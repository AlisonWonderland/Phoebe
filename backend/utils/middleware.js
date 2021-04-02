const logger = require('./logger')
// const config = require('../config/config')
const dayjs = require('dayjs')
const redis = require('redis')

const redisClient = redis.createClient()
const WINDOW_SIZE_IN_HOURS = 24
const MAX_WINDOW_REQUEST_COUNT = 100
const WINDOW_LOG_INTERVAL_IN_HOURS = 1

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

// thread will always include a picture
const imageValidation = (req, res, next) => {
    const file = req.file ? req.file : req.files[0]

    if(!file && req.body.postType !== 'thread') {
        // console.log('no file')
        next()
        return
    }
    
    const sizeInMB = (req.file.size / (1024*1024)).toFixed(2)
    if(sizeInMB > 10) {
        res.status(404).send({error: `File size exceeds 10 MB. File size: ${sizeInMB} MB`})
    }
    else {
        const mimetype = file.mimetype
        // console.log(mimetype)
        if(mimetype === 'image/jpeg' || mimetype === 'image/png' || mimetype === 'application/pdf')
            next()
        else 
            res.status(400).send({ error: 'Invalid file format' })
    }


}

const initUploadData = (req, res, next) => {
    const file = req.file ? req.file : req.files[0]

    if(file) {
        req.body = {
            ...req.body,
            uploadData: {
                mimetype: file.mimetype,
                id: Date.now(),
                buffer: file.buffer,
                postType: req.body.postType,
                filename: file.originalname,
            }
        }
    }

    next()
}

// https://blog.logrocket.com/rate-limiting-node-js/
const customRedisRateLimiter = (req, res, next) => {
    // console.log('ip',req.ip)
    try {
        // check that redis client exists
        if (!redisClient) {
            throw new Error('Redis client does not exist!')
            process.exit(1)
        }

        // Manage records every 24 hours
        redisClient.get('windowStart', (err, record) => {
            if(err) throw err

            if(record === null) {
                redisClient.set('windowStart', dayjs().unix())
            }
            else {
                let windowStart = record
                let windowStartFromNow = dayjs()
                    .subtract(WINDOW_SIZE_IN_HOURS, 'hours')
                    .unix()

                // reset redis if the request was made more than 24 hours after the first request of the window
                if(windowStart < windowStartFromNow) {
                    redisClient.flushall((err, succeeded) => {
                        if(err) throw err
                    })
                }
            }
        })

        // fetch records of current user using IP address, returns null when no record is found
        redisClient.get(req.ip, function(err, record) {
            if (err) throw err
            
            const currentRequestTime = dayjs()
            // console.log(record)
            //  if no record is found , create a new record for user and store to redis
            if (record === null) {
                let newRecord = []
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                }
                newRecord.push(requestLog)
                redisClient.set(req.ip, JSON.stringify(newRecord))
                next()
                return
            }
            // if record is found, parse it's value and calculate number of requests users has made within the last window
            let data = JSON.parse(record)
            let windowStartTimestamp = dayjs()
                .subtract(WINDOW_SIZE_IN_HOURS, 'hours')
                .unix()
            let requestsWithinWindow = data.filter(entry => {
                return entry.requestTimeStamp > windowStartTimestamp
            })
            // console.log('requestsWithinWindow', requestsWithinWindow)
            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                return accumulator + entry.requestCount
            }, 0)
            
            // if number of requests made is greater than or equal to the desired maximum, return error
            if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
                res
                    .status(429)
                    .send(
                        {error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`}
                    )
            } 
            else {
                // if number of requests made is less than allowed maximum, log new entry
                let lastRequestLog = data[data.length - 1]
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                    .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours')
                    .unix()
                //  if interval has not passed since last request log, increment counter
                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++
                    data[data.length - 1] = lastRequestLog
                } 
                else {
                    //  if interval has passed, log new entry for current user and timestamp
                    data.push({
                        requestTimeStamp: currentRequestTime.unix(),
                        requestCount: 1
                    })
                }
                redisClient.set(req.ip, JSON.stringify(data))
                next()
            }
        })
    } 
    catch (error) {
        next(error)
    }
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error)
    
    res.status(500).send({ error: 'An unknown error occurred' })

    next(error)
}

module.exports = {
    requestLogger,
    imageValidation,
    initUploadData,
    customRedisRateLimiter,
    unknownEndpoint,
    errorHandler
}