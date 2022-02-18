import { Router } from 'express'
import handleLogin from '../API/handleLogin'

const route = Router()

route.post('/', handleLogin)


module.exports = route