import { Router } from "express";
import userRouter from "./user.route.js";


const indexRouter = Router()

indexRouter.use('/user',userRouter)


export default indexRouter