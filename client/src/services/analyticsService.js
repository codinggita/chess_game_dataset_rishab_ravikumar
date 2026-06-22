/* ── Analytics Service ──
   Aggregated chart and insight data.
   Backend: /api/v1/analytics
*/

import api from './api';

const unwrapData = (res) => res.data.data.data;

export const getVictoryDistribution = async () => {
  const res = await api.get('/analytics/victory-distribution');
  return unwrapData(res);
};

export const getColorAdvantage = async () => {
  const res = await api.get('/analytics/color-advantage');
  return unwrapData(res);
};

export const getTurnCountAvg = async () => {
  const res = await api.get('/analytics/turn-count-average');
  return unwrapData(res);
};

export const getTimeControlUsage = async () => {
  const res = await api.get('/analytics/time-control-usage');
  return unwrapData(res);
};

export const getShortestGames = async () => {
  const res = await api.get('/analytics/shortest-games');
  return unwrapData(res);
};

export const getLongestGames = async () => {
  const res = await api.get('/analytics/longest-games');
  return unwrapData(res);
};

export const getRatingGapUpsets = async () => {
  const res = await api.get('/analytics/rating-gap-upsets');
  return unwrapData(res);
};

export const getCheckmateFreq = async () => {
  const res = await api.get('/analytics/checkmate-frequency');
  return unwrapData(res);
};

export const getOpeningSuccess = async () => {
  const res = await api.get('/analytics/opening-success');
  return unwrapData(res);
};

export const getPlayerGrowth = async () => {
  const res = await api.get('/analytics/player-growth');
  return unwrapData(res);
};

export const getHourlyActivity = async () => {
  const res = await api.get('/analytics/hourly-activity');
  return unwrapData(res);
};
