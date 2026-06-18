import mongoose from "mongoose";

const connectToMongoDB = async() =>{
      console.log("Trying to connect to the database");
      try{
            await mongoose.connect(process.env.MONGO_URI)
            console.log('database connected!');
      }
      catch(error){
            console.log('Error connecting to the database ' + error.message);
      }
}

export default connectToMongoDB;