import {
    Schema,
    model
} from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    segment: {
        type: String,
        required: false,
    },
    employeeName: {
        type: String,
        required: false,
    }
})

const UserModel = model('user', userSchema)

export default UserModel