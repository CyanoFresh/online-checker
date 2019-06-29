const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');

const reportError = async (target, errorMessage) => {
  return axios.get(
    `https://api.telegram.org/bot${config.bot.token}/sendMessage?chat_id=${config.bot.chatId}&text=`
    + encodeURIComponent(errorMessage),
  );
};

const reportErrorCode = async (target, responseCode) => {
  const errorMessage = `Service '${target.name}' has wrong response code: ${responseCode}`;

  console.log(errorMessage);

  return reportError(target, errorMessage);
};

const checkTarget = async target => {
  console.log(`Checking '${target.name}'...`);

  axios.get(target.url)
    .then(response => {
      const neededResponseCode = target.responseCode || 200;

      if (response.status !== neededResponseCode) {
        return reportErrorCode(target, response.status);
      }

      console.log(`Checked '${target.name}' successfully`);
    })
    .catch(error => {
      console.error(`Error for '${target.name}': `, error);

      return reportError(target, `Cannot fetch url '${target.url}' for target '${target.name}'\nError: ${error.message}`);
    });
};

config.targets.forEach(target => {
  console.log(`Initializing '${target.name}' with interval ${target.interval} s.`);

  setInterval(() => checkTarget(target), target.interval * 1000);
});
