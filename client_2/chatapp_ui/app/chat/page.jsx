"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import useAuthStore from "../../zustand/useAuthStore";
import useUsersStore from "../../zustand/useUsersStore";
import useChatRecieverStore from "../../zustand/useChatRecieverStore";
import useChatStore from "../../zustand/useChatStore";
import UsersList from "../../_components/UsersList";

const CHAT_SERVER = "http://localhost:8084"; //to match port of docker server2

const Chat = () => {
    const [msg, setMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const { authName } = useAuthStore();
    const { updateUsers } = useUsersStore();
    const { recieverName } = useChatRecieverStore();
    const { conversations, activeConversationKey, selectConversation, addMessage } =
        useChatStore();

    const messages = conversations[activeConversationKey] ?? [];

    const getUserData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/users", {
                withCredentials: true,
            });

            updateUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        if (!authName) return;

        const newSocket = io(CHAT_SERVER, {
            query: { username: authName },
        });

        setSocket(newSocket);
        getUserData();

        return () => newSocket.close();
    }, [authName]);

    useEffect(() => {
        selectConversation(authName, recieverName);
    }, [authName, recieverName, selectConversation]);

    useEffect(() => {
        if (!socket || !authName) return;

        const onChatMsg = (data) => {
            const isForMe =
                data.sender === authName || data.receiver === authName;

            if (!isForMe) return;

            const otherUser =
                data.sender === authName ? data.receiver : data.sender;

            addMessage(authName, otherUser, data);
        };

        socket.on("chat msg", onChatMsg);

        return () => socket.off("chat msg", onChatMsg);
    }, [socket, authName, addMessage]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (!msg.trim() || !socket || !recieverName) return;

        const messagePayload = {
            text: msg,
            sender: authName,
            receiver: recieverName,
        };

        socket.emit("chat message", messagePayload);
        addMessage(authName, recieverName, messagePayload);
        setMessage("");
    };

    return (
        <div className="flex h-screen">
            <UsersList />

            <div className="w-2/3 flex flex-col">
                <div className="border-b p-4 font-semibold text-lg">
                    {authName && recieverName ? (
                        <span>
                            {authName} is chatting with {recieverName}
                        </span>
                    ) : (
                        <span>Select a user to start chatting</span>
                    )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex mb-3 ${
                                message.sentByMe ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                                    message.sentByMe
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

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
                        disabled={!recieverName}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
