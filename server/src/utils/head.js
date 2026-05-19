const headExists = (model, query) => async (req, res) => {
  const exists = await model.exists(query(req));
  res.status(exists ? 200 : 404).end();
};

const headOk = (req, res) => {
  res.status(200).end();
};

module.exports = { headExists, headOk };
