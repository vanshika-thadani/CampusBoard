
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

const getPublicMessages = async (req, res) => {
    try {
        const messages = await Message.find({ isPublic: true })
        .populate('senderId', 'username profilePhoto');
        return res.status(200).json(messages);
    } catch (err) {
        console.error("Get Public Messages Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const sendPublicMessages = async (req, res) => {
    try {
        const { input } = req.body;
        const newMessage = await Message.create({
            senderId: req.user._id,
            message: input,
            isPublic: true
        });

        const populatedMsg = await Message.findById(newMessage._id)
        .populate('senderId', 'username profilePhoto');

        return res.status(201).json(populatedMsg);
    } catch (err) {
        console.error("Send Public Message Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getPrivateMessages = async (req, res) => {
    try {
        const user1 = req.user._id;
        const user2 = req.params.userId;
        const messages = await Message.find({
            isPublic : false,
            $or : [
                { senderId : user1, receiverId : user2 },
                { senderId : user2, receiverId : user1 }
            ]
        }).populate('senderId receiverId');

        return res.status(200).json(messages);
    
    } catch (err) {
        console.error("Get Private Messages Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const sendPrivateMessages = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.params;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({ 
                participants: [senderId, receiverId] 
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: req.body.message,
            file: req.file?.filename,
            isPublic: false,
            conversationId: conversation._id
        });

        conversation.lastMessage = newMessage._id;
        await conversation.save();

        const populatedMsg = await Message.findById(newMessage._id)
        .populate('senderId receiverId', 'username profilePhoto')

        return res.status(201).json(populatedMsg);
    } catch (err) {
        console.error("Send Private Message Error:", err.message);
        return res.status(500).json({ message: "Failed to send message" });
    }
}

const getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({ participants: userId})
        .populate('participants', 'username profilePhoto')
        .populate('lastMessage', 'message createdAt')
        .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (err) {
        console.error("Get User Conversations Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { 
    getPublicMessages, 
    sendPublicMessages, 
    getPrivateMessages, 
    sendPrivateMessages,
    getUserConversations
}
