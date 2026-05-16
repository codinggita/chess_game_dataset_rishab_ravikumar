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
   * Get match moves
   */
  getMatchMoves: async (matchId) => {
    const match = await Match.findOne({ id: matchId, isDeleted: false });
    if (!match) throw new Error('Match not found');
    return match.moves; // Return the raw moves string
  },

  /**
   * Get match PGN (simplified - in reality would convert to proper PGN)
   */
  getMatchPGN: async (matchId) => {
    const match = await Match.findOne({ id: matchId, isDeleted: false });
    if (!match) throw new Error('Match not found');
    // For now, return moves as PGN (real implementation would add headers, etc.)
    return match.moves;
  },

  /**
   * Get match FEN (simplified - returns starting position)
   */
  getMatchFEN: async (matchId) => {
    const match = await Match.findOne({ id: matchId, isDeleted: false });
    if (!match) throw new Error('Match not found');
    // Return starting FEN position (real implementation would calculate from moves)
    return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  },

  /**
   * Get match analysis (basic stats)
   */
  getMatchAnalysis: async (matchId) => {
    const match = await Match.findOne({ id: matchId, isDeleted: false });
    if (!match) throw new Error('Match not found');
    return {
      id: match.id,
      turns: match.turns,
      winner: match.winner,
      victoryStatus: match.victory_status,
      openingName: match.opening_name,
      openingECO: match.opening_eco,
      rated: match.rated,
      whitePlayer: match.white_id,
      blackPlayer: match.black_id,
      whiteRating: match.white_rating,
      blackRating: match.black_rating,
      incrementCode: match.increment_code,
      createdAt: match.created_at,
      lastMoveAt: match.last_move_at
    };
  },

  /**
   * Get latest matches
   */
  getLatestMatches: async (filters = {}) => {
    const query = { ...filters, isDeleted: false };
    return await Match.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
  },

  /**
   * Get trending matches (simplified - most recent)
   */
  getTrendingMatches: async (filters = {}) => {
    // In a real implementation, this might consider views, likes, etc.
    // For now, return most recent matches
    const query = { ...filters, isDeleted: false };
    return await Match.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
  },

  /**
   * Get random match
   */
  getRandomMatch: async () => {
    const count = await Match.countDocuments({ isDeleted: false });
    if (count === 0) throw new Error('No matches found');
    const random = Math.floor(Math.random() * count);
    return await Match.findOne({ isDeleted: false }).skip(random);
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
   * Archive match (soft hide)
   */
  archiveMatch: async (matchId) => {
    const match = await Match.findOneAndUpdate(
      { id: matchId, isDeleted: false, isArchived: false },
      { isArchived: true },
      { new: true }
    );
    if (!match) throw new Error('Match not found or already archived');
    return match;
  },

  /**
   * Restore match from archive
   */
  restoreMatch: async (matchId) => {
    const match = await Match.findOneAndUpdate(
      { id: matchId, isDeleted: false, isArchived: true },
      { isArchived: false },
      { new: true }
    );
    if (!match) throw new Error('Match not found or not archived');
    return match;
  },

  /**
   * Bulk upload matches
   */
  bulkUpload: async (matchesData = []) => {
    if (!matchesData.length) throw new Error('No matches provided');

    let createdCount = 0;
    const created = [];

    for (const data of matchesData) {
      const existing = await Match.findOne({ id: data.id });
      if (existing) continue;
      const match = await Match.create(data);
      created.push(match);
      createdCount++;
    }

    return { createdCount, matches: created };
  },

  /**
   * Bulk update matches by IDs
   */
  bulkUpdate: async (ids = [], updateData = {}) => {
    if (!ids.length) throw new Error('No IDs provided');

    const result = await Match.updateMany(
      { id: { $in: ids }, isDeleted: false },
      updateData,
      { runValidators: true }
    );

    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  },

  /**
   * Bulk soft delete matches by IDs
   */
  bulkDelete: async (ids = []) => {
    if (!ids.length) throw new Error('No IDs provided');

    const result = await Match.updateMany(
      { id: { $in: ids }, isDeleted: false },
      { isDeleted: true }
    );

    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  },

  /**
   * Bulk archive matches by IDs
   */
  bulkArchive: async (ids = []) => {
    if (!ids.length) throw new Error('No IDs provided');

    const result = await Match.updateMany(
      { id: { $in: ids }, isDeleted: false, isArchived: false },
      { isArchived: true }
    );

    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  },

  /**
   * Bulk restore matches from archive by IDs
   */
  bulkRestore: async (ids = []) => {
    if (!ids.length) throw new Error('No IDs provided');

    const result = await Match.updateMany(
      { id: { $in: ids }, isDeleted: false, isArchived: true },
      { isArchived: false }
    );

    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
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
