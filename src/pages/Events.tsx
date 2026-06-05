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
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PageHero } from "../components";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";
import { fetchEvents, type ApiEvent } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  EVENT_TYPE_LABELS,
  EVENT_CATEGORY_COLORS,
  EVENT_CATEGORIES,
  EVENT_FALLBACK_BY_CATEGORY,
  EVENT_FALLBACK_DEFAULT,
} from "../constants/menus";

const TZ = "America/Toronto";

function isSameDay(s: Date, e: Date): boolean {
  const fmt = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });
  return fmt(s) === fmt(e);
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);

  const dateOpts: Intl.DateTimeFormatOptions = {
    timeZone: TZ,
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  };

  const startDate = s.toLocaleDateString("en-CA", dateOpts);
  const startTime = s.toLocaleTimeString("en-CA", timeOpts);
  const endTime = e.toLocaleTimeString("en-CA", timeOpts);

  if (isSameDay(s, e)) {
    return `${startDate} · ${startTime} – ${endTime}`;
  }

  const endDate = e.toLocaleDateString("en-CA", dateOpts);
  return `${startDate} ${startTime} – ${endDate} ${endTime}`;
}

interface NormalizedEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  dateLabel: string;
  imageUrl: string;
  ticketLink: string | null;
}

function normalizeEvent(ev: ApiEvent): NormalizedEvent {
  const category = ev.type;
  const imageUrl = ev.imageUrls?.length
    ? resolveImageUrl(ev.imageUrls[0])
    : (EVENT_FALLBACK_BY_CATEGORY[category] ?? EVENT_FALLBACK_DEFAULT);
  return {
    id: ev.id,
    title: ev.title,
    description: ev.description,
    category,
    dateLabel: formatDateRange(ev.eventStartDate, ev.eventEndDate),
    imageUrl,
    ticketLink: ev.ticketLink,
  };
}

export default function Events() {
  usePageMeta({
    title: "Events | Live Music, Trivia & Sports in Whitby",
    description: "See what's on at Corrado's Restaurant in Whitby — live music nights, trivia, NHL & sports viewing parties, karaoke, private events, and seasonal celebrations. There's always something exciting happening.",
    ogImage: "/orrdos/interior-main-dining.jpg",
  });
  const { getImage } = useSiteImages();
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadEvents = useCallback(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data.map(normalizeEvent));
        setError(null);
      })
      .catch(() => {
        setError("Unable to load events. Please try again later.");
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Real-time updates via WebSocket
  useWsRefresh(WsEvent.EVENT_CREATED, loadEvents);
  useWsRefresh(WsEvent.EVENT_UPDATED, loadEvents);
  useWsRefresh(WsEvent.EVENT_DELETED, loadEvents);

  const filtered =
    activeTab === "all" ? events : events.filter((e) => e.category === activeTab);

  return (
    <>
      <PageHero
        title="Events at Corrado's"
        subtitle="Live music, sports nights, private celebrations, and community gatherings — there's always something happening."
        backgroundImage={getImage(
          "hero_events",
          "/restaurant/catering-dessert-display.jpeg",
        )}
      />

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
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

          {!loading && (
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
                  {EVENT_CATEGORIES.map((cat) => (
                    <Tab key={cat.value} label={cat.label} value={cat.value} />
                  ))}
                </Tabs>
              </Box>

              <Grid container spacing={3}>
                {filtered.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transition:
                          "transform 0.35s ease, box-shadow 0.35s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                        },
                        "&:hover img": { transform: "scale(1.06)" },
                        bgcolor: "#fff",
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          height: { xs: 180, md: 200 },
                        }}
                      >
                        <Box
                          component="img"
                          src={event.imageUrl}
                          alt={event.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              EVENT_FALLBACK_DEFAULT;
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)",
                          }}
                        />
                        <Chip
                          label={
                            EVENT_TYPE_LABELS[event.category] || event.category
                          }
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            bgcolor:
                              EVENT_CATEGORY_COLORS[event.category] ||
                              palette.charcoal,
                            color: "#fff",
                            textTransform: "capitalize",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      {/* Content */}
                      <Box sx={{ p: 2.5 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 0.5, lineHeight: 1.2 }}
                        >
                          {formatAmpersand(event.title)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: palette.primary.main,
                            fontWeight: 600,
                            mb: 1.5,
                            fontSize: "0.82rem",
                          }}
                        >
                          {event.dateLabel}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: palette.text.secondary,
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {event.description}
                        </Typography>
                        {event.ticketLink && (
                          <Button
                            href={event.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1.5 }}
                          >
                            Get Tickets
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {filtered.length === 0 && !loading && (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: palette.text.secondary }}
                  >
                    No events in this category right now. Check back soon!
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Private event CTA */}
          <Box
            sx={{
              mt: 8,
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 6 },
              bgcolor: palette.charcoal,
              borderRadius: 3,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 65%)",
            }} />
            <Box sx={{ width: 48, height: 3, bgcolor: palette.gold, mx: "auto", mb: 3, borderRadius: 2 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: "1.5rem", md: "2rem" },
                color: "#fff",
                position: "relative",
              }}
            >
              Planning a Private Event?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.65)",
                mb: 4,
                maxWidth: 550,
                mx: "auto",
                position: "relative",
              }}
            >
              From intimate dinners to large celebrations, we can customize any
              event to your needs. Contact us to get started.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ position: "relative" }}
            >
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/party-menus"
                size="large"
                sx={{ px: 4 }}
              >
                View Party Menus
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/contact"
                size="large"
                sx={{
                  px: 4,
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "#fff",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
