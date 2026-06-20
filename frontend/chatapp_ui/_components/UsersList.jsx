"use client";

import React from "react";
import useUsersStore from "../zustand/useUsersStore";

const UsersList = () => {
    const { users } = useUsersStore();

    return (
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
    );
};

export default UsersList;