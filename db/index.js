import mongoose from "mongoose";
import 'dotenv/config'

const connect=async ()=>{
    try {
      const connection=  await mongoose.connect(`${process.env.DB_URL}samsungDB`)
      console.log(`server has successfully connected to the database DB Host:${connection.connection.host}`)
    } catch (error) {
      console.log(`error in connecting to the database`)
        throw error 
    }
}


export default connect
