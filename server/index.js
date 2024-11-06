const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL
const port = process.env.PORT || 3300;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware

const app = express();

// Enable CORS with default options
app.use(cors());

// JSON middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/TheWhiteSharkDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Connecting models
require("./models/user_model");
require("./models/task_model");

// Include your routes after enabling CORS
app.use(require("./routes/user_route"));
app.use(require("./routes/user_related_route"));
app.use(require("./routes/task_route"));
// Webhook route to receive updates from Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Create the bot instance without polling
const bot = new TelegramBot(TOKEN);

// Set webhook once, outside of any Express or server functions
const webhookURL = `${url}/bot${TOKEN}`;
bot
  .setWebHook(webhookURL)
  .then(() => {
    console.log(`Webhook set to: ${webhookURL}`);
  })
  .catch((err) => {
    console.error("Error setting webhook:", err);
  });

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("It is Working");
});

// Respond to the /start command with a button to open the web app
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Open the web app inside Telegram:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Web App",
            web_app: { url: "https://thewhiteshark.io/" }, // Your web app URL
          },
        ],
      ],
    },
  });
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
