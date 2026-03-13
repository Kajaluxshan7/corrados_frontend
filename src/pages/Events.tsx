import { useState } from 'react';
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
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { PageHero } from '../components';
import { events } from '../data';
import { palette } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";

const categories = [
  { label: "All Events", value: "all" },
  { label: "Sports", value: "sports" },
  { label: "Live Music", value: "live-music" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Private", value: "private" },
  { label: "Community", value: "community" },
];

const categoryColors: Record<string, string> = {
  sports: "#1565C0",
  "live-music": "#6A1B9A",
  seasonal: palette.primary.main,
  private: palette.gold,
  community: palette.secondary.main,
};

const eventImages: Record<string, string> = {
  'live-jazz-friday': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
  'wine-tasting': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  'nhl-playoffs': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
  'mothers-day': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'private-event': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
  'trivia-night': 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
  'euro-2026': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  'kids-cooking': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
};

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? events
      : events.filter((e) => e.category === activeTab);

  return (
    <>
      <PageHero
        title="Events at Corrado's"
        subtitle="Live music, sports nights, private celebrations, and community gatherings — there's always something happening."
        backgroundImage="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
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
                    height: '100%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
                    },
                    '&:hover img': { transform: 'scale(1.06)' },
                    bgcolor: '#fff',
                  }}
                >
                  {/* Image */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: 180, md: 200 } }}>
                    <Box
                      component="img"
                      src={eventImages[event.id]}
                      alt={event.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />
                    <Chip
                      label={event.category.replace("-", " ")}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: categoryColors[event.category] || palette.charcoal,
                        color: '#fff',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  {/* Content */}
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.2 }}>
                      {formatAmpersand(event.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.primary.main, fontWeight: 600, mb: 1.5, fontSize: '0.82rem' }}
                    >
                      {event.date} &bull; {event.time}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        lineHeight: 1.7,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" sx={{ color: palette.text.secondary }}>
                No events in this category right now. Check back soon!
              </Typography>
            </Box>
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
