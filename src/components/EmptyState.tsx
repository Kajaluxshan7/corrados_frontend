import { Box, Typography, Button } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import { palette, fonts } from "../theme";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Optional CTA — internal route (`to`) or external link (`href`). */
  action?: { label: string; to?: string; href?: string };
  light?: boolean;
}

/**
 * A friendly, branded empty state — replaces plain "being updated" text strings.
 * Gives loading-into-nothing a warm, intentional feel with an icon + optional CTA.
 *
 * Phase 1 primitive — see UIUX_PREMIUM_PLAN.md §4.1.
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  light = false,
}: EmptyStateProps) {
  const textPrimary = light ? "#fff" : palette.text.primary;
  const textSecondary = light ? "rgba(255,255,255,0.72)" : palette.text.secondary;

  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 9 },
        px: 2,
        maxWidth: 480,
        mx: "auto",
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 72,
          height: 72,
          mx: "auto",
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          bgcolor: light ? "rgba(255,255,255,0.08)" : "rgba(190,89,83,0.08)",
          color: palette.primary.main,
          "& svg": { fontSize: 34 },
        }}
      >
        {icon ?? <RestaurantMenuOutlinedIcon />}
      </Box>
      <Typography
        sx={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: { xs: "1.4rem", md: "1.7rem" },
          color: textPrimary,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" sx={{ color: textSecondary, lineHeight: 1.7, mb: action ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      {action &&
        (action.to ? (
          <Button variant="contained" color="primary" component={RouterLink} to={action.to}>
            {action.label}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component="a"
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {action.label}
          </Button>
        ))}
    </Box>
  );
}
