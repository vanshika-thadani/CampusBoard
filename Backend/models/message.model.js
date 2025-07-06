const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    message : {
        type : String,
    },
    isPublic : {
        type: Boolean,
        default : false
    }
},
{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;