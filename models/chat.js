const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        maxLength: 100,
    },
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
    }
})

const chat = mongoose.model("Chat", chatSchema)

module.exports = chat;