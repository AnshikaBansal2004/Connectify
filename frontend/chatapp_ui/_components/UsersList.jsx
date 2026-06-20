"use client";

import React from "react";
import useUsersStore from "../zustand/useUsersStore";
import useChatRecieverStore from "../zustand/useChatRecieverStore";

const UsersList = () => {
    const { users } = useUsersStore();
    const { updateRecieverName } = useChatRecieverStore();

    const handleUserClick = (username) => {
        updateRecieverName(username);
    };

    return (
        <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Users</h2>

            {users?.map((user) => (
                <div
                    key={user._id}
                    onClick={() => handleUserClick(user.username)}
                    className="p-3 mb-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                    {user.username}
                </div>
            ))}
        </div>
    );
};

export default UsersList;