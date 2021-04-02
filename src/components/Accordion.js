import AccordionItem from './AccordionItem'

const Accordion = ({ data }) => {
    return (
        <div className="accordion">
            {
                data.map((val, index) => {
                    return <AccordionItem key={index} 
                        itemTitle={`Paragraph ${index + 1}`} 
                        itemContent={val} 
                    />
                })
            }
        </div>
    )
}

export default Accordion