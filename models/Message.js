const mongoose = require("mongoose");

// Message Schema
// Defines the structure of chat messages stored in MongoDB.
const MessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    room: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

// Export the Message model.
// Allows other parts of the application to interact with the Message collection in MongoDB.
module.exports = mongoose.model("Message", MessageSchema);
