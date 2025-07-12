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
import { wakeupResponses, crudResponses, autodeleteResponses } from "../utills/responses.js";
import { scheduleReminder } from "../services/reminder.js";


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
        secure: true,
        sameSite: 'None',
        maxAge:24*60*60*1000
    }

    return res.status(200)
        .cookie('accesstoken', accesstoken, options)
        .cookie('refreshtoken', refreshtoken, options)
        .json({
            message: 'User login successfully',
            existuser
        })
})

export const logout = asynchandler(async (req, res) => {
    return res.status(200)
        .cookie()
        .cookie()
        .json({
            message: 'Logout successfully'
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
    const { username, email, token } = req.body
    const userId = req.user.id

    const existuser = await User.findOne({ $or: [{ email }, { username }] })
    if (existuser) {
        if (existuser.email === email && existuser.id !== userId) throw new ApiError(400, 'User already exist with this email')
        if (existuser.username === username && existuser.id !== userId) throw new ApiError(400, 'User already exist with this username')
    }
    const user = await User.findByIdAndUpdate(userId, { $set: { email: email.toLowerCase(), username, deviceToken: token } }, { new: true })
    return res.status(200).json({
        message: 'Userprofile update successfully',
        user
    })
})

// manual part 

export const addTask = asynchandler(async (req, res) => {
    const { task } = req.body
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!task) throw new ApiError(400, 'Plz fill all field')

    let humandate
    const time = parseDate(task)
    const newtask = await Task.create({
        userId: userId,
        title: task.toLowerCase(),
        remindAt: time ?? null
    })
    if (time) {
        humandate = new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
        scheduleReminder(newtask.id, task, time, user)
    }
    return res.status(200).json({
        message: 'Task add successfully',
        humandate,
        newtask
    })
})

export const getUserAllTask = asynchandler(async (req, res) => {
    const userId = req.user.id

    const allTasks = await Task.find({ userId: userId }).sort({ createdAt: -1 })
    return res.status(200).json({
        message: 'Fetch all tasks successfully',
        allTasks
    })
})

export const getTaskById = asynchandler(async (req, res) => {
    const { taskId } = req.params
    if (!taskId) throw new ApiError(400, 'Task id is required field')

    const task = await Task.findById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    return res.status(200).json({
        message: 'Fetch task successfully',
        task
    })
})

export const updateStatus = asynchandler(async (req, res) => {
    const { taskId } = req.params
    if (!taskId) throw new ApiError(400, 'Task id must required')

    const task = await Task.findById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    task.completed = true
    task.reminded = true

    await task.save()
    return res.status(200).json({
        message: 'Task update successfully',
        task
    })
})

export const updateTask = asynchandler(async (req, res) => {
    const { taskId, title } = req.body
    const userId = req.user.id
    const user = req.user

    if ([taskId, title].some(field => field === '')) throw new ApiError(400, 'Please fill all field')

    const existTask = await Task.findOne({ _id: taskId, userId: userId})
    if (!existTask) throw new ApiError(400, 'Task not fdound with given id')

    if(existTask.completed===true) throw new ApiError(400,'Not update completed task')

    const time = parseDate(title)
    if (time) {
        scheduleReminder(existTask.id, title, time, user)
    }

    existTask.title = title
    existTask.remindAt = time ?? null
    existTask.save()

    return res.status(200).json({
        message:'Task update successfully',
        existTask
    })
})

export const deleteTask = asynchandler(async (req, res) => {
    const { taskId } = req.params
    if (!taskId) throw new ApiError(400, 'Task id must required')

    const task = await Task.findById(taskId)
    if (!task) throw new ApiError(404, 'Task not found')

    if (task.completed == false) throw new ApiError(400, 'Plz first complete a task')

    await Task.deleteOne({ _id: task._id })
    return res.status(200).json({
        message: 'Delete tasks successfully'
    })
})


export const getUserPogress = asynchandler(async (req, res) => {
    const userId = req.user.id

    const totalTask = await Task.countDocuments({ userId: userId })
    const finishedTask = await Task.countDocuments({ completed: true, userId: userId })

    const average = totalTask === 0 ? 0 : Math.trunc((finishedTask / totalTask) * 100);

    return res.status(200).json({
        message: 'Fetch user pogress successfully',
        totalTask:totalTask ?? 0,
        finishedTask:finishedTask ?? 0,
        avarage: average
    })
})


// assistant part 
export const wakeUpAssistant = asynchandler(async (req, res) => {
    const { text } = req.body

    if (!wakeupResponses[text]) throw new ApiError(400, 'Plz speak valid wakeup word');

    const chosen = get_random(wakeupResponses[text].texts);
    const voiceId = wakeupResponses[text].id
    const voiceBuffer = await getVoiceUrl(chosen, wakeupResponses[text].id);

    return res.status(200).json({
        message: 'Assistant wakeup successfully',
        voiceId,
        voiceBuffer
    })

})

export const crudOfTask = asynchandler(async (req, res) => {
    const { task, voiceId } = req.body
    const userId = req.user.id
    const user = req.user

    if ([task, voiceId].some((field) => field.trim() === '')) throw new ApiError(400, 'Plz fill all field')

    const index = Math.floor((Math.random() * 2))
    const now = new Date()
    const date = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const yesterdayTask = await Task.find({ userId: userId, completed: false, createdAt: { $gt: new Date(year, month, date - 1), $lte: new Date(year, month, date) } })
    if (yesterdayTask.length > 0) {
        const charaterResponse = crudResponses.old[voiceId][index]
        const voiceBuffer = await getVoiceUrl(charaterResponse, voiceId)
        return res.status(200).json({
            message: 'Yesterday pending tasks',
            voiceBuffer
        })
    }

    function remove(keyword) {
        return task.toLowerCase().replace(keyword.toLowerCase(), "")
    }

    if (task.toLowerCase().includes('add task')) {
        let humandate
        const text = remove('add task')
        const doc = nlp(text)
        const verb = doc.verbs().out('text');
        const noun = doc.nouns().first().out('text');
        const tasktitle = `${verb} ${noun}`.replace(',', 'and');
        const time = parseDate(text)

        const charaterResponse = crudResponses.add[voiceId][index](tasktitle)
        const [newtask, voiceBuffer] = await Promise.all([
            Task.create({
                userId: userId,
                title: tasktitle.toLowerCase(),
                remindAt: time ?? null
            }),
            getVoiceUrl(charaterResponse, voiceId)
        ])
        if (time) {
            humandate = new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
            scheduleReminder(newtask.id, tasktitle, time, user)
        }
        return res.status(200).json({
            message: 'Add task successfully',
            newtask,
            humandate: time ? humandate : null,
            voiceBuffer
        })
    }
    else if (task.toLowerCase().includes('my pending task') || task.toLowerCase().includes('my task')) {
        const tasks = await Task.find({ userId: userId, completed: false, createdAt: { $gt: new Date(year, month, date), $lte: new Date(year, month, date + 1) } })
        const titles = tasks.map((t) => t.title)
        const list = []
        for (let i = 0; i < titles.length; i++) {
            list[i] = `${i + 1} is ${titles[i]}`
        }
        const charaterResponse = list.length == 0 ? 'I not get yours pending tasks, first add task.' : crudResponses.mytasks[voiceId][index](list)
        const voiceBuffer = await getVoiceUrl(charaterResponse, voiceId)
        return res.status(200).json({
            message: 'Fetch all current tasks successfully',
            list,
            voiceBuffer
        })
    }
    else if (task.toLowerCase().includes('delete this')) {
        const text = remove('delete this').toLowerCase()
        const oldtask = await Task.findOne({ title: { $regex: text.trim(), $options: 'i' }, userId: userId })
        if (!oldtask) {
            const voiceBuffer = await getVoiceUrl(`Oops! i can't find your task.... so speck exact task title.`, voiceId)
            return res.status(400).json({
                message: 'Failed to find task',
                voiceBuffer
            })
        }
        await Task.deleteOne({ _id: oldtask.id })
        const charaterResponse = crudResponses.delete[voiceId][index](oldtask.title)
        const voiceBuffer = await getVoiceUrl(charaterResponse, voiceId)
        return res.status(200).json({
            taskId: oldtask.id,
            message: 'Delete your task successfully',
            title: oldtask.title,
            voiceBuffer
        })
    }
    else {
        const charaterResponse = crudResponses.other[voiceId][index]
        const voiceBuffer = await getVoiceUrl(charaterResponse, voiceId)
        return res.status(200).json({
            message: 'Oops! wrong starting word',
            voiceBuffer
        })
    }
})

export const AutoDelete = asynchandler(async (req, res) => {
    const userId = req.user.id
    const now = new Date()
    const date = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const oldtasks = await Task.find({ userId: userId, createdAt: { $lte: new Date(year, month, date - 3) } }).select('_id')
    if (oldtasks.length > 0) {
        const voices = ['JBFqnCBsd6RMkjVDRZzb', 'WU3NNr4InTpWBvdLxgpD', 'eVItLK1UvXctxuaRV2Oq', 'WTUK291rZZ9CLPCiFTfh']
        const Index = Math.floor((Math.random() * voices.length))
        const index = Math.floor((Math.random() * 2))
        const voiceId = voices[Index]

        await Task.deleteMany({ _id: { $in: oldtasks } })

        const charaterResponse = autodeleteResponses[voiceId][index](oldtasks.length)
        const voiceBuffer = await getVoiceUrl(charaterResponse, voiceId)
        return res.status(200).json({
            message: `Delete your 3 day's old ${oldtasks.length} tasks successfully`,
            voiceBuffer
        })
    }
    return res.status(200).json({
        message: 'Not present olds tasks'
    })
})
