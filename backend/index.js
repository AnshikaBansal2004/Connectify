import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config(); //dotenv pkg loads env variables from .env to process.env
const port = process.env.PORT || 5000; //5000 is default, in case .env is not found

const app = express(); //application

const server = http.createServer(app); //http server on top of the express app
const io = new Server(server,{
      cors:{
            allowedHeaders:["*"],
            origin:"*" //adding these to prevent (strict_origin_when_cross_origin). Setting these to allow traffic from all sources
      }
}); //socket server

//websocket connections to the socket server 
// when connection is established, 
io.on("connection",(socket)=>{
      console.log("Client connected"      );
      const username = socket.handshake.query.username;
      console.log("username: ",username);
      socket.on("chat message",(msg)=>{
          //  socket.broadcast.emit('chat msg',msg); //broadcast the message to all other clients
            console.log("sender:",msg.sender);
            console.log("reciever",msg.reciver);
            console.log('recieved the message ', msg.textMsg);
      });
})

//defining a route
app.get('/',(req,res)=>{
      res.send('route');
});

//starting the server
server.listen(port,()=>{
 console.log('server listening at http://localhost:${port}');
});