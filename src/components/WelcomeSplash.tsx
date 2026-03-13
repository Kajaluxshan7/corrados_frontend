import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { palette } from '../theme';
import { formatAmpersand } from '../utils/formatAmpersand';

type WelcomeSplashProps = {
  visible: boolean;
};

export default function WelcomeSplash({ visible }: WelcomeSplashProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        background: `radial-gradient(120% 75% at 50% 18%, ${palette.ivory} 0%, ${palette.cream} 58%, ${palette.warmGray} 100%)`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: { xs: 360, md: 620 },
          height: { xs: 360, md: 620 },
          borderRadius: '50%',
          top: { xs: -185, md: -260 },
          left: { xs: -160, md: -220 },
          background: `radial-gradient(circle, ${alpha(palette.navy, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: { xs: 320, md: 520 },
          height: { xs: 320, md: 520 },
          borderRadius: '50%',
          bottom: { xs: -170, md: -240 },
          right: { xs: -150, md: -200 },
          background: `radial-gradient(circle, ${alpha(palette.primary.main, 0.22)} 0%, transparent 70%)`,
          filter: 'blur(48px)',
        },
      }}
    >
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 150, md: 200 },
            height: { xs: 150, md: 200 },
            borderRadius: '50%',
            border: `1px solid ${alpha(palette.gold, 0.16)}`,
            top: `${13 + i * 26}%`,
            left: i === 1 ? 'auto' : `${4 + i * 11}%`,
            right: i === 1 ? '7%' : 'auto',
            animation: `splashOrbit ${9 + i * 1.8}s linear infinite`,
            transformOrigin: 'center',
          }}
        />
      ))}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%',
          maxWidth: 760,
          opacity: 0,
          animation: 'splashFadeUp 0.8s ease forwards',
          animationDelay: '0.1s',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 0.7,
            borderRadius: 999,
            border: `1px solid ${alpha(palette.gold, 0.42)}`,
            bgcolor: alpha(palette.ivory, 0.72),
            color: palette.wine,
            letterSpacing: '0.22em',
            fontSize: { xs: '0.56rem', md: '0.64rem' },
            fontWeight: 600,
          }}
        >
          WELCOME TO CORRADO&apos;S
        </Typography>
        <Box
          sx={{
            mt: { xs: 2, md: 2.5 },
            mx: 'auto',
            width: '100%',
            maxWidth: { xs: 560, md: 700 },
            borderRadius: { xs: 5, md: 7 },
            border: `1px solid ${alpha(palette.warmGray, 0.95)}`,
            background: `linear-gradient(145deg, ${alpha(palette.ivory, 0.95)} 0%, ${alpha(palette.cream, 0.95)} 60%, ${alpha(palette.warmGray, 0.9)} 100%)`,
            boxShadow: `0 26px 70px ${alpha(palette.navy, 0.14)}`,
            px: { xs: 2.3, sm: 3.2, md: 4 },
            py: { xs: 2.4, md: 3.1 },
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: 136, sm: 156, md: 170 },
              height: { xs: 136, sm: 156, md: 170 },
              borderRadius: '50%',
              mx: 'auto',
              display: 'grid',
              placeItems: 'center',
              border: `2px solid ${alpha(palette.gold, 0.52)}`,
              bgcolor: alpha(palette.ivory, 0.92),
              boxShadow: `0 0 0 10px ${alpha(palette.navy, 0.06)}, inset 0 0 36px ${alpha(palette.gold, 0.13)}`,
              animation: 'splashSoftPulse 2.6s ease-in-out infinite',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: `1px solid ${alpha(palette.navy, 0.2)}`,
                animation: 'splashOrbit 12s linear infinite',
              },
            }}
          >
            <Box
              component="img"
              src="/logos/logo-blue.png"
              alt="Corrado's Restaurant and Bar"
              sx={{
                width: '78%',
                maxWidth: 130,
                filter: `drop-shadow(0 7px 14px ${alpha(palette.navy, 0.14)})`,
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              mt: 2.2,
              color: palette.charcoal,
              fontWeight: 700,
              fontSize: { xs: '1.24rem', sm: '1.5rem', md: '1.75rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {formatAmpersand("Corrado's Restaurant & Bar")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: palette.text.secondary,
              fontSize: { xs: '0.83rem', md: '0.95rem' },
              lineHeight: 1.72,
              fontStyle: 'italic',
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            Authentic Italian dining with handcrafted tradition and warm family hospitality.
          </Typography>
          <Box
            sx={{
              mt: 1.35,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.1,
              px: 1.6,
              py: 0.42,
              borderRadius: 999,
              border: `1px solid ${alpha(palette.wine, 0.26)}`,
              bgcolor: alpha(palette.ivory, 0.68),
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: palette.wine,
                letterSpacing: '0.14em',
                fontSize: { xs: '0.54rem', md: '0.61rem' },
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              WHITBY, ON
            </Typography>
            <Box
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                bgcolor: alpha(palette.wine, 0.5),
              }}
            />
            <Typography
              variant="overline"
              sx={{
                color: palette.wine,
                letterSpacing: '0.14em',
                fontSize: { xs: '0.54rem', md: '0.61rem' },
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              EST. 2010
            </Typography>
          </Box>
          <Box
            sx={{
              mt: { xs: 2.2, md: 2.5 },
              mx: 'auto',
              width: { xs: 170, sm: 200, md: 230 },
              height: 4,
              borderRadius: 999,
              overflow: 'hidden',
              bgcolor: alpha(palette.warmGray, 0.9),
            }}
          >
            <Box
              sx={{
                height: '100%',
                borderRadius: 999,
                transformOrigin: 'left',
                background: `linear-gradient(90deg, ${palette.navy} 0%, ${palette.gold} 52%, ${palette.primary.main} 100%)`,
                backgroundSize: '200% 100%',
                animation:
                  'welcomeLoader 1.65s cubic-bezier(0.4, 0, 0.2, 1) forwards, splashShimmer 1.65s ease-in-out forwards',
              }}
            />
          </Box>
          <Box
            sx={{
              mt: 1.25,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.7,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <Box
                key={dot}
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor: alpha(palette.navy, 0.58),
                  animation: 'splashDotPulse 1s ease-in-out infinite',
                  animationDelay: `${dot * 0.15}s`,
                }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.85,
              color: alpha(palette.text.secondary, 0.9),
              letterSpacing: '0.08em',
              fontWeight: 600,
              fontSize: { xs: '0.62rem', md: '0.67rem' },
            }}
          >
            PREPARING YOUR EXPERIENCE
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            mt: 1.5,
            display: 'block',
            color: alpha(palette.text.secondary, 0.7),
            letterSpacing: '0.05em',
            fontSize: { xs: '0.64rem', md: '0.69rem' },
          }}
        >
          Crafted with passion, served with family warmth.
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 7,
            pointerEvents: 'none',
            background:
              `linear-gradient(180deg, transparent 0%, transparent 45%, ${alpha(palette.ivory, 0.42)} 100%)`,
            opacity: 0.55,
          }}
        />
      </Box>
    </Box>
  );
}
