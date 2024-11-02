const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL
const port = process.env.PORT || 3300;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/TheWhiteSharkDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Import User model
const User = require("./models/user_model");

// Include routes
app.use(require("./routes/user_route"));
app.use(require("./routes/user_related_route"));

// Create the bot instance
const bot = new TelegramBot(TOKEN);

// Set webhook for Telegram
const webhookURL = `${url}/bot${TOKEN}`;
bot
  .setWebHook(webhookURL)
  .then(() => {
    console.log(`Webhook set to: ${webhookURL}`);
  })
  .catch((err) => {
    console.error("Error setting webhook:", err);
  });

// Webhook route for Telegram updates
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Route to check if a username is available
app.post("/check-username", async (req, res) => {
  const { username } = req.body;
  try {
    const userExists = await User.exists({ username });
    res.json({ available: !userExists });
  } catch (error) {
    console.error("Error checking username:", error);
    res
      .status(500)
      .json({ message: "An error occurred while checking the username." });
  }
});

// /start command to show introductory content and launch button
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Send an introductory message about the app and display a "Launch App" button with chatId as a parameter
    bot.sendMessage(
      chatId,
      "Welcome to The White Shark App! Here you can manage your tasks, collaborate, and more. Tap 'Launch App' to get started.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Launch App",
                web_app: {
                  url: `https://thewhiteshark.io/authenticate/${chatId}`,
                }, // Dynamic URL with chatId
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.error("Error in /start command:", error);
    bot.sendMessage(chatId, "An error occurred. Please try again later.");
  }
});

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("It is Working");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
