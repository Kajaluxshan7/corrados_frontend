import { keyframes } from "@emotion/react";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { Link as RouterLink } from "react-router-dom";
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
import { SectionHeader, NewsletterSignup } from "../components";
import { testimonials } from "../data";
import { palette } from "../theme";
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

// navTiles defaults used as fallbacks when admin hasn't set a custom image
const NAV_TILE_DEFAULTS: Record<string, string> = {
  nav_about: "/restaurant/chef-pizza-oven.jpeg",
  nav_menus: "/restaurant/gnocchi-tomato-cream.jpeg",
  nav_specials: "/restaurant/ravioli-mushroom-spinach.jpeg",
  nav_family_meals: "/restaurant/family-meal-takeout.jpeg",
  nav_party_menus: "/restaurant/catering-dessert-display.jpeg",
  nav_events: "/restaurant/menu-spread.jpeg",
  nav_gallery: "/restaurant/seafood-linguine.jpeg",
  nav_contact: "/restaurant/antipasto-platter.jpeg",
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

const tileReveal = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 34px, 0) scale(0.96);
    filter: blur(8px) saturate(0.75);
  }
  58% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0) saturate(1);
  }
`;

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

const sectionLight = keyframes`
  0%, 100% {
    background-position: 18% 12%, 88% 84%, 50% 50%;
  }
  50% {
    background-position: 30% 18%, 72% 76%, 50% 50%;
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

const REVIEWS_PER_PAGE = 4;

export default function Home() {
  usePageMeta({
    title: "Authentic Italian Dining in Whitby, ON",
    description:
      "Corrado's Restaurant & Bar — Whitby's favourite Italian dining destination since 2010. Handmade pasta, stone-oven pizza, curated wines, family meals, daily specials, private events & live sports. Open 7 days.",
    ogImage: "/orrdos/exterior-building.jpg",
    ogType: "website",
  });
  const { getImage } = useSiteImages();

  // Build navTiles with dynamic images at render time
  const navTiles = NAV_TILE_META.map((meta) => ({
    ...meta,
    image: getImage(meta.key, NAV_TILE_DEFAULTS[meta.key]),
  }));

  const [specialsPopupOpen, setSpecialsPopupOpen] = useState(false);
  const [activeSpecial, setActiveSpecial] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewsVisible, setReviewsVisible] = useState(true);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);
  const reviewFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      .catch(() => {});
  }, []);

  const loadHomeEvents = useCallback(() => {
    fetchEvents()
      .then((data) => setLiveEvents(data))
      .catch(() => {});
  }, []);

  const loadHomeGallery = useCallback(() => {
    fetchStoryCategories()
      .then((data) => setGalleryCategories(data.filter((c) => c.isActive)))
      .catch(() => {});
  }, []);

  const loadHomeFamilyMeals = useCallback(() => {
    fetchFamilyMeals()
      .then((data) => setLiveFamilyMeals(data))
      .catch(() => {});
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

  const totalReviewPages = Math.ceil(testimonials.length / REVIEWS_PER_PAGE);

  const changeReviewPage = useCallback((next: number) => {
    setReviewsVisible(false);
    if (reviewFadeRef.current) clearTimeout(reviewFadeRef.current);
    reviewFadeRef.current = setTimeout(() => {
      setReviewPage(next);
      setReviewsVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (isReviewsHovered) return;
    const timer = setInterval(() => {
      changeReviewPage((reviewPage + 1) % totalReviewPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalReviewPages, isReviewsHovered, reviewPage, changeReviewPage]);

  useEffect(() => {
    return () => {
      if (reviewFadeRef.current) clearTimeout(reviewFadeRef.current);
    };
  }, []);

  const visibleReviews = testimonials.slice(
    reviewPage * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE,
  );

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

      {/* Navigation tile bento grid — 3×3, logo at center slot */}
      <Box
        component="section"
        sx={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          bgcolor: palette.charcoal,
          backgroundImage:
            "radial-gradient(ellipse at 18% 12%, rgba(190,89,83,0.28) 0%, rgba(190,89,83,0) 34%), radial-gradient(ellipse at 86% 86%, rgba(44,85,48,0.28) 0%, rgba(44,85,48,0) 36%), linear-gradient(135deg, #2D2926 0%, #171210 54%, #241815 100%)",
          backgroundSize: "140% 140%, 140% 140%, 100% 100%",
          animation: `${sectionLight} 18s ease-in-out infinite`,
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
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 22%, rgba(255,255,255,0) 48%), linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.34) 100%)",
            mixBlendMode: "screen",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.1,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0 1px, rgba(255,255,255,0) 1px 4px)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            "& .cinematic-tile, & .tile-img, & .tile-sheen, & .tile-frame, & .tile-title, & .tile-arrow":
              {
                animation: "none !important",
                transition: "none !important",
              },
            "& .cinematic-tile::before": {
              animation: "none !important",
            },
          },
        }}
      >
        {/* ── All 8 nav tiles (4 × 2 grid) ── */}
        {navTiles.map((tile, i) => (
          <Box
            key={tile.path}
            className="cinematic-tile"
            component={RouterLink}
            to={tile.path}
            sx={{
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
              textDecoration: "none",
              display: "block",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.14)",
              bgcolor: palette.charcoal,
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
              transformStyle: "preserve-3d",
              animation: `${tileReveal} 880ms cubic-bezier(0.19, 1, 0.22, 1) both`,
              animationDelay: `${i * 65}ms`,
              transition:
                "transform 0.55s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.55s ease, border-color 0.55s ease",
              "&:hover, &:focus-visible": {
                boxShadow:
                  "0 34px 76px rgba(0,0,0,0.42), 0 0 0 1px rgba(201,169,110,0.34)",
                borderColor: "rgba(201,169,110,0.5)",
                transform: "translateY(-10px) scale(1.018)",
              },
              "&:focus-visible": {
                outline: `2px solid ${palette.gold}`,
                outlineOffset: 4,
              },
              "&:hover .tile-img, &:focus-visible .tile-img": {
                "--tile-scale": "1.15",
                filter: "saturate(1.08) contrast(1.06)",
              },
              "&:hover .tile-overlay, &:focus-visible .tile-overlay": {
                background:
                  "linear-gradient(to top, rgba(20,15,12,0.94) 0%, rgba(20,15,12,0.64) 50%, rgba(20,15,12,0.12) 100%)",
              },
              "&:hover .tile-frame, &:focus-visible .tile-frame": {
                opacity: 1,
                transform: "scale(0.985)",
              },
              "&:hover .tile-title, &:focus-visible .tile-title": {
                transform: "translateY(-3px)",
                color: palette.gold,
              },
              "&:hover .tile-arrow, &:focus-visible .tile-arrow": {
                transform: "translate3d(6px, 0, 0)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: 3,
                bottom: 14,
                left: 18,
                right: 18,
                height: "2px",
                background: `linear-gradient(90deg, ${palette.primary.main}, ${palette.gold})`,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.45s cubic-bezier(0.19, 1, 0.22, 1)",
              },
              "&:hover::after, &:focus-visible::after": {
                transform: "scaleX(1)",
              },
            }}
          >
            <Box
              className="tile-img"
              sx={{
                "--tile-scale": "1.07",
                position: "absolute",
                inset: -8,
                backgroundImage: `url(${tile.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(0.96) contrast(1)",
                animation: `${tileImageDrift} ${17 + i}s ease-in-out infinite alternate`,
                transition: "filter 0.55s ease",
                willChange: "transform",
              }}
            />
            <Box
              className="tile-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                background:
                  "linear-gradient(to top, rgba(20,15,12,0.9) 0%, rgba(20,15,12,0.48) 48%, rgba(20,15,12,0.08) 100%)",
                transition: "background 0.45s ease",
              }}
            />
            <Box
              className="tile-sheen"
              sx={{
                position: "absolute",
                zIndex: 2,
                top: "-28%",
                bottom: "-28%",
                width: "34%",
                left: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,222,0.38) 50%, rgba(255,255,255,0) 100%)",
                filter: "blur(10px)",
                animation: `${lightSweep} ${9 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${0.6 + i * 0.32}s`,
                pointerEvents: "none",
              }}
            />
            <Box
              className="tile-frame"
              sx={{
                position: "absolute",
                zIndex: 2,
                inset: 12,
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 1.5,
                opacity: 0.55,
                transition:
                  "opacity 0.45s ease, transform 0.45s cubic-bezier(0.19, 1, 0.22, 1)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                p: { xs: 2.5, md: 3.5 },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "#fff",
                  bgcolor: `${palette.primary.main}CC`,
                  border: `1px solid ${palette.primary.light}44`,
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  mb: 0.75,
                  px: 0.9,
                  py: 0.3,
                  borderRadius: 0.75,
                  display: "inline-flex",
                  lineHeight: 1.2,
                  width: "fit-content",
                  backdropFilter: "blur(4px)",
                }}
              >
                {tile.tagline}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  className="tile-title"
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: "1.05rem", sm: "1.1rem", md: "1.16rem" },
                    letterSpacing: "0.01em",
                    lineHeight: 1.25,
                    textShadow: "0 3px 14px rgba(0,0,0,0.4)",
                    transition:
                      "transform 0.45s cubic-bezier(0.19, 1, 0.22, 1), color 0.3s ease",
                  }}
                >
                  {tile.label}
                </Typography>
                <ArrowForwardIcon
                  className="tile-arrow"
                  sx={{
                    color: palette.gold,
                    fontSize: 20,
                    transition: "transform 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}

      </Box>

      {/* ─── INTRO / ABOUT TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                loading="lazy"
                src={getImage(
                  "home_about_owner",
                  "/restaurant/owner_and_logo.jpg",
                )}
                alt="Corrado's owner with the restaurant logo"
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 400 },
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                OUR STORY
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                A Taste of Italy in Whitby
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}
              >
                Since 2010, Corrado's has been the neighbourhood's favourite
                destination for authentic Italian cuisine. From our family to
                yours, we prepare every dish with fresh ingredients,
                time-honoured recipes, and a genuine passion for hospitality.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}
              >
                Whether you're here for a casual weeknight dinner, a special
                celebration, or cheering on your team during the big game —
                there's always a seat at our table for you.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/about"
                endIcon={<ArrowForwardIcon />}
              >
                Our Story
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURED MENU CATEGORIES ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="OUR MENU"
          title="Explore Our Kitchen"
          description="From handmade pasta to stone-oven pizza, our menu celebrates the best of Italian cuisine with a Canadian twist."
        />
        <Container>
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
            ].map((cat) => (
              <Grid key={cat.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  component={RouterLink}
                  to="/menus"
                  sx={{
                    textDecoration: "none",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    loading="lazy"
                    image={cat.image}
                    alt={cat.label}
                    sx={{
                      height: { xs: 200, sm: 220, md: 240 },
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: palette.charcoal }}
                    >
                      {cat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/menus"
              endIcon={<ArrowForwardIcon />}
              size="large"
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── DAILY SPECIALS PREVIEW ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="DAILY SPECIALS"
          title="Something Special Every Day"
          description="Take advantage of our rotating daily deals — great food at even better prices."
        />
        <Container>
          <Grid container spacing={3}>
            {featuredSpecials.map((special) => (
              <Grid key={special.id} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {special.imageUrls?.length > 0 && (
                    <CardMedia
                      component="img"
                      loading="lazy"
                      height="180"
                      image={resolveImageUrl(special.imageUrls[0])}
                      alt={special.title}
                    />
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
                          borderColor: palette.gold,
                          color: palette.gold,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
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
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/specials"
              endIcon={<ArrowForwardIcon />}
            >
              View All Specials
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── FAMILY MEALS HIGHLIGHT ─── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: palette.charcoal,
          backgroundImage: `url(${getImage("home_family_meals_bg", "/restaurant/catering-fruit-platter.jpeg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(30, 25, 22, 0.85)",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <SectionHeader
            subtitle="FAMILY MEALS"
            title="Share the Table, Share the Love"
            description="Ready-to-enjoy family meal packages perfect for every occasion. From classic Italian dinners to pizza party packs."
            light
          />
          <Container>
            <Grid container spacing={3}>
              {liveFamilyMeals
                .filter((m) => m.mealType === "combo")
                .slice(0, 3)
                .map((meal) => (
                  <Grid key={meal.id} size={{ xs: 12, md: 4 }}>
                    <Card
                      sx={{ height: "100%", bgcolor: "rgba(255,255,255,0.95)" }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          {formatAmpersand(meal.name)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: palette.text.secondary, mb: 2 }}
                        >
                          {meal.description}
                        </Typography>
                        <Chip
                          label={`Serves ${meal.serves}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Typography
                          variant="h5"
                          sx={{
                            color: palette.primary.main,
                            fontWeight: 700,
                            mt: 2,
                          }}
                        >
                          {`$${Number(meal.basePrice).toFixed(2)}${meal.priceLabel}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/family-meals"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Family Meals
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ─── PARTY / CATERING HIGHLIGHT ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                PRIVATE EVENTS & CATERING
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                Host Your Next Event at Corrado's
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}
              >
                From intimate gatherings to large celebrations, we have the
                perfect space and menu for your event. Birthday parties,
                corporate dinners, sports viewing parties, and more.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}
              >
                Our dedicated event coordinator will work with you to customize
                every detail, from menu selection to seating arrangement.
                Starting at just $25 per person.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/party-menus"
                  endIcon={<ArrowForwardIcon />}
                >
                  Party Menus
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                >
                  Get in Touch
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                loading="lazy"
                src={getImage(
                  "home_private_events",
                  "/orrdos/interior-upstairs.jpg",
                )}
                alt="Corrado's upstairs dining room — perfect for private events"
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 400 },
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── EVENTS TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="UPCOMING EVENTS"
          title="What's Happening at Corrado's"
          description="Live music, sports nights, wine tastings, and more — there's always something exciting going on."
        />
        <Container>
          <Grid container spacing={3}>
            {featuredEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: "100%" }}>
                  {event.imageUrls?.length > 0 && (
                    <CardMedia
                      component="img"
                      loading="lazy"
                      height="180"
                      image={resolveImageUrl(event.imageUrls[0])}
                      alt={event.title}
                    />
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
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/events"
              endIcon={<ArrowForwardIcon />}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── GALLERY TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="GALLERY"
          title="A Glimpse Inside Corrado's"
          description="Explore our beautiful space, delicious dishes, and memorable events."
        />
        <Container>
          <Grid container spacing={2}>
            {(galleryImages.length > 0
              ? galleryImages
              : [
                  "/orrdos/exterior-building.jpg",
                  "/orrdos/interior-upstairs.jpg",
                  "/orrdos/interior-booths.jpg",
                  "/orrdos/exterior-patio.jpg",
                ]
            ).map((src, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Box
                  component="img"
                  loading="lazy"
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  sx={{
                    width: "100%",
                    height: { xs: 160, md: 220 },
                    objectFit: "cover",
                    borderRadius: 1,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/gallery"
              endIcon={<ArrowForwardIcon />}
            >
              View Full Gallery
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── MOBILE APPS SECTION ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                MOBILE APP
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                Order From Anywhere
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}
              >
                Download the Corrado's app and get your favourite Italian dishes
                delivered right to your door. Browse our full menu, customize
                your order, track delivery, and earn rewards with every
                purchase.
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 280, md: 400 },
                  bgcolor: palette.background.default,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 380,
                    bgcolor: "#222",
                    borderRadius: "24px",
                    border: "4px solid #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
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
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── WHY CHOOSE US ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="WHY CORRADO'S"
          title="What Makes Us Special"
          description="There are many reasons families in Whitby and Oshawa choose Corrado's for dining, takeout, and events."
        />
        <Container>
          <Grid container spacing={3}>
            {[
              {
                icon: <LocalPizzaIcon />,
                title: "Authentic Italian",
                text: "Handmade pasta, stone-oven pizza, and traditional recipes crafted with the freshest ingredients",
              },
              {
                icon: <GroupsIcon />,
                title: "Family Dining",
                text: "Warm booths downstairs, spacious upstairs seating — a welcoming atmosphere for the whole family",
              },
              {
                icon: <CelebrationIcon />,
                title: "Private Events",
                text: "Upstairs dining room and patio available for birthdays, corporate dinners, and celebrations",
              },
              {
                icon: <WineBarIcon />,
                title: "Wine & Cocktails",
                text: "Extensive Italian and international wines, craft cocktails, and the best Espresso Martini in town",
              },
              {
                icon: <SportsBarIcon />,
                title: "Sports Viewing",
                text: "Multiple screens throughout — the perfect spot to cheer on your team during the big game",
              },
              {
                icon: <DeckIcon />,
                title: "Beautiful Patio",
                text: "Enjoy al fresco dining on our charming outdoor patio in the warmer months",
              },
              {
                icon: <ChildCareIcon />,
                title: "Kids' Menu",
                text: "Child-friendly options the little ones will love, with fast service so no one waits long",
              },
              {
                icon: <StarIcon />,
                title: "Exceptional Value",
                text: "Generous portions, quality ingredients, and great prices — consistently rated 5 stars",
              },
              {
                icon: <LocalParkingIcon />,
                title: "Easy to Find",
                text: "Located right off Baldwin with ample street parking and a welcoming entrance",
              },
              {
                icon: <WifiIcon />,
                title: "Free WiFi",
                text: "Stay connected while you dine with complimentary high-speed WiFi",
              },
              {
                icon: <AccessibleIcon />,
                title: "Fully Accessible",
                text: "Wheelchair accessible space so every guest feels welcome and comfortable",
              },
            ].map((feature, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      color: palette.primary.main,
                      mb: 1.5,
                      "& svg": { fontSize: 36 },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: palette.text.secondary }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── TESTIMONIALS ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="WHAT OUR GUESTS SAY"
          title="Loved by Families Across Whitby"
        />
        <Container
          onMouseEnter={() => setIsReviewsHovered(true)}
          onMouseLeave={() => setIsReviewsHovered(false)}
        >
          <Grid
            container
            spacing={3}
            sx={{
              minHeight: { xs: "auto", sm: 280 },
              opacity: reviewsVisible ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {visibleReviews.map((t) => (
              <Grid key={t.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{ height: 240, display: "flex", flexDirection: "column" }}
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
                        lineHeight: 1.7,
                        mb: 2,
                        flex: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      "{t.text}"
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
              </Grid>
            ))}
          </Grid>
          {/* Dot indicators */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}
          >
            {Array.from({ length: totalReviewPages }).map((_, i) => (
              <Box
                key={i}
                onClick={() => changeReviewPage(i)}
                sx={{
                  width: reviewPage === i ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  bgcolor:
                    reviewPage === i ? palette.primary.main : palette.warmGray,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── NEWSLETTER SIGNUP ─── */}
      <NewsletterSignup />

      {/* ─── CONTACT STRIP ─── */}
    </>
  );
}
