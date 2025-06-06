import mongoose from "mongoose";


const taskschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:mongoose.Schema.Types.String
    },
    completed:{
        type:mongoose.Schema.Types.Boolean
    },
    reminded:{
        type:mongoose.Schema.Types.Boolean,
        default:false
    },
    createdAt:{
        type:mongoose.Schema.Types.Date,
        default:Date.now
    }
})


export const Task = mongoose.model('Task',taskschema)