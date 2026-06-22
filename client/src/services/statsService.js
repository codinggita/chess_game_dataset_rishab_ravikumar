/* ── Stats Service ──
   Aggregated dashboard statistics.
   Backend: /api/v1/stats
   Backend wraps: { success, message, data: { ...payload } }
   Axios: response.data = full JSON body
   So: response.data.data = the payload (e.g. { total: 20058 })
*/

import api from './api';

/* ── Helpers ── */

/* Backend wraps: { success, data: { data: { ...payload } } }
   Axios response.data = full JSON body
   So: res.data.data.data = the actual payload (e.g. { total: 20058 }) */
const unwrapData = (res) => res.data.data.data;

export const getTotalMatches = async () => {
  const res = await api.get('/stats/total-matches');
  return unwrapData(res).total;
};

export const getTotalPlayers = async () => {
  const res = await api.get('/stats/total-players');
  return unwrapData(res).total;
};

export const getAverageRating = async () => {
  const res = await api.get('/stats/average-rating');
  return unwrapData(res);
};

export const getTopOpenings = async () => {
  const res = await api.get('/stats/top-openings');
  return unwrapData(res);
};

export const getCheckmateRate = async () => {
  const res = await api.get('/stats/checkmate-rate');
  const rate = unwrapData(res).rate; // "4.2%"
  return parseFloat(rate);           // 4.2
};

export const getResignationRate = async () => {
  const res = await api.get('/stats/resignation-rate');
  return unwrapData(res);
};

export const getTimeoutRate = async () => {
  const res = await api.get('/stats/timeout-rate');
  return unwrapData(res);
};

export const getWhiteWinRate = async () => {
  const res = await api.get('/stats/white-win-rate');
  const rate = unwrapData(res).rate; // "49.8%"
  return parseFloat(rate);           // 49.8
};

export const getBlackWinRate = async () => {
  const res = await api.get('/stats/black-win-rate');
  const rate = unwrapData(res).rate;
  return parseFloat(rate);
};

export const getDrawRate = async () => {
  const res = await api.get('/stats/draw-rate');
  const rate = unwrapData(res).rate;
  return parseFloat(rate);
};

export const getRatedGames = async () => {
  const res = await api.get('/stats/rated-games');
  return unwrapData(res);
};

export const getDailyGames = async () => {
  const res = await api.get('/stats/daily-games');
  return unwrapData(res);
};

export const getMonthlyGames = async () => {
  const res = await api.get('/stats/monthly-games');
  return unwrapData(res);
};

export const getYearlyGames = async () => {
  const res = await api.get('/stats/yearly-games');
  return unwrapData(res);
};
