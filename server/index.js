// const token = "7600493808:AAGVYoJVAVZlMhrLKgeyHZQGq0uaqrqyroA";
// const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL

const axios = require("axios");
const { Telegraf } = require("telegraf");
// const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3300;

// Enable CORS with default options
app.use(cors());

// JSON middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
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

// Initialize the Telegram bot using the token from environment variable
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

app.post("/webhook", (req, res) => {
  try {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Define a simple bot command, e.g., /start
bot.start((ctx) => {
  const chatId = ctx.chat.id; // Accessing the chat ID from context
  ctx.reply("Open the web app inside Telegram:", {
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


// Start the bot
try {
  bot.launch();
  console.log("Telegram bot launched successfully.");
} catch (error) {
  console.error("Error launching Telegram bot:", error.message);
}


//Set the webhook
const setWebhook = async () => {
  const webhookUrl = "https://thewhiteshark.vercel.app/webhook"; // Replace with your URL
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/setWebhook?url=${webhookUrl}`;

  try {
    const response = await axios.get(url);
    console.log('Webhook set:', response.data);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
};

setWebhook();


app.get("/", (req, res) => {
  res.send("It is Working");
});

// Start Express Server
// app.listen(port, async() => {
//   console.log(`Express server is listening on port ${port}`);
//   await setWebhook();
// });

module.exports = app;
