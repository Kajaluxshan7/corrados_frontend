import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './palette';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    text: palette.text,
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    subtitle1: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 2,  // Sharp corners per requirements
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 28px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
