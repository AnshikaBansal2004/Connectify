import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config(); //dotenv pkg loads env variables from .env to process.env
const port = process.env.PORT || 5000; //5000 is default, in case .env is not found

const app = express(); //application

const server = http.createServer(app); //http server on top of the express app
const io = new Server(server); //socket server

//websocket connections to the socket server 
// when connection is established, 
io.on("connection",()=>{
      console.log("Client connected");
})



