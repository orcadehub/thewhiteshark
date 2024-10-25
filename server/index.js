const { Telegraf } = require('telegraf');
const express = require('express');

const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI"; // Bot token stored in a separate variable
const bot = new Telegraf(TOKEN);

const app = express();

// Middleware to handle JSON data from Telegram
app.use(express.json());

// Define the webhook route to match the URL you set on Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
  // Process incoming Telegram updates
  bot.handleUpdate(req.body);
  res.sendStatus(200); // Respond to Telegram with a 200 OK
});

// Optional route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Bot is running on Vercel!');
});

// Start the Express server (useful for local testing)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Sample handler for incoming messages
bot.on('text', (ctx) => {
  ctx.replyWithHTML('<b>Hello</b>'); // Reply with bold "Hello"
});

// Launch the bot (useful for local testing but not required on Vercel)
bot.launch();
