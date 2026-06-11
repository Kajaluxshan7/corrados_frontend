import { keyframes } from "@emotion/react";
import { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  IconButton,
  Rating,
  Stack,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AccessibleIcon from "@mui/icons-material/Accessible";
import DeckIcon from "@mui/icons-material/Deck";
import GroupsIcon from "@mui/icons-material/Groups";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import WineBarIcon from "@mui/icons-material/WineBar";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AppleIcon from "@mui/icons-material/Apple";
import ShopIcon from "@mui/icons-material/Shop";
import {
  SectionHeader,
  NewsletterSignup,
  TiltCard,
  ParallaxImage,
  SpotlightCard,
  InfiniteMarquee,
  ScrollRotate3D,
  Magnet,
  MouseMoveSpotlight,
  FloatingOrbs,
  GrainOverlay,
} from "../components";
import { motion, type Variants } from "framer-motion";
import { testimonials } from "../data";
import { palette, fonts } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";
import {
  fetchSpecials,
  fetchEvents,
  fetchStoryCategories,
  fetchFamilyMeals,
  type ApiSpecial,
  type ApiEvent,
  type ApiStoryCategory,
  type ApiFamilyMeal,
} from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  EVENT_TYPE_LABELS,
  SPECIAL_TYPE_LABELS,
  SPECIAL_POPUP_FALLBACK_IMAGES,
} from "../constants/menus";

// Heavy click-transition effect — lazy-loaded so it stays out of the initial
// Home bundle and only downloads when a tile is actually clicked (Phase 3).
const ShatterPortalOverlay = lazy(() => import("../components/ShatterPortalOverlay"));

// navTiles defaults used as fallbacks when admin hasn't set a custom image
const NAV_TILE_DEFAULTS: Record<string, string> = {
  nav_about: "/restaurant/chef-pizza-oven.jpeg",
  nav_menus: "/restaurant/gnocchi-tomato-cream.jpeg",
  nav_specials: "/restaurant/ravioli-mushroom-spinach.jpeg",
  nav_family_meals: "/restaurant/family-meal-takeout.jpeg",
  nav_party_menus: "/restaurant/catering-dessert-display.jpeg",
  nav_events: "/restaurant/menu-spread.jpeg",
  nav_gallery: "/restaurant/menu-spread.jpeg",
  nav_contact: "/restaurant/antipasto-platter.jpeg",
};

const PREVIEW_IMAGES_MAP: Record<string, string[]> = {
  nav_about: [
    "/restaurant/chef-pizza-oven.jpeg",
    "/restaurant/owner_and_logo.jpg",
    "/orrdos/interior-booths.jpg",
    "/orrdos/interior-upstairs.jpg",
    "/orrdos/exterior-building.jpg",
    "/restaurant/menu-spread.jpeg"
  ],
  nav_menus: [
    "/restaurant/gnocchi-tomato-cream.jpeg",
    "/restaurant/seafood-linguine.jpeg",
    "/orrdos/pizza-corrados.jpg",
    "/restaurant/arancini-tomato.jpeg",
    "/restaurant/ravioli-mushroom-spinach.jpeg",
    "/restaurant/beef-short-rib.jpeg",
    "/restaurant/antipasto-platter.jpeg",
    "/restaurant/catering-dessert-display.jpeg"
  ],
  nav_specials: [
    "/restaurant/ravioli-mushroom-spinach.jpeg",
    "/restaurant/beef-short-rib.jpeg",
    "/restaurant/antipasto-platter.jpeg",
    "/restaurant/arancini-tomato.jpeg",
    "/restaurant/gnocchi-tomato-cream.jpeg",
    "/restaurant/seafood-linguine.jpeg",
    "/orrdos/pizza-corrados.jpg"
  ],
  nav_family_meals: [
    "/restaurant/family-meal-takeout.jpeg",
    "/restaurant/menu-spread.jpeg",
    "/restaurant/gnocchi-tomato-cream.jpeg",
    "/restaurant/arancini-tomato.jpeg",
    "/orrdos/pizza-corrados.jpg",
    "/restaurant/beef-short-rib.jpeg"
  ],
  nav_party_menus: [
    "/restaurant/catering-dessert-display.jpeg",
    "/orrdos/interior-upstairs.jpg",
    "/restaurant/antipasto-platter.jpeg",
    "/orrdos/interior-booths.jpg",
    "/restaurant/menu-spread.jpeg",
    "/restaurant/seafood-linguine.jpeg"
  ],
  nav_events: [
    "/restaurant/menu-spread.jpeg",
    "/orrdos/interior-upstairs.jpg",
    "/restaurant/chef-pizza-oven.jpeg",
    "/orrdos/exterior-building.jpg",
    "/restaurant/owner_and_logo.jpg",
    "/orrdos/interior-booths.jpg"
  ],
  nav_gallery: [
    "/restaurant/seafood-linguine.jpeg",
    "/orrdos/exterior-building.jpg",
    "/orrdos/interior-booths.jpg",
    "/orrdos/exterior-patio.jpg",
    "/orrdos/interior-upstairs.jpg",
    "/restaurant/chef-pizza-oven.jpeg",
    "/restaurant/owner_and_logo.jpg",
    "/restaurant/gnocchi-tomato-cream.jpeg"
  ],
  nav_contact: [
    "/restaurant/antipasto-platter.jpeg",
    "/orrdos/exterior-building.jpg",
    "/restaurant/owner_and_logo.jpg",
    "/orrdos/exterior-patio.jpg",
    "/orrdos/interior-booths.jpg",
    "/orrdos/interior-upstairs.jpg"
  ],
};

// Static tile metadata — 4×2 grid, no center logo
// Order: About, Menus, Specials, Events, Family Meals, Party Menus, Gallery, Contact
const NAV_TILE_META = [
  {
    label: "About",
    path: "/about",
    tagline: "Our Story & Heritage",
    key: "nav_about",
  },
  {
    label: "Digital Menu",
    path: "/menus",
    tagline: "Explore Our Italian Table",
    key: "nav_menus",
  },
  {
    label: "Specials",
    path: "/specials",
    tagline: "Today's Featured Dishes",
    key: "nav_specials",
  },
  {
    label: "Events",
    path: "/events",
    tagline: "What's Happening",
    key: "nav_events",
  },
  {
    label: "Family Meals",
    path: "/family-meals",
    tagline: "Feed the Whole Family",
    key: "nav_family_meals",
  },
  {
    label: "Party Menus",
    path: "/party-menus",
    tagline: "Celebrate With Us",
    key: "nav_party_menus",
  },
  {
    label: "Gallery",
    path: "/gallery",
    tagline: "A Feast for the Eyes",
    key: "nav_gallery",
  },
  {
    label: "Contact",
    path: "/contact",
    tagline: "Find Us & Reach Out",
    key: "nav_contact",
  },
];


const tileImageDrift = keyframes`
  0% {
    transform: scale(var(--tile-scale, 1.06)) translate3d(-1.4%, -1.1%, 0);
  }
  50% {
    transform: scale(var(--tile-scale, 1.06)) translate3d(1.2%, -0.4%, 0);
  }
  100% {
    transform: scale(var(--tile-scale, 1.06)) translate3d(0.3%, 1.2%, 0);
  }
`;

const lightSweep = keyframes`
  0% {
    transform: translate3d(-130%, 0, 0) rotate(18deg);
    opacity: 0;
  }
  32% {
    opacity: 0.34;
  }
  58% {
    opacity: 0.12;
  }
  100% {
    transform: translate3d(145%, 0, 0) rotate(18deg);
    opacity: 0;
  }
`;





function getSpecialPopupImage(special: ApiSpecial, index: number): string {
  if (special.imageUrls?.length) return resolveImageUrl(special.imageUrls[0]);
  return SPECIAL_POPUP_FALLBACK_IMAGES[
    index % SPECIAL_POPUP_FALLBACK_IMAGES.length
  ];
}

function getSpecialLabel(special: ApiSpecial): string {
  if (special.dayOfWeek) {
    return (
      special.dayOfWeek.charAt(0).toUpperCase() + special.dayOfWeek.slice(1)
    );
  }
  return SPECIAL_TYPE_LABELS[special.type] ?? "Special";
}

const EVENT_TZ = "America/Toronto";

function formatEventDateRange(start: string): string {
  const s = new Date(start);
  const dateStr = s.toLocaleDateString("en-CA", {
    timeZone: EVENT_TZ,
    month: "short",
    day: "numeric",
  });
  const timeStr = s.toLocaleTimeString("en-CA", {
    timeZone: EVENT_TZ,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateStr} · ${timeStr}`;
}

const floatUp = keyframes`
  0% { transform: translateY(0px) translateZ(40px); }
  50% { transform: translateY(-12px) translateZ(40px); }
  100% { transform: translateY(0px) translateZ(40px); }
`;

const floatDown = keyframes`
  0% { transform: translateY(0px) translateZ(60px); }
  50% { transform: translateY(10px) translateZ(60px); }
  100% { transform: translateY(0px) translateZ(60px); }
`;

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: i * 0.08,
    },
  }),
};

const bentoContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const bentoTileVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    rotateX: 15,
    filter: "blur(8px) saturate(0.6) brightness(0.7)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px) saturate(1) brightness(1)",
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18,
      mass: 0.8,
    },
  },
};

interface NavTile {
  label: string;
  path: string;
  tagline: string;
  key: string;
  image: string;
  previewImages: string[];
}

export default function Home() {
  usePageMeta({
    title: "Authentic Italian Dining in Whitby, ON",
    description:
      "Corrado's Restaurant & Bar — Whitby's favourite Italian dining destination since 2010. Handmade pasta, stone-oven pizza, curated wines, family meals, daily specials, private events & live sports. Open 7 days.",
    ogImage: "/orrdos/exterior-building.jpg",
    ogType: "website",
  });
  const { getImage } = useSiteImages();

  // Stagger reveal trigger synced with splash screen
  const [animateEntrance, setAnimateEntrance] = useState(false);
  const navigate = useNavigate();

  const bentoGridRef = useRef<HTMLDivElement>(null);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [activeShatter, setActiveShatter] = useState<{
    rect: DOMRect;
    path: string;
    image: string;
    label: string;
    tagline: string;
    previewImages: string[];
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__splash_completed) {
        setAnimateEntrance(true);
      } else {
        const timer = setTimeout(() => {
          setAnimateEntrance(true);
        }, 1950);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTileClick = (e: React.MouseEvent<HTMLAnchorElement>, tile: NavTile) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }
    e.preventDefault();
    if (activeShatter) return;

    const gridEl = bentoGridRef.current;
    const cardEl = e.currentTarget;
    if (gridEl && cardEl) {
      const gridRect = gridEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const relativeX = cardRect.left - gridRect.left + cardRect.width / 2;
      const relativeY = cardRect.top - gridRect.top + cardRect.height / 2;
      setZoomOrigin(`${relativeX}px ${relativeY}px`);
    }

    const rect = cardEl.getBoundingClientRect();
    setActiveShatter({
      rect,
      path: tile.path,
      image: tile.image,
      label: tile.label,
      tagline: tile.tagline,
      previewImages: tile.previewImages,
    });
  };

  const handleZoomComplete = () => {
    if (activeShatter) {
      navigate(activeShatter.path);
    }
  };

  // Build navTiles with dynamic images and preview lists at render time
  const navTiles = NAV_TILE_META.map((meta) => ({
    ...meta,
    image: getImage(meta.key, NAV_TILE_DEFAULTS[meta.key]),
    previewImages: PREVIEW_IMAGES_MAP[meta.key] || [NAV_TILE_DEFAULTS[meta.key]],
  }));

  const [specialsPopupOpen, setSpecialsPopupOpen] = useState(false);
  const [activeSpecial, setActiveSpecial] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupShownRef = useRef(false);

  // Live data state
  const [liveSpecials, setLiveSpecials] = useState<ApiSpecial[]>([]);
  const [liveEvents, setLiveEvents] = useState<ApiEvent[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<
    ApiStoryCategory[]
  >([]);
  const [liveFamilyMeals, setLiveFamilyMeals] = useState<ApiFamilyMeal[]>([]);

  const loadHomeSpecials = useCallback(() => {
    fetchSpecials()
      .then((data) =>
        setLiveSpecials(data.sort((a, b) => a.sortOrder - b.sortOrder)),
      )
      .catch(() => { });
  }, []);

  const loadHomeEvents = useCallback(() => {
    fetchEvents()
      .then((data) => setLiveEvents(data))
      .catch(() => { });
  }, []);

  const loadHomeGallery = useCallback(() => {
    fetchStoryCategories()
      .then((data) => setGalleryCategories(data.filter((c) => c.isActive)))
      .catch(() => { });
  }, []);

  const loadHomeFamilyMeals = useCallback(() => {
    fetchFamilyMeals()
      .then((data) => setLiveFamilyMeals(data))
      .catch(() => { });
  }, []);

  useEffect(() => {
    loadHomeSpecials();
    loadHomeEvents();
    loadHomeGallery();
    loadHomeFamilyMeals();
  }, [loadHomeSpecials, loadHomeEvents, loadHomeGallery, loadHomeFamilyMeals]);

  useWsRefresh(WsEvent.SPECIAL_CREATED, loadHomeSpecials);
  useWsRefresh(WsEvent.SPECIAL_UPDATED, loadHomeSpecials);
  useWsRefresh(WsEvent.SPECIAL_DELETED, loadHomeSpecials);
  useWsRefresh(WsEvent.EVENT_CREATED, loadHomeEvents);
  useWsRefresh(WsEvent.EVENT_UPDATED, loadHomeEvents);
  useWsRefresh(WsEvent.EVENT_DELETED, loadHomeEvents);
  useWsRefresh(WsEvent.STORY_UPDATED, loadHomeGallery);
  useWsRefresh(WsEvent.FAMILY_MEAL_UPDATED, loadHomeFamilyMeals);

  const popupSpecials = liveSpecials.slice(0, 4);
  const featuredSpecials = liveSpecials.slice(0, 3);
  const featuredEvents = liveEvents.slice(0, 3);

  // Collect gallery images from stories
  const galleryImages = galleryCategories
    .flatMap((cat) =>
      (cat.stories ?? [])
        .filter((s) => s.isActive)
        .flatMap((s) => (s.imageUrls ?? []).map((url) => resolveImageUrl(url))),
    )
    .slice(0, 4);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (popupSpecials.length === 0) return;
    autoPlayRef.current = setInterval(() => {
      setActiveSpecial((prev) => (prev + 1) % popupSpecials.length);
    }, 4000);
  }, [popupSpecials.length, stopAutoPlay]);

  const goToSpecial = useCallback(
    (index: number) => {
      setActiveSpecial(index);
      startAutoPlay();
    },
    [startAutoPlay],
  );

  const goPrev = useCallback(() => {
    goToSpecial(
      (activeSpecial - 1 + popupSpecials.length) % popupSpecials.length,
    );
  }, [activeSpecial, popupSpecials.length, goToSpecial]);

  const goNext = useCallback(() => {
    goToSpecial((activeSpecial + 1) % popupSpecials.length);
  }, [activeSpecial, popupSpecials.length, goToSpecial]);

  const closeSpecialsPopup = useCallback(() => {
    stopAutoPlay();
    setSpecialsPopupOpen(false);
    setActiveSpecial(0);
  }, [stopAutoPlay]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "corrados-specials-popup-seen";
    if (window.sessionStorage.getItem(storageKey) === "true") return;

    const timer = window.setTimeout(() => {
      setSpecialsPopupOpen(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  // Only mark popup as "seen" once it actually renders with specials data.
  // This prevents sessionStorage being set before data has loaded.
  useEffect(() => {
    if (
      !specialsPopupOpen ||
      popupSpecials.length === 0 ||
      popupShownRef.current
    )
      return;
    popupShownRef.current = true;
    window.sessionStorage.setItem("corrados-specials-popup-seen", "true");
  }, [specialsPopupOpen, popupSpecials.length]);

  useEffect(() => {
    if (specialsPopupOpen) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return stopAutoPlay;
  }, [specialsPopupOpen, startAutoPlay, stopAutoPlay]);

  return (
    <>
      <Dialog
        open={
          specialsPopupOpen &&
          popupSpecials.length > 0 &&
          activeSpecial < popupSpecials.length
        }
        onClose={closeSpecialsPopup}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              overflow: "hidden",
              borderRadius: 2.5,
              bgcolor: palette.charcoal,
              border: `1px solid ${palette.warmGray}`,
              boxShadow: "0 28px 70px rgba(45, 41, 38, 0.28)",
            },
          },
        }}
      >
        {popupSpecials.length > 0 && activeSpecial < popupSpecials.length && (
          <>
            {/* Header */}
            <Box
              sx={{
                position: "relative",
                px: { xs: 2.5, md: 3.5 },
                pt: { xs: 4, md: 4.5 },
                pb: { xs: 2, md: 2.5 },
                background: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.charcoal} 100%)`,
              }}
            >
              <IconButton
                onClick={closeSpecialsPopup}
                sx={{ position: "absolute", top: 12, right: 12, color: "#fff" }}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="overline"
                sx={{
                  color: palette.gold,
                  letterSpacing: "0.18em",
                  fontSize: "0.68rem",
                }}
              >
                THIS WEEK AT CORRADO&apos;S
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  mt: 0.5,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  lineHeight: 1.1,
                }}
              >
                House Specials
              </Typography>
            </Box>

            {/* Carousel */}
            <Box
              sx={{
                position: "relative",
                px: { xs: 2.5, md: 3.5 },
                pt: { xs: 2.5, md: 3 },
                pb: 0,
              }}
            >
              {/* Special card — single item */}
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 300, md: 360 },
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.2)",
                  bgcolor: palette.charcoal,
                }}
              >
                {/* Full-ratio image — objectFit contain shows the whole image */}
                <Box
                  key={getSpecialPopupImage(popupSpecials[activeSpecial], activeSpecial)}
                  component="img"
                  src={getSpecialPopupImage(popupSpecials[activeSpecial], activeSpecial)}
                  alt={popupSpecials[activeSpecial].title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    transition: "opacity 0.4s ease",
                  }}
                />
                {/* Gradient overlay for text readability */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(20,15,12,0.06) 0%, rgba(20,15,12,0.65) 60%, rgba(20,15,12,0.92) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    p: { xs: 2, md: 2.5 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <Chip
                      label={getSpecialLabel(popupSpecials[activeSpecial])}
                      size="small"
                      sx={{
                        bgcolor: palette.primary.main,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                      }}
                    />
                    <Chip
                      label={
                        SPECIAL_TYPE_LABELS[
                        popupSpecials[activeSpecial].type
                        ] ?? popupSpecials[activeSpecial].type
                      }
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.14)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.18)",
                        fontWeight: 600,
                        fontSize: "0.68rem",
                        backdropFilter: "blur(6px)",
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: palette.gold,
                        letterSpacing: "0.18em",
                        fontSize: "0.62rem",
                      }}
                    >
                      Weekly Feature
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        mt: 0.35,
                        lineHeight: 1.15,
                        textShadow: "0 4px 20px rgba(0,0,0,0.35)",
                      }}
                    >
                      {formatAmpersand(popupSpecials[activeSpecial].title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.85)",
                        mt: 0.8,
                        lineHeight: 1.55,
                        maxWidth: 400,
                      }}
                    >
                      {popupSpecials[activeSpecial].description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: palette.gold, fontWeight: 700, mt: 1.25 }}
                    >
                      {SPECIAL_TYPE_LABELS[popupSpecials[activeSpecial].type] ??
                        "Special"}
                    </Typography>
                  </Box>
                </Box>

                {/* Prev / Next buttons — only shown when multiple specials */}
                {popupSpecials.length > 1 && (
                  <>
                    <IconButton
                      onClick={goPrev}
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={goNext}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Dot indicators — only shown when multiple specials */}
              {popupSpecials.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {popupSpecials.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => goToSpecial(i)}
                      sx={{
                        width: activeSpecial === i ? 24 : 8,
                        height: 8,
                        borderRadius: 999,
                        bgcolor:
                          activeSpecial === i
                            ? palette.gold
                            : "rgba(255,255,255,0.25)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor:
                            activeSpecial === i
                              ? palette.gold
                              : "rgba(255,255,255,0.4)",
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                px: { xs: 2.5, md: 3.5 },
                py: { xs: 2, md: 2.5 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {popupSpecials.length > 1 && (
                <Typography
                  variant="body2"
                  sx={{ color: palette.text.secondary, fontSize: "0.78rem" }}
                >
                  {activeSpecial + 1} / {popupSpecials.length}
                </Typography>
              )}
              <Button
                variant="contained"
                component={RouterLink}
                to="/specials"
                endIcon={<ArrowForwardIcon />}
                onClick={closeSpecialsPopup}
              >
                View All Specials
              </Button>
            </Box>
          </>
        )}
      </Dialog>
      {/* Navigation tile bento grid — 4×2 grid on a warm ivory backdrop with a soft cursor-follow glow */}
      <MouseMoveSpotlight
        glowColor="rgba(201, 169, 110, 0.16)"
        size={900}
        style={{ width: "100%", height: "100%", backgroundColor: palette.ivory }}
      >
        <Box
          ref={bentoGridRef}
          component={motion.section}
          variants={bentoContainerVariants}
          initial="hidden"
          animate={
            activeShatter
              ? {
                scale: 3.0,
                opacity: 0,
                transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] },
              }
              : animateEntrance
                ? "visible"
                : "hidden"
          }
          style={{
            transformOrigin: activeShatter ? zoomOrigin : "50% 50%",
          }}
          className="bento-grid"
          sx={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            bgcolor: "transparent",
            display: "grid",
            gap: { xs: 1.25, md: 1.75 },
            p: { xs: 1.25, sm: 2, md: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gridTemplateRows: {
              xs: "repeat(8, 200px)",
              sm: "repeat(4, 240px)",
              md: "repeat(2, minmax(270px, 28vw))",
              lg: "repeat(2, 310px)",
            },
            perspective: "1400px",
            "@media (prefers-reduced-motion: reduce)": {
              "& .cinematic-tile, & .tile-img, & .tile-sheen, & .tile-frame, & .tile-title, & .tile-arrow":
              {
                animation: "none !important",
                transition: "none !important",
              },
            },
          }}
        >
          {/* Soft warm ambiance backdrop — light, premium, and far lighter than a video */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-18%",
                left: "-12%",
                width: "60%",
                height: "75%",
                background: `radial-gradient(circle, ${palette.primary.main}1A 0%, rgba(0,0,0,0) 70%)`,
                animation: "float 16s ease-in-out infinite",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "-22%",
                right: "-12%",
                width: "62%",
                height: "78%",
                background: `radial-gradient(circle, ${palette.gold}24 0%, rgba(0,0,0,0) 70%)`,
                animation: "float 20s ease-in-out infinite reverse",
              }}
            />
          </Box>

          {/* ── All 8 nav tiles (4 × 2 grid) ── */}
          {navTiles.map((tile, i) => (
            <motion.div
              key={tile.path}
              variants={bentoTileVariants}
              style={{
                width: "100%",
                height: "100%",
                opacity: activeShatter?.path === tile.path ? 0 : 1,
                visibility: activeShatter?.path === tile.path ? "hidden" : "visible",
                transition: "opacity 0.05s ease, visibility 0.05s ease",
              }}
            >
              <TiltCard>
                <Box
                  className="cinematic-tile"
                  component={RouterLink}
                  to={tile.path}
                  onClick={(e) => handleTileClick(e as React.MouseEvent<HTMLAnchorElement>, tile)}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    overflow: "hidden",
                    textDecoration: "none",
                    display: "block",
                    borderRadius: "16px",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    bgcolor: "rgba(22, 20, 19, 0.95)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(201, 169, 110, 0.16)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    transition: "box-shadow 0.5s ease, border-color 0.5s ease, transform 0.5s ease",
                    "&:focus-visible": {
                      outline: `2px solid #C9A96E`,
                      outlineOffset: 4,
                    },
                    "&:hover, &:focus-visible": {
                      borderColor: "rgba(201, 169, 110, 0.65)",
                      boxShadow: "0 24px 56px rgba(190, 89, 83, 0.18), 0 0 0 1px rgba(201, 169, 110, 0.55)",
                    },
                    "&:hover .tile-img, &:focus-visible .tile-img": {
                      "--tile-scale": "1.12",
                      filter: "saturate(1.08) contrast(1.04) brightness(1.04)",
                    },
                    "&:hover .tile-title, &:focus-visible .tile-title": {
                      color: palette.gold,
                    },
                    "&:hover .tile-arrow, &:focus-visible .tile-arrow": {
                      transform: "translate3d(6px, 0, 0)",
                      color: palette.gold,
                    },
                    "&:hover .tile-badge, &:focus-visible .tile-badge": {
                      bgcolor: "rgba(201, 169, 110, 0.22)",
                      borderColor: "rgba(201, 169, 110, 0.6)",
                      color: palette.gold,
                    },
                  }}
                >
                  {/* Full-bleed photo */}
                  <Box
                    className="tile-img"
                    sx={{
                      "--tile-scale": "1.06",
                      position: "absolute",
                      inset: -8,
                      backgroundImage: `url(${tile.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "saturate(1.04) contrast(1.02)",
                      animation: `${tileImageDrift} ${17 + i}s ease-in-out infinite alternate`,
                      transition: "filter 0.55s ease",
                      willChange: "transform",
                    }}
                  />
                  {/* Cinematic dark gradient — strong bottom scrim like Specials cards */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      background: "linear-gradient(to top, rgba(18,15,14,0.97) 0%, rgba(18,15,14,0.6) 38%, rgba(18,15,14,0.1) 65%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Grain texture overlay (matches Specials page) */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 2.5,
                      opacity: 0.18,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                      backgroundSize: "200px 200px",
                      backgroundRepeat: "repeat",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Subtle hover/active overlay highlight for depth */}
                  <Box
                    className="tile-highlight"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 3,
                      borderRadius: "16px",
                      border: "1px solid transparent",
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
                      opacity: 0,
                      transition: "opacity 0.5s ease, border-color 0.5s ease",
                      ".cinematic-tile:hover &": {
                        opacity: 1,
                        borderColor: "rgba(201, 169, 110, 0.25)",
                      }
                    }}
                  />
                  {/* Gold sheen sweep */}
                  <Box
                    className="tile-sheen"
                    sx={{
                      position: "absolute",
                      zIndex: 4,
                      top: "-28%",
                      bottom: "-28%",
                      width: "34%",
                      left: 0,
                      background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(201,169,110,0.22) 50%, rgba(255,255,255,0) 100%)",
                      filter: "blur(12px)",
                      animation: `${lightSweep} ${9 + i * 0.4}s ease-in-out infinite`,
                      animationDelay: `${0.6 + i * 0.32}s`,
                      pointerEvents: "none",
                    }}
                  />
                  {/* Content */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: { xs: 2.5, md: 3 },
                      gap: 0.75,
                    }}
                  >
                    {/* Gold pill badge — Floating glass capsule */}
                    <Box
                      className="tile-badge"
                      sx={{
                        display: "inline-flex",
                        width: "fit-content",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "999px",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Typography sx={{
                        color: palette.gold,
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                      }}>
                        {tile.tagline}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Typography
                        className="tile-title"
                        variant="h5"
                        sx={{
                          color: "#ffffff",
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "1.08rem", sm: "1.12rem", md: "1.2rem" },
                          letterSpacing: "0.01em",
                          lineHeight: 1.2,
                          transition: "color 0.3s ease",
                          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                        }}
                      >
                        {tile.label}
                      </Typography>
                      <ArrowForwardIcon
                        className="tile-arrow"
                        sx={{
                          color: palette.gold,
                          fontSize: 19,
                          transition: "transform 0.3s ease, color 0.3s ease",
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </TiltCard>
            </motion.div>
          ))}
        </Box>
      </MouseMoveSpotlight>

      {/* ─── INTRO / ABOUT TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", px: { xs: 1, md: 2 } }}>
                {/* Premium gold double frame behind/overlapping */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: -12,
                    border: "1.5px solid rgba(201, 169, 110, 0.25)",
                    borderRadius: "24px",
                    zIndex: 0,
                    pointerEvents: "none",
                    boxShadow: "inset 0 0 20px rgba(201, 169, 110, 0.1)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 4,
                      border: "1px solid rgba(201, 169, 110, 0.12)",
                      borderRadius: "20px",
                    }
                  }}
                />
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "24px", // Polished border radius
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.5)", // Polished border stroke
                    boxShadow: "0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(201, 169, 110, 0.1)", // Soft shadow
                    height: { xs: "300px", md: "400px" },
                    position: "relative",
                    zIndex: 1,
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.01)",
                      boxShadow: `0 32px 64px rgba(190, 89, 83, 0.18), 0 0 0 1px rgba(201, 169, 110, 0.2)`,
                    }
                  }}
                >
                  <ParallaxImage
                    src={getImage(
                      "home_about_owner",
                      "/restaurant/owner_and_logo.jpg",
                    )}
                    alt="Corrado's owner with the restaurant logo"
                    speed={0.15}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Box sx={{ color: palette.gold, fontSize: "1.4rem", mb: 0.8, display: "flex", lineHeight: 1 }}>⚜</Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: palette.primary.main,
                    mb: 1,
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  OUR STORY
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
                    color: palette.text.primary,
                  }}
                >
                  A Taste of Italy in Whitby
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: palette.text.secondary,
                    mb: 2.5,
                    lineHeight: 1.8,
                    fontSize: "0.98rem",
                  }}
                >
                  Since 2010, Corrado's has been the neighbourhood's favourite destination for authentic Italian cuisine. From our family to yours, we prepare every dish with fresh ingredients, time-honoured recipes, and a genuine passion for hospitality.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: "0.98rem",
                  }}
                >
                  Whether you're here for a casual weeknight dinner, a special celebration, or cheering on your team during the big game — there's always a seat at our table for you.
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/about"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", 
                    px: 4.5, 
                    py: 1.8,
                    borderRadius: "30px", // Normal premium pill button shape
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    bgcolor: "#C85A4E", // Sleek terracotta
                    color: "#fff",
                    boxShadow: "0 8px 28px rgba(201, 169, 110, 0.35), 0 4px 10px rgba(200, 90, 78, 0.2)",
                    "&:hover": { 
                      transform: "translateY(-3px)",
                      bgcolor: "#B64B40",
                      boxShadow: "0 14px 36px rgba(201, 169, 110, 0.5), 0 6px 16px rgba(200, 90, 78, 0.35)",
                    }
                  }}
                >
                  Our Story
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURED MENU CATEGORIES ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.cream, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="OUR MENU"
            title="Explore Our Kitchen"
            description="From handmade pasta to stone-oven pizza, our menu celebrates the best of Italian cuisine with a Canadian twist."
          />
          <Grid container spacing={3}>
            {[
              {
                label: "Appetizers",
                image: getImage(
                  "home_menu_appetizers",
                  "/restaurant/arancini-tomato.jpeg",
                ),
              },
              {
                label: "Pasta",
                image: getImage(
                  "home_menu_pasta",
                  "/restaurant/ravioli-mushroom-spinach.jpeg",
                ),
              },
              {
                label: "Pizza",
                image: getImage(
                  "home_menu_pizza",
                  "/orrdos/pizza-corrados.jpg",
                ),
              },
              {
                label: "Mains",
                image: getImage(
                  "home_menu_mains",
                  "/restaurant/beef-short-rib.jpeg",
                ),
              },
            ].map((cat, i) => (
              <Grid key={cat.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUpVariants}
                  custom={i}
                  style={{ height: "100%" }}
                >
                  <TiltCard>
                    <Card
                      component={RouterLink}
                      to="/menus"
                      sx={{
                        textDecoration: "none",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: "16px",
                        bgcolor: "rgba(255, 255, 255, 0.85)", // Premium frosted glass look
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(201, 169, 110, 0.2)",
                        boxShadow: "0 8px 24px rgba(45,41,38,0.04)",
                        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "rgba(201, 169, 110, 0.5)",
                          boxShadow: "0 20px 48px rgba(190, 89, 83, 0.08), 0 0 22px rgba(201, 169, 110, 0.15)",
                        },
                        "&:hover .category-image": {
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      <Box sx={{ overflow: "hidden", height: { xs: 200, sm: 220, md: 240 }, flexShrink: 0 }}>
                        <CardMedia
                          component="img"
                          loading="lazy"
                          image={cat.image}
                          alt={cat.label}
                          className="category-image"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ color: palette.gold, fontSize: "0.95rem" }}>⚜</span>
                          <Typography
                            variant="h6"
                            sx={{ 
                              fontWeight: 900, 
                              color: palette.charcoal,
                              fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
                              fontSize: "1.25rem",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {cat.label}
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: palette.gold, fontSize: 18 }} />
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/menus"
                endIcon={<ArrowForwardIcon />}
                size="large"
                sx={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                  px: 4, 
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  boxShadow: "0 6px 20px rgba(190, 89, 83, 0.25)",
                  "&:hover": { 
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(190, 89, 83, 0.35)",
                  }
                }}
              >
                View Full Menu
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── DAILY SPECIALS PREVIEW ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="DAILY SPECIALS"
            title="Something Special Every Day"
            description="Take advantage of our rotating daily deals — great food at even better prices."
          />
          <Grid container spacing={3}>
            {featuredSpecials.map((special, i) => (
              <Grid key={special.id} size={{ xs: 12, md: 4 }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUpVariants}
                  custom={i}
                  style={{ height: "100%" }}
                >
                  <SpotlightCard glowColor="rgba(190, 89, 83, 0.12)" style={{ height: "100%", borderRadius: "16px" }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #FFF8F6 0%, #F5DDD8 100%)", // Blush-terracotta gradient
                        border: "1px solid rgba(201, 169, 110, 0.18)",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "rgba(201, 169, 110, 0.5)",
                          boxShadow: "0 24px 56px rgba(190, 89, 83, 0.12), 0 0 24px rgba(201, 169, 110, 0.15)",
                        },
                      }}
                    >
                      {special.imageUrls?.length > 0 && (
                        <Box sx={{ overflow: "hidden", height: 180 }}>
                          <CardMedia
                            component="img"
                            loading="lazy"
                            image={resolveImageUrl(special.imageUrls[0])}
                            alt={special.title}
                            sx={{
                              height: "100%",
                              transition: "transform 0.5s ease",
                              "&:hover": {
                                transform: "scale(1.06)",
                              },
                            }}
                          />
                        </Box>
                      )}
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Chip
                            label={getSpecialLabel(special)}
                            size="small"
                            sx={{
                              bgcolor: palette.primary.main,
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                            }}
                          />
                          <Chip
                            label={
                              SPECIAL_TYPE_LABELS[special.type] ?? special.type
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: "rgba(190, 89, 83, 0.3)",
                              color: palette.primary.main,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ 
                            fontWeight: 900, 
                            mb: 1.5,
                            fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
                            color: palette.charcoal,
                          }}
                        >
                          {formatAmpersand(special.title)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: palette.text.secondary,
                            mb: 2,
                            lineHeight: 1.7,
                          }}
                        >
                          {special.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </SpotlightCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/specials"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                  px: 4, 
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  borderWidth: "1.5px",
                  "&:hover": { 
                    transform: "translateY(-2px)",
                    borderWidth: "1.5px",
                  }
                }}
              >
                View All Specials
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── FAMILY MEALS HIGHLIGHT ─── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${palette.ivory} 0%, ${palette.cream} 55%, #F2DFDB 100%)`,
          borderTop: `1px solid ${palette.warmGray}`,
          borderBottom: `1px solid ${palette.warmGray}`,
        }}
      >
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Box sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="FAMILY MEALS"
            title="Share the Table, Share the Love"
            description="Ready-to-enjoy family meal packages perfect for every occasion. From classic Italian dinners to pizza party packs."
          />
          <Container>
            <Grid container spacing={3}>
              {liveFamilyMeals
              .filter((m) => m.mealType === "combo")
              .slice(0, 3)
              .map((meal, i) => (
                <Grid key={meal.id} size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeInUpVariants}
                    custom={i}
                    style={{ height: "100%" }}
                  >
                    <ScrollRotate3D style={{ height: "100%" }}>
                      <Card
                        sx={{
                          height: "100%",
                          background: "linear-gradient(135deg, #FFF8F6 0%, #F5DDD8 100%)", // Blush-terracotta gradient
                          borderRadius: "16px",
                          border: "1px solid rgba(201, 169, 110, 0.18)",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            borderColor: "rgba(201, 169, 110, 0.5)",
                            boxShadow: "0 24px 56px rgba(190, 89, 83, 0.12), 0 0 24px rgba(201, 169, 110, 0.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                          <Typography
                            variant="h6"
                            sx={{ 
                              mb: 1, 
                              fontWeight: 900,
                              color: palette.charcoal,
                              fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
                              fontSize: "1.25rem",
                            }}
                          >
                            {formatAmpersand(meal.name)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: palette.text.secondary, mb: 2.5, lineHeight: 1.7, flexGrow: 1 }}
                          >
                            {meal.description}
                          </Typography>
                          <Box sx={{ mt: "auto" }}>
                            <Chip
                              label={`Serves ${meal.serves}`}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                bgcolor: "rgba(201, 169, 110, 0.15)",
                                color: palette.primary.main,
                                border: "1px solid rgba(201, 169, 110, 0.25)",
                                fontWeight: 700,
                                fontSize: "0.68rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            />
                            <Typography
                              variant="h5"
                              sx={{
                                color: palette.charcoal,
                                fontWeight: 900,
                                fontFamily: "'Playfair Display', 'Didot', serif",
                                mt: 2.5,
                                fontSize: "1.5rem",
                                display: "flex",
                                alignItems: "baseline",
                              }}
                            >
                              <span style={{ color: palette.gold, fontSize: "1.05rem", fontWeight: 700, marginRight: 2, fontFamily: "'Inter', sans-serif" }}>$</span>
                              {Number(meal.basePrice).toFixed(2)}
                              {meal.priceLabel && (
                                <span style={{ fontSize: "0.82rem", color: palette.text.secondary, fontWeight: 500, marginLeft: 6, fontFamily: "'Inter', sans-serif" }}>
                                  {meal.priceLabel}
                                </span>
                              )}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </ScrollRotate3D>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/family-meals"
                endIcon={<ArrowForwardIcon />}
                size="large"
                sx={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                  px: 4, 
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  boxShadow: "0 6px 20px rgba(190, 89, 83, 0.25)",
                  "&:hover": { 
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(190, 89, 83, 0.35)",
                  }
                }}
              >
                View Family Meals
              </Button>
            </Box>
          </Box>
          </Container>
        </Box>
      </Box>



      {/* ─── PARTY / CATERING HIGHLIGHT ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.cream, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Box sx={{ color: palette.gold, fontSize: "1.4rem", mb: 0.8, display: "flex", lineHeight: 1 }}>⚜</Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: palette.primary.main,
                    mb: 1,
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  PRIVATE EVENTS & CATERING
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3.5,
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontFamily: fonts.display,
                    color: palette.text.primary,
                  }}
                >
                  Host Your Next Event at Corrado's
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: "0.98rem",
                  }}
                >
                  From intimate gatherings to large celebrations, we have the perfect space and menu for your event.
                </Typography>

                {/* Redesigned details list as a luxury menu board */}
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                    border: "1px solid rgba(201, 169, 110, 0.25)",
                    borderRadius: "16px",
                    p: { xs: 3, md: 4 },
                    mb: 4.5,
                    boxShadow: "inset 0 0 24px rgba(201, 169, 110, 0.04), 0 10px 30px rgba(0,0,0,0.02)",
                  }}
                >
                  <Stack spacing={2.5}>
                    {[
                      { label: "Capacity", val: "Up to 80 Guests (Upstairs Dining & Patio)" },
                      { label: "Menus", val: "Custom Buffet, Plated, or Cocktail Reception" },
                      { label: "A/V Setup", val: "High-Definition Screens & Built-in Sound" },
                      { label: "Pricing", val: "Starting at just $25.00 per guest" },
                      { label: "Booking Policy", val: "No room rental fee (minimum spends apply)" },
                    ].map((row, i) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          borderBottom: i === 4 ? "none" : "1px dashed rgba(201, 169, 110, 0.3)", 
                          pb: 2, 
                          gap: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "rgba(201, 169, 110, 0.03)",
                            px: 1.5,
                            mx: -1.5,
                            borderRadius: "8px",
                          }
                        }}
                      >
                        <Typography sx={{ color: palette.primary.main, fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 1.25 }}>
                          <span style={{ color: palette.gold, fontSize: "1.05rem", filter: "drop-shadow(0 1px 2px rgba(201,169,110,0.3))" }}>⚜</span> {row.label}
                        </Typography>
                        <Typography sx={{ color: palette.charcoal, textAlign: "right", fontSize: "0.92rem", fontWeight: 600, fontFamily: fonts.body }}>
                          {row.val}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
 
                <Stack direction="row" spacing={2} sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/party-menus"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      px: 4, 
                      py: 1.5,
                      borderRadius: "30px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      bgcolor: palette.primary.main,
                      boxShadow: "0 8px 24px rgba(190, 89, 83, 0.3), 0 4px 12px rgba(201, 169, 110, 0.15)",
                      "&:hover": { 
                        transform: "translateY(-2px)",
                        bgcolor: palette.primary.dark,
                        boxShadow: "0 12px 32px rgba(190, 89, 83, 0.4), 0 6px 18px rgba(201, 169, 110, 0.25)",
                      }
                    }}
                  >
                    Party Menus
                  </Button>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/contact"
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      px: 4, 
                      py: 1.5,
                      borderRadius: "30px",
                      fontWeight: 750,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderWidth: "1.5px",
                      borderColor: "rgba(190, 89, 83, 0.3)",
                      color: palette.primary.main,
                      "&:hover": { 
                        transform: "translateY(-2px)",
                        borderWidth: "1.5px",
                        borderColor: palette.primary.dark,
                        bgcolor: "rgba(190, 89, 83, 0.04)",
                      }
                    }}
                  >
                    Get in Touch
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", px: { xs: 1, md: 2 } }}>
                {/* Premium gold double frame behind/overlapping */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: -12,
                    border: "1px solid rgba(201, 169, 110, 0.3)",
                    borderRadius: "16px",
                    zIndex: 0,
                    pointerEvents: "none",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 4,
                      border: "1px dashed rgba(201, 169, 110, 0.18)",
                      borderRadius: "12px",
                    }
                  }}
                />
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
                    height: { xs: "300px", md: "400px" },
                    position: "relative",
                    zIndex: 1,
                    transition: "transform 0.5s ease, box-shadow 0.5s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 20px 48px rgba(190, 89, 83, 0.12)`,
                    }
                  }}
                >
                  <ParallaxImage
                    src={getImage(
                      "home_private_events",
                      "/orrdos/interior-upstairs.jpg",
                    )}
                    alt="Corrado's upstairs dining room — perfect for private events"
                    speed={-0.12}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* ─── EVENTS TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="UPCOMING EVENTS"
            title="What's Happening at Corrado's"
            description="Live music, sports nights, wine tastings, and more — there's always something exciting going on."
          />
          <Grid container spacing={3}>
            {featuredEvents.map((event, i) => (
              <Grid key={event.id} size={{ xs: 12, md: 4 }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUpVariants}
                  custom={i}
                  style={{ height: "100%" }}
                >
                  <TiltCard>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        border: "1px solid rgba(201, 169, 110, 0.16)",
                        boxShadow: "0 8px 24px rgba(45,41,38,0.04)",
                        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "rgba(201, 169, 110, 0.45)",
                          boxShadow: "0 20px 48px rgba(190, 89, 83, 0.08), 0 0 22px rgba(201, 169, 110, 0.08)",
                        },
                        "&:hover .event-image": {
                          transform: "scale(1.06)",
                        },
                      }}
                    >
                      {event.imageUrls?.length > 0 && (
                        <Box sx={{ overflow: "hidden", height: 180 }}>
                          <CardMedia
                            component="img"
                            loading="lazy"
                            image={resolveImageUrl(event.imageUrls[0])}
                            alt={event.title}
                            className="event-image"
                            sx={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        </Box>
                      )}
                      <CardContent sx={{ p: 3 }}>
                        <Chip
                          label={EVENT_TYPE_LABELS[event.type] ?? event.type}
                          size="small"
                          sx={{
                            mb: 2,
                            bgcolor: palette.secondary.main,
                            color: "#fff",
                            textTransform: "capitalize",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                          {formatAmpersand(event.title)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: palette.primary.main,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {formatEventDateRange(event.eventStartDate)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: palette.text.secondary, lineHeight: 1.7 }}
                        >
                          {event.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/events"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                  px: 4, 
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  borderWidth: "1.5px",
                  "&:hover": { 
                    transform: "translateY(-2px)",
                    borderWidth: "1.5px",
                  }
                }}
              >
                View All Events
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── GALLERY TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.cream, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="GALLERY"
            title="A Glimpse Inside Corrado's"
            description="Explore our beautiful space, delicious dishes, and memorable events."
          />
          <Grid container spacing={2}>
            {(galleryImages.length > 0
              ? galleryImages
              : [
                "/orrdos/interior-wide.jpg",
                "/restaurant/menu-spread.jpeg",
                "/orrdos/interior-main-dining.jpg",
                "/restaurant/chef-pizza-oven.jpeg",
              ]
            ).map((src, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUpVariants}
                  custom={i}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 160, md: 220 },
                      borderRadius: "16px",
                      border: "1px solid rgba(201, 169, 110, 0.16)",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(45,41,38,0.04)",
                      transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: "rgba(201, 169, 110, 0.45)",
                        boxShadow: "0 20px 48px rgba(190, 89, 83, 0.08), 0 0 22px rgba(201, 169, 110, 0.08)",
                      },
                    }}
                  >
                    <ParallaxImage
                      src={src}
                      alt={`Gallery image ${i + 1}`}
                      speed={0.08}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/gallery"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                  px: 4, 
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  borderWidth: "1.5px",
                  "&:hover": { 
                    transform: "translateY(-2px)",
                    borderWidth: "1.5px",
                  }
                }}
              >
                View Full Gallery
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── MOBILE APPS SECTION ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Box sx={{ color: palette.gold, fontSize: "1.4rem", mb: 0.8, display: "flex", lineHeight: 1 }}>⚜</Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: palette.primary.main,
                    mb: 1,
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  MOBILE APP
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif",
                    color: palette.text.primary,
                  }}
                >
                  Order From Anywhere
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: "0.98rem",
                  }}
                >
                  Download the Corrado's app and get your favourite Italian dishes delivered right to your door. Browse our full menu, customize your order, track delivery, and earn rewards with every purchase.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Tooltip
                    title="Coming soon — stay tuned!"
                    arrow
                    placement="top"
                  >
                    <span>
                      <Button
                        variant="contained"
                        disabled
                        startIcon={<AppleIcon />}
                        sx={{
                          bgcolor: "#000",
                          color: "#fff",
                          px: 3,
                          py: 1.2,
                          textTransform: "none",
                          fontSize: "0.85rem",
                          "&.Mui-disabled": {
                            bgcolor: "#555",
                            color: "rgba(255,255,255,0.6)",
                          },
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
                              lineHeight: 1,
                              textAlign: "left",
                            }}
                          >
                            Coming Soon
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              lineHeight: 1.2,
                            }}
                          >
                            App Store
                          </Typography>
                        </Box>
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title="Coming soon — stay tuned!"
                    arrow
                    placement="top"
                  >
                    <span>
                      <Button
                        variant="contained"
                        disabled
                        startIcon={<ShopIcon />}
                        sx={{
                          bgcolor: "#000",
                          color: "#fff",
                          px: 3,
                          py: 1.2,
                          textTransform: "none",
                          fontSize: "0.85rem",
                          "&.Mui-disabled": {
                            bgcolor: "#555",
                            color: "rgba(255,255,255,0.6)",
                          },
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
                              lineHeight: 1,
                              textAlign: "left",
                            }}
                          >
                            Coming Soon
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              lineHeight: 1.2,
                            }}
                          >
                            Google Play
                          </Typography>
                        </Box>
                      </Button>
                    </span>
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ScrollRotate3D>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: 280, md: 400 },
                    bgcolor: palette.background.default,
                    borderRadius: 1,
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Box
                    sx={{
                      width: 200,
                      height: 380,
                      bgcolor: "#000",
                      borderRadius: "32px",
                      border: "6px solid #1c1a1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 28px 64px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                      transformStyle: "preserve-3d",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 8,
                        width: 65,
                        height: 14,
                        bgcolor: "#000",
                        borderRadius: "10px",
                        zIndex: 10,
                      }
                    }}
                  >
                    <Box
                      component="img"
                      loading="lazy"
                      src="/restaurant/menu-spread.jpeg"
                      alt="App preview — Corrado's menu on mobile"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                    />
                  </Box>
                  {/* Floating elements to enhance the 3D parallax effect */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "15%",
                      left: "12%",
                      zIndex: 2,
                      animation: `${floatUp} 4s ease-in-out infinite`,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: palette.primary.main,
                        color: "#fff",
                        p: 1.5,
                        borderRadius: "50%",
                        boxShadow: "0 10px 25px rgba(190, 89, 83, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LocalPizzaIcon />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "20%",
                      right: "12%",
                      zIndex: 2,
                      animation: `${floatDown} 3.5s ease-in-out infinite`,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: palette.gold,
                        color: "#fff",
                        p: 1.5,
                        borderRadius: "50%",
                        boxShadow: "0 10px 25px rgba(201, 169, 110, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StarIcon />
                    </Box>
                  </Box>
                </Box>
              </ScrollRotate3D>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── WHY CHOOSE US ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.cream, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            subtitle="WHY CORRADO'S"
            title="What Makes Us Special"
            description="There are many reasons families in Whitby and Oshawa choose Corrado's for dining, takeout, and events."
          />
          <Grid container spacing={3}>
            {[
              {
                icon: <LocalPizzaIcon />,
                title: "Authentic Italian",
                text: "Handmade pasta, stone-oven pizza, and traditional recipes crafted with the freshest ingredients",
                grid: { xs: 12, sm: 6, md: 6 },
              },
              {
                icon: <GroupsIcon />,
                title: "Family Dining",
                text: "Warm booths downstairs, spacious upstairs seating — a welcoming atmosphere for the whole family",
                grid: { xs: 12, sm: 6, md: 6 },
              },
              {
                icon: <CelebrationIcon />,
                title: "Private Events",
                text: "Upstairs dining room and patio available for birthdays, corporate dinners, and celebrations",
                grid: { xs: 12, sm: 6, md: 4 },
              },
              {
                icon: <WineBarIcon />,
                title: "Wine & Cocktails",
                text: "Extensive Italian and international wines, craft cocktails, and the best Espresso Martini in town",
                grid: { xs: 12, sm: 6, md: 4 },
              },
              {
                icon: <SportsBarIcon />,
                title: "Sports Viewing",
                text: "Multiple screens throughout — the perfect spot to cheer on your team during the big game",
                grid: { xs: 12, sm: 6, md: 4 },
              },
              {
                icon: <DeckIcon />,
                title: "Beautiful Patio",
                text: "Enjoy al fresco dining on our charming outdoor patio in the warmer months",
                grid: { xs: 12, sm: 6, md: 3 },
              },
              {
                icon: <ChildCareIcon />,
                title: "Kids' Menu",
                text: "Child-friendly options the little ones will love, with fast service so no one waits long",
                grid: { xs: 12, sm: 6, md: 3 },
              },
              {
                icon: <StarIcon />,
                title: "Exceptional Value",
                text: "Generous portions, quality ingredients, and great prices — consistently rated 5 stars",
                grid: { xs: 12, sm: 6, md: 3 },
              },
              {
                icon: <LocalParkingIcon />,
                title: "Easy to Find",
                text: "Located right off Baldwin with ample street parking and a welcoming entrance",
                grid: { xs: 12, sm: 6, md: 3 },
              },
              {
                icon: <WifiIcon />,
                title: "Free WiFi",
                text: "Stay connected while you dine with complimentary high-speed WiFi",
                grid: { xs: 12, sm: 6, md: 6 },
              },
              {
                icon: <AccessibleIcon />,
                title: "Fully Accessible",
                text: "Wheelchair accessible space so every guest feels welcome and comfortable",
                grid: { xs: 12, sm: 6, md: 6 },
              },
            ].map((feature, i) => (
              <Grid key={i} size={feature.grid}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUpVariants}
                  custom={i % 4}
                  style={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      p: 3.5,
                      borderRadius: "18px",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      bgcolor: "rgba(255, 255, 255, 0.45)", // Frosted glass panel
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(45, 41, 38, 0.02)",
                      transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), bgcolor 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        bgcolor: "rgba(255, 255, 255, 0.85)",
                        borderColor: "rgba(201, 169, 110, 0.35)",
                        boxShadow: "0 24px 50px rgba(201, 169, 110, 0.15), 0 0 30px rgba(201, 169, 110, 0.08)", // Dynamic hover glow
                      },
                      "&:hover .liquid-glass": {
                        bgcolor: palette.primary.main,
                        color: "#fff",
                        borderColor: palette.primary.main,
                        boxShadow: "0 0 20px rgba(190, 89, 83, 0.45)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: palette.primary.main,
                        mb: 2,
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Magnet strength={4} padding={40}>
                        <Box
                          className="liquid-glass"
                          sx={{
                            color: palette.primary.main,
                            p: 2,
                            borderRadius: "50%",
                            bgcolor: "rgba(201, 169, 110, 0.1)", // Soft glowing gold circular background
                            border: "1px solid rgba(201, 169, 110, 0.25)",
                            boxShadow: "0 0 15px rgba(201, 169, 110, 0.2)", // Soft glow
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 56,
                            height: 56,
                            "& svg": { fontSize: 26 },
                            transition: "all 0.35s ease",
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </Magnet>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1, color: palette.charcoal, letterSpacing: "0.01em" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, lineHeight: 1.6, fontSize: "0.85rem" }}
                    >
                      {feature.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── TESTIMONIALS ─── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Ambient blurred gradient orbs & grain texture */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />
        <GrainOverlay opacity={0.03} />

        <Box sx={{ position: "relative", zIndex: 2, width: "100%" }}>
          <SectionHeader
            subtitle="WHAT OUR GUESTS SAY"
            title="Loved by Families Across Whitby"
          />
          <Box sx={{ width: "100%" }}>
          <InfiniteMarquee speed={45} direction="left" pauseOnHover={true}>
            {testimonials.map((t) => (
              <Box
                key={t.id}
                sx={{
                  width: { xs: 280, sm: 320, md: 350 },
                  flexShrink: 0,
                  display: "inline-block",
                  whiteSpace: "normal",
                }}
              >
                <Card
                  sx={{
                    minHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 6px 22px rgba(45,41,38,0.06)",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Rating
                      value={t.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 1.5, flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        mb: 2,
                        flex: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        fontSize: "0.85rem",
                      }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </Typography>
                    <Box sx={{ flexShrink: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, fontSize: "0.85rem" }}
                      >
                        {t.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: palette.text.secondary,
                          fontSize: "0.75rem",
                        }}
                      >
                        via {t.source}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </InfiniteMarquee>
        </Box>
        </Box>
      </Box>

      {/* ─── NEWSLETTER SIGNUP ─── */}
      <NewsletterSignup />

      {/* ─── PORTAL ZOOM OVERLAY (lazy-loaded on tile click) ─── */}
      {activeShatter && (
        <Suspense fallback={null}>
          <ShatterPortalOverlay
            rect={activeShatter.rect}
            image={activeShatter.image}
            label={activeShatter.label}
            tagline={activeShatter.tagline}
            previewImages={activeShatter.previewImages}
            isTriggered={!!activeShatter}
            onComplete={handleZoomComplete}
          />
        </Suspense>
      )}
    </>
  );
}
