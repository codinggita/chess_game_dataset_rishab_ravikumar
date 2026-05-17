const Match = require('../models/Match');

const analyticsService = {
  getVictoryDistribution: async () => {
    const pipeline = [
      { $match: { isDeleted: false, victory_status: { $ne: '', $exists: true } } },
      { $group: { _id: '$victory_status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ];
    return await Match.aggregate(pipeline);
  },

  getColorAdvantage: async () => {
    const pipeline = [
      { $match: { isDeleted: false, winner: { $ne: 'draw', $ne: '', $exists: true } } },
      { $group: { _id: '$winner', count: { $sum: 1 } } },
      { $project: { _id: 0, color: '$_id', count: 1 } }
    ];
    return await Match.aggregate(pipeline);
  },

  getTurnCountAverage: async () => {
    const pipeline = [
      { $match: { isDeleted: false, turns: { $ne: '', $exists: true } } },
      { $group: { _id: null, avgTurns: { $avg: { $toInt: '$turns' } }, minTurns: { $min: { $toInt: '$turns' } }, maxTurns: { $max: { $toInt: '$turns' } } } },
      { $project: { _id: 0, avgTurns: { $round: ['$avgTurns', 1] }, minTurns: 1, maxTurns: 1 } }
    ];
    const result = await Match.aggregate(pipeline);
    return result[0] || { avgTurns: 0, minTurns: 0, maxTurns: 0 };
  },

  getRatedVsCasual: async () => {
    const pipeline = [
      { $match: { isDeleted: false, rated: { $ne: '', $exists: true } } },
      { $group: { _id: '$rated', count: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', count: 1 } }
    ];
    return await Match.aggregate(pipeline);
  },

  getTimeControlUsage: async () => {
    const pipeline = [
      { $match: { isDeleted: false, increment_code: { $ne: '', $exists: true } } },
      { $addFields: { initial: { $toInt: { $arrayElemAt: [{ $split: ['$increment_code', '+'] }, 0] } } } },
      { $addFields: { timeClass: { $switch: { branches: [{ case: { $lt: ['$initial', 180] }, then: 'bullet' }, { case: { $lt: ['$initial', 600] }, then: 'blitz' }, { case: { $lt: ['$initial', 1800] }, then: 'rapid' }], default: 'classical' } } } },
      { $group: { _id: '$timeClass', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, timeClass: '$_id', count: 1 } }
    ];
    return await Match.aggregate(pipeline);
  },

  getShortestGames: async () => {
    const pipeline = [
      { $match: { isDeleted: false, turns: { $ne: '', $exists: true } } },
      { $addFields: { turnsInt: { $toInt: '$turns' } } },
      { $sort: { turnsInt: 1 } },
      { $limit: 10 },
      { $project: { id: 1, white_id: 1, black_id: 1, winner: 1, turnsInt: 1, _id: 0 } }
    ];
    return await Match.aggregate(pipeline);
  },

  getLongestGames: async () => {
    const pipeline = [
      { $match: { isDeleted: false, turns: { $ne: '', $exists: true } } },
      { $addFields: { turnsInt: { $toInt: '$turns' } } },
      { $sort: { turnsInt: -1 } },
      { $limit: 10 },
      { $project: { id: 1, white_id: 1, black_id: 1, winner: 1, turnsInt: 1, _id: 0 } }
    ];
    return await Match.aggregate(pipeline);
  }
};

module.exports = analyticsService;
