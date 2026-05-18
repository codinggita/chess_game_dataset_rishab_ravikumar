const morgan = require('morgan');
const logStore = require('../utils/logStore');

const logger = morgan('dev', {
  stream: {
    write(message) {
      const parts = message.trim().split(' ');
      logStore.add({
        method: parts[0],
        url: parts[1],
        status: parseInt(parts[2], 10),
        responseTime: parts[3] === '-' ? null : parseFloat(parts[3]),
        message: message.trim()
      });
    }
  }
});

module.exports = logger;
