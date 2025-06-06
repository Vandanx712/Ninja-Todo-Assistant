import mongoose from "mongoose";


const userschema = new mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.String
    },
    email:{
        type:mongoose.Schema.Types.String
    },
    password:{
        type:mongoose.Schema.Types.String
    }
},{timestamps:true})


export const User = mongoose.model('User',userschema)