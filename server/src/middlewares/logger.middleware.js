const morgan = require('morgan');
const logStore = require('../utils/logStore');

// Custom token-based format — no ANSI colors, structured fields
morgan.token('response-ms', (req, res) => {
  const start = req._startAt;
  const end = process.hrtime(start);
  return ((end[0] * 1e3) + (end[1] * 1e-6)).toFixed(2);
});

const logger = morgan((tokens, req, res) => {
  // Return null to skip morgan's own stream — we handle storage directly
  return null;
}, {
  stream: { write() {} }
});

// Use a real middleware that stores structured data without ANSI
const structuredLogger = (req, res, next) => {
  const startAt = process.hrtime();
  req._startAt = startAt;

  res.on('finish', () => {
    const diff = process.hrtime(startAt);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6);

    logStore.add({
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: parseFloat(responseTime.toFixed(2)),
    });
  });

  next();
};

module.exports = structuredLogger;
