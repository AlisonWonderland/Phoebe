// require('express-async-errors') 
const middleware = require('./utils/middleware.js')
const express = require('express')
const app = express()
const cors = require('cors')

const imageAnalysisRouter = require('./controllers/imageAnalysis')

// need to figure out which ones to use
app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
// app.use(middleware.requestLogger)

app.use('/api/imageAnalysis', imageAnalysisRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app