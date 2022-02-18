import { connect } from "mongoose"
import 'dotenv/config'

const URI: string = process.env.DB_connection!

const connectDB = async(): Promise<void> => {

    try {
        await connect(URI)
        console.log('DB connected')
    }
    catch(error){
        console.log(`Error on connect to DB. ${error}`)
    }
}

export default connectDB