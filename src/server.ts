import express from 'express'
import cors from 'cors'
import connectDB from './DB/Connection'

const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())

connectDB()

const homeRoutes = require('./routes/feedback')
const adminRoutes = require('./routes/admin')
const loginRoutes = require('./routes/login')
const tiRoutes = require('./routes/ti')

server.get('/', (request, response)=>{
    return response.send('Server is running well.')
})

server.use('/feedback', homeRoutes)
server.use('/admin', adminRoutes)
server.use('/login', loginRoutes)
server.use('/ti', tiRoutes)

export default server
