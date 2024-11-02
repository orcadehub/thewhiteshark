const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// Protected route to access user profile
router.get("/profile", authenticateToken, (req, res) => {
  try {
    res.status(200).json({
      message: "Profile accessed successfully",
      user: req.user, // `req.user` is attached by the middleware
    });
  } catch (error) {
    console.error("Error accessing profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching profile." });
  }
});

// Fetch total referrals and their usernames
router.get("/profile/referrals", authenticateToken, async (req, res) => {
  try {
    // Find users who were referred by the current user
    const referrals = await User.find({
      referredBy: req.user.referralId, // Matches referrals using the `referredBy` field
    }).select("username");

    res.status(200).json({
      message: "Referrals fetched successfully",
      referrals,
      totalReferrals: referrals.length,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});


// LeaderBoard
router.get("/leaderboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total user count
    const totalUsers = await User.countDocuments();

    // Get all users sorted by walletAmount, limited to the top 100
    const leaderboard = await User.find({}, "username walletAmount")
      .sort({ walletAmount: -1 })
      .limit(100);

    // Calculate the rank of the current user by wallet amount
    const userRank =
      (await User.countDocuments({
        walletAmount: { $gt: req.user.walletAmount },
      })) + 1;

    res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard,
      totalUsers,
      userRank,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
