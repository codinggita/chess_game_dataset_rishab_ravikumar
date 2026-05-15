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
