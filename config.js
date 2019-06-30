module.exports = {
  targets: [
    {
      name: 'sh',
      url: 'https://home.solomaha.com/',
      responseCode: 500,
    },
  ],
  bot: {
    token: process.env.BOT_TOKEN,
    chatId: process.env.BOT_CHAT_ID,
  },
};