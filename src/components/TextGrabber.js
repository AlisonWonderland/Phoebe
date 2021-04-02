import { useState } from 'react'
import imageService from '../services/imageService'
import Navbar from './Navbar'  
import Footer from './Footer'
import ErrorMessage from './ErrorMessage'
import Accordion from './Accordion'  

import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";

const TextGrabber = () => {
    const [ file, setFile ] = useState(null)
    const [ fileSelected, setFileSelected ] = useState(false)
    const [ highlight, setHighlight ] = useState(false)
    const [ loadingResults, setLoadingResults ] = useState(false)
    const [ extractedText, setExtractedText ] = useState(null)
    const [ paragraphsData, setParagraphsData ] = useState(null)
    const [ error, setError ] = useState(null)


    const handleSubmission = async (e) => {
        e.preventDefault();
        setLoadingResults(true)

        const formData = new FormData();
        formData.append('image', file)

        try {
            
            const response = await imageService.upload(formData)
    
            const paragraphsData = response.data.paragraphs
            setParagraphsData(paragraphsData)
    
            const text = response.data.text
            setExtractedText(text)
    
            setLoadingResults(false)
            setFileSelected(false)
            // setFile(null)
            if(error !== null) {
                setError(null)
            }
        }
        catch(err) {
            setLoadingResults(false)
            console.log(err)
            console.log(err.response)
            if(err.response === undefined) {
                setError('Can\'t connect to server.')
            }
            else {
                setError(err.response.data.error)
                console.log('data error', err.response.data.error)
            }
        }
    }

    const downloadDoc = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: extractedText.split('\n').map(text => 
                    new Paragraph({
                        text,
                    })
                )
            }]
        });
        
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "Extracted text.docx");
        });
    }

    // Todo
    const uploadToGoogleDocs = () => {

    }

    const handleRevisions = (e) => {
        setExtractedText(e.target.value)
    }

    const handleInputClick = (e) => {
        e.target.value = null
    } 

    const handleFileChange = (e) => {
        setFileSelected(true)
        setFile(e.target.files[0])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation();        
        
        let files = [...e.dataTransfer.files];
        setFile(files[0])
        setFileSelected(true)
        setHighlight(false)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation();
        setHighlight(true)
    }
    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation();
        setHighlight(false)
    }
    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation();
        setHighlight(true)        
    }

    return (   
        <>
            <div id="textGrabber">
                <Navbar />
                <div id="uploadContainer">   
                    <h1 className="textGrabberTitle">Upload images to scan</h1>
                    
                    <ErrorMessage error={error} />
                    <div 
                        id="drop-area"
                        style={{"borderColor": highlight ? '#F9F871' : ''}}
                        onDrop={handleDrop} 
                        onDragOver={handleDragOver} 
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave} 
                    >
                        <form className="my-form">
                            <p>Drag and drop your file here or click the button below to choose it</p>
                            <input type="file" id="fileElem" multiple accept="image/*" onChange={handleFileChange} onClick={handleInputClick} />
                            <label className="button" htmlFor="fileElem">Select file</label>
                        </form>
                    </div>


                    {
                        fileSelected && file &&
                        <div id="uploadDataContainer">
                            <div className="filesList">
                                <h2>Image:</h2>
                                { file.name }
                            </div>

                            <button className="downloadBtn" onClick={handleSubmission}>Upload photos</button>
                        </div>
                    }

                    {
                        loadingResults &&
                        <div className="loadingContainer">
                            <span className="loadingMessage">Loading results</span>
                            <img src="/assets/loadingx64.gif" alt="loading icon" />
                        </div>
                    }
                    {   
                        extractedText &&
                        <>
                            <div className="modifyTextContainer">
                                <div className="modifyText">
                                    <h2 className="sectionTitle">Extracted paragraphs and their confidence</h2>
                                    <Accordion data={paragraphsData} />                
                                </div>
                            </div>
                            <div className="modifyTextContainer">
                                <div className="modifyText">
                                    <h2 className="sectionTitle">Modify extracted text</h2>
                                    <textarea id="" cols="150" rows="25" value={extractedText} onChange={handleRevisions}></textarea>  
                                    <button className="downloadBtn" onClick={downloadDoc}><i className="fas fa-download"></i> Download as .docx</button>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <Footer />
            </div>
        </>
    )
}

export default TextGrabber