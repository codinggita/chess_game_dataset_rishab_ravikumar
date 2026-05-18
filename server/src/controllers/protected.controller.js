const User = require('../models/User');
const Match = require('../models/Match');
const Player = require('../models/Player');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const matchService = require('../services/match.service');

const protectedController = {
  saveMatch: asyncHandler(async (req, res) => {
    const match = await Match.findOne({ id: req.params.id, isDeleted: false }).lean();
    if (!match) return apiResponse.error(res, 'Match not found', null, 404);

    const exists = req.user.savedMatches.some(sm => sm.matchId === req.params.id);
    if (exists) return apiResponse.error(res, 'Match already saved', null, 409);

    req.user.savedMatches.push({ matchId: req.params.id });
    await req.user.save();
    return apiResponse.success(res, 'Match saved', { savedMatch: { matchId: req.params.id } });
  }),

  unsaveMatch: asyncHandler(async (req, res) => {
    const idx = req.user.savedMatches.findIndex(sm => sm.matchId === req.params.id);
    if (idx === -1) return apiResponse.error(res, 'Match not in saved list', null, 404);

    req.user.savedMatches.splice(idx, 1);
    await req.user.save();
    return apiResponse.success(res, 'Match unsaved');
  }),

  getSavedMatches: asyncHandler(async (req, res) => {
    const ids = req.user.savedMatches.map(sm => sm.matchId);
    if (ids.length === 0) return apiResponse.success(res, 'Saved matches fetched', { matches: [] });

    const matches = await Match.find({ id: { $in: ids } }).lean();
    return apiResponse.success(res, 'Saved matches fetched', { matches });
  }),

  getProfileStats: asyncHandler(async (req, res) => {
    const savedCount = req.user.savedMatches.length;
    const user = await User.findById(req.user._id).select('-password -refreshToken -resetToken -resetTokenExpiry');
    return apiResponse.success(res, 'Profile stats fetched', {
      user,
      stats: { savedMatches: savedCount }
    });
  }),

  listMatches: asyncHandler(async (req, res) => {
    const matches = await matchService.getAllMatches(req.query, {}, 0, 20);
    return apiResponse.success(res, 'Protected matches fetched', { matches });
  }),

  createMatch: asyncHandler(async (req, res) => {
    const match = await matchService.createMatch(req.body);
    return apiResponse.success(res, 'Match created via protected route', { match }, {}, 201);
  }),

  updateMatch: asyncHandler(async (req, res) => {
    const match = await matchService.updateMatch(req.params.id, req.body);
    return apiResponse.success(res, 'Match updated via protected route', { match });
  }),

  deleteMatch: asyncHandler(async (req, res) => {
    await matchService.deleteMatch(req.params.id);
    return apiResponse.success(res, 'Match deleted via protected route');
  }),

  getAdminDashboard: asyncHandler(async (req, res) => {
    const [totalMatches, totalUsers, totalPlayers] = await Promise.all([
      Match.countDocuments({ isDeleted: false }),
      User.countDocuments(),
      Player.countDocuments()
    ]);
    return apiResponse.success(res, 'Admin protected dashboard', {
      totalMatches, totalUsers, totalPlayers
    });
  })
};

module.exports = protectedController;
