import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { PageHero } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";
import { fetchSpecials, type ApiSpecial } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";
import { useSiteImages } from "../contexts/SiteImagesContext";
import { usePageMeta } from "../hooks/usePageMeta";

// Display labels for backend SpecialType enum
const SPECIAL_TYPE_LABELS: Record<string, string> = {
  daily: "Daily",
  game_time: "Game Time",
  day_time: "Daytime",
  chef: "Chef's Special",
  seasonal: "Seasonal",
};

const categoryColors: Record<string, string> = {
  daily: palette.primary.main,
  game_time: "#1565C0",
  day_time: palette.gold,
  chef: palette.wine,
  seasonal: palette.secondary.main,
};

const categories = [
  { label: "Daily", value: "daily" },
  { label: "Game Time", value: "game_time" },
  { label: "Daytime", value: "day_time" },
  { label: "Chef's Special", value: "chef" },
  { label: "Seasonal", value: "seasonal" },
];

// Fallback images by special type / day
const fallbackByDay: Record<string, string> = {
  monday: "/restaurant/ravioli-mushroom-spinach.jpeg",
  tuesday: "/restaurant/pizza-margherita.jpeg",
  wednesday: "/restaurant/chicken-marsala.jpeg",
  thursday: "/restaurant/seafood-mussels.jpeg",
  friday: "/restaurant/spaghetti-bolognese.jpeg",
  saturday: "/restaurant/penne-primavera.jpeg",
  sunday: "/restaurant/beef-short-rib.jpeg",
};
const fallbackDefault = "/restaurant/gnocchi-tomato-cream.jpeg";

function getSpecialImage(special: ApiSpecial): string {
  if (special.imageUrls?.length) return resolveImageUrl(special.imageUrls[0]);
  if (special.dayOfWeek) {
    return fallbackByDay[special.dayOfWeek.toLowerCase()] ?? fallbackDefault;
  }
  return fallbackDefault;
}

function getSpecialDayLabel(special: ApiSpecial): string {
  if (special.dayOfWeek) {
    return (
      special.dayOfWeek.charAt(0).toUpperCase() + special.dayOfWeek.slice(1)
    );
  }
  const typeMap: Record<string, string> = {
    daily: "Daily",
    game_time: "Game Time",
    day_time: "Daytime",
    chef: "Chef's Special",
    seasonal: "Seasonal",
  };
  return typeMap[special.type] ?? "Special";
}

export default function Specials() {
  usePageMeta({
    title: "Daily Specials | Deals at Corrado's Whitby",
    description: "Don't miss Corrado's rotating daily specials — chef's features, game-time deals, daytime offers, and seasonal highlights. Great Italian food at even better prices, every day of the week.",
    ogImage: "/restaurant/ravioli-mushroom-spinach.jpeg",
  });
  const { getImage } = useSiteImages();
  const [specials, setSpecials] = useState<ApiSpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("daily");

  const loadSpecials = useCallback(() => {
    fetchSpecials()
      .then((data) => {
        const sorted = data.sort((a, b) => a.sortOrder - b.sortOrder);
        setSpecials(sorted);
        setError(null);
        // Auto-select first tab that has data if current tab is empty
        setActiveTab((prev) => {
          const hasCurrentTab = sorted.some((s) => s.type === prev);
          if (hasCurrentTab) return prev;
          const firstType = categories.find((cat) =>
            sorted.some((s) => s.type === cat.value),
          );
          return firstType?.value ?? prev;
        });
      })
      .catch(() => {
        setError("Unable to load specials. Please try again later.");
        setSpecials([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSpecials();
  }, [loadSpecials]);

  // Real-time updates via WebSocket
  useWsRefresh(WsEvent.SPECIAL_CREATED, loadSpecials);
  useWsRefresh(WsEvent.SPECIAL_UPDATED, loadSpecials);
  useWsRefresh(WsEvent.SPECIAL_DELETED, loadSpecials);

  const filtered = specials.filter((s) => s.type === activeTab);

  return (
    <>
      <PageHero
        title="Daily Specials"
        subtitle="Great food at even better prices — something new every day of the week."
        backgroundImage={getImage(
          "hero_specials",
          "/restaurant/penne-primavera.jpeg",
        )}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {/* Category filter */}
              <Box sx={{ mb: 5, borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      fontSize: "0.8rem",
                      minWidth: "auto",
                      px: 2,
                    },
                    "& .Mui-selected": {
                      color: `${palette.primary.main} !important`,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: palette.primary.main,
                    },
                  }}
                >
                  {categories.map((cat) => (
                    <Tab key={cat.value} label={cat.label} value={cat.value} />
                  ))}
                </Tabs>
              </Box>

              {filtered.length === 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    py: 10,
                    color: palette.text.secondary,
                  }}
                >
                  No active specials in this category. Check back soon!
                </Typography>
              )}

              {filtered.length > 0 && (
                <Grid container spacing={3}>
                  {filtered.map((special) => (
                    <Grid key={special.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box
                        sx={{
                          position: "relative",
                          height: "100%",
                          minHeight: { xs: 320, md: 380 },
                          borderRadius: 1,
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                          transition:
                            "transform 0.35s ease, box-shadow 0.35s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                          },
                          "&:hover img": { transform: "scale(1.06)" },
                        }}
                      >
                        <Box
                          component="img"
                          src={getSpecialImage(special)}
                          alt={special.title}
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              fallbackDefault;
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(180deg, rgba(20,15,12,0.08) 0%, rgba(20,15,12,0.55) 45%, rgba(20,15,12,0.92) 100%)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: { xs: 2, md: 2.5 },
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
                              label={
                                SPECIAL_TYPE_LABELS[special.type] ||
                                getSpecialDayLabel(special)
                              }
                              size="small"
                              sx={{
                                bgcolor:
                                  categoryColors[special.type] ||
                                  palette.primary.main,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="overline"
                              sx={{
                                color: palette.gold,
                                letterSpacing: "0.16em",
                                fontSize: "0.6rem",
                              }}
                            >
                              {special.type === "seasonal"
                                ? "Seasonal Special"
                                : "Weekly Feature"}
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                color: "#fff",
                                fontWeight: 700,
                                mt: 0.3,
                                lineHeight: 1.15,
                                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                              }}
                            >
                              {formatAmpersand(special.title)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255,255,255,0.82)",
                                mt: 0.8,
                                lineHeight: 1.55,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {special.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {/* Order CTA */}
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Don't Miss Out!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: palette.text.secondary,
                mb: 3,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              These specials are available for dine-in, takeout, and delivery.
              Order now and enjoy.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={businessInfo.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ px: 5 }}
            >
              Order Now
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
