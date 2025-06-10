import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

async function getVoiceUrl(text,voiceId) {
    
    const responce = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,{
        text,
        model_id: 'eleven_monolingual_v1',
        voice_setting:{ stability: 0.3, similarity_boost: 0.9,speed:0.4}
    },{
        headers:{
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        },
        responseType:'arraybuffer'
    })
    return responce.data
}


export default getVoiceUrl