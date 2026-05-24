/**
 * Shared display metadata for Events & Specials.
 *
 * These maps mirror the backend `EventType` / `SpecialType` enums. Keep them in
 * sync with the backend — they live here (not duplicated per page) so a new
 * enum value only has to be added once.
 */
import { palette } from "../theme";

// ─── Events ───────────────────────────────────────────────────────────────────

/** Backend EventType enum → human label */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  live_music: "Live Music",
  sports_viewing: "Sports Viewing",
  trivia_night: "Trivia Night",
  karaoke: "Karaoke",
  private_party: "Private Party",
  special_event: "Special Event",
};

/** Backend EventType enum → chip colour */
export const EVENT_CATEGORY_COLORS: Record<string, string> = {
  live_music: "#6A1B9A",
  sports_viewing: "#1565C0",
  trivia_night: palette.secondary.main,
  karaoke: palette.wine,
  private_party: palette.gold,
  special_event: palette.primary.main,
};

/** Tab filter list for the Events page (includes the synthetic "all" tab) */
export const EVENT_CATEGORIES = [
  { label: "All Events", value: "all" },
  { label: "Live Music", value: "live_music" },
  { label: "Sports Viewing", value: "sports_viewing" },
  { label: "Trivia Night", value: "trivia_night" },
  { label: "Karaoke", value: "karaoke" },
  { label: "Private Party", value: "private_party" },
  { label: "Special Event", value: "special_event" },
];

/** Fallback images per event category */
export const EVENT_FALLBACK_BY_CATEGORY: Record<string, string> = {
  live_music: "/restaurant/catering-dessert-display.jpeg",
  sports_viewing: "/restaurant/menu-spread.jpeg",
  special_event: "/restaurant/spaghetti-bolognese.jpeg",
  private_party: "/restaurant/catering-fruit-platter.jpeg",
  trivia_night: "/restaurant/chocolate-lava-cake.jpeg",
  karaoke: "/restaurant/valentine-martini.jpeg",
};
export const EVENT_FALLBACK_DEFAULT =
  "/restaurant/catering-dessert-display.jpeg";

// ─── Specials ─────────────────────────────────────────────────────────────────

/** Backend SpecialType enum → human label */
export const SPECIAL_TYPE_LABELS: Record<string, string> = {
  daily: "Daily",
  everyday: "Everyday",
  weekend: "Weekend",
  game_time: "Game Time",
  day_time: "Daytime",
  chef: "Chef's Special",
  seasonal: "Seasonal",
  limited_time: "Limited Time",
};

/** Backend SpecialType enum → chip colour */
export const SPECIAL_CATEGORY_COLORS: Record<string, string> = {
  daily: palette.primary.main,
  everyday: palette.secondary.dark,
  weekend: palette.navy,
  game_time: "#1565C0",
  day_time: palette.gold,
  chef: palette.wine,
  seasonal: palette.secondary.main,
  limited_time: "#C2410C",
};

/** Tab filter list for the Specials page */
export const SPECIAL_CATEGORIES = [
  { label: "Daily", value: "daily" },
  { label: "Everyday", value: "everyday" },
  { label: "Weekend", value: "weekend" },
  { label: "Game Time", value: "game_time" },
  { label: "Daytime", value: "day_time" },
  { label: "Chef's Special", value: "chef" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Limited Time", value: "limited_time" },
];

/** Fallback images per weekday for day-scoped specials */
export const SPECIAL_FALLBACK_BY_DAY: Record<string, string> = {
  monday: "/restaurant/ravioli-mushroom-spinach.jpeg",
  tuesday: "/restaurant/pizza-margherita.jpeg",
  wednesday: "/restaurant/chicken-marsala.jpeg",
  thursday: "/restaurant/seafood-mussels.jpeg",
  friday: "/restaurant/spaghetti-bolognese.jpeg",
  saturday: "/restaurant/penne-primavera.jpeg",
  sunday: "/restaurant/beef-short-rib.jpeg",
};
export const SPECIAL_FALLBACK_DEFAULT =
  "/restaurant/gnocchi-tomato-cream.jpeg";

/** Rotating fallback images for the Home-page specials popup carousel */
export const SPECIAL_POPUP_FALLBACK_IMAGES: string[] = [
  "/restaurant/penne-primavera.jpeg",
  "/restaurant/pizza-margherita.jpeg",
  "/restaurant/spaghetti-bolognese.jpeg",
  "/restaurant/valentine-martini.jpeg",
  "/restaurant/chicken-pasta-sundried.jpeg",
  "/restaurant/seafood-mussels.jpeg",
];
