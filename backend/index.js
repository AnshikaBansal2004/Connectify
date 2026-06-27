import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { addMsgToConversation, getConversationMessages } from "./controller/msgs.controller.js";
import connectToMongoDB from "./db/MongoDbConnection.js";
import msgsRouter from "./routes/msgs.route.js";

dotenv.config();

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
});
app.use(express.json());

const io = new Server(server, {
      cors: {
            origin: "*",
            allowedHeaders: ["*"]
      }
});

// ---------------- SOCKET CONNECTION ----------------
io.on("connection", (socket) => {
      console.log("Client connected");

      const username = socket.handshake.query.username;

      console.log("username:", username);

      if (username) {
            socket.join(username);
      }
      const channelName = `chat_${username}`;

      subscribe(channelName, (msg) => {
            console.log("Received message:", msg);
            socket.emit("chatmsg", JSON.parse(msg));
      });
      // ---------------- MESSAGE HANDLER ----------------
      socket.on("chat message", (msg) => {
            console.log("Received msg:", msg);

            io.to(msg.receiver).emit("chat msg", msg);
            const channelName = `chat_${msg.receiver}`;
            publish(channelName, JSON.stringify(msg));

            addMsgToConversation([msg.sender, msg.receiver], {
                  text: msg.text,
                  sender: msg.sender,
                  receiver: msg.receiver,
            });
      });

      // ---------------- DISCONNECT ----------------
      socket.on("disconnect", () => {
            console.log("Disconnected:", username);
      });
});

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
      res.send("route working");
});

app.get("/messages", getConversationMessages);

app.use('/msgs', msgsRouter);

// ---------------- START SERVER ----------------
server.listen(port, () => {
      connectToMongoDB();
      console.log(`server listening at http://localhost:${port}`);
});