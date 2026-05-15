const matchService = require('../services/match.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Match Controller Handlers
 */
const matchController = {
  // @desc    Get all matches
  // @route   GET /api/v1/matches
  getAll: asyncHandler(async (req, res) => {
    const matches = await matchService.getAllMatches(req.query);
    return apiResponse.success(res, 'Matches fetched successfully', { matches });
  }),

  // @desc    Get match by ID
  // @route   GET /api/v1/matches/:id
  getById: asyncHandler(async (req, res) => {
    const match = await matchService.getMatchById(req.params.id);
    return apiResponse.success(res, 'Match fetched successfully', { match });
  }),

  // @desc    Get match moves
  // @route   GET /api/v1/matches/:id/moves
  getMoves: asyncHandler(async (req, res) => {
    const moves = await matchService.getMatchMoves(req.params.id);
    return apiResponse.success(res, 'Match moves fetched', { moves });
  }),

  // @desc    Get match PGN
  // @route   GET /api/v1/matches/:id/pgn
  getPGN: asyncHandler(async (req, res) => {
    const pgn = await matchService.getMatchPGN(req.params.id);
    return apiResponse.success(res, 'Match PGN fetched', { pgn });
  }),

  // @desc    Get match FEN
  // @route   GET /api/v1/matches/:id/fen
  getFEN: asyncHandler(async (req, res) => {
    const fen = await matchService.getMatchFEN(req.params.id);
    return apiResponse.success(res, 'Match FEN fetched', { fen });
  }),

  // @desc    Get match analysis
  // @route   GET /api/v1/matches/:id/analysis
  getAnalysis: asyncHandler(async (req, res) => {
    const analysis = await matchService.getMatchAnalysis(req.params.id);
    return apiResponse.success(res, 'Match analysis fetched', { analysis });
  }),

  // @desc    Get latest matches
  // @route   GET /api/v1/matches/latest
  getLatestMatches: asyncHandler(async (req, res) => {
    const matches = await matchService.getLatestMatches(req.query);
    return apiResponse.success(res, 'Latest matches fetched', { matches });
  }),

  // @desc    Get trending matches
  // @route   GET /api/v1/matches/trending
  getTrendingMatches: asyncHandler(async (req, res) => {
    const matches = await matchService.getTrendingMatches(req.query);
    return apiResponse.success(res, 'Trending matches fetched', { matches });
  }),

  // @desc    Get random match
  // @route   GET /api/v1/matches/random
  getRandomMatch: asyncHandler(async (req, res) => {
    const match = await matchService.getRandomMatch();
    return apiResponse.success(res, 'Random match fetched', { match });
  }),

  // @desc    Create new match
  // @route   POST /api/v1/matches
  create: asyncHandler(async (req, res) => {
    const match = await matchService.createMatch(req.body);
    return apiResponse.success(res, 'Match created successfully', { match }, {}, 201);
  }),

  // @desc    Update match
  // @route   PATCH /api/v1/matches/:id
  update: asyncHandler(async (req, res) => {
    const match = await matchService.updateMatch(req.params.id, req.body);
    return apiResponse.success(res, 'Match updated successfully', { match });
  }),

  // @desc    Delete match
  // @route   DELETE /api/v1/matches/:id
  delete: asyncHandler(async (req, res) => {
    await matchService.deleteMatch(req.params.id);
    return apiResponse.success(res, 'Match deleted successfully');
  })
};

module.exports = matchController;
