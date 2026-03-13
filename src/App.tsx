import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { WelcomeSplash } from './components';
import { theme } from './theme';
import router from './routes';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setShowSplash(false), 1900);
    const unmountTimer = window.setTimeout(() => setSplashMounted(false), 2450);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@keyframes welcomeLoader': {
            from: { transform: 'scaleX(0)' },
            to: { transform: 'scaleX(1)' },
          },
          '@keyframes splashFadeUp': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes splashShimmer': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '0% 0' },
          },
          '@keyframes splashOrbit': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          '@keyframes splashSoftPulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
          },
          '@keyframes splashDotPulse': {
            '0%, 100%': { transform: 'translateY(0)', opacity: 0.35 },
            '50%': { transform: 'translateY(-4px)', opacity: 0.95 },
          },
        }}
      />
      <RouterProvider router={router} />
      {splashMounted && <WelcomeSplash visible={showSplash} />}
    </ThemeProvider>
  );
}

export default App;
