const { Telegraf } = require('telegraf');
const express = require('express');

const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const WEBHOOK_URL = `https://thewhiteshark.vercel.app/bot${TOKEN}`; // Set webhook URL dynamically
const bot = new Telegraf(TOKEN);

const app = express();

// Middleware to handle JSON data from Telegram
app.use(express.json());

// Set the webhook automatically when the app starts
bot.telegram.setWebhook(WEBHOOK_URL).then(() => {
  console.log("Webhook set successfully:", WEBHOOK_URL);
}).catch((err) => {
  console.error("Error setting webhook:", err);
});

// Define the webhook route using the TOKEN variable
app.post(`/bot${TOKEN}`, (req, res) => {
  console.log("Received an update from Telegram:", req.body); // Log incoming updates
  bot.handleUpdate(req.body).catch(err => console.error("Error processing update:", err)); // Log any processing errors
  res.sendStatus(200); // Respond to Telegram with a 200 OK
});

// Optional route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Bot is running on Vercel!');
});

// Only start the Express server if running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Handle incoming text messages
bot.on('text', (ctx) => {
  console.log("Received text message:", ctx.message.text); // Log the incoming text
  ctx.replyWithHTML('<b>Hello</b>'); // Reply with bold "Hello"
});
