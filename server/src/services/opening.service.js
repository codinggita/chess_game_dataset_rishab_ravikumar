const Opening = require('../models/Opening');

const openingService = {
  getAllOpenings: async (filters = {}, skip = 0, limit = 10) => {
    const { page, ...dbFilters } = filters;
    return await Opening.find({ ...dbFilters }).sort({ totalGames: -1 }).skip(skip).limit(limit);
  },

  getPopularOpenings: async (filters = {}) => {
    const { page, ...dbFilters } = filters;
    return await Opening.find({ ...dbFilters }).sort({ totalGames: -1 }).limit(20);
  },

  getTrendingOpenings: async (filters = {}) => {
    const { page, ...dbFilters } = filters;
    return await Opening.find({ ...dbFilters }).sort({ createdAt: -1 }).limit(20);
  },

  getOpeningWinRates: async (filters = {}) => {
    const { page, ...dbFilters } = filters;
    return await Opening.find({ winRate: { $exists: true }, ...dbFilters })
      .select('eco name totalGames winRate')
      .sort({ totalGames: -1 })
      .limit(20);
  },

  searchOpenings: async (q, filters = {}) => {
    const { page, ...dbFilters } = filters;
    const query = {
      ...dbFilters,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { eco: { $regex: q, $options: 'i' } },
        { family: { $regex: q, $options: 'i' } }
      ]
    };
    return await Opening.find(query).sort({ totalGames: -1 }).limit(20);
  },

  getOpeningByEco: async (ecoCode) => {
    const opening = await Opening.findOne({ eco: ecoCode.toUpperCase() });
    if (!opening) throw new Error('Opening not found');
    return opening;
  }
};

module.exports = openingService;
