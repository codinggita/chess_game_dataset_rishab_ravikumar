/* ── Redux Store ──
   configureStore with all 4 slices.
   - auth:   user session, token, authentication state
   - ui:     theme, sidebar, modal state
   - user:   profile, saved matches
   - data:   match/player/opening lists, dashboard stats
*/

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    user: userReducer,
    data: dataReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
