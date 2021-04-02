const vision = require('@google-cloud/vision')
const multer  = require('multer')
const upload = multer()
const { imageValidation, customRedisRateLimiter } = require('../utils/middleware')
const imageAnalysisRouter = require('express').Router()

const client = new vision.ImageAnnotatorClient()

// https://cloud.google.com/vision/docs/fulltext-annotations for anotating image

imageAnalysisRouter.post('/analyze', customRedisRateLimiter, upload.single('image'), imageValidation, async(req, res) => {
    // console.log('iamge info', req.file)

    try {
        const [result] = await client.documentTextDetection(req.file.buffer)
        const fullTextAnnotation = result.fullTextAnnotation
    
        let paragraphs = []
    
        fullTextAnnotation.pages.forEach(page => {
            page.blocks.forEach(block => {
                block.paragraphs.forEach(paragraph => {
                    let paragraphText = ''           
                    
                    paragraph.words.forEach(word => {
                        const wordText = word.symbols.map(s => s.text).join('')
                        paragraphText += wordText + ' '
                    })
                    
                    paragraphText += '\n'
                    paragraphs.push({ paragraphText, paragraphConfidence: paragraph.confidence })
                })
            })
        })

        res.status(200).send({text: fullTextAnnotation.text, paragraphs})
    }
    catch(err) {
        res.status(404).send({ error: 'Error occured with Google Cloud API' })
    }

})

module.exports = imageAnalysisRouter