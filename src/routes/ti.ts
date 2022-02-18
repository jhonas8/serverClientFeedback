import { Router } from 'express'
import handleRegistration from '../API/handleRegistration'
import User from '../structures/user'

const route = Router()

route.post('/register', handleRegistration)

route.get('/users', async(request, response)=>{
    const users = await User.returnAll()

    response.send(users)
})

route.post('/users/passwordChange', async(request, response)=>{
    const { newPassword, userId } = request.body

    const user = new User(userId)

    const isChanged = await user.changePassword(newPassword)

    return response.send(isChanged)
})

route.post('/users/remove', async(request,response) =>{
    const { userId } = request.body

    const user = new User(userId)

    const deletedUser = await user.removeUser()

    return response.send(deletedUser)
})

route.get('/users/')

module.exports = route