import schedule, { cancelJob } from 'node-schedule'
import notifier from 'node-notifier'
import { Task } from '../models/task.model.js';



export const sendNotification = (message) => {
    notifier.notify({
        title: 'Remember your task',
        message: message,
        sound: true,
    });
};

export const scheduleReminder = (id,task,time) => {
    try {
        const reminderDate = new Date(time)

        // const rule = new schedule.RecurrenceRule()
        // rule.year = reminderDate.getFullYear()
        // rule.month = reminderDate.getMonth()+1
        // rule.date = reminderDate.getDate()
        // rule.hour = reminderDate.getHours()
        // rule.minute = reminderDate.getMinutes()
        // rule.second = 0


        const jobname = task
        schedule.scheduleJob(jobname, reminderDate, async function () {
            let count = 0
            const maxDuration = 5
            const internal = setInterval(() => {
                sendNotification(task)   // ahi firebase push notification nu logic aave
                count +=1
                if (count > maxDuration) {
                    cancelJob(jobname)
                    clearInterval(internal)
                }
            }, 10000)
            await Task.findByIdAndUpdate(id,{$set:{reminded:true}})
        })
    } catch (error) {
        console.error('Error scheduling reminder:', err)
    }
}