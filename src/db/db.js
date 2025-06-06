import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async() =>{
    try {
        const dbname = `ninjatodo`
        const connectioninstance = await mongoose.connect(`${process.env.DATABASE_URL}/${dbname}`)
        console.log(`mongoDb connect on ${connectioninstance.connection.host}`)
    } catch (error) {
        console.log(`connection error is ${error}`)
    }
}