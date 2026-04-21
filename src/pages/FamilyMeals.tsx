import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { PageHero } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';
import { useSiteImages } from '../contexts/SiteImagesContext';
import { useWsRefresh, WsEvent } from '../contexts/WebSocketContext';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  fetchFamilyMeals,
  type ApiFamilyMeal,
} from '../services/api';
import { resolveImageUrl } from '../config/api';

// Fallback images per meal type
const FALLBACK_IMAGES: Record<string, string> = {
  combo: '/restaurant/family-meal-takeout.jpeg',
  daily_special: '/restaurant/shrimp-fettuccine.jpeg',
};

// Site-image keys for admin-managed meal card images
const MEAL_IMAGE_KEYS: Record<string, string> = {
  'Family Dinner Combo #1': 'family_meal_classic_italian',
  'Family Dinner Combo #2': 'family_meal_pizza_party',
  'Family Dinner Combo #3': 'family_meal_sunday_feast',
  'Family Dinner Combo #4': 'family_meal_date_night',
};

const AVAILABILITY_LABELS: Record<string, string> = {
  dine_in: 'Dine In',
  take_out: 'Take Out',
  delivery: 'Delivery',
};

function MealCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={180} />
      <CardContent>
        <Skeleton height={32} width="60%" sx={{ mb: 1 }} />
        <Skeleton height={24} width="30%" sx={{ mb: 2 }} />
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} width="80%" />
      </CardContent>
    </Card>
  );
}

function MealCard({
  meal,
  getImage,
}: {
  meal: ApiFamilyMeal;
  getImage: (key: string, fallback: string) => string;
}) {
  const siteImageKey = MEAL_IMAGE_KEYS[meal.name];
  const imageUrl =
    meal.imageUrls.length > 0
      ? resolveImageUrl(meal.imageUrls[0])
      : siteImageKey
        ? getImage(siteImageKey, FALLBACK_IMAGES[meal.mealType])
        : FALLBACK_IMAGES[meal.mealType];

  const priceDisplay =
    Number(meal.basePrice) === 0
      ? meal.priceLabel
      : `$${Number(meal.basePrice).toFixed(2)}${meal.priceLabel}`;

  const availableAddons = meal.addons.filter((a) => a.isAvailable);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        },
        '&:hover img': { transform: 'scale(1.06)' },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: { xs: 180, md: 200 },
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={meal.name}
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
            background:
              'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />
        {/* Availability chips */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            display: 'flex',
            gap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          {meal.availableFor.map((a) => (
            <Chip
              key={a}
              label={AVAILABILITY_LABELS[a] ?? a}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '0.65rem',
                height: 20,
              }}
            />
          ))}
        </Box>
      </Box>

      <CardContent
        sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Name + serves */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
            {meal.name}
          </Typography>
          <Chip
            label={`Serves ${meal.serves}`}
            size="small"
            sx={{
              bgcolor: palette.secondary.main,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.7rem',
              ml: 1,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Price */}
        <Typography
          variant="h4"
          sx={{ color: palette.primary.main, fontWeight: 700, mb: 2 }}
        >
          {priceDisplay}
        </Typography>

        {/* Description */}
        {meal.description && (
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.7 }}
          >
            {meal.description}
          </Typography>
        )}

        {/* Included items */}
        {meal.items.length > 0 && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontSize: '0.8rem', color: palette.charcoal }}
            >
              INCLUDES:
            </Typography>
            <List dense sx={{ flex: 1 }}>
              {meal.items.map((item, idx) => (
                <ListItem key={idx} disableGutters sx={{ py: 0.3 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon
                      sx={{ fontSize: 16, color: palette.secondary.main }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: palette.text.secondary,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {/* Add-ons */}
        {availableAddons.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontSize: '0.75rem', color: palette.charcoal }}
            >
              ADD-ONS:
            </Typography>
            {availableAddons.map((addon) => (
              <Box
                key={addon.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AddCircleOutlineIcon
                    sx={{ fontSize: 13, color: palette.text.secondary }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.78rem' }}
                  >
                    {addon.name}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: palette.primary.main,
                  }}
                >
                  +${Number(addon.price).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function FamilyMeals() {
  usePageMeta({
    title: 'Family Meals | Italian Takeout Packages Whitby',
    description:
      "Feed the whole family with Corrado's ready-to-enjoy family meal packages. Classic Italian dinners, pizza party packs, Sunday feasts & daily specials — generous portions, great value.",
    ogImage: '/restaurant/family-meal-takeout.jpeg',
  });

  const { getImage } = useSiteImages();
  const [meals, setMeals] = useState<ApiFamilyMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      const data = await fetchFamilyMeals();
      setMeals(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useWsRefresh(WsEvent.FAMILY_MEAL_UPDATED, load);

  const combos = meals.filter((m) => m.mealType === 'combo');
  const dailySpecials = meals.filter((m) => m.mealType === 'daily_special');

  return (
    <>
      <PageHero
        title="Family Meals"
        subtitle="Complete meal packages for the whole family — ready to enjoy at home or at our table."
        backgroundImage={getImage(
          'hero_family_meals',
          '/restaurant/family-meal-takeout.jpeg',
        )}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          {error && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={load}>
                  Retry
                </Button>
              }
              sx={{ mb: 4 }}
            >
              Unable to load family meals. Please try again.
            </Alert>
          )}

          {/* ─── Family Combo Packages ─── */}
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <DinnerDiningIcon sx={{ color: palette.primary.main, fontSize: 32 }} />
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: palette.secondary.main, fontWeight: 700 }}
                >
                  For the Whole Family
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Family Combo Packages
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, md: 6 }}>
                      <MealCardSkeleton />
                    </Grid>
                  ))
                : combos.map((meal) => (
                    <Grid key={meal.id} size={{ xs: 12, md: 6 }}>
                      <MealCard meal={meal} getImage={getImage} />
                    </Grid>
                  ))}
            </Grid>

            {!loading && combos.length === 0 && !error && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Family combo packages are being updated — check back soon.
              </Typography>
            )}
          </Box>

          {/* ─── Daily & Weekly Specials ─── */}
          {(loading || dailySpecials.length > 0) && (
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <LocalOfferIcon sx={{ color: palette.primary.main, fontSize: 32 }} />
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: palette.secondary.main, fontWeight: 700 }}
                  >
                    Available Every Week
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Daily &amp; Weekly Specials
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MealCardSkeleton />
                      </Grid>
                    ))
                  : dailySpecials.map((meal) => (
                      <Grid key={meal.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MealCard meal={meal} getImage={getImage} />
                      </Grid>
                    ))}
              </Grid>
            </Box>
          )}

          {/* ─── Order CTA ─── */}
          <Box
            sx={{
              mt: 4,
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
              textAlign: 'center',
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
              Order Your Family Meal Today
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
              Available for dine-in, takeout, and delivery. Order online or call
              us to place your order.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
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
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component="a"
                href={`tel:${businessInfo.phone}`}
              >
                Call {businessInfo.phone}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
