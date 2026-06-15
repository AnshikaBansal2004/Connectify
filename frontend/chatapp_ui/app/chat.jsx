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

  useEffect(() => {
    const newSocket = io("http://localhost:8080");

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (socket && msg.trim()) {
      socket.emit("chat message", msg);
      console.log("Sent:", msg);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Chat App
      </h1>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 mr-2"
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