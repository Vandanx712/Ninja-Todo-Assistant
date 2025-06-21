import { Router } from "express";
import { addTask, AutoDelete, crudOfTask, deleteTask, getTaskById, getUserAllTask, login, register, updateprofile, updateStatus, usergetById, wakeUpAssistant } from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/verifyjwt.js";
import { botresponce } from "../services/trainbot.js";


const userRoute = Router()

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/:userId').get(verifyjwt,usergetById)
userRoute.route('/update').put(verifyjwt,updateprofile)
// manual part
userRoute.route('/add').post(verifyjwt,addTask)
userRoute.route('/').get(verifyjwt,getUserAllTask)
userRoute.route('/:taskId').get(verifyjwt,getTaskById)
userRoute.route('/:taskId').delete(verifyjwt,deleteTask)
userRoute.route('/:taskId').put(verifyjwt,updateStatus)

//assistant part 
userRoute.route('/wakeup').post(verifyjwt,wakeUpAssistant)
userRoute.route('/crudtask').post(verifyjwt,crudOfTask)
userRoute.route('/auto').post(verifyjwt,AutoDelete)

//chatbot part 
userRoute.route('/bot').post(verifyjwt,botresponce)

export default userRoute