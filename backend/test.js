// File for playing with the api and seeing how responses are formatted
const dayjs = require('dayjs')

async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision')
    // const util = require('util')
    // Creates a client
    const client = new vision.ImageAnnotatorClient()

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    const fileName = './test_p.jpg'
    
    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName)
    // console.log('result', result)

    const fullTextAnnotation = result.fullTextAnnotation
    // console.log(`Full text: ${fullTextAnnotation.text}`);
    // console.log('page size', fullTextAnnotation.pages.length)
    
    // fullTextAnnotation.pages.forEach(page => {
        
    //     // console.log(`Page object: ${util.inspect(page, {depth: null})}`)
    //     console.log('+++++++++++++++++++++++')
    //     page.blocks.forEach(block => {
    //       console.log(`Block confidence: ${block.confidence}`);
    //       console.log(`Block: ${block}`)

    //       block.paragraphs.forEach(paragraph => {
    //           console.log('-------')
    //           console.log(Object.keys(paragraph))
    //           console.log(paragraph.words)
    //           console.log(paragraph.confidence)
    //       })
    //     });
    // });

    let paragraphs = []

    fullTextAnnotation.pages.forEach(page => {
        page.blocks.forEach(block => {
            // console.log(`Block confidence: ${block.confidence}`);
            block.paragraphs.forEach(paragraph => {
                // console.log(`Paragraph confidence: ${paragraph.confidence}`);
                let paragraphText = ''           
                
                paragraph.words.forEach(word => {
                    const wordText = word.symbols.map(s => s.text).join('')
                    // console.log(`Word text: ${wordText}`);
                    // console.log(`Word confidence: ${word.confidence}`);
                    paragraphText += wordText + ' '
                    // word.symbols.forEach(symbol => {
                    //   console.log(`Symbol text: ${symbol.text}`);
                    //   console.log(`Symbol confidence: ${symbol.confidence}`);
                    // });
                })
                
                paragraphText += '\n'
                paragraphs.push(paragraphText)
            })
        })
    })

    console.log(paragraphs)
}
// quickstart()
let test = dayjs().unix()
console.log(test)
test = dayjs().subtract(24, 'hours')
                .unix()
console.log(test)
