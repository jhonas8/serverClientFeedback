import { Schema, model } from 'mongoose'

const now = new Date()

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
        default: `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`
    },
    hour: {
        type: String,
        default: `${now.getHours()}:${now.getMinutes()}`
    },
    fromMonth: {
        type: Number,
        default: (now.getMonth() + 1)
    }
})

const HistoryModel = model('historySchema', historySchema)

export default HistoryModel
