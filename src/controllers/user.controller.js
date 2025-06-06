import { asynchandler } from "../utills/asynchandller.js";
import { ApiError } from '../utills/apierror.js'
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const generateAccessToken = async(user)=>{
    try {
        const accesstoken = jwt.sign({
            id:user.id,
            username:user.username
        },process.env.ACCESS_TOKEN,{expiresIn:process.env.ACCESS_TOKEN_EXPIRE})
        return accesstoken 
    } catch (error) {
        console.log(error)
    }
}

export const generateRefreshToken = async(user)=>{
    try {
        const refreshtoken = jwt.sign({
            id:user.id
        },process.env.REFRESH_TOKEN,{expiresIn:process.env.REFRESH_TOKEN_EXPIRE})
        return refreshtoken
    } catch (error) {
        console.log(error)
    }
}


export const register = asynchandler(async(req,res)=>{
    const {username,email,password} = req.body
    if([username,email,password].some((field)=>field.trim()==='')) throw new ApiError(429,'Plz fill all field')

    const user = await User.findOne({email:email.toLowerCase()})
    if(user){
        if(user.username===username) throw new ApiError(400,'User already exist with this username')
        if(user.email===email) throw new ApiError(400,'User already exist with this email')
    }

    const newuser = await User.create({
        username:username,
        email:email.toLowerCase(),
        password:await bcrypt.hash(password,10)
    })

    return res.status(200).json({
        message:'User register successfully',
        newuser
    })
})


export const login = asynchandler(async(req,res)=>{
    const {username,password} = req.body
    if([username,password].some((field)=>field.trim()==='')) throw new ApiError(429,'Plz fill all field')

    const existuser = await User.findOne({username:username})
    if(!existuser) throw new ApiError(404,'User not found')

    const userpassword = await bcrypt.compare(password,existuser.password)
    if(!userpassword) throw new ApiError(400,'Plz enter correct password')

    const accesstoken = await generateAccessToken(existuser)
    const refreshtoken = await generateRefreshToken(existuser)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie('accesstoken',accesstoken,options)
    .cookie('refreshtoken',refreshtoken,options)
    .json({
        message:'User login successfully',
        existuser
    })
})


export const usergetById = asynchandler(async(req,res)=>{
    const {userId} = req.params
    if(!userId) throw new ApiError(400,'User id must required')

    const user = await User.findById(userId)
    if(!user) throw new ApiError(404,'User not found') 

    return res.status(200).json({
        message:'Fetch user by id successfully',
        user
    })
})


// export const wakeUpAssistant = asynchandler(async(req,res)=>{
//     const 
// })