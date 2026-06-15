/* ── Auth Service ──
   Authentication API functions.
   Backend: /api/v1/auth
*/

import api from './api';

const unwrap = (res) => res.data.data;

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(unwrap);

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then(unwrap);

export const logout = () =>
  api.post('/auth/logout').then(unwrap);

export const refreshToken = (token) =>
  api.post('/auth/refresh-token', { refreshToken: token }).then(unwrap);

export const getProfile = () =>
  api.get('/auth/me').then(unwrap);

export const updateProfile = (data) =>
  api.put('/auth/me', data).then(unwrap);

export const changePassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword }).then(unwrap);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then(unwrap);

export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password }).then(unwrap);

export const verifyEmail = () =>
  api.post('/auth/verify-email').then(unwrap);
