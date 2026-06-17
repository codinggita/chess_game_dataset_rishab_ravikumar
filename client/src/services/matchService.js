/* ── Match Service ──
   Match CRUD, bulk operations, filters, PGN/FEN.
   Backend: /api/v1/matches
*/

import api from './api';

const unwrap = (res) => {
  if (res.data && res.data.meta) {
    return { ...res.data.data, meta: res.data.meta };
  }
  return res.data.data;
};

/* ── CRUD ── */
export const getAll = (params) =>
  api.get('/matches', { params }).then(unwrap);

export const getById = (id) =>
  api.get(`/matches/${id}`).then(unwrap);

export const create = (data) =>
  api.post('/matches', data).then(unwrap);

export const update = (id, data) =>
  api.put(`/matches/${id}`, data).then(unwrap);

export const replace = (id, data) =>
  api.put(`/matches/${id}`, data).then(unwrap);

export const remove = (id) =>
  api.delete(`/matches/${id}`).then(unwrap);

/* ── Archive / Restore ── */
export const archive = (id) =>
  api.put(`/matches/${id}/archive`).then(unwrap);

export const restore = (id) =>
  api.put(`/matches/${id}/restore`).then(unwrap);

/* ── Bulk ── */
export const bulkUpload = (matches) =>
  api.post('/matches/bulk', { matches }).then(unwrap);

export const bulkUpdate = (ids, data) =>
  api.put('/matches/bulk', { ids, data }).then(unwrap);

export const bulkDelete = (ids) =>
  api.delete('/matches/bulk', { data: { ids } }).then(unwrap);

export const bulkArchive = (ids) =>
  api.put('/matches/bulk/archive', { ids }).then(unwrap);

/* ── Lists ── */
export const getLatest = () =>
  api.get('/matches/latest').then(unwrap);

export const getTrending = () =>
  api.get('/matches/trending').then(unwrap);

export const getRandom = () =>
  api.get('/matches/random').then(unwrap);

/* ── Game data ── */
export const getMoves = (id) =>
  api.get(`/matches/${id}/moves`).then(unwrap);

export const getPGN = (id) =>
  api.get(`/matches/${id}/pgn`).then(unwrap);

export const getFEN = (id) =>
  api.get(`/matches/${id}/fen`).then(unwrap);

export const getAnalysis = (id) =>
  api.get(`/matches/${id}/analysis`).then(unwrap);

/* ── Filter / Sort ── */
export const filterBy = (type) =>
  api.get(`/matches/filter/${type}`).then(unwrap);

export const getSorted = (type) =>
  api.get(`/matches/sorted/${type}`).then(unwrap);

/* ── Cursor / Infinite pagination ── */
export const getCursor = (cursor, limit = 20) =>
  api.get('/matches/cursor', { params: { cursor, limit } }).then(unwrap);

export const getInfinite = (page, limit = 20) =>
  api.get('/matches/infinite', { params: { page, limit } }).then(unwrap);
