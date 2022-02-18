import { Router } from 'express'
import handleAvaliationButtonPost from '../API/handleAvaliationButton'

const route = Router() 

route.post('/', handleAvaliationButtonPost)

module.exports = route