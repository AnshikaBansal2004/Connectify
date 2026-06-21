import { create } from "zustand";
import axios from "axios";

const CHAT_SERVER = "http://localhost:8080";

export const getConversationKey = (user1, user2) =>
    [user1, user2].sort().join("_");

const formatMessage = (message, authName) => ({
    text: message.text,
    sender: message.sender,
    receiver: message.receiver,
    sentByMe: message.sender === authName,
});

const useChatStore = create((set) => ({
    conversations: {},
    activeConversationKey: "",

    selectConversation: async (authName, receiverName) => {
        if (!authName || !receiverName) {
            set({ activeConversationKey: "" });
            return;
        }

        const key = getConversationKey(authName, receiverName);
        set({ activeConversationKey: key });

        try {
            const res = await axios.get(`${CHAT_SERVER}/messages`, {
                params: { user1: authName, user2: receiverName },
            });

            const messages = res.data.map((message) =>
                formatMessage(message, authName)
            );

            set((state) => ({
                conversations: {
                    ...state.conversations,
                    [key]: messages,
                },
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    },

    addMessage: (authName, otherUser, message) => {
        const key = getConversationKey(authName, otherUser);

        set((state) => ({
            conversations: {
                ...state.conversations,
                [key]: [
                    ...(state.conversations[key] ?? []),
                    formatMessage(message, authName),
                ],
            },
        }));
    },
}));

export default useChatStore;
