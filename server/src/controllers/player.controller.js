const playerService = require('../services/player.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { paginate } = require('../utils/pagination');

const playerController = {
  getAll: asyncHandler(async (req, res) => {
    const { page, limit, sort, ...filters } = req.query;
    const { skip, meta } = paginate(req.query, page, limit);
    const players = await playerService.getAllPlayers(filters, skip, meta.limit);
    return apiResponse.success(res, 'Players fetched successfully', { players }, meta);
  }),

  getByUsername: asyncHandler(async (req, res) => {
    const player = await playerService.getPlayerByUsername(req.params.username);
    return apiResponse.success(res, 'Player fetched successfully', { player });
  })
};

module.exports = playerController;
