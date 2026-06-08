import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import { motion } from 'framer-motion';
import { palette, fonts } from '../theme';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function NotFound() {
  usePageMeta({ title: "Page Not Found" });
  const reducedMotion = useReducedMotion();

  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: palette.charcoal,
        color: '#fff',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft brand glow */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: 400, md: 700 },
          height: { xs: 400, md: 700 },
          background: `radial-gradient(circle, ${palette.primary.main}33 0%, rgba(0,0,0,0) 68%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative plate / pizza mark */}
          <Box
            aria-hidden
            sx={{
              width: 76,
              height: 76,
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: `1px solid ${palette.gold}55`,
              bgcolor: 'rgba(201,169,110,0.10)',
              color: palette.gold,
              '& svg': { fontSize: 38 },
            }}
          >
            <LocalPizzaOutlinedIcon />
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.display,
              fontSize: { xs: '5.5rem', md: '8rem' },
              fontWeight: 800,
              lineHeight: 0.95,
              color: palette.gold,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h3"
            sx={{ fontFamily: fonts.display, color: '#fff', mb: 1.5 }}
          >
            This dish isn't on the menu
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.72)',
              mb: 4,
              maxWidth: 420,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            The page you're looking for has wandered off — but there's always a
            seat at our table. Let's get you back to the good stuff.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              size="large"
            >
              Back to Home
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/menus"
              startIcon={<MenuBookIcon />}
              size="large"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              View Menus
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/contact"
              startIcon={<PhoneIcon />}
              size="large"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
