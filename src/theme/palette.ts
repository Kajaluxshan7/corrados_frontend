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
} as const;
