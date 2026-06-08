import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './palette';
import { fonts, radius, shadows, easingCss } from './tokens';

// ─── Type scale ───────────────────────────────────────────────────────────────
// Major-third (1.250) scale so pages can stop hand-rolling fontSize overrides.
// Display headings (h1–h4) use the elegant serif; body & UI stay on Inter.

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
    info: palette.info,
    background: palette.background,
    text: palette.text,
  },
  typography: {
    fontFamily: fonts.body,
    // ── Editorial serif display ──
    h1: {
      fontFamily: fonts.display,
      fontWeight: 800,
      fontSize: '3.25rem',
      lineHeight: 1.08,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: '2.6rem',
      lineHeight: 1.12,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: '2.05rem',
      lineHeight: 1.15,
    },
    h4: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: '1.6rem',
      lineHeight: 1.2,
    },
    // ── Functional sans headings (card titles, small UI) ──
    h5: {
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: '1.05rem',
      lineHeight: 1.35,
    },
    body1: {
      fontFamily: fonts.body,
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: fonts.body,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: fonts.body,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    subtitle1: {
      fontFamily: fonts.body,
      fontWeight: 400,
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: fonts.body,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: radius.sm, // unified soft base (was 2px "sharp"); cards use md/lg
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        body: {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '*, *::before, *::after': {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        // ── Global keyboard focus ring (Phase 1) ──
        // Premium = nothing ever feels inaccessible. A single gold focus-visible
        // ring on every interactive element, invisible to mouse users.
        'a, button, [role="button"], input, select, textarea, [tabindex]': {
          '&:focus-visible': {
            outline: `2px solid ${palette.gold}`,
            outlineOffset: '3px',
            borderRadius: `${radius.sm}px`,
          },
        },
        // Respect users who prefer reduced motion, globally.
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.001ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.001ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          padding: '10px 28px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: `background-color 0.25s ${easingCss.soft}, border-color 0.25s ${easingCss.soft}, transform 0.25s ${easingCss.soft}`,
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
          borderRadius: radius.md,
          boxShadow: shadows.sm,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: radius.md,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radius.sm,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.sm,
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
          borderRadius: radius.sm,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: fonts.body,
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
