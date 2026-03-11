import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHero } from '../components';
import { events } from '../data';
import { palette } from '../theme';

const categories = [
  { label: 'All Events', value: 'all' },
  { label: 'Sports', value: 'sports' },
  { label: 'Live Music', value: 'live-music' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Private', value: 'private' },
  { label: 'Community', value: 'community' },
];

const categoryColors: Record<string, string> = {
  sports: '#1565C0',
  'live-music': '#6A1B9A',
  seasonal: palette.primary.main,
  private: palette.gold,
  community: palette.secondary.main,
};

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? events : events.filter((e) => e.category === activeTab);

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
          <Box sx={{ mb: 5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { fontSize: '0.8rem', minWidth: 'auto', px: 2 },
                '& .Mui-selected': { color: `${palette.primary.main} !important` },
                '& .MuiTabs-indicator': { backgroundColor: palette.primary.main },
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
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Chip
                      label={event.category.replace('-', ' ')}
                      size="small"
                      sx={{
                        mb: 2,
                        alignSelf: 'flex-start',
                        bgcolor: categoryColors[event.category] || palette.charcoal,
                        color: '#fff',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.primary.main, fontWeight: 600, mb: 1.5 }}
                    >
                      {event.date} &bull; {event.time}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, lineHeight: 1.7, flex: 1 }}
                    >
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
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
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Planning a Private Event?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: palette.text.secondary, mb: 3, maxWidth: 550, mx: 'auto' }}
            >
              From intimate dinners to large celebrations, we can customize any event to your needs.
              Contact us to get started.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
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
