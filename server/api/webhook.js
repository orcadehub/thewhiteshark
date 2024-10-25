const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { message } = req.body;

    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;

      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: `You said: ${text}`,
        }
      );

      res.status(200).send("Message processed");
    } else {
      res.status(200).send("No message found");
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Server error");
  }
};
