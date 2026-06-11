import { Box, Typography, Container } from '@mui/material';
import type { ReactNode } from 'react';
import { palette, fonts } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";
import BlurText from './BlurText';

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  children?: ReactNode;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  align = "center",
  light = false,
  children,
}: SectionHeaderProps) {
  return (
    <Container>
      <Box
        sx={{
          textAlign: align,
          mb: { xs: 5, md: 6 },
          maxWidth: align === "center" ? 700 : "none",
          mx: align === "center" ? "auto" : 0,
        }}
      >
        {subtitle && (
          <>
            <Box
              sx={{
                color: palette.gold,
                fontSize: "1.4rem",
                mb: 0.8,
                display: "flex",
                justifyContent: align === "center" ? "center" : "flex-start",
                lineHeight: 1,
              }}
            >
              ⚜
            </Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: light ? palette.gold : palette.primary.main,
                mb: 1,
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              {formatAmpersand(subtitle)}
            </Typography>
          </>
        )}
        <Typography
          component="div"
          sx={{
            color: light ? "#fff" : palette.charcoal,
            mb: 2,
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontFamily: fonts.display,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            display: "flex",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          <BlurText text={formatAmpersand(title)} align={align} />
        </Typography>
        {description && (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: light ? "rgba(255,255,255,0.72)" : palette.text.secondary,
              maxWidth: 600,
              mx: align === "center" ? "auto" : 0,
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
        )}
        {children}
      </Box>
    </Container>
  );
}
