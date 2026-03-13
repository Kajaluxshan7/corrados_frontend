import { useEffect, useState, useRef, useCallback } from 'react';
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AccessibleIcon from "@mui/icons-material/Accessible";
import DeckIcon from "@mui/icons-material/Deck";
import GroupsIcon from "@mui/icons-material/Groups";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import LiquorIcon from "@mui/icons-material/Liquor";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppleIcon from "@mui/icons-material/Apple";
import ShopIcon from "@mui/icons-material/Shop";
import { SectionHeader } from "../components";
import {
  menuCategories,
  specials,
  familyMeals,
  testimonials,
  events,
} from "../data";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";

const navTiles = [
  {
    label: "About",
    path: "/about",
    tagline: "Our Story & Heritage",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    gridColumn: "1 / 3",
    gridRow: "1 / 3",
  },
  {
    label: "Menus",
    path: "/menus",
    tagline: "Explore Our Italian Table",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
    gridColumn: "3 / 4",
    gridRow: "1 / 2",
  },
  {
    label: "Specials",
    path: "/specials",
    tagline: "Today's Featured Dishes",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    gridColumn: "4 / 5",
    gridRow: "1 / 2",
  },
  {
    label: "Family Meals",
    path: "/family-meals",
    tagline: "Feed the Whole Family",
    image:
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80",
    gridColumn: "3 / 4",
    gridRow: "2 / 3",
  },
  {
    label: "Party Menus",
    path: "/party-menus",
    tagline: "Celebrate With Us",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    gridColumn: "4 / 5",
    gridRow: "2 / 3",
  },
  {
    label: "Events",
    path: "/events",
    tagline: "What's Happening",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
    gridColumn: "1 / 3",
    gridRow: "3 / 4",
  },
  {
    label: "Gallery",
    path: "/gallery",
    tagline: "A Feast for the Eyes",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    gridColumn: "3 / 4",
    gridRow: "3 / 4",
  },
  {
    label: "Contact",
    path: "/contact",
    tagline: "Find Us & Reach Out",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    gridColumn: "4 / 5",
    gridRow: "3 / 4",
  },
];

const specialPosterImages: Record<string, string> = {
  'monday-pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80',
  'tuesday-pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80',
  'wednesday-wings': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=900&q=80',
  'thursday-wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
  'friday-seafood': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900&q=80',
  'weekend-brunch': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80',
  'lunch-combo': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80',
  'happy-hour': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=80',
};

export default function Home() {
  const [specialsPopupOpen, setSpecialsPopupOpen] = useState(false);
  const [activeSpecial, setActiveSpecial] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const featuredCategories = menuCategories.slice(0, 4);
  const featuredSpecials = specials.slice(0, 3);
  const featuredEvents = events.slice(0, 3);
  const popupSpecials = specials.slice(0, 4);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
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
    goToSpecial((activeSpecial - 1 + popupSpecials.length) % popupSpecials.length);
  }, [activeSpecial, popupSpecials.length, goToSpecial]);

  const goNext = useCallback(() => {
    goToSpecial((activeSpecial + 1) % popupSpecials.length);
  }, [activeSpecial, popupSpecials.length, goToSpecial]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = 'corrados-specials-popup-seen';
    if (window.sessionStorage.getItem(storageKey) === 'true') return;

    const timer = window.setTimeout(() => {
      setSpecialsPopupOpen(true);
      window.sessionStorage.setItem(storageKey, 'true');
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (specialsPopupOpen) {
      startAutoPlay();
    } else {
      stopAutoPlay();
      setActiveSpecial(0);
    }
    return stopAutoPlay;
  }, [specialsPopupOpen, startAutoPlay, stopAutoPlay]);

  return (
    <>
      <Dialog
        open={specialsPopupOpen}
        onClose={() => setSpecialsPopupOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            overflow: 'hidden',
            borderRadius: 2.5,
            bgcolor: palette.charcoal,
            border: `1px solid ${palette.warmGray}`,
            boxShadow: '0 28px 70px rgba(45, 41, 38, 0.28)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            px: { xs: 2.5, md: 3.5 },
            pt: { xs: 4, md: 4.5 },
            pb: { xs: 2, md: 2.5 },
            background: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.charcoal} 100%)`,
          }}
        >
          <IconButton
            onClick={() => setSpecialsPopupOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="overline"
            sx={{ color: palette.gold, letterSpacing: '0.18em', fontSize: '0.68rem' }}
          >
            THIS WEEK AT CORRADO&apos;S
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              mt: 0.5,
              fontSize: { xs: '1.6rem', md: '2rem' },
              lineHeight: 1.1,
            }}
          >
            House Specials
          </Typography>
        </Box>

        {/* Carousel */}
        <Box sx={{ position: 'relative', px: { xs: 2.5, md: 3.5 }, pt: { xs: 2.5, md: 3 }, pb: 0 }}>
          {/* Special card — single item */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 300, md: 360 },
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.2)',
              backgroundImage: `linear-gradient(180deg, rgba(20,15,12,0.06) 0%, rgba(20,15,12,0.65) 60%, rgba(20,15,12,0.92) 100%), url(${specialPosterImages[popupSpecials[activeSpecial].id]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'background-image 0.4s ease',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                p: { xs: 2, md: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
                <Chip
                  label={popupSpecials[activeSpecial].day}
                  size="small"
                  sx={{ bgcolor: palette.primary.main, color: '#fff', fontWeight: 700, fontSize: '0.68rem' }}
                />
                {popupSpecials[activeSpecial].badge && (
                  <Chip
                    label={popupSpecials[activeSpecial].badge}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.14)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.18)',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      backdropFilter: 'blur(6px)',
                    }}
                  />
                )}
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: palette.gold, letterSpacing: '0.18em', fontSize: '0.62rem' }}
                >
                  Weekly Feature
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    mt: 0.35,
                    lineHeight: 1.15,
                    textShadow: '0 4px 20px rgba(0,0,0,0.35)',
                  }}
                >
                  {formatAmpersand(popupSpecials[activeSpecial].title)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    mt: 0.8,
                    lineHeight: 1.55,
                    maxWidth: 400,
                  }}
                >
                  {popupSpecials[activeSpecial].description}
                </Typography>
                <Typography variant="h6" sx={{ color: palette.gold, fontWeight: 700, mt: 1.25 }}>
                  {popupSpecials[activeSpecial].price}
                </Typography>
              </Box>
            </Box>

            {/* Prev / Next buttons */}
            <IconButton
              onClick={goPrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.45)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                width: 36,
                height: 36,
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={goNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.45)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                width: 36,
                height: 36,
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Dot indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            {popupSpecials.map((_, i) => (
              <Box
                key={i}
                onClick={() => goToSpecial(i)}
                sx={{
                  width: activeSpecial === i ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: activeSpecial === i ? palette.gold : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: activeSpecial === i ? palette.gold : 'rgba(255,255,255,0.4)' },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2, md: 2.5 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" sx={{ color: palette.text.secondary, fontSize: '0.78rem' }}>
            {activeSpecial + 1} / {popupSpecials.length}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/specials"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setSpecialsPopupOpen(false)}
          >
            View All Specials
          </Button>
        </Box>
      </Dialog>

      {/* Navigation tile bento grid */}
      <Box
        sx={{
          bgcolor: palette.background.default,
          display: "grid",
          gap: { xs: 1, md: 1.5 },
          p: { xs: 1, md: 1.5 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gridTemplateRows: {
            xs: "repeat(8, 200px)",
            sm: "repeat(4, 240px)",
            md: "repeat(3, 300px)",
          },
        }}
      >
        {navTiles.map((tile) => (
          <Box
            key={tile.path}
            component={RouterLink}
            to={tile.path}
            sx={{
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              display: "block",
              borderRadius: 2,
              border: `1px solid ${palette.warmGray}`,
              boxShadow: "0 10px 28px rgba(45, 41, 38, 0.08)",
              gridColumn: { md: tile.gridColumn },
              gridRow: { md: tile.gridRow },
              "&:hover": {
                boxShadow: "0 18px 42px rgba(45, 41, 38, 0.16)",
              },
              "&:hover .tile-img": { transform: "scale(1.05)" },
              "&:hover .tile-overlay": {
                background:
                  "linear-gradient(to top, rgba(20,15,12,0.92) 0%, rgba(20,15,12,0.62) 58%, rgba(20,15,12,0.22) 100%)",
              },
              "&:hover .tile-frame": { opacity: 1 },
              "&:hover .tile-arrow": { transform: "translateX(5px)" },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 10,
                left: 12,
                right: 12,
                height: "2px",
                bgcolor: palette.primary.main,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.35s ease",
              },
              "&:hover::after": { transform: "scaleX(1)" },
            }}
          >
            {/* Background image */}
            <Box
              className="tile-img"
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${tile.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.55s ease",
              }}
            />
            {/* Gradient overlay */}
            <Box
              className="tile-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(20,15,12,0.84) 0%, rgba(20,15,12,0.42) 52%, rgba(20,15,12,0.08) 100%)",
                transition: "background 0.3s ease",
              }}
            />
            <Box
              className="tile-frame"
              sx={{
                position: "absolute",
                inset: 12,
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 1.5,
                opacity: 0.7,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            />
            {/* Text */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
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
                  bgcolor: "rgba(36, 58, 125, 0.72)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.16em",
                  mb: 0.9,
                  px: 1,
                  py: 0.35,
                  borderRadius: 999,
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
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: "1.08rem", sm: "1.15rem", md: "1.22rem" },
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    lineHeight: 1.2,
                    textShadow: "0 3px 14px rgba(0,0,0,0.35)",
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
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80"
                alt="Corrado's Restaurant interior"
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
            {featuredCategories.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  component={RouterLink}
                  to="/menus"
                  sx={{
                    textDecoration: "none",
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      cat.id === "appetizers"
                        ? "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80"
                        : cat.id === "pasta"
                          ? "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80"
                          : cat.id === "pizza"
                            ? "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
                            : "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80"
                    }
                    alt={cat.name}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: palette.charcoal }}
                    >
                      {cat.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, mt: 0.5 }}
                    >
                      {cat.items.length} items
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
                        label={special.day}
                        size="small"
                        sx={{
                          bgcolor: palette.primary.main,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                      {special.badge && (
                        <Chip
                          label={special.badge}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: palette.gold,
                            color: palette.gold,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
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
                    <Typography
                      variant="h6"
                      sx={{
                        color: palette.primary.main,
                        fontWeight: 700,
                        mt: "auto",
                      }}
                    >
                      {special.price}
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
          backgroundImage:
            "url(https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80)",
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
              {familyMeals.slice(0, 3).map((meal) => (
                <Grid key={meal.id} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{ height: "100%", bgcolor: "rgba(255,255,255,0.95)" }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
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
                        {meal.price}
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
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80"
                alt="Private event at Corrado's"
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
                  <CardContent sx={{ p: 3 }}>
                    <Chip
                      label={event.category.replace("-", " ")}
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
                      {event.date} &bull; {event.time}
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
            {[
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
              "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
            ].map((src, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Box
                  component="img"
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
                {/* TODO: Replace href with actual App Store URL when available */}
                <Button
                  variant="contained"
                  href="#"
                  startIcon={<AppleIcon />}
                  sx={{
                    bgcolor: "#000",
                    color: "#fff",
                    px: 3,
                    py: 1.2,
                    "&:hover": { bgcolor: "#333" },
                    textTransform: "none",
                    fontSize: "0.85rem",
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
                      Download on the
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
                {/* TODO: Replace href with actual Google Play URL when available */}
                <Button
                  variant="contained"
                  href="#"
                  startIcon={<ShopIcon />}
                  sx={{
                    bgcolor: "#000",
                    color: "#fff",
                    px: 3,
                    py: 1.2,
                    "&:hover": { bgcolor: "#333" },
                    textTransform: "none",
                    fontSize: "0.85rem",
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
                      GET IT ON
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
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80"
                    alt="App preview"
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
                icon: <LocalDiningIcon />,
                title: "Authentic Italian",
                text: "Traditional recipes with the freshest ingredients",
              },
              {
                icon: <GroupsIcon />,
                title: "Family Dining",
                text: "Warm, welcoming atmosphere for the whole family",
              },
              {
                icon: <CelebrationIcon />,
                title: "Private Events",
                text: "Customizable party and catering packages",
              },
              {
                icon: <LiquorIcon />,
                title: "Extensive Wine List",
                text: "Curated Italian and international wines",
              },
              {
                icon: <DeckIcon />,
                title: "Beautiful Patio",
                text: "Enjoy outdoor dining in the warmer months",
              },
              {
                icon: <ChildCareIcon />,
                title: "Kids' Menu",
                text: "Child-friendly options the little ones will love",
              },
              {
                icon: <WifiIcon />,
                title: "Free WiFi",
                text: "Stay connected while you dine",
              },
              {
                icon: <LocalParkingIcon />,
                title: "Free Parking",
                text: "Convenient parking for all guests",
              },
              {
                icon: <AccessibleIcon />,
                title: "Wheelchair Accessible",
                text: "Fully accessible dining space",
              },
            ].map((feature, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 4 }}>
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
        <Container>
          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid key={t.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Rating
                      value={t.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 1.5 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        fontStyle: "italic",
                        lineHeight: 1.7,
                        mb: 2,
                      }}
                    >
                      "{t.text}"
                    </Typography>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CONTACT STRIP ─── */}
    </>
  );
}
