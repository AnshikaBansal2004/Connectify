"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import useAuthStore from "../../zustand/useAuthStore";
import axios from "axios";
import useUsersStore from "../../zustand/useUsersStore";
import UsersList from "../../_components/UsersList";
import useChatRecieverStore from "../../zustand/useChatRecieverStore";

const Chat = () => {
    const [msg, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [msgs, setMessages] = useState([]);

    const { authName } = useAuthStore();
    const { updateUsers } = useUsersStore();
    const { recieverName } = useChatRecieverStore();

    // ---------------- FETCH USERS ----------------
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

    const CHAT_SERVER = "http://localhost:8080";

    // ---------------- FETCH CHAT HISTORY ----------------
    useEffect(() => {
        if (!authName || !recieverName) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {
            try {
                const res = await axios.get(`${CHAT_SERVER}/messages`, {
                    params: { user1: authName, user2: recieverName },
                });

                setMessages(
                    res.data.map((m) => ({
                        text: m.text,
                        sender: m.sender,
                        receiver: m.receiver,
                        sentByMe: m.sender === authName,
                    }))
                );
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        loadMessages();
    }, [authName, recieverName]);

    // ---------------- SOCKET SETUP ----------------
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
        if (!socket || !authName || !recieverName) return;

        const onChatMsg = (data) => {
            const isCurrentChat =
                (data.sender === authName && data.receiver === recieverName) ||
                (data.sender === recieverName && data.receiver === authName);

            if (!isCurrentChat) return;

            setMessages((prev) => [
                ...prev,
                {
                    text: data.text,
                    sender: data.sender,
                    receiver: data.receiver,
                    sentByMe: data.sender === authName,
                },
            ]);
        };

        socket.on("chat msg", onChatMsg);
        return () => socket.off("chat msg", onChatMsg);
    }, [socket, authName, recieverName]);

    // ---------------- SEND MESSAGE ----------------
    const sendMessage = (e) => {
        e.preventDefault();

        if (!msg.trim() || !socket || !recieverName) return;

        const messagePayload = {
            text: msg,
            sender: authName,
            receiver: recieverName,
        };

        socket.emit("chat message", messagePayload);

        setMessages((prev) => [
            ...prev,
            {
                text: msg,
                sender: authName,
                receiver: recieverName,
                sentByMe: true,
            },
        ]);

        setMessage("");
    };

    return (
        <div className="flex h-screen">
            {/* LEFT PANEL */}
            <UsersList />

            {/* RIGHT PANEL */}
            <div className="w-2/3 flex flex-col">

                {/* HEADER */}
                <div className="border-b p-4 font-semibold text-lg">
                    {authName && recieverName ? (
                        <span>
                            {authName} is chatting with {recieverName}
                        </span>
                    ) : (
                        <span>Select a user to start chatting</span>
                    )}
                </div>

                {/* MESSAGES */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {msgs.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex mb-3 ${
                                msg.sentByMe ? "justify-end" : "justify-start"
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
                <form
                    onSubmit={sendMessage}
                    className="flex gap-2 p-4 border-t"
                >
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