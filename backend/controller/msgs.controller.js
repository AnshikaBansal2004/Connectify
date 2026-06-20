import Conversation from "../models/chat.model.js";

export const getConversationMessages = async (req, res) => {
    try {
        const { user1, user2 } = req.query;

        if (!user1 || !user2) {
            return res.status(400).json({ message: "user1 and user2 are required" });
        }

        const conversation = await Conversation.findOne({
            users: { $all: [user1, user2] },
        });

        return res.status(200).json(conversation?.msgs ?? []);
    } catch (error) {
        console.log("Error fetching conversation: " + error.message);
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const addMsgToConversation = async (participants, msg) => {
    try {
        // Find conversation by participants
        let conversation = await Conversation.findOne(
                            { users: { $all: participants } });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({ users: participants });
        }

        // Add msg to the conversation
        conversation.msgs.push(msg);
        await conversation.save();
        return conversation;
    } catch (error) {
        console.log('Error adding message to conversation: ' + error.message);
        return null;
    }
};
