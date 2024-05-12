import mongoose from "mongoose";

const connect=async ()=>{
    try {
      const connection=  await mongoose.connect(`mongodb+srv://Riddle:9118380538@cluster0.qr5vrpz.mongodb.net/samsungDB`)
      console.log(`server has successfully connected to the database DB Host:${connection.connection.host}`)
    } catch (error) {
      console.log(`error in connecting to the database`)
        throw error
    }
}


export default connect
