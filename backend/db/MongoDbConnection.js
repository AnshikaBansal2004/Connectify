import mongoose from "mongoose";

const connectToMongoDB = async() =>{
      console.log("Trying to connect to the database");
      try{
           await mongoose.connect(process.env.MONGO_URI)
            console.log('database connected from main BE!');
      }
      catch(error){
            console.log('Error connecting to the database in the main BE' + error.message);
      }
}

export default connectToMongoDB;