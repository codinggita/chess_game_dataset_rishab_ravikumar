const Player = require('../models/Player');

const playerService = {
  getAllPlayers: async (filters = {}, skip = 0, limit = 10) => {
    const { page, ...dbFilters } = filters;
    const query = { ...dbFilters };
    return await Player.find(query).sort({ totalGames: -1 }).skip(skip).limit(limit);
  },

  getPlayerByUsername: async (username) => {
    const player = await Player.findOne({ username });
    if (!player) throw new Error('Player not found');
    return player;
  }
};

module.exports = playerService;
