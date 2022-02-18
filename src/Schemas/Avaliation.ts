import { Schema, model } from 'mongoose'

const avaliationSchema =  new Schema({
    feedbackRate: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        requried: true
    },
})

const AvaliationModel = model('AvaliationSchema', avaliationSchema)

export default AvaliationModel
