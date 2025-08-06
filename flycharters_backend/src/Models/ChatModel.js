// models/ChatModel.model.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
},{ timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);