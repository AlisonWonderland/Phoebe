import Navbar from './Navbar'
import Footer from './Footer'

const Home = () => {
    return (   
        <div className="home">
            <Navbar />
            <div className="section">
                <div className="instructHeaders description">
                    <div>Capture.</div>
                    <div>Upload.</div>
                    <div>Save.</div>
                </div>
                <div className="screenshots">
                </div>
            </div>
            <div className="section">
                <div className="instructHeaders description">
                    <div>Work smarter</div>
                    <span className="descriptionText">
                        Take photos of handwritten notes or typed worksheets that you
                        want to type up.
                    </span>
                </div>
                <div className="screenshots">
                    <img src="/assets/notes.webp" alt="Person taking notes on paper" />
                </div>
            </div>
            <div className="section">
                <div className="instructHeaders description">
                    <div>Extraction</div>
                    <span className="descriptionText">
                        Phoebe uses Google Cloud Vision API to detect text in your picture
                        and extracts it so you don't have to retype everything.
                    </span>
                </div>
                <div className="screenshots">
                    <img src="/assets/cloud_api.jpeg" alt="Google cloud vision api logo" />
                </div>
            </div>
            <div className="section">
                <div className="instructHeaders description">
                    <div>Save</div>
                    <span className="descriptionText">
                        After the analysis, you can modify the extracted text so that you can
                        fix issues. Then you can download the extracted text in docx or create a 
                        new Google Doc with the extracted text.
                    </span>
                </div>
                <div className="screenshots">
                    <img src="/assets/word_icon.webp" alt="Microsoft word icon" />
                </div>
            </div>
            <Footer />
        </div> 

    )
}

export default Home