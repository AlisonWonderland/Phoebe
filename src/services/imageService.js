import axios from 'axios'
const imageApiURL = 'http://localhost:3001/api/imageAnalysis'

const upload = async (formData) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    return await axios.post(`${imageApiURL}/analyze`, formData, config)
}


export default 
{ 
    upload
}