import { useState, useRef } from "react"

const AccordionItem = ({itemTitle, itemContent}) => {
    const [ active, setActive ] = useState("")
    const [ heigth, setHeigth ] = useState("0px")
    const [ icon, setIcon ] = useState('plus')

    // console.log('active', active)
    const content = useRef(null)

    const handleToggleClick = () => {
        setActive(active === "" ? "active" : "")
        setHeigth(active === "" ? `${content.current.scrollHeight}px` : "0px")
        setIcon(active === "" ? 'minus' : 'plus')
    }

    return (
        <>
            <button className={`accordionToggle ${active}`} onClick={handleToggleClick}>
                <p className="accordionTitle">{itemTitle}</p>
                <i className={`fas fa-${icon}`}></i>
            </button>
                
            <div ref={content} className="accordionContent" style={{maxHeight: `${heigth}`}}>
                <div className="accordionText">
                    {itemContent.paragraphText}
                </div>
                <div className="confidence">
                    <i className="fas fa-info-circle">
                        <span className="hoverText">
                            This is how certain the Cloud Vision API is of its text extraction from your picture.
                            0% means the API is certain it extracted text incorrectly. 100% means it thinks it 
                            didn't make any errors.
                        </span>
                    </i>
                    <span className="confidenceTitle"> Confidence percentage: </span>
                    {itemContent.paragraphConfidence.toFixed(4) * 100} %
                </div>
            </div>
        </>
    )
}

export default AccordionItem