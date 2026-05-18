const MAX_LOGS = 500;
const logs = [];

const logStore = {
  add(entry) {
    logs.push({ ...entry, timestamp: new Date().toISOString() });
    if (logs.length > MAX_LOGS) logs.shift();
  },
  getAll(limit = 100) {
    return logs.slice(-limit).reverse();
  },
  clear() {
    logs.length = 0;
  }
};

module.exports = logStore;
