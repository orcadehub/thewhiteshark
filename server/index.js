const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL
const port = process.env.PORT || 3300;

const axios = require("axios");
const { Telegraf } = require("telegraf");
// const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const dotenv = require("dotenv");
const { saveMessage } = require("./models/message_model");

dotenv.config();

const app = express();

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

// Webhook route for Telegram to send updates to
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body); // Pass the incoming update to Telegraf for processing
  res.sendStatus(200); // Respond with OK status
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

bot.command("help", (ctx) => {
  ctx.reply(
    "This bot can help you with various tasks! Type /start to get started."
  );
});

bot.command("info", async (ctx) => {
  const user = ctx.from;
  ctx.reply(`Your name is ${user.first_name} ${user.last_name}`);
});

// Handle incoming text messages
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const messageText = ctx.message.text;

  // Save the message to MongoDB
  await saveMessage(userId, messageText);

  // Reply to the user
  ctx.reply('Your message has been saved!');
});

// Start the bot
bot.launch();

// Set the webhook
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

// Call the function to set the webhook
setWebhook();

app.get("/", (req, res) => {
  res.send("It is Working");
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
