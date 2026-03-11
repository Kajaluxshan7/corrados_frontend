import { Box, Typography, Container, Button } from '@mui/material';
import type { ReactNode } from 'react';
import { palette } from '../theme';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: { label: string; href?: string; to?: string };
  children?: ReactNode;
  height?: string | number;
  overlay?: number;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  cta,
  children,
  height = '50vh',
  overlay = 0.55,
}: PageHeroProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        bgcolor: backgroundImage ? undefined : palette.charcoal,
        overflow: 'hidden',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: `rgba(30, 25, 22, ${overlay})`,
          zIndex: 1,
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center', py: 6 }}>
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              color: '#ddd',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              mb: 3,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            {subtitle}
          </Typography>
        )}
        {cta && cta.href && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            component="a"
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1, px: 5, py: 1.5, fontSize: '0.9rem' }}
          >
            {cta.label}
          </Button>
        )}
        {cta && !cta.href && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 1, px: 5, py: 1.5, fontSize: '0.9rem' }}
          >
            {cta.label}
          </Button>
        )}
        {children}
      </Container>
    </Box>
  );
}
