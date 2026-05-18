const apiResponse = require('./apiResponse');

const allowedMethods = (methods) => (req, res) => {
  res.set('Allow', methods.join(', '));
  return apiResponse.success(res, 'Allowed methods', { methods });
};

module.exports = { allowedMethods };
