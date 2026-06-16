/* ── userSlice ──
   Profile, saved matches, and personal stats.
   Consumes authService + userService from services layer.
*/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';
import * as authService from '../../services/authService';

/* ─── Thunks ─── */

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  },
);

export const fetchSavedMatches = createAsyncThunk(
  'user/fetchSavedMatches',
  async (params, { rejectWithValue }) => {
    try {
      return await userService.getSavedMatches(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch saved matches');
    }
  },
);

export const saveMatch = createAsyncThunk(
  'user/saveMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      await userService.saveMatch(matchId);
      return matchId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save match');
    }
  },
);

export const unsaveMatch = createAsyncThunk(
  'user/unsaveMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      await userService.unsaveMatch(matchId);
      return matchId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to unsave match');
    }
  },
);

/* ─── Initial state ─── */

const initialState = {
  profile: null,
  savedMatches: [],
  isLoading: false,
  error: null,
};

/* ─── Slice ─── */

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    resetUser(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    /* fetchProfile */
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* updateProfile */
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* fetchSavedMatches */
    builder
      .addCase(fetchSavedMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedMatches.fulfilled, (state, action) => {
        state.savedMatches = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSavedMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* saveMatch */
    builder
      .addCase(saveMatch.fulfilled, (state, action) => {
        if (!state.savedMatches.some((m) => m.id === action.payload || m._id === action.payload)) {
          state.savedMatches.push({ id: action.payload });
        }
      })
      .addCase(saveMatch.rejected, (state, action) => {
        state.error = action.payload;
      });

    /* unsaveMatch */
    builder
      .addCase(unsaveMatch.fulfilled, (state, action) => {
        state.savedMatches = state.savedMatches.filter(
          (m) => m.id !== action.payload && m._id !== action.payload,
        );
      })
      .addCase(unsaveMatch.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserError, resetUser } = userSlice.actions;
export default userSlice.reducer;
