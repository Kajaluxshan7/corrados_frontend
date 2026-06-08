import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { palette, spacingTokens } from "../theme";

type SectionTone = "default" | "cream" | "charcoal" | "paper";

const TONE_BG: Record<SectionTone, string> = {
  default: palette.background.default,
  cream: palette.cream,
  charcoal: palette.charcoal,
  paper: palette.background.paper,
};

interface SectionProps {
  children: ReactNode;
  /** Background treatment. `charcoal` also flips text to light. */
  tone?: SectionTone;
  /** Tighter vertical rhythm for secondary sections. */
  compact?: boolean;
  /** Wrap children in a max-width Container (default true). */
  container?: boolean;
  id?: string;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
}

/**
 * Canonical full-width page section. Standardizes the vertical rhythm and
 * background tones that pages previously hand-rolled as
 * `<Box sx={{ py: { xs: 8, md: 10 }, bgcolor: ... }}>`.
 *
 * Phase 0 primitive — see UIUX_PREMIUM_PLAN.md §3.4.
 */
export default function Section({
  children,
  tone = "default",
  compact = false,
  container = true,
  id,
  sx,
  containerSx,
}: SectionProps) {
  const py = compact ? spacingTokens.sectionPySm : spacingTokens.sectionPy;

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py,
        bgcolor: TONE_BG[tone],
        color: tone === "charcoal" ? "#fff" : palette.text.primary,
        ...sx,
      }}
    >
      {container ? <Container sx={containerSx}>{children}</Container> : children}
    </Box>
  );
}
