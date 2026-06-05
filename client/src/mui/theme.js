import { createTheme } from '@mui/material/styles';

/* ───────────────────────────────────────────────
   ChessIQ Analytics — MUI Theme
   Matches CSS design tokens: gold accent, sharp corners, no shadows
   ─────────────────────────────────────────────── */

const shared = {
  shape: { borderRadius: 4 },
  shadows: [
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
    button: { textTransform: 'uppercase' },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 13,
        },
        columnHeader: {
          backgroundColor: '#0B0B0E',
          color: '#C9A84C',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: 11,
          '&:focus': { outline: 'none' },
        },
        row: {
          '&:nth-of-type(odd)': { backgroundColor: '#131318' },
          '&:nth-of-type(even)': { backgroundColor: '#1A1A20' },
          '&:hover': { backgroundColor: '#22222A' },
          '&.Mui-selected': { backgroundColor: '#2A2A32' },
        },
        cell: {
          borderBottom: '1px solid #2A2A32',
          color: '#EDE9E0',
          '&:focus': { outline: 'none' },
        },
        footerContainer: {
          backgroundColor: '#0B0B0E',
          color: '#9CA3AF',
          borderTop: '1px solid #2A2A32',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#131318',
          border: '1px solid #2A2A32',
          borderRadius: 4,
          boxShadow: 'none',
        },
        backdrop: { backgroundColor: 'rgba(0,0,0,0.7)' },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C9A84C',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C9A84C',
          },
        },
        select: { color: '#EDE9E0' },
        icon: { color: '#9CA3AF' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A20',
          border: '1px solid #2A2A32',
          borderRadius: 4,
          boxShadow: 'none',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#EDE9E0',
          fontSize: 13,
          '&:hover': { backgroundColor: '#22222A' },
          '&.Mui-selected': { backgroundColor: '#2A2A32', color: '#C9A84C' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: '#3A3A45' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#9CA3AF', '&.Mui-focused': { color: '#C9A84C' } },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#C9A84C' },
    secondary: { main: '#9CA3AF' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    success: { main: '#22C55E' },
    background: { default: '#0B0B0E', paper: '#131318' },
    text: { primary: '#EDE9E0', secondary: '#9CA3AF' },
    divider: '#2A2A32',
  },
});

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#C9A84C' },
    secondary: { main: '#6B7280' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    success: { main: '#22C55E' },
    background: { default: '#F5F3EE', paper: '#FFFFFF' },
    text: { primary: '#1A1A1A', secondary: '#6B7280' },
    divider: '#E5E4E0',
  },
});
