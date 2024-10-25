const TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const url = "https://thewhiteshark-886m9bfcq-orcadehubs-projects.vercel.app/"; // Your Vercel app URL
const port = 3300;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

// Parse the updates to JSON
app.use(express.json());

// Create the bot instance WITHOUT polling (Webhook-based only)
const bot = new TelegramBot(TOKEN);

// Webhook route to receive updates from Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body); // Process incoming updates from Telegram
  res.sendStatus(200); // Respond to Telegram with 200 OK
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});

// Just to ping!
bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, 'I am alive!');
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Open the web app inside Telegram:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Web App",
              web_app: { url: "https://thewhiteshark.io/" }, // Replace with your web app URL
            },
          ],
        ],
      },
    });
  });

