/* ── Stats Service ──
   Aggregated dashboard statistics.
   Backend: /api/v1/stats
*/

import api from './api';

const unwrap = (res) => res.data.data || res.data;

export const getTotalMatches = () =>
  api.get('/stats/total-matches').then(unwrap);

export const getTotalPlayers = () =>
  api.get('/stats/total-players').then(unwrap);

export const getAverageRating = () =>
  api.get('/stats/average-rating').then(unwrap);

export const getTopOpenings = () =>
  api.get('/stats/top-openings').then(unwrap);

export const getCheckmateRate = () =>
  api.get('/stats/checkmate-rate').then(unwrap);

export const getResignationRate = () =>
  api.get('/stats/resignation-rate').then(unwrap);

export const getTimeoutRate = () =>
  api.get('/stats/timeout-rate').then(unwrap);

export const getWhiteWinRate = () =>
  api.get('/stats/white-win-rate').then(unwrap);

export const getBlackWinRate = () =>
  api.get('/stats/black-win-rate').then(unwrap);

export const getDrawRate = () =>
  api.get('/stats/draw-rate').then(unwrap);

export const getRatedGames = () =>
  api.get('/stats/rated-games').then(unwrap);

export const getDailyGames = () =>
  api.get('/stats/daily-games').then(unwrap);

export const getMonthlyGames = () =>
  api.get('/stats/monthly-games').then(unwrap);

export const getYearlyGames = () =>
  api.get('/stats/yearly-games').then(unwrap);
