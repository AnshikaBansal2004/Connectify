"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import useAuthStore from "../../zustand/useAuthStore";
import axios from "axios";
import useUsersStore from "../../zustand/useUsersStore";

const Chat = () => {
    const [msg, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [msgs, setMessages] = useState([]);

    const { authName } = useAuthStore();
    const { users, updateUsers } = useUsersStore();

    const getUserData = async () => {
        const res = await axios.get("http://localhost:5000/users", {
            withCredentials: true,
        });

        updateUsers(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        const newSocket = io("http://localhost:8080", {
            query: {
                username: authName,
            },
        });

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

        getUserData();

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();

        const msgtobesent = {
            textMsg: msg,
            sender: "amit",
            reciver: "anshika",
        };

        if (socket) {
            socket.emit("chat message", msgtobesent);

            setMessages((prev) => [
                ...prev,
                {
                    text: msg,
                    sentByMe: true,
                },
            ]);

            setMessage("");
        }
    };

    return (
        <div className="flex h-screen">

            {/* LEFT PANEL - USERS */}
            <div className="w-1/3 border-r p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Users</h2>

                {users?.map((user) => (
                    <div
                        key={user._id}
                        className="p-3 mb-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                        {user.username}
                    </div>
                ))}
            </div>

            {/* RIGHT PANEL - CHAT */}
            <div className="w-2/3 flex flex-col">

                {/* MESSAGES */}
                <div className="flex-1 p-4 overflow-y-auto">
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

                {/* INPUT */}
                <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t">
                    <input
                        type="text"
                        value={msg}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="border p-2 flex-1 rounded"
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Chat;