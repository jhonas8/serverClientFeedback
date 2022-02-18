import { Schema, model } from 'mongoose'

const now = new Date()
const minutes = now.getUTCMinutes().toString.length === 1 ? '0'+now.getUTCMinutes() : now.getUTCMinutes()

const historySchema =  new Schema({
    feedbackRate: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        requried: true
    },
    date: {
        type: String,
        default: `${now.getUTCDate()}/${now.getUTCMonth()+1}/${now.getUTCFullYear()}`
    },
    hour: {
        type: String,
        default: `${now.getUTCHours()+3}:${minutes}`
    },
    fromMonth: {
        type: Number,
        default: (now.getMonth() + 1)
    }
})

const HistoryModel = model('historySchema', historySchema)

export default HistoryModel
