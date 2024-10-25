const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const url = "https://thewhiteshark-git-main-orcadehubs-projects.vercel.app"; // Use your Vercel domain

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const bot = new TelegramBot(TOKEN); // Initialize bot without polling
bot.setWebHook(`${url}/bot${TOKEN}`); // Set webhook to the Vercel URL

const app = express();
app.use(express.json()); // Parse incoming requests as JSON

// Route to handle Telegram updates
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body); // Process incoming message
  res.sendStatus(200); // Send OK status to Telegram
});

// Optional route for checking the bot
app.get("/", (req, res) => {
  res.send("Bot is running on Vercel!");
});

// Respond to a /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello! Your bot is working on Vercel!");
});

// Export the app for Vercel
module.exports = app;
