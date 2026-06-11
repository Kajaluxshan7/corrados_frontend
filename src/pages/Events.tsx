import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingOrbs, SplitWordReveal, TiltCard } from "../components";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { Link as RouterLink } from "react-router-dom";
import { PageHero, CardGridSkeleton, EmptyState } from "../components";
import { palette, fonts } from "../theme";
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
  startDate: Date;
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
    startDate: new Date(ev.eventStartDate),
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
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

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
          "/restaurant/events-hero.png",
        )}
        kenBurns
        parallax
        overlay={0.3}
        titleSx={{
          background: "linear-gradient(135deg, #FFF 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))",
        }}
      />

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          {loading && <CardGridSkeleton count={6} columns={{ xs: 12, sm: 6, md: 4 }} imageHeight={200} />}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && (
            <>
              {/* Custom Animated Category Filter Pills */}
              <Box
                sx={{
                  mb: 6,
                  display: "flex",
                  gap: 1.5,
                  overflowX: "auto",
                  pb: 1.5,
                  "&::-webkit-scrollbar": {
                    height: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0,0,0,0.03)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: "2px",
                  },
                }}
              >
                {EVENT_CATEGORIES.map((cat) => {
                  const active = activeTab === cat.value;
                  return (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab(cat.value)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        padding: "10px 22px",
                        borderRadius: "9999px",
                        border: "1px solid",
                        borderColor: active ? "transparent" : palette.warmGray,
                        color: active ? "#fff" : palette.text.secondary,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        backgroundColor: "transparent",
                        fontFamily: fonts.body,
                        outline: "none",
                      }}
                    >
                      <span style={{ position: "relative", zIndex: 2 }}>{cat.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeEventPill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: palette.primary.main,
                            borderRadius: "9999px",
                            zIndex: 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </Box>

              {/* Event Cards Grid */}
              <Grid
                container
                spacing={4}
                sx={{
                  "&:hover .event-card-tile": {
                    opacity: 0.65,
                    filter: "grayscale(20%) blur(0.3px)",
                  },
                  "& .event-card-tile:hover": {
                    opacity: 1,
                    filter: "none",
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((event, i) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={i}
                      hoveredCardIndex={hoveredCardIndex}
                      setHoveredCardIndex={setHoveredCardIndex}
                    />
                  ))}
                </AnimatePresence>
              </Grid>

              {filtered.length === 0 && !loading && (
                <EmptyState
                  icon={<EventBusyOutlinedIcon />}
                  title="No events here just yet"
                  description="There's nothing scheduled in this category right now — check back soon, or get in touch about hosting your own."
                  action={{ label: "Plan a Private Event", to: "/contact" }}
                />
              )}
            </>
          )}

          {/* Private event glassmorphism CTA */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            sx={{
              mt: 10,
              py: { xs: 6, md: 8 },
              px: { xs: 4, md: 6 },
              background: "linear-gradient(135deg, #FAF0ED 0%, #FFFDFD 50%, #FAF0ED 100%)", // Premium light blush gradient
              border: `1px solid rgba(190, 89, 83, 0.12)`, // Subtle brand red border
              borderRadius: "16px",
              textAlign: "center",
              color: palette.charcoal,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 48px rgba(190, 89, 83, 0.08)",
            }}
          >
            {/* Soft subtle glowing orbs, opacity lowered to 0.06 for light theme */}
            <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  fontFamily: fonts.display,
                  color: palette.primary.dark,
                  letterSpacing: "-0.01em",
                }}
              >
                <SplitWordReveal text="Planning a Private Event?" delay={0.05} stagger={0.06} style={{ color: palette.primary.dark }} />
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: palette.text.secondary,
                  mb: 4,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.7,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                }}
              >
                From intimate family dinners and bridal showers to large corporate gatherings, 
                we customize every menu and detail to make your celebration unforgettable.
              </Typography>

              {/* Event Types Grid/Tags */}
              <Box 
                sx={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  justifyContent: "center", 
                  gap: 1.5, 
                  mb: 5,
                  maxWidth: 500,
                  mx: "auto"
                }}
              >
                {["Corporate Events", "Bridal Showers", "Rehearsal Dinners", "Birthday Bashes", "Family Gatherings"].map((type) => (
                  <Box
                    key={type}
                    sx={{
                      px: 2,
                      py: 0.75,
                      bgcolor: "rgba(190, 89, 83, 0.04)",
                      border: "1px solid rgba(190, 89, 83, 0.12)",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: palette.primary.main,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {type}
                  </Box>
                ))}
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2.5}
                justifyContent="center"
                alignItems="center"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/party-menus"
                    size="large"
                    sx={{
                      bgcolor: palette.primary.main,
                      color: "#fff",
                      fontWeight: 600,
                      px: 4,
                      py: 1.6,
                      borderRadius: "8px",
                      textTransform: "none",
                      boxShadow: `0 6px 16px rgba(190, 89, 83, 0.2)`,
                      "&:hover": {
                        bgcolor: palette.primary.dark,
                        boxShadow: `0 10px 24px rgba(190, 89, 83, 0.3)`,
                      },
                    }}
                  >
                    View Party Packages
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/contact"
                    size="large"
                    sx={{
                      borderColor: "rgba(190, 89, 83, 0.3)",
                      color: palette.primary.main,
                      fontWeight: 600,
                      px: 4,
                      py: 1.6,
                      borderRadius: "8px",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: palette.primary.dark,
                        bgcolor: "rgba(190, 89, 83, 0.04)",
                      },
                    }}
                  >
                    Contact Coordinator
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventCard Subcomponent
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({
  event,
  index,
  hoveredCardIndex,
  setHoveredCardIndex,
}: {
  event: NormalizedEvent;
  index: number;
  hoveredCardIndex: number | null;
  setHoveredCardIndex: (i: number | null) => void;
}) {
  const isHovered = hoveredCardIndex === index;

  let month = "JUN";
  let day = "12";
  try {
    const start = event.startDate;
    if (!isNaN(start.getTime())) {
      month = start.toLocaleDateString("en-US", { month: "short", timeZone: TZ }).toUpperCase();
      day = start.toLocaleDateString("en-US", { day: "2-digit", timeZone: TZ });
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }} className="event-card-tile" style={{ transition: "opacity 0.4s ease, filter 0.4s ease" }}>
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ height: "100%" }}
      >
        <TiltCard maxRotate={6}>
          <Box
            onMouseEnter={() => setHoveredCardIndex(index)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            sx={{
              height: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isHovered 
                ? "0 20px 40px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)"
                : "0 4px 20px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.02)",
              transition: "box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              bgcolor: "#fff",
              border: `1px solid ${palette.warmGray}`,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Elegant Floating Ticket-Style Calendar Date Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                width: 58,
                height: 76,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(18, 15, 14, 0.9)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${palette.gold}`,
                borderRadius: "8px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                overflow: "hidden",
              }}
            >
              {/* Upper half: Month */}
              <Box sx={{ pt: 0.75, pb: 0.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: palette.gold, letterSpacing: "0.12em", lineHeight: 1, fontFamily: fonts.display }}>
                  {month}
                </Typography>
              </Box>
              {/* Perforation line */}
              <Box sx={{ width: "100%", borderTop: "1px dashed rgba(201, 169, 110, 0.4)", position: "relative" }}>
                {/* Perforation holes on left and right */}
                <Box sx={{ position: "absolute", left: -4, top: -4, width: 8, height: 8, borderRadius: "50%", bgcolor: "rgba(18,15,14,0.9)" }} />
                <Box sx={{ position: "absolute", right: -4, top: -4, width: 8, height: 8, borderRadius: "50%", bgcolor: "rgba(18,15,14,0.9)" }} />
              </Box>
              {/* Lower half: Day */}
              <Box sx={{ pt: 0.5, pb: 0.75, textAlign: "center", width: "100%" }}>
                <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: fonts.display }}>
                  {day}
                </Typography>
              </Box>
            </Box>

            {/* Event Category Floating Badge (Top-Left) */}
            <Chip
              label={EVENT_TYPE_LABELS[event.category] || event.category}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                bgcolor: EVENT_CATEGORY_COLORS[event.category] || palette.charcoal,
                color: "#fff",
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                borderRadius: "4px",
                height: "22px",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />

            {/* Image Section */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                height: { xs: 190, md: 210 },
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
                  transform: isHovered ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = EVENT_FALLBACK_DEFAULT;
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)",
                }}
              />
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  lineHeight: 1.25,
                  fontSize: "1.2rem",
                  fontFamily: fonts.display,
                  color: palette.charcoal,
                }}
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
                  letterSpacing: "0.01em",
                }}
              >
                {event.dateLabel}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  lineHeight: 1.7,
                  mb: 2.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flexGrow: 1,
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
                  sx={{
                    alignSelf: "flex-start",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    borderColor: palette.primary.main,
                    color: palette.primary.main,
                    borderRadius: "6px",
                    px: 2.5,
                    py: 0.8,
                    textTransform: "none",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 1,
                    transition: "color 0.3s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: palette.primary.main,
                      zIndex: -1,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                    },
                    "&:hover": {
                      color: "#fff",
                      borderColor: palette.primary.main,
                      "&::before": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  Get Tickets
                </Button>
              )}
            </Box>
          </Box>
        </TiltCard>
      </motion.div>
    </Grid>
  );
}

