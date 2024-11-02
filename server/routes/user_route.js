// routes/userRoute.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
// Define a secret key for JWT
const JWT_SECRET = "my_jwt_secret_key";
// Function to generate a unique alphanumeric referral ID
async function generateUniqueReferralId() {
  let referralId;
  let existingUser;

  // Keep generating a new referral ID until it is unique
  do {
    referralId = generateReferralId(6); // Customize the length of the referral ID here
    existingUser = await User.findOne({ referralId });
  } while (existingUser);

  return referralId;
}

// Function to generate an alphanumeric referral ID
function generateReferralId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Combined Signup/Login route
router.post("/authenticate/:chatid", async (req, res) => {
  const { username, referralId } = req.body;
  const { chatid } = req.params;

  try {
    // Check if user with given chatId already exists
    let user = await User.findOne({ chatId: chatid });

    if (user) {
      // User exists, proceed with login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
      });
    } else {
      // New user, proceed with signup
      if (!username) {
        return res
          .status(400)
          .json({ message: "Username is required for signup." });
      }

      // Validate referral ID if provided
      if (referralId) {
        const referrer = await User.findOne({ referralId });
        if (referrer) {
          referrer.totalReferrals += 1;
          await referrer.save();
        } else {
          return res.status(400).json({ message: "Invalid referral ID." });
        }
      }

      // Generate unique referral ID for the new user
      const newReferralId = await generateUniqueReferralId();

      // Create the new user
      user = new User({
        username,
        referralId: newReferralId,
        chatId: chatid,
        fullName: "", // Placeholder, update as needed
        password: "", // Placeholder, update as needed
        email: "", // Placeholder, update as needed
        mobileNumber: "", // Placeholder, update as needed
      });

      await user.save();

      // Generate JWT token for the new user
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "User signed up successfully",
        user,
        token,
      });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
});

module.exports = router;
