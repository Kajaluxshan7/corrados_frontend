// Corrado's Restaurant — Brand Color Palette
// Primary: #BE5953 (Terracotta Red — brand anchor from logo)
// Designed for an Italian restaurant with warm, elegant, family-friendly feel

export const palette = {
  primary: {
    main: "#BE5953", // Terracotta red — header, CTAs, brand accent
    light: "#D4817C",
    dark: "#8E3830",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#2C5530", // Deep olive green — Italian accent
    light: "#4A7A4F",
    dark: "#1A3A1E",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#FDF8F4", // Warm ivory
    paper: "#FFFFFF",
  },
  // Semantic status colors — kept distinct from the terracotta brand color so
  // "error" never reads as "brand". Tuned to sit harmoniously with the palette.
  error: {
    main: "#C0392B", // clear red, distinct from brand terracotta #BE5953
    light: "#E57368",
    dark: "#8E2A20",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#B45309", // amber — matches the (formerly hardcoded) WS banner
    light: "#D97B2A",
    dark: "#8A3E06",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#2C5530", // reuse the brand olive green for confirmations
    light: "#4A7A4F",
    dark: "#1A3A1E",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#243A7D", // brand navy
    light: "#3D548F",
    dark: "#182850",
    contrastText: "#FFFFFF",
  },
  text: {
    primary: "#2D2926", // Deep charcoal brown
    secondary: "#5C524D", // Muted brown
  },
  // Extended custom colors
  cream: "#F5EDE4", // Soft cream for alternating sections
  gold: "#C9A96E", // Warm gold for highlights and accents
  sage: "#8B9D77", // Sage green for subtle accents
  wine: "#722F37", // Deep wine for elegant touches
  warmGray: "#E8E0D8", // Warm gray for borders and dividers
  ivory: "#FDF8F4", // Ivory base
  charcoal: "#2D2926", // Deep text
  navy: "#243A7D", // Brand navy blue — from logo-white-on-blue.png
  // Semantic tokens
  textMuted: "rgba(255,255,255,0.6)",   // muted text on dark backgrounds
  borderDark: "rgba(255,255,255,0.08)", // subtle borders on dark backgrounds
  borderLight: "rgba(0,0,0,0.08)",      // subtle borders on light backgrounds
  overlay: "rgba(18,15,14,0.95)",       // cinematic dark overlay
} as const;
