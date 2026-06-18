//this is HTML + JS = JSX
/*
"use client";
import React, { useEffect, useState } from 'react'
import io from "socket.io-client";
import client from 'react-dom/client';

const Chat = () => {
    //  const [msg,setMessage] = useState(''); //intitally message and socket are null
      const [socket,setSocket] = useState(null);

      useEffect(()=>{
            //establish socket connection with backend URL
            const newSocket = io('http://localhost:8080');
            setSocket(newSocket);
            //cleanup
            return () => newSocket.close();
      },[]);

      const sendMessage = (e) =>{
            e.preventDefault();
            if(socket){
                  socket.emit('chat message',msg);
                  setMessage('');
            }
      }

//adding a tail wind css button. 
  return (
    <div>
      <form onSubmit={sendMessage}>
       <button type="button" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Submit</button>
     </form>
      </div>
  )
}


export default Chat
*/
"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
    const [msg, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [msgs, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io("http://localhost:8080");

        setSocket(newSocket);

        newSocket.on("chat msg", (msg) => {
            console.log("Received:", msg);

            setMessages((prev) => [
                ...prev,
                {
                    text: msg,
                    sentByMe: false,
                },
            ]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();

        if (socket && msg.trim()) {
            socket.emit("chat message", msg);

            setMessages((prev) => [
                ...prev,
                {
                    text: msg,
                    sentByMe: true,
                },
            ]);

            console.log("Sent:", msg);
            setMessage("");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                Chat App
            </h1>

            <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
                {msgs.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-3 ${
                            msg.sentByMe
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                                msg.sentByMe
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="border p-2 flex-1 rounded"
                />

                <button
                    type="submit"
                    className="text-white bg-blue-500 px-4 py-2 rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;