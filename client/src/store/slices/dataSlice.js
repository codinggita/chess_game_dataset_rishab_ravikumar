/* ── dataSlice ──
   Central data cache for matches, players, openings, and dashboard stats.
   Each sub-section has its own pagination, filters, and loading state.
   Consumes matchService, playerService, openingService, statsService.
*/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as matchService from '../../services/matchService';
import * as playerService from '../../services/playerService';
import * as openingService from '../../services/openingService';
import * as statsService from '../../services/statsService';

/* ─── Thunks: Matches ─── */

export const fetchMatches = createAsyncThunk(
  'data/fetchMatches',
  async (params, { rejectWithValue }) => {
    try {
      return await matchService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
    }
  },
);

export const createMatch = createAsyncThunk(
  'data/createMatch',
  async (data, { rejectWithValue }) => {
    try {
      return await matchService.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create match');
    }
  },
);

export const updateMatch = createAsyncThunk(
  'data/updateMatch',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await matchService.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update match');
    }
  },
);

export const deleteMatch = createAsyncThunk(
  'data/deleteMatch',
  async (id, { rejectWithValue }) => {
    try {
      await matchService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete match');
    }
  },
);

export const archiveMatch = createAsyncThunk(
  'data/archiveMatch',
  async (id, { rejectWithValue }) => {
    try {
      return await matchService.archive(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to archive match');
    }
  },
);

export const restoreMatch = createAsyncThunk(
  'data/restoreMatch',
  async (id, { rejectWithValue }) => {
    try {
      return await matchService.restore(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to restore match');
    }
  },
);

/* ─── Thunks: Players ─── */

export const fetchPlayers = createAsyncThunk(
  'data/fetchPlayers',
  async (params, { rejectWithValue }) => {
    try {
      return await playerService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch players');
    }
  },
);

/* ─── Thunks: Openings ─── */

export const fetchOpenings = createAsyncThunk(
  'data/fetchOpenings',
  async (params, { rejectWithValue }) => {
    try {
      return await openingService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch openings');
    }
  },
);

/* ─── Thunks: Stats ─── */

export const fetchStats = createAsyncThunk(
  'data/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [totalMatches, totalPlayers, whiteWinRate, blackWinRate, drawRate, checkmateRate, resignationRate, timeoutRate, topOpenings, averageRating] =
        await Promise.all([
          statsService.getTotalMatches(),
          statsService.getTotalPlayers(),
          statsService.getWhiteWinRate(),
          statsService.getBlackWinRate(),
          statsService.getDrawRate(),
          statsService.getCheckmateRate(),
          statsService.getResignationRate(),
          statsService.getTimeoutRate(),
          statsService.getTopOpenings(),
          statsService.getAverageRating(),
        ]);
      return {
        totalMatches,
        totalPlayers,
        whiteWinRate,
        blackWinRate,
        drawRate,
        checkmateRate,
        resignationRate,
        timeoutRate,
        topOpenings,
        averageRating,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  },
);

/* ─── Initial state ─── */

const initialState = {
  matches: {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    filters: {},
    sort: { created_at: -1 },
    isLoading: false,
  },
  players: {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
  },
  openings: {
    items: [],
    totalCount: 0,
    filters: {},
    isLoading: false,
  },
  stats: {
    totalMatches: 0,
    totalPlayers: 0,
    whiteWinRate: 0,
    blackWinRate: 0,
    drawRate: 0,
    checkmateRate: 0,
    resignationRate: 0,
    timeoutRate: 0,
    topOpenings: [],
    averageRating: 0,
    isLoading: false,
  },
  error: null,
};

/* ─── Helpers ─── */

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return { items: payload, totalCount: payload.length };
  if (payload?.matches) return { items: payload.matches, totalCount: payload.meta?.total || payload.totalCount || payload.matches.length };
  if (payload?.players) return { items: payload.players, totalCount: payload.totalCount || payload.players.length };
  if (payload?.openings) return { items: payload.openings, totalCount: payload.totalCount || payload.openings.length };
  if (payload?.items) return { items: payload.items, totalCount: payload.totalCount || payload.items.length };
  return { items: [], totalCount: 0 };
};

/* ─── Slice ─── */

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setMatchFilters(state, action) {
      state.matches.filters = { ...state.matches.filters, ...action.payload };
    },
    clearMatchFilters(state) {
      state.matches.filters = {};
    },
    setMatchPage(state, action) {
      state.matches.page = action.payload;
    },
    setMatchSort(state, action) {
      state.matches.sort = action.payload;
    },
    clearDataError(state) {
      state.error = null;
    },
    resetData() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    /* ── fetchMatches ── */
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.matches.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        const { items, totalCount } = normalizeList(action.payload);
        state.matches.items = items;
        state.matches.totalCount = totalCount;
        state.matches.isLoading = false;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.matches.isLoading = false;
        state.error = action.payload;
      });

    /* ── createMatch ── */
    builder
      .addCase(createMatch.fulfilled, (state, action) => {
        state.matches.items.unshift(action.payload);
        state.matches.totalCount += 1;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* ── updateMatch ── */
    builder
      .addCase(updateMatch.fulfilled, (state, action) => {
        const idx = state.matches.items.findIndex(
          (m) => m.id === action.payload.id || m._id === action.payload._id,
        );
        if (idx !== -1) {
          state.matches.items[idx] = action.payload;
        }
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* ── deleteMatch ── */
    builder
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.matches.items = state.matches.items.filter(
          (m) => m.id !== action.payload && m._id !== action.payload,
        );
        state.matches.totalCount = Math.max(0, state.matches.totalCount - 1);
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* ── archiveMatch ── */
    builder
      .addCase(archiveMatch.fulfilled, (state, action) => {
        const idx = state.matches.items.findIndex(
          (m) => m.id === action.payload.id || m._id === action.payload._id,
        );
        if (idx !== -1) {
          state.matches.items[idx] = { ...state.matches.items[idx], isArchived: true };
        }
      })
      .addCase(archiveMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* ── restoreMatch ── */
    builder
      .addCase(restoreMatch.fulfilled, (state, action) => {
        const idx = state.matches.items.findIndex(
          (m) => m.id === action.payload.id || m._id === action.payload._id,
        );
        if (idx !== -1) {
          state.matches.items[idx] = { ...state.matches.items[idx], isArchived: false };
        }
      })
      .addCase(restoreMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* ── fetchPlayers ── */
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.players.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        const { items, totalCount } = normalizeList(action.payload);
        state.players.items = items;
        state.players.totalCount = totalCount;
        state.players.isLoading = false;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.players.isLoading = false;
        state.error = action.payload;
      });

    /* ── fetchOpenings ── */
    builder
      .addCase(fetchOpenings.pending, (state) => {
        state.openings.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOpenings.fulfilled, (state, action) => {
        const { items, totalCount } = normalizeList(action.payload);
        state.openings.items = items;
        state.openings.totalCount = totalCount;
        state.openings.isLoading = false;
      })
      .addCase(fetchOpenings.rejected, (state, action) => {
        state.openings.isLoading = false;
        state.error = action.payload;
      });

    /* ── fetchStats ── */
    builder
      .addCase(fetchStats.pending, (state) => {
        state.stats.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = { ...state.stats, ...action.payload, isLoading: false };
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.stats.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setMatchFilters,
  clearMatchFilters,
  setMatchPage,
  setMatchSort,
  clearDataError,
  resetData,
} = dataSlice.actions;

export default dataSlice.reducer;
