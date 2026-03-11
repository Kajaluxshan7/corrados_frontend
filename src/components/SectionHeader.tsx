import { Box, Typography, Container } from '@mui/material';
import type { ReactNode } from 'react';
import { palette } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";

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
          mb: 5,
          maxWidth: align === "center" ? 700 : "none",
          mx: align === "center" ? "auto" : 0,
        }}
      >
        {subtitle && (
          <Typography
            variant="subtitle2"
            sx={{
              color: light ? palette.gold : palette.primary.main,
              mb: 1,
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
            }}
          >
            {formatAmpersand(subtitle)}
          </Typography>
        )}
        <Typography
          variant="h3"
          sx={{
            color: light ? "#fff" : palette.charcoal,
            mb: 2,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 700,
          }}
        >
          {formatAmpersand(title)}
        </Typography>
        {description && (
          <Typography
            variant="body1"
            sx={{
              color: light ? "#ccc" : palette.text.secondary,
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
