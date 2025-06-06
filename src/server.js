import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './db/db.js'
import indexRouter from './rotues/indexroute.js'


dotenv.config()

const port = process.env.PORT || 2003
const app = express()

await connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())
app.use('/api',indexRouter)
app.listen(port,()=>{
    console.log(`App listen on ${port}`)
})