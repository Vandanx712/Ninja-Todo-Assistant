import { asynchandler } from "../utills/asynchandller.js";
import { ApiError } from '../utills/apierror.js'
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import getVoiceUrl from "../services/animevoice.js";
import { Task } from "../models/task.model.js";
import { parseDate } from "chrono-node";
import nlp from "compromise";
import { wakeupResponses , crudResponses} from "../utills/responses.js";


dotenv.config()

export const generateAccessToken = async (user) => {
    try {
        const accesstoken = jwt.sign({
            id: user.id,
            username: user.username
        }, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })
        return accesstoken
    } catch (error) {
        console.log(error)
    }
}

export const generateRefreshToken = async (user) => {
    try {
        const refreshtoken = jwt.sign({
            id: user.id
        }, process.env.REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE })
        return refreshtoken
    } catch (error) {
        console.log(error)
    }
}

function get_random(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
}


export const register = asynchandler(async (req, res) => {
    const { username, email, password } = req.body
    if ([username, email, password].some((field) => field.trim() === '')) throw new ApiError(429, 'Plz fill all field')

    const user = await User.findOne({ email: email.toLowerCase() })
    if (user) {
        if (user.username === username) throw new ApiError(400, 'User already exist with this username')
        if (user.email === email) throw new ApiError(400, 'User already exist with this email')
    }

    const newuser = await User.create({
        username: username,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10)
    })

    return res.status(200).json({
        message: 'User register successfully',
        newuser
    })
})


export const login = asynchandler(async (req, res) => {
    const { username, password } = req.body
    if ([username, password].some((field) => field.trim() === '')) throw new ApiError(429, 'Plz fill all field')

    const existuser = await User.findOne({ username: username })
    if (!existuser) throw new ApiError(404, 'User not found')

    const userpassword = await bcrypt.compare(password, existuser.password)
    if (!userpassword) throw new ApiError(400, 'Plz enter correct password')

    const accesstoken = await generateAccessToken(existuser)
    const refreshtoken = await generateRefreshToken(existuser)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie('accesstoken', accesstoken, options)
        .cookie('refreshtoken', refreshtoken, options)
        .json({
            message: 'User login successfully',
            existuser
        })
})


export const usergetById = asynchandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(400, 'User id must required')

    const user = await User.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')

    return res.status(200).json({
        message: 'Fetch user by id successfully',
        user
    })
})


export const updateprofile = asynchandler(async (req, res) => {
    const { username, email } = req.body
    const userId = req.user.id

    const existuser = await User.findOne({ $or: [{ email }, { username }] })
    if (existuser) {
        if (existuser.email === email) throw new ApiError(400, 'User already exist with this email')
        if (existuser.username === username) throw new ApiError(400, 'User already exist with this username')
    }

    const user = await User.findByIdAndUpdate(userId, { email: email.toLowerCase(), username: username }, { new: true })
    return res.status(200).json({
        message: 'Update user successfully',
        user
    })
})

// manual part 

export const addTask = asynchandler(async(req,res)=>{
    const { task } = req.body
    const userId = req.user.id
    if (!task) throw new ApiError(400, 'Plz fill all field')

    const time = parseDate(text)
    if (time) {
        humandate = new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
    }
    const newtask = await Task.create({
        userId:userId,
        title:task.toLowerCase(),
        remindAt:time ?? null
    })

    return res.status(200).json({
        message:'Task add successfully',
        newtask
    })
})

export const getUserAllTask = asynchandler(async(req,res)=>{
    const userId = req.user.id

    const allTasks = await Task.find({userId:userId}).sort({createdAt:-1})
    return res.status(200).json({
        message:'Fetch all tasks successfully',
        allTasks
    })
})

export const getTaskById = asynchandler(async(req,res)=>{
    const {taskId} = req.params
    if(!taskId) throw new ApiError(400,'Task id is required field')

    const task = await Task.findById(taskId)
    if(!task) throw new ApiError(404,'Task not found')

    return res.status(200).json({
        message:'Fetch task successfully',
        task
    })
})

export const updateStatus = asynchandler(async(req,res)=>{
    const {taskId} = req.params
    if(!taskId) throw new ApiError(400,'Task id must required')

    const task = await Task.findById(taskId)
    if(!task) throw new ApiError(404,'Task not found')
    
    const updatedTask = await Task.updateOne(task.id,{completed:true,reminded:true})
    return res.status(200).json({
        message:'Task update successfully',
        updatedTask
    })
})

export const deleteManyTasks = asynchandler(async(req,res)=>{
    const {taskIds} = req.body
    if(taskIds.length==0) throw new ApiError(400,'Plz select single id') 

    const tasks = await Task.find({_id:{$in:taskIds}})
    if(taskIds.length !== tasks.length) throw new ApiError(404,'Some tasks not found')

    await Task.deleteMany({_id:{$in:taskIds}})
    return res.status(200).json({
        message:'Delete tasks successfully'
    })
})


// assistant part 
export const wakeUpAssistant = asynchandler(async (req, res) => {
    const { text } = req.body

    const key = text.toLowerCase();

    if (!wakeupResponses[key]) throw new ApiError(400, 'Plz speak valid wakeup word');

    const chosen = get_random(wakeupResponses[key].texts);
    const voiceBuffer = await getVoiceUrl(chosen, wakeupResponses[key].id);

    return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(voiceBuffer);

})

export const crudOfTask = asynchandler(async(req,res)=>{
    const {task,voiceId} = req.body
    const userId = req.user.id

    if([task,voiceId].some((field)=>field.trim()==='')) throw new ApiError(400,'Plz fill all field')

    const index = Math.floor((Math.random() * 2))
    const now = new Date()
    const date = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const yesterdayTask = await Task.find({userId:userId,completed:false,createdAt:{$gt: new Date(year,month,date-1),$lte:new Date(year,month,date)}})
    if(yesterdayTask.length > 0) {
        const charaterResponse = crudResponses.old[voiceId][index]
        const voiceBuffer = await getVoiceUrl(charaterResponse,voiceId)
        return res.status(200).json({
            message:'Yesterday pending tasks',
            voiceBuffer
        })
        // return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(voiceBuffer);
    }

    function remove(keyword){
        return task.toLowerCase().replace(keyword.toLowerCase(), "")
    }

    if(task.toLowerCase().includes('add task')){
        let humandate
        const text = remove('add task')
        const doc = nlp(text)
        const verb = doc.verbs().out('text');
        const noun = doc.nouns().first().out('text');
        const tasktitle = `${verb} ${noun}`.replace(',','and');
        const time = parseDate(text)
        if(time){
            humandate  = new Date(time).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',hour12:true})
        }
        const newtask = await Task.create({
            userId:userId,
            title:tasktitle.toLowerCase(),
            remindAt:time ?? null
        })
        const charaterResponse = crudResponses.add[voiceId][index](tasktitle)
        const voiceBuffer = await getVoiceUrl(charaterResponse,voiceId)
        return res.status(200).json({
            message:'Add task successfully',
            newtask,
            humandate:time?humandate:null,
            voiceBuffer
        })
        // return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(voiceBuffer);
    }
    else if(task.toLowerCase().includes('my pending tasks')){
        const tasks = await Task.find({userId:userId,completed:false,createdAt:{$gt:new Date(year,month,date),$lte:new Date(year,month,date+1)}})
        const titles = tasks.map((t)=>t.title)
        const list = []
        for(let i=0;i<titles.length;i++){
            list[i] = `${i+1} is ${titles[i]}`
        }
        const charaterResponse = crudResponses.mytasks[voiceId][index](list)
        const voiceBuffer = await getVoiceUrl(charaterResponse,voiceId)
        return res.status(200).json({
            message:'Fetch all current tasks successfully',
            list,
            voiceBuffer
        })
        // return res.status(200).setHeader('Content-Type','audio/mpeg').send(voiceBuffer)
    }
    else if(task.toLowerCase().includes('delete this')){
        const text = remove('delete this').toLowerCase()
        const oldtask = await Task.findOne({title:{$regex:text.trim(),$options:'i'}})
        if(!oldtask){
            const voiceBuffer = await getVoiceUrl(`Oops! i can't find your task.... so speck exact task title.`,voiceId)
            return res.status(400).json({
                message:'Failed to find task',
                voiceBuffer
            })
            // return res.status(200).setHeader('Content-Type','audio/mpeg').send(voiceBuffer)
        }
        await Task.deleteOne({_id:oldtask.id})
        const charaterResponse = crudResponses.delete[voiceId][index](oldtask.title)
        const voiceBuffer = await getVoiceUrl(charaterResponse,voiceId)
        return res.status(200).json({
            message:'Delete your task successfully',
            title:oldtask.title,
            voiceBuffer
        })
        // return res.status(200).setHeader('Content-Type','audio/mpeg').send(voiceBuffer)
    }
    else{
        const charaterResponse = crudResponses.other[voiceId][index]
        const voiceBuffer = await getVoiceUrl(charaterResponse,voiceId)
        return res.status(200).json({
            message:'Oops! wrong starting word',
            voiceBuffer
        })
        // return res.status(200).setHeader('Content-Type','audio/mpeg').send(voiceBuffer)
    }
})