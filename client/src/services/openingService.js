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

export const getByStyle = (style) =>
  api.get(`/openings/style/${style}`).then(unwrap);

export const getByComplexity = (level) =>
  api.get(`/openings/complexity/${level}`).then(unwrap);

export const getByAdvantage = (side) =>
  api.get(`/openings/advantage/${side}`).then(unwrap);

export const getGambits = () =>
  api.get('/openings/gambits').then(unwrap);

export const getRare = () =>
  api.get('/openings/rare').then(unwrap);
