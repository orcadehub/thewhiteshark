const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
const url = "https://thewhiteshark.vercel.app/"; // Vercel deployment URL
const port = 3300;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN, { polling: true });

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

// Just to ping!
bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "I am alive!");
});

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Hello, this is a simple response."); // Simplified response for testing
// });

app.get('/',(req,res)=>{
  res.send("It is Working")
})

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
