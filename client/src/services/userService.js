/* ── User Service ──
   Saved matches, personal profile stats.
   Backend: /api/v1/protected
*/

import api from './api';

const unwrap = (res) => res.data.data || res.data;

export const getSavedMatches = (params) =>
  api.get('/protected/saved-matches', { params }).then(unwrap);

export const saveMatch = (matchId) =>
  api.post('/protected/saved-matches', { matchId }).then(unwrap);

export const unsaveMatch = (matchId) =>
  api.delete(`/protected/saved-matches/${matchId}`).then(unwrap);

export const getProfileStats = () =>
  api.get('/protected/profile-stats').then(unwrap);
