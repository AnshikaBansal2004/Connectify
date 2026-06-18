import express from "express";
import dotenv from "dotenv";
import http from "http";

dotenv.config(); 
const port = process.env.PORT || 5000; 

const app = express(); //application

const server = http.createServer(app); //http server on top of the express app
const io = new Server(server,{
      cors:{
            allowedHeaders:["*"],
            origin:"*" //adding these to prevent (strict_origin_when_cross_origin). Setting these to allow traffic from all sources
      }
}); //socket server

//defining a route
app.get('/',(req,res)=>{
      res.send('route');
});

//starting the server
app.listen(port,()=>{
 console.log('server listening at http://localhost:${port}');
});