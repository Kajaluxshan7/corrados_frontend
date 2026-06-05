import { Box, Typography, Container, Button } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: { label: string; href?: string; to?: string };
  children?: ReactNode;
  height?: string | number;
  overlay?: number;
  parallax?: boolean;
  kenBurns?: boolean;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  cta,
  children,
  height = "50vh",
  overlay = 0.55,
  parallax = false,
  kenBurns = false,
}: PageHeroProps) {
  // Determine if we use the dual-layer background (for parallax/Ken Burns) or single-layer
  const useDualLayer = backgroundImage && (parallax || kenBurns);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Fallback or single-layer image
        backgroundImage: (backgroundImage && !useDualLayer)
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        bgcolor: backgroundImage ? undefined : palette.charcoal,
        overflow: "hidden",
      }}
    >
      {/* Parallax / Ken Burns background layers */}
      {useDualLayer && (
        <Box
          className={parallax ? "hero-parallax-bg" : undefined}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: parallax ? -150 : 0,
            height: parallax ? "calc(100% + 150px)" : "100%",
            width: "100%",
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: kenBurns ? "kenBurns 24s ease-in-out infinite" : undefined,
            }}
          />
        </Box>
      )}

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: `rgba(18, 15, 14, ${overlay})`,
          zIndex: 1,
        }}
      />
      <Container
        sx={{ position: "relative", zIndex: 2, textAlign: "center", py: 6 }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.75rem" },
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            letterSpacing: "0.01em",
          }}
        >
          {formatAmpersand(title)}
        </Typography>
        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.82)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              mb: 3,
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.6,
            }}
          >
            {formatAmpersand(subtitle)}
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
            sx={{ mt: 1, px: 5, py: 1.5, fontSize: "0.9rem" }}
          >
            {cta.label}
          </Button>
        )}
        {cta && cta.to && !cta.href && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to={cta.to}
            sx={{ mt: 1, px: 5, py: 1.5, fontSize: "0.9rem" }}
          >
            {cta.label}
          </Button>
        )}
        {cta && !cta.href && !cta.to && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 1, px: 5, py: 1.5, fontSize: "0.9rem" }}
          >
            {cta.label}
          </Button>
        )}
        {children}
      </Container>
    </Box>
  );
}
