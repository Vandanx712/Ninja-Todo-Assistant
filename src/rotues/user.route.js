import { Router } from "express";
import { login, register, updateprofile, usergetById, wakeUpAssistant } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";


const userRoute = Router()

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/:userId').get(verifyjwt,usergetById)
userRoute.route('/update').put(verifyjwt,updateprofile)
userRoute.route('/wakeup').post(verifyjwt,wakeUpAssistant)

export default userRoute