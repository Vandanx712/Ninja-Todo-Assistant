import jwt from 'jsonwebtoken'
import { asynchandler } from '../utills/asynchandller.js'
import { ApiError } from '../utills/apierror.js'
import { User } from '../models/user.model.js'



export const verifyjwt = asynchandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accesstoken
        if(!token) throw new ApiError(400,'Unauthorized request')

        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN)
        const user = await User.findById(decoded.id).select('-password')

        req.user = user 
        next()
    } catch (error) {
        console.log(error)
    }
})