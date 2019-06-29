module.exports = {
  targets: [
    {
      name: 'sh',
      url: 'https://home.solomaha.com/',
      interval: 5 /** 60*/,
    },
  ],
  bot: {
    token: process.env.BOT_TOKEN,
    chatId: process.env.BOT_CHAT_ID,
  },
};