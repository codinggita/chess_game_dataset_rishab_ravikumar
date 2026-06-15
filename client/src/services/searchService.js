/* ── Search Service ──
   Global search across matches, players, openings.
   Backend: /api/v1/search
*/

import api from './api';

const unwrap = (res) => res.data.data || res.data;

export const searchMatches = (q) =>
  api.get('/search/matches', { params: { q } }).then(unwrap);

export const searchPlayers = (q) =>
  api.get('/search/players', { params: { q } }).then(unwrap);

export const searchOpenings = (q) =>
  api.get('/search/openings', { params: { q } }).then(unwrap);

export const searchEco = (q) =>
  api.get('/search/eco', { params: { q } }).then(unwrap);

export const searchFuzzy = (q) =>
  api.get('/search/fuzzy', { params: { q } }).then(unwrap);

export const autocomplete = (q) =>
  api.get('/search/autocomplete', { params: { q } }).then(unwrap);

export const getRecent = () =>
  api.get('/search/recent').then(unwrap);

export const getPopular = () =>
  api.get('/search/popular').then(unwrap);

export const searchAdvanced = (params) =>
  api.get('/search/advanced', { params }).then(unwrap);

export const searchByRating = (rating) =>
  api.get('/search/by-rating', { params: { rating } }).then(unwrap);

export const searchByDateRange = (from, to) =>
  api.get('/search/by-date', { params: { from, to } }).then(unwrap);
