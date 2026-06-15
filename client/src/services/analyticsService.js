/* ── Analytics Service ──
   Aggregated chart and insight data.
   Backend: /api/v1/analytics
*/

import api from './api';

const unwrap = (res) => res.data.data || res.data;

export const getVictoryDistribution = () =>
  api.get('/analytics/victory-distribution').then(unwrap);

export const getColorAdvantage = () =>
  api.get('/analytics/color-advantage').then(unwrap);

export const getTurnCountAvg = () =>
  api.get('/analytics/turn-count-avg').then(unwrap);

export const getTimeControlUsage = () =>
  api.get('/analytics/time-control-usage').then(unwrap);

export const getShortestGames = () =>
  api.get('/analytics/shortest-games').then(unwrap);

export const getLongestGames = () =>
  api.get('/analytics/longest-games').then(unwrap);

export const getRatingGapUpsets = () =>
  api.get('/analytics/rating-gap-upsets').then(unwrap);

export const getCheckmateFreq = () =>
  api.get('/analytics/checkmate-frequency').then(unwrap);

export const getOpeningSuccess = () =>
  api.get('/analytics/opening-success').then(unwrap);

export const getPlayerGrowth = () =>
  api.get('/analytics/player-growth').then(unwrap);

export const getHourlyActivity = () =>
  api.get('/analytics/hourly-activity').then(unwrap);
