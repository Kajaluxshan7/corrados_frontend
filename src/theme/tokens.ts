// Corrado's — Design Tokens
// Single source of truth for radius, elevation, spacing rhythm, and motion.
// Phase 0 of the Premium UI/UX plan: replaces per-page magic numbers.

// ─── Font stacks ──────────────────────────────────────────────────────────────
// 'AmpersandFix' (defined in index.css via unicode-range) must come FIRST so the
// elegant-but-awkward Playfair Display swash "&" is swapped for a plain glyph.
export const fonts = {
  display: "'AmpersandFix', 'Playfair Display', Georgia, 'Times New Roman', serif",
  body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  // Reserved for occasional editorial pull-quotes / taglines.
  accent: "'AmpersandFix', 'Playfair Display', Georgia, serif",
} as const;

// ─── Border radius ──────────────────────────────────────────────────────────
// One coherent system, replacing the previous 2 / 8 / 16 / 20 / 28 / 40 drift.
export const radius = {
  sm: 8,    // buttons, inputs, chips, small controls
  md: 12,   // standard content cards
  lg: 16,   // feature tiles, hero panels, dialogs
  pill: 999,
} as const;

// ─── Elevation ──────────────────────────────────────────────────────────────
// Warm-tinted shadows (charcoal-brown, not pure black) read as more "expensive".
const SHADOW_TINT = "45, 41, 38"; // palette.charcoal as rgb
export const shadows = {
  sm: `0 2px 8px rgba(${SHADOW_TINT}, 0.08), 0 1px 3px rgba(${SHADOW_TINT}, 0.06)`,
  md: `0 8px 24px rgba(${SHADOW_TINT}, 0.12), 0 2px 8px rgba(${SHADOW_TINT}, 0.08)`,
  lg: `0 20px 48px rgba(${SHADOW_TINT}, 0.18), 0 4px 16px rgba(${SHADOW_TINT}, 0.10)`,
  // Gold-kissed hover glow for premium interactive cards.
  hover: `0 24px 60px rgba(${SHADOW_TINT}, 0.18), 0 0 24px rgba(201, 169, 110, 0.15)`,
} as const;

// ─── Spacing rhythm ─────────────────────────────────────────────────────────
// Standard section padding + content gaps so vertical rhythm stops drifting.
export const spacingTokens = {
  sectionPy: { xs: 8, md: 12 },   // vertical padding for full-width sections
  sectionPySm: { xs: 6, md: 9 },  // tighter sections
  contentGap: { xs: 4, md: 6 },   // gap between major columns/blocks
  cardGap: 3,                     // gap inside card grids
} as const;

// ─── Motion ─────────────────────────────────────────────────────────────────
// Soft, weighted easings — "motion that feels like fabric". Use everywhere
// instead of re-typing cubic-beziers per component.
export const easing = {
  // [0.16, 1, 0.3, 1] — expressive ease-out, the house standard.
  outExpo: [0.16, 1, 0.3, 1] as const,
  // [0.19, 1, 0.22, 1] — slightly snappier, for entrances.
  outQuint: [0.19, 1, 0.22, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
} as const;

// CSS-string equivalents for sx/CSS transitions.
export const easingCss = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuint: "cubic-bezier(0.19, 1, 0.22, 1)",
  soft: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const duration = {
  fast: 0.25,
  base: 0.45,
  slow: 0.85,
} as const;
