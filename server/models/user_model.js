const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  walletAmount: { type: Number, default: 0.0 },
  totalReferrals: { type: Number, default: 0 },
  referralId: { type: String, required: true }, // Unique referral ID for the user
  referredBy: { type: String, default: null }, // Stores referral ID of the referrer
  chatId: { type: String, unique: true }, // Stores Telegram chat ID, if linked
  dateJoined: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  profilePictureUrl: { type: String, default: null },
  lastLogin: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
