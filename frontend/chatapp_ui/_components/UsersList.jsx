"use client";

import React from "react";
import useUsersStore from "../zustand/useUsersStore";
import useChatRecieverStore from "../zustand/useChatRecieverStore";
import useAuthStore from "../zustand/useAuthStore";

const UsersList = () => {
    const { users } = useUsersStore();
    const { authName } = useAuthStore();
    const { recieverName, updateRecieverName } = useChatRecieverStore();

    const handleUserClick = (username) => {
        if (username === authName) return;
        updateRecieverName(username);
    };

    return (
        <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Users</h2>

            {users
                ?.filter((user) => user.username !== authName)
                .map((user) => (
                    <div
                        key={user._id}
                        onClick={() => handleUserClick(user.username)}
                        className={`p-3 mb-2 rounded cursor-pointer ${
                            recieverName === user.username
                                ? "bg-blue-100 border border-blue-400"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        {user.username}
                    </div>
                ))}
        </div>
    );
};

export default UsersList;