const moment = require("moment");
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment.utc().subtract(4, 'hours').format(" h:mma"),
  };
}

module.exports = formatMessage;
