/* ── uiSlice ──
   Global UI state: theme, sidebar, modals.
   Theme persisted in localStorage to survive refreshes.
   toggleTheme updates localStorage + <html> class for CSS variables.
*/

import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => localStorage.getItem('theme') || 'dark';

const initialState = {
  theme: getInitialTheme(),
  sidebarCollapsed: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
      document.documentElement.classList.toggle('light', state.theme === 'light');
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.classList.toggle('light', action.payload === 'light');
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openModal(state, action) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
