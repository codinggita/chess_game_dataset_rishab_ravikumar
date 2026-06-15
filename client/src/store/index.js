/* ── Redux Store ──
   configureStore with auth + ui slices.
   userSlice and dataSlice added in subsequent PRs.
*/

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
