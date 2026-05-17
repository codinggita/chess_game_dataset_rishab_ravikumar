const openingService = require('../services/opening.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { paginate } = require('../utils/pagination');

const openingController = {
  getAll: asyncHandler(async (req, res) => {
    const { page, limit, ...filters } = req.query;
    const { skip, meta } = paginate(req.query, page, limit);
    const openings = await openingService.getAllOpenings(filters, skip, meta.limit);
    return apiResponse.success(res, 'Openings fetched', { openings }, meta);
  }),

  getPopular: asyncHandler(async (req, res) => {
    const openings = await openingService.getPopularOpenings(req.query);
    return apiResponse.success(res, 'Popular openings fetched', { openings });
  }),

  getTrending: asyncHandler(async (req, res) => {
    const openings = await openingService.getTrendingOpenings(req.query);
    return apiResponse.success(res, 'Trending openings fetched', { openings });
  }),

  getWinRates: asyncHandler(async (req, res) => {
    const openings = await openingService.getOpeningWinRates(req.query);
    return apiResponse.success(res, 'Opening win rates fetched', { openings });
  }),

  search: asyncHandler(async (req, res) => {
    const { q } = req.query;
    const openings = await openingService.searchOpenings(q, req.query);
    return apiResponse.success(res, 'Openings search results', { openings });
  }),

  getByEco: asyncHandler(async (req, res) => {
    const opening = await openingService.getOpeningByEco(req.params.ecoCode);
    return apiResponse.success(res, 'Opening fetched', { opening });
  })
};

module.exports = openingController;
