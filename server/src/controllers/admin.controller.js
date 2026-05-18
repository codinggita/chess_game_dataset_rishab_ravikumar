const Match = require('../models/Match');
const User = require('../models/User');
const Player = require('../models/Player');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const adminController = {
  getDashboard: asyncHandler(async (req, res) => {
    const [totalMatches, deletedMatches, totalUsers, totalPlayers] = await Promise.all([
      Match.countDocuments({ isDeleted: false }),
      Match.countDocuments({ isDeleted: true }),
      User.countDocuments(),
      Player.countDocuments()
    ]);
    return apiResponse.success(res, 'Dashboard stats fetched', {
      totalMatches, deletedMatches, totalUsers, totalPlayers
    });
  }),

  listUsers: asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -refreshToken -resetToken -resetTokenExpiry');
    return apiResponse.success(res, 'Users fetched', { users });
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -refreshToken -resetToken -resetTokenExpiry');
    if (!user) return apiResponse.error(res, 'User not found', null, 404);
    return apiResponse.success(res, 'User fetched', { user });
  }),

  updateUserRole: asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return apiResponse.error(res, 'Invalid role', null, 400);
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return apiResponse.error(res, 'User not found', null, 404);
    return apiResponse.success(res, 'User role updated', { user });
  }),

  banUser: asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
    if (!user) return apiResponse.error(res, 'User not found', null, 404);
    return apiResponse.success(res, 'User banned', { user });
  }),

  unbanUser: asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true }).select('-password');
    if (!user) return apiResponse.error(res, 'User not found', null, 404);
    return apiResponse.success(res, 'User unbanned', { user });
  }),

  getDeletedMatches: asyncHandler(async (req, res) => {
    const matches = await Match.find({ isDeleted: true }).lean();
    return apiResponse.success(res, 'Deleted matches fetched', { matches });
  }),

  softDeleteMatch: asyncHandler(async (req, res) => {
    const match = await Match.findOneAndUpdate(
      { id: req.params.id },
      { isDeleted: true },
      { new: true }
    ).lean();
    if (!match) return apiResponse.error(res, 'Match not found', null, 404);
    return apiResponse.success(res, 'Match soft deleted', { match });
  }),

  restoreMatch: asyncHandler(async (req, res) => {
    const match = await Match.findOneAndUpdate(
      { id: req.params.id },
      { isDeleted: false },
      { new: true }
    ).lean();
    if (!match) return apiResponse.error(res, 'Match not found', null, 404);
    return apiResponse.success(res, 'Match restored', { match });
  })
};

module.exports = adminController;
