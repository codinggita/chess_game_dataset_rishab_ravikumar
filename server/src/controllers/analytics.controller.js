const analyticsService = require('../services/analytics.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const analyticsController = {
  getVictoryDistribution: asyncHandler(async (req, res) => {
    const data = await analyticsService.getVictoryDistribution();
    return apiResponse.success(res, 'Victory distribution fetched', { data });
  }),

  getColorAdvantage: asyncHandler(async (req, res) => {
    const data = await analyticsService.getColorAdvantage();
    return apiResponse.success(res, 'Color advantage fetched', { data });
  }),

  getTurnCountAverage: asyncHandler(async (req, res) => {
    const data = await analyticsService.getTurnCountAverage();
    return apiResponse.success(res, 'Average turn count fetched', { data });
  }),

  getRatedVsCasual: asyncHandler(async (req, res) => {
    const data = await analyticsService.getRatedVsCasual();
    return apiResponse.success(res, 'Rated vs casual fetched', { data });
  }),

  getTimeControlUsage: asyncHandler(async (req, res) => {
    const data = await analyticsService.getTimeControlUsage();
    return apiResponse.success(res, 'Time control usage fetched', { data });
  }),

  getShortestGames: asyncHandler(async (req, res) => {
    const data = await analyticsService.getShortestGames();
    return apiResponse.success(res, 'Shortest games fetched', { data });
  }),

  getLongestGames: asyncHandler(async (req, res) => {
    const data = await analyticsService.getLongestGames();
    return apiResponse.success(res, 'Longest games fetched', { data });
  })
};

module.exports = analyticsController;
