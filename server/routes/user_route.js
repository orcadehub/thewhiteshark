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
router.post("/authenticate", async (req, res) => {
  const { username, referralId } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    // Check if a user with the given username already exists
    let user = await User.findOne({ username });

    if (!user) {
      // User does not exist, so create a new user (signup)
      // If referral ID is provided, validate it
      if (referralId) {
        const referrer = await User.findOne({ referralId });
        if (referrer) {
          // Increment the totalReferrals for the user associated with the referral ID
          referrer.totalReferrals += 1;
          await referrer.save();
        } else {
          return res.status(400).json({ message: "Invalid referral ID." });
        }
      }

      // Generate a unique referral ID for the new user
      const newReferralId = await generateUniqueReferralId();

      // Create the new user
      user = new User({
        username,
        referralId: newReferralId, // Store unique referral ID for the new user
      });
      await user.save();

      // Send a response indicating successful signup
      res.status(201).json({
        message: "User signed up successfully",
        user,
      });
    }

    // Generate JWT token for the user (for both new and existing users)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return user data and token
    res.status(200).json({
      message: user
        ? "User logged in successfully"
        : "User signed up successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
});

module.exports = router;
