const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Generate Access Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Auth Service Logic
 */
const authService = {
  register: async (userData) => {
    const user = await User.create(userData);
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  },

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (user.isBanned) {
      throw new Error('Your account has been banned');
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  },

  logout: async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  getProfile: async (userId) => {
    return await User.findById(userId).select('-password -refreshToken');
  },

  updateProfile: async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');
  },

  deleteProfile: async (userId) => {
    return await User.findByIdAndDelete(userId);
  }
};

module.exports = authService;
