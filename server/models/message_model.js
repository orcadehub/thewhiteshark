const mongoose = require("mongoose");

// Define a schema for messages
const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create a model from the schema
const Message = mongoose.model("Message", messageSchema);

// Function to save messages to MongoDB
const saveMessage = async (userId, messageText) => {
  const newMessage = new Message({
    userId,
    message: messageText,
  });
  await newMessage.save();
};

module.exports = { saveMessage };
