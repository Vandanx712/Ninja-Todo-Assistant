import { asynchandler } from "../utills/asynchandller.js";
import { ApiError } from '../utills/apierror.js'
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import getVoiceUrl from "../voiceService/animevoice.js";


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


export const wakeUpAssistant = asynchandler(async (req, res) => {
    const { text } = req.body

    const responses = {
        oknaruto: {
            texts: [
                "Yosh! I'm Naruto Uzumaki, and I never go back on my word. Ready to tackle your tasks, believe it!",
                "Hey! Let’s crush today’s to-dos with some real ninja energy!",
                "Shadow Clone or not, I’ll make sure your tasks get done – Dattebayo!",
                "Time to become the Hokage of productivity! Let’s go!"
            ],
            id: process.env.NARUTO_VOICE_ID
        },
        okhinata: {
            texts: [
                "H-hello... I’m here to help you with your tasks… Let’s do our best today!",
                "You’re doing great. I believe in you… L-let’s get things done, together.",
                "Uhm… I organized your task list. Please check it when you’re ready.",
                "Even small steps matter… I’ll assist you quietly, okay?"
            ],
            id: process.env.HINATA_VOICE_ID
        },
        okjiraiya: {
            texts: [
                "Ahh, my pupil! The great Jiraiya is here to help you conquer your tasks—while maybe writing a new novel too!",
                "You can’t train like a ninja with unfinished tasks, kid. Let’s get them done!",
                "Even the Legendary Sannin had to handle chores... let’s do yours with style!",
                "Finish your to-dos now, then reward yourself with some ramen… or research, hehe."
            ],
            id: process.env.JIRAIYA_VOICE_ID
        }
    };

    const key = text.toLowerCase();

    if (!responses[key]) throw new ApiError(400, 'Plz speak valid wakeup word');

    const chosen = get_random(responses[key].texts);
    const voiceBuffer = await getVoiceUrl(chosen, responses[key].id);

    return res.status(200).setHeader('Content-Type', 'audio/mpeg').send(voiceBuffer);

})