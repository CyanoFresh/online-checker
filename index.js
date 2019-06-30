const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');

const reportError = (target, errorMessage) => {
  axios.get(
    `https://api.telegram.org/bot${config.bot.token}/sendMessage?chat_id=${config.bot.chatId}&parse_mode=markdown&text=`
    + encodeURIComponent(errorMessage),
  );
};

const reportErrorCode = (target, responseCode) => {
  const errorMessage = `*[online-checker]* Service '${target.name}' has wrong response code: ${responseCode}`;

  console.log(errorMessage);

  reportError(target, errorMessage);
};

const checkTarget = async target => {
  console.log(`Checking '${target.name}'...`);

  try {
    const response = await axios.get(target.url);

    const neededResponseCode = target.responseCode || 200;

    if (response.status !== neededResponseCode) {
      reportErrorCode(target, response.status);

      return {
        ok: false,
        error: `Wrong response code: ${response.status}`,
        target,
      };
    }

    console.log(`Checked '${target.name}' successfully`);

    return {
      ok: true,
      target,
    };
  } catch (error) {
    console.error(`Error for '${target.name}': `, error);

    reportError(target, `*[online-checker]* Cannot fetch url '${target.url}' for service '${target.name}'\nError: ${error.message}`);

    return {
      ok: false,
      error,
      target,
    };
  }
};

async function check() {
  return await Promise.all(config.targets.map(checkTarget));
}

// for now.sh:
module.exports = async (req, res) => {
  const results = await check();

  res.json({
    ok: true,
    results,
  });
};
