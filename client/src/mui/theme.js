import { createTheme } from '@mui/material/styles';

/* ───────────────────────────────────────────────
   ChessIQ Analytics — MUI Theme (Dark Default)
   Matches CHESSIQ-FRONTEND-PRD.md tokens exactly.
   PRD Rule #14: Dark mode is default. Light mode is optional toggle.
   ─────────────────────────────────────────────── */

const theme = createTheme({
  shape: { borderRadius: 4 },
  shadows: Array(25).fill('none'),
  palette: {
    mode: 'dark',
    primary: { main: '#C9A84C' },
    secondary: { main: '#8C8CA0' },
    error: { main: '#F05252' },
    warning: { main: '#F59E0B' },
    info: { main: '#6B7AFF' },
    success: { main: '#2DD4A0' },
    background: { default: '#0B0B0E', paper: '#131318' },
    text: { primary: '#EDE9E0', secondary: '#8C8CA0' },
    divider: '#1E1E28',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
    button: { textTransform: 'uppercase' },
  },
  components: {
    /* ── Data Grid (§5 Data Table) ── */
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 13,
        },
        columnHeader: {
          backgroundColor: '#1A1A22',
          color: '#55556A',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: 12,
          padding: '0 16px',
          height: '40px !important',
          minHeight: '40px !important',
          maxHeight: '40px !important',
          '&:focus': { outline: 'none' },
          '&:hover': { color: '#EDE9E0' },
        },
        columnHeaderTitle: {
          fontWeight: 600,
        },
        sortIcon: {
          color: '#C9A84C',
        },
        row: {
          height: '48px !important',
          minHeight: '48px !important',
          maxHeight: '48px !important',
          borderBottom: '1px solid #1E1E28',
          '&:hover': {
            backgroundColor: '#181820',
            boxShadow: 'inset 3px 0 0 rgba(201,168,76,0.5)',
          },
          '&.Mui-selected': {
            backgroundColor: '#181820',
          },
          '&:last-child': {
            borderBottom: 'none',
          },
        },
        cell: {
          borderBottom: '1px solid #1E1E28',
          color: '#EDE9E0',
          padding: '0 16px',
          '&:focus': { outline: 'none' },
        },
        footerContainer: {
          backgroundColor: '#131318',
          color: '#55556A',
          borderTop: '1px solid #1E1E28',
        },
        columnSeparator: {
          color: '#1E1E28',
        },
        overlay: {
          backgroundColor: '#131318',
        },
      },
    },

    /* ── Dialog / Modal (§5 Modal/Dialog) ── */
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A22',
          border: '1px solid #35354A',
          borderRadius: 8,
          boxShadow: 'none',
        },
        backdrop: { backgroundColor: 'rgba(0,0,0,0.75)' },
      },
    },

    /* ── Select / Dropdown ── */
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#252530',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C9A84C',
          },
        },
        select: {
          color: '#EDE9E0',
          fontSize: 13,
        },
        icon: { color: '#55556A' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#EDE9E0',
          fontSize: 13,
        },
        notchedOutline: { borderColor: '#252530' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#55556A',
          fontSize: 13,
          '&.Mui-focused': { color: '#C9A84C' },
        },
      },
    },

    /* ── Menu / MenuItem ── */
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A22',
          border: '1px solid #35354A',
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
          '&:hover': { backgroundColor: '#222230' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(201,168,76,0.08)',
            color: '#C9A84C',
          },
        },
      },
    },
  },
});

export default theme;
