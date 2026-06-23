"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuthStore from "../zustand/useAuthStore";

const Auth = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {authName, updateAuthName} = useAuthStore(); //custom hook 
    const signUpFunc = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/auth/signup",
                {
                    username,
                    password,
                },
                {
                    withCredentials : true
                }
            );

            if (
                res.data.message ===
                "Username already exists. Please select a unique username"
            ) {
                alert(res.data.message);
            } else {
                alert("Signup successful!");
                updateAuthName(username);   
                router.push("/chat");
            }
        } catch (error) {
            console.log("Error in signup function:", error.message);
            alert("Signup failed");
        }
    };

    const LoginFunc = async () => {
        try {
            const res = await axios.post("http://localhost:5000/auth/login",
                {
                    username,
                    password,
                },
            {
                withCredentials : true
            });
            alert("Login successful!");
            updateAuthName(username);
            router.push('/chat');

        } catch (error) {
            console.log("Error in login function:", error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
                    Connectify
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Connect instantly with your friends
                </p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={LoginFunc}
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={signUpFunc}
                            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;