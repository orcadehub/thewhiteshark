// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  walletAmount: { type: Number, default: 0.0 },
  totalReferrals: { type: Number, default: 0 },
  referralId: { type: String, required: true }, // This user’s unique referral ID
  referredBy: { type: String, default: null }, // Stores referral ID of the referrer
  dateJoined: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  profilePictureUrl: { type: String, default: null },
  lastLogin: { type: Date, default: null },
  farmingStartTime: { type: Date, default: null },
  farmingDuration: { type: Number, default: 30 * 1000 },
  completedTasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      status: { type: String,enum:["start", "complete"], default: "start" },
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
