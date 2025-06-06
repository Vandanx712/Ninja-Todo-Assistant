import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'


dotenv.config()

const port = process.env.PORT || 2003
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())
app.use()
app.listen(port,()=>{
    console.log(`App listen on ${port}`)
})