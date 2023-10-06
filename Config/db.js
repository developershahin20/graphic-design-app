import mongoose from 'mongoose'
import colors from 'colors'


const connectDb = async()=>{
    try {
       const conn = await mongoose.connect(process.env.MONGO_URL)
       console.log(`Connected to mogoDb Database ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`error in mongodb ${error}`.bgRed.white)
    }
}

export default connectDb;