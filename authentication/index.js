import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import connectToMongoDB from "./db/MongoDbConnection.js";
import usersRouter from "./routes/users.route.js";
import cookieparser from "cookie-parser";

dotenv.config(); 
const port = process.env.PORT || 5000; 

const app = express(); //application
//MIDDLEWARE:
app.use(cors(
      {
       origin : "http://localhost:3000",
       credentials : true,
      }
));
app.use(express.json()); //parses the incoming request bodyand populates req.body with the JSON format data
app.use(cookieparser());
app.use('/auth',authRouter); //any req whose path starts with /auth will be routed here
app.use('/users',usersRouter);
      

//defining a route
app.get('/',(req,res)=>{
      res.send('route');
});

connectToMongoDB();

//starting the server
app.listen(port,()=>{
 console.log('server listening at http://localhost:5000');
});