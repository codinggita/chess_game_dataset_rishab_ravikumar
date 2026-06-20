/* ── Opening Service ──
   Opening directory, ECO codes, popularity, trends.
   Backend: /api/v1/openings
*/

import api from './api';

const unwrap = (res) => res.data.data;

export const getAll = (params) =>
  api.get('/openings', { params }).then(unwrap);

export const getPopular = () =>
  api.get('/openings/popular').then(unwrap);

export const getTrending = () =>
  api.get('/openings/trending').then(unwrap);

export const getWinRates = () =>
  api.get('/openings/win-rates').then(unwrap);

export const search = (q) =>
  api.get('/openings/search', { params: { q } }).then(unwrap);

export const getByEco = (eco) =>
  api.get(`/openings/eco/${eco}`).then(unwrap);

export const getAggressive = () =>
  api.get('/openings/aggressive').then(unwrap);

export const getDefensive = () =>
  api.get('/openings/defensive').then(unwrap);

export const getGambits = () =>
  api.get('/openings/gambits').then(unwrap);

export const getWhiteAdvantage = () =>
  api.get('/openings/white-advantage').then(unwrap);

export const getBlackAdvantage = () =>
  api.get('/openings/black-advantage').then(unwrap);

export const getBeginnerFriendly = () =>
  api.get('/openings/beginner-friendly').then(unwrap);

export const getByComplexity = (level) =>
  api.get('/openings/complexity', { params: { level } }).then(unwrap);

export const getRare = () =>
  api.get('/openings/rare').then(unwrap);
