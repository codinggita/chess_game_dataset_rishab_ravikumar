const apiResponse = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return apiResponse.error(res, 'Admin access required', null, 403);
  }
  next();
};

module.exports = { adminOnly };
