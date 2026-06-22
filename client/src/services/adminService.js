/* ── Admin Service ──
   Admin dashboard, user management, system health.
   Backend: /api/v1/admin, /api/v1/system
*/

import api from './api';

const unwrap = (res) => res.data.data || res.data;

/* ── Dashboard ── */
export const getDashboard = () =>
  api.get('/admin/dashboard').then(unwrap);

/* ── User Management ── */
export const getUsers = (params) =>
  api.get('/admin/users', { params }).then(unwrap);

export const getUser = (id) =>
  api.get(`/admin/users/${id}`).then(unwrap);

export const updateRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, { role }).then(unwrap);

export const banUser = (id) =>
  api.patch(`/admin/users/${id}/ban`).then(unwrap);

export const unbanUser = (id) =>
  api.patch(`/admin/users/${id}/unban`).then(unwrap);

/* ── Match Moderation ── */
export const getDeletedMatches = () =>
  api.get('/admin/matches/deleted').then(unwrap);

export const softDelete = (id) =>
  api.delete(`/admin/matches/${id}`).then(unwrap);

export const restoreMatch = (id) =>
  api.put(`/admin/matches/${id}/restore`).then(unwrap);

/* ── System ── */
export const getLogs = (limit = 50) =>
  api.get('/admin/logs', { params: { limit } }).then(unwrap);

export const getSystemHealth = () =>
  api.get('/system/health').then(unwrap);

export const clearCache = () =>
  api.delete('/admin/cache/clear').then(unwrap);

export const getPerformance = () =>
  api.get('/system/performance').then(unwrap);

export const getStorage = () =>
  api.get('/system/storage').then(unwrap);

export const getDatabaseStatus = () =>
  api.get('/system/database/status').then(unwrap);
