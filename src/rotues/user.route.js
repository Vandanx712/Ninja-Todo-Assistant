import { Router } from "express";
import { login, register, usergetById } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";


const userRoute = Router()

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/:id').get(verifyjwt,usergetById)


export default userRoute