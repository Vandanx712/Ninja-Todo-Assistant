import { Router } from "express";
import { addTask, crudOfTask, deleteManyTasks, getTaskById, getUserAllTask, login, register, updateprofile, updateStatus, usergetById, wakeUpAssistant } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";


const userRoute = Router()

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/:userId').get(verifyjwt,usergetById)
userRoute.route('/update').put(verifyjwt,updateprofile)
userRoute.route('/add').post(verifyjwt,addTask)
userRoute.route('/').get(verifyjwt,getUserAllTask)
userRoute.route('/:taskId').get(verifyjwt,getTaskById)
userRoute.route('/').delete(verifyjwt,deleteManyTasks)
userRoute.route('/:taskId').put(verifyjwt,updateStatus)

//assistant part 
userRoute.route('/wakeup').post(verifyjwt,wakeUpAssistant)
userRoute.route('/crudtask').post(verifyjwt,crudOfTask)

export default userRoute