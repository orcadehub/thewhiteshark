// models/task_model.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  points: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Earn", "Weekly", "New", "OnChain", "Friends"], // Updated categories
    required: true,
  },
  friends: { type: Number, default: 0 }, // Number of friends referred, used only for "Friends" category
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
