import { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { palette } from '../theme';

export default function ScrollProgressButton() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setProgress(0);
        setVisible(false);
        return;
      }

      const nextProgress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollableHeight) * 100)));
      setProgress(nextProgress);
      setVisible(scrollTop > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 24 },
        bottom: { xs: 16, md: 24 },
        zIndex: 1400,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
      }}
    >
      <IconButton
        aria-label="Scroll to top"
        onClick={handleScrollToTop}
        sx={{
          position: 'relative',
          width: { xs: 64, md: 72 },
          height: { xs: 64, md: 72 },
          borderRadius: '50%',
          p: 0,
          background: `conic-gradient(${palette.primary.main} ${progress * 3.6}deg, rgba(36, 58, 125, 0.16) 0deg)`,
          boxShadow: '0 18px 34px rgba(45, 41, 38, 0.18)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 24px 42px rgba(45, 41, 38, 0.24)',
            background: `conic-gradient(${palette.gold} ${progress * 3.6}deg, rgba(36, 58, 125, 0.18) 0deg)`,
          },
        }}
      >
        <Box
          sx={{
            width: 'calc(100% - 10px)',
            height: 'calc(100% - 10px)',
            borderRadius: '50%',
            background: `linear-gradient(180deg, ${palette.background.default} 0%, ${palette.cream} 100%)`,
            color: palette.navy,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${palette.warmGray}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 6,
              borderRadius: '50%',
              border: `1px solid ${palette.navy}18`,
            },
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: { xs: 13, md: 14 },
              fontSize: '0.48rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: palette.primary.main,
              lineHeight: 1,
            }}
          >
            TOP
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.88rem', md: '0.96rem' },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '0.03em',
              color: palette.navy,
              mt: 1,
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </IconButton>
    </Box>
  );
}