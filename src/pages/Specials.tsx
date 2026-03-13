import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { PageHero } from '../components';
import { specials, businessInfo } from '../data';
import { palette } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";

const specialImages: Record<string, string> = {
  'monday-pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
  'tuesday-pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'wednesday-wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80',
  'thursday-wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  'friday-seafood': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80',
  'weekend-brunch': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'lunch-combo': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'happy-hour': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
};

export default function Specials() {
  return (
    <>
      <PageHero
        title="Daily Specials"
        subtitle="Great food at even better prices — something new every day of the week."
        backgroundImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={3}>
            {specials.map((special) => (
              <Grid key={special.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    minHeight: { xs: 320, md: 380 },
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                    },
                    '&:hover img': { transform: 'scale(1.06)' },
                  }}
                >
                  <Box
                    component="img"
                    src={specialImages[special.id]}
                    alt={special.title}
                    sx={{
                      position: 'absolute',
                      inset: 0,
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
                      background: 'linear-gradient(180deg, rgba(20,15,12,0.08) 0%, rgba(20,15,12,0.55) 45%, rgba(20,15,12,0.92) 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
                      <Chip
                        label={special.day}
                        size="small"
                        sx={{ bgcolor: palette.primary.main, color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
                      />
                      {special.badge && (
                        <Chip
                          label={special.badge}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
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
                        sx={{ color: palette.gold, letterSpacing: '0.16em', fontSize: '0.6rem' }}
                      >
                        Weekly Feature
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#fff',
                          fontWeight: 700,
                          mt: 0.3,
                          lineHeight: 1.15,
                          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                        }}
                      >
                        {formatAmpersand(special.title)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.82)',
                          mt: 0.8,
                          lineHeight: 1.55,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {special.description}
                      </Typography>
                      <Typography variant="h6" sx={{ color: palette.gold, fontWeight: 700, mt: 1.25 }}>
                        {special.price}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

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
