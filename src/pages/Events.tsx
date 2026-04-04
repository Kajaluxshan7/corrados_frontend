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
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";

// Map backend EventType enum values to display labels and colors
const EVENT_TYPE_LABELS: Record<string, string> = {
  live_music: "Live Music",
  sports_viewing: "Sports Viewing",
  trivia_night: "Trivia Night",
  karaoke: "Karaoke",
  private_party: "Private Party",
  special_event: "Special Event",
};

const categoryColors: Record<string, string> = {
  live_music: "#6A1B9A",
  sports_viewing: "#1565C0",
  trivia_night: palette.secondary.main,
  karaoke: palette.wine,
  private_party: palette.gold,
  special_event: palette.primary.main,
};

const categories = [
  { label: "All Events", value: "all" },
  { label: "Live Music", value: "live_music" },
  { label: "Sports Viewing", value: "sports_viewing" },
  { label: "Trivia Night", value: "trivia_night" },
  { label: "Karaoke", value: "karaoke" },
  { label: "Private Party", value: "private_party" },
  { label: "Special Event", value: "special_event" },
];

// Fallback images per category
const fallbackByCategory: Record<string, string> = {
  live_music:
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
  sports_viewing:
    "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
  special_event:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  private_party:
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
  trivia_night:
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
  karaoke:
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
};
const fallbackDefault =
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80";

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
    : (fallbackByCategory[category] ?? fallbackDefault);
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
        backgroundImage="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80"
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
                  {categories.map((cat) => (
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
                        borderRadius: 1,
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
                              categoryColors[event.category] ||
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
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
              textAlign: "center",
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
              Planning a Private Event?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: palette.text.secondary,
                mb: 3,
                maxWidth: 550,
                mx: "auto",
              }}
            >
              From intimate dinners to large celebrations, we can customize any
              event to your needs. Contact us to get started.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/party-menus"
                size="large"
              >
                View Party Menus
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/contact"
                size="large"
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
