const Match = require('../models/Match');

/**
 * Match Service Logic
 */
const matchService = {
  /**
   * Get all matches (non-deleted)
   */
  getAllMatches: async (filters = {}) => {
    const query = { ...filters, isDeleted: false };
    return await Match.find(query).sort({ createdAt: -1 });
  },

  /**
   * Get match by Lichess ID
   */
  getMatchById: async (matchId) => {
    const match = await Match.findOne({ id: matchId, isDeleted: false });
    if (!match) throw new Error('Match not found');
    return match;
  },

  /**
   * Create new match
   */
  createMatch: async (matchData) => {
    // Check if match ID already exists
    const existing = await Match.findOne({ id: matchData.id });
    if (existing) throw new Error('Match ID already exists');
    
    return await Match.create(matchData);
  },

  /**
   * Update match
   */
  updateMatch: async (matchId, updateData) => {
    const match = await Match.findOneAndUpdate(
      { id: matchId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );
    if (!match) throw new Error('Match not found');
    return match;
  },

  /**
   * Soft delete match
   */
  deleteMatch: async (matchId) => {
    const match = await Match.findOneAndUpdate(
      { id: matchId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!match) throw new Error('Match not found');
    return match;
  }
};

module.exports = matchService;
