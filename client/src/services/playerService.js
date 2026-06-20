/* ── Player Service ──
   Player CRUD, stats, rating history, comparison.
   Backend: /api/v1/players
*/

import api from './api';

const unwrap = (res) => res.data.data;

export const getAll = (params) =>
  api.get('/players', { params }).then(unwrap);

export const getByUsername = (username) =>
  api.get(`/players/${username}`).then(unwrap);

export const getHistory = (username) =>
  api.get(`/players/${username}/history`).then(unwrap);

export const getStats = (username) =>
  api.get(`/players/${username}/stats`).then(unwrap);

export const getOpenings = (username) =>
  api.get(`/players/${username}/openings`).then(unwrap);

export const getRatingHistory = (username) =>
  api.get(`/players/${username}/rating-history`).then(unwrap);

export const getWinRate = (username) =>
  api.get(`/players/${username}/win-rate`).then(unwrap);

export const getLossRate = (username) =>
  api.get(`/players/${username}/loss-rate`).then(unwrap);

export const getDrawRate = (username) =>
  api.get(`/players/${username}/draw-rate`).then(unwrap);

export const getRecent = (username) =>
  api.get(`/players/${username}/recent`).then(unwrap);

/* ── Leaderboards ── */
export const getTopRated = () =>
  api.get('/players/top-rated').then(unwrap);

export const getTopActive = () =>
  api.get('/players/top-active').then(unwrap);

export const getTopWinning = () =>
  api.get('/players/top-winning').then(unwrap);

/* ── Compare ── */
export const compare = (player1, player2) =>
  api.get(`/players/compare/${player1}/${player2}`).then(unwrap);

export const getByRatingRange = (min, max) =>
  api.get('/players/rating-range', { params: { min, max } }).then(unwrap);
