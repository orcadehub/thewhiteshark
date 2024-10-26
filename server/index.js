const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL
const port = process.env.PORT || 3300;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

// Parse the updates to JSON
app.use(express.json());

// Webhook route to receive updates from Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);

  // Set webhook to the Vercel deployment URL
  const webhookURL = `${url}/bot${TOKEN}`;
  bot.setWebHook(webhookURL).then(() => {
    console.log(`Webhook set to: ${webhookURL}`);
  }).catch(err => {
    console.error("Error setting webhook:", err);
  });
});

// Create the bot instance WITHOUT polling
const bot = new TelegramBot(TOKEN);

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

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send("It is Working");
});
