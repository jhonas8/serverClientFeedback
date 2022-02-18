import server from "./server"

const PORT = process.env.PORT || 8001

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})