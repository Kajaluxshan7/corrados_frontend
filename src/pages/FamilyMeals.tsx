import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingOrbs, GrainOverlay } from '../components';
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
  Dialog,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import GroupIcon from '@mui/icons-material/Group';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PageHero, EmptyState } from '../components';
import { businessInfo } from '../data';
import { palette, fonts } from '../theme';
import { useSiteImages } from '../hooks/useSiteImages';
import { useWsRefresh } from '../hooks/useWebSocket';
import { WsEvent } from '../contexts/WebSocketContext';
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



// Categories filter options
const CATEGORY_TABS = [
  { value: 'all', label: 'All Packages' },
  { value: 'combo', label: 'Feast Combos' },
  { value: 'daily_special', label: 'Weekly Specials' },
] as const;

function MealCardSkeleton() {
  return (
    <Card sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 3 }}>
        <Skeleton height={36} width="70%" sx={{ mb: 1.5 }} />
        <Skeleton height={28} width="40%" sx={{ mb: 3 }} />
        <Skeleton height={20} sx={{ mb: 1 }} />
        <Skeleton height={20} sx={{ mb: 1 }} />
        <Skeleton height={20} width="85%" sx={{ mb: 2 }} />
        <Divider sx={{ my: 2 }} />
        <Skeleton height={40} width="100%" sx={{ borderRadius: '8px' }} />
      </CardContent>
    </Card>
  );
}

// ─── Compact Visual Showcard for Showcase Grid ─────────────────────────────────
function Showcard({
  meal,
  getImage,
  onSelect,
}: {
  meal: ApiFamilyMeal;
  getImage: (key: string, fallback: string) => string;
  onSelect: () => void;
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

  return (
    <Box
      onClick={onSelect}
      sx={{
        bgcolor: '#FFFDF9',
        borderRadius: '16px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        boxShadow: '0 4px 16px rgba(45, 41, 38, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '&:hover': {
          borderColor: palette.gold,
          boxShadow: '0 16px 36px rgba(201, 169, 110, 0.18)',
          transform: 'translateY(-6px)',
        },
        '&:hover img': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <GrainOverlay opacity={0.03} />

      {/* Image Header */}
      <Box sx={{ position: 'relative', height: 230, overflow: 'hidden', flexShrink: 0 }}>
        <Box
          component="img"
          src={imageUrl}
          alt={meal.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.92)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))',
          }}
        />

        {/* Badge of category */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            zIndex: 3,
          }}
        >
          <Chip
            label={meal.mealType === 'combo' ? 'FEAST COMBO' : 'WEEKLY SPECIAL'}
            sx={{
              bgcolor: palette.primary.main,
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              height: 22,
            }}
          />
        </Box>
      </Box>

      {/* Card Info */}
      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: fonts.display,
              fontWeight: 800,
              color: palette.charcoal,
              fontSize: '1.35rem',
              lineHeight: 1.25,
              mb: 1,
            }}
          >
            {meal.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <GroupIcon sx={{ color: palette.secondary.main, fontSize: '0.95rem' }} />
            <Typography
              variant="body2"
              sx={{
                color: palette.text.secondary,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              Serves {meal.serves}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 1.5,
            borderTop: '1px dashed rgba(201, 169, 110, 0.25)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: fonts.display,
              color: palette.primary.main,
              fontWeight: 850,
              fontSize: '1.45rem',
            }}
          >
            {priceDisplay}
          </Typography>

          <Button
            size="small"
            endIcon={<KeyboardArrowRightIcon className="btn-arrow" sx={{ fontSize: '1.1rem !important', transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />}
            sx={{
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRadius: '8px',
              borderColor: 'rgba(201, 169, 110, 0.4)',
              color: palette.charcoal,
              px: 2,
              py: 0.75,
              borderWidth: '1px',
              borderStyle: 'solid',
              bgcolor: 'transparent',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&:hover': {
                bgcolor: palette.gold,
                borderColor: palette.gold,
                color: '#fff',
                boxShadow: '0 6px 18px rgba(201, 169, 110, 0.25)',
              },
              '&:hover .btn-arrow': {
                transform: 'translateX(4px)',
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Immersive Details Modal Overlay ────────────────────────────────────────────
function FeastDetailsModal({
  meal,
  open,
  onClose,
  getImage,
}: {
  meal: ApiFamilyMeal | null;
  open: boolean;
  onClose: () => void;
  getImage: (key: string, fallback: string) => string;
}) {
  if (!meal) return null;

  const priceDisplay =
    Number(meal.basePrice) === 0
      ? meal.priceLabel
      : `$${Number(meal.basePrice).toFixed(2)}${meal.priceLabel}`;

  const availableAddons = meal.addons.filter((a) => a.isAvailable);

  const siteImageKey = MEAL_IMAGE_KEYS[meal.name];
  const imageUrl =
    meal.imageUrls.length > 0
      ? resolveImageUrl(meal.imageUrls[0])
      : siteImageKey
        ? getImage(siteImageKey, FALLBACK_IMAGES[meal.mealType])
        : FALLBACK_IMAGES[meal.mealType];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          bgcolor: '#FFFDF9',
          borderRadius: '24px',
          border: `2px solid ${palette.gold}`,
          boxShadow: '0 24px 64px rgba(45, 41, 38, 0.2), inset 0 0 40px rgba(201, 169, 110, 0.06)',
          position: 'relative',
          overflow: 'hidden',
          p: 0,
          margin: { xs: 2, sm: 3 },
          width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)' },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(28, 25, 23, 0.7)',
          },
        },
      }}
    >
      <GrainOverlay opacity={0.03} />

      <IconButton
        onClick={onClose}
        id="close-details-modal"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          color: palette.charcoal,
          bgcolor: 'rgba(255, 253, 249, 0.8)',
          border: '1px solid rgba(201, 169, 110, 0.25)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          '&:hover': {
            bgcolor: palette.gold,
            color: '#fff',
            transform: 'rotate(90deg)',
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Grid container>
        {/* Left Side: Visual Image Panel */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            position: 'relative',
            height: { xs: 240, md: 'auto' },
            minHeight: { md: 520 },
            display: 'flex',
            flexDirection: 'column',
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
              position: 'absolute',
              inset: 0,
              filter: 'brightness(0.9)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: {
                xs: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                md: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
              },
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              mt: 'auto',
              p: 3,
              color: '#fff',
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
            }}
          >
            <Chip
              label={meal.mealType === 'combo' ? 'FEAST COMBO' : 'WEEKLY SPECIAL'}
              size="small"
              sx={{
                bgcolor: palette.primary.main,
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                width: 'fit-content',
                mb: 1,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: '1.65rem',
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {meal.name}
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Detailed Info */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: { xs: 3.5, sm: 4, md: 5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Desktop header */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                mb: 2.5,
                pb: 2,
                borderBottom: `1.5px dashed ${palette.gold}44`,
              }}
            >
              <Chip
                label={meal.mealType === 'combo' ? 'FEAST COMBO' : 'WEEKLY SPECIAL'}
                size="small"
                sx={{
                  bgcolor: palette.primary.main,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  mb: 1.5,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: fonts.display,
                  fontWeight: 800,
                  color: palette.charcoal,
                  fontSize: '1.85rem',
                  lineHeight: 1.2,
                }}
              >
                {meal.name}
              </Typography>
            </Box>

            {/* Capacity + serving info */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon sx={{ color: palette.secondary.main, fontSize: '1.15rem' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: palette.text.secondary,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  Serves {meal.serves}
                </Typography>
              </Stack>
              {meal.availableFor.map((a) => (
                <Chip
                  key={a}
                  label={AVAILABILITY_LABELS[a] ?? a}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(45, 41, 38, 0.06)',
                    color: palette.charcoal,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              ))}
            </Stack>

            {/* Pricing block */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: fonts.display,
                  color: palette.primary.main,
                  fontWeight: 850,
                  fontSize: '1.9rem',
                  lineHeight: 1,
                }}
              >
                {priceDisplay}
              </Typography>
            </Box>

            {meal.description && (
              <Typography
                variant="body1"
                sx={{
                  color: palette.text.secondary,
                  fontFamily: fonts.body,
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  mb: 3,
                  fontStyle: 'italic',
                }}
              >
                {meal.description}
              </Typography>
            )}

            <Divider sx={{ my: 1.5, borderColor: `${palette.gold}33` }} />

            {/* Two Column items */}
            <Grid container spacing={3} sx={{ my: 0.5, flexGrow: 1 }}>
              {meal.items.length > 0 && (
                <Grid size={{ xs: 12, sm: availableAddons.length > 0 ? 6 : 12 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: fonts.display,
                        color: palette.secondary.main,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
                      ⚜ Package Includes
                    </Typography>
                    <List dense disablePadding>
                      {meal.items.map((item, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.5, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 20, mt: 0.25 }}>
                            <CheckCircleIcon sx={{ fontSize: 13, color: palette.secondary.main }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              fontFamily: fonts.body,
                              variant: 'body2',
                              color: palette.charcoal,
                              fontWeight: 600,
                              fontSize: '0.82rem',
                              lineHeight: 1.35,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              )}

              {availableAddons.length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: fonts.display,
                        color: palette.primary.main,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
                      ✚ Upgrades Available
                    </Typography>
                    <Stack spacing={1}>
                      {availableAddons.map((addon) => (
                        <Box
                          key={addon.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderRadius: '8px',
                            border: '1px solid rgba(45, 41, 38, 0.05)',
                            bgcolor: 'rgba(45, 41, 38, 0.02)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, pr: 1 }}>
                            <AddCircleOutlineIcon sx={{ fontSize: 12, color: palette.text.secondary, flexShrink: 0 }} />
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{
                                fontFamily: fonts.body,
                                color: palette.charcoal,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {addon.name}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: fonts.body,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: palette.primary.main,
                              flexShrink: 0,
                            }}
                          >
                            +${Number(addon.price).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* PDFs */}
            {meal.pdfUrls && meal.pdfUrls.length > 0 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${palette.gold}44` }}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  {meal.pdfUrls.map((url, i) => (
                    <Button
                      key={i}
                      component="a"
                      href={resolveImageUrl(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      startIcon={<PictureAsPdfIcon />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 99,
                        color: palette.charcoal,
                        borderColor: 'rgba(201, 169, 110, 0.4)',
                        '&:hover': {
                          borderColor: palette.gold,
                          bgcolor: 'rgba(201, 169, 110, 0.05)',
                        },
                      }}
                    >
                      {meal.pdfUrls.length > 1 ? `View PDF Package ${i + 1}` : 'Download Package PDF'}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 2.5, borderColor: `${palette.gold}33` }} />

            {/* Call to Order online buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingBagOutlinedIcon />}
                id={`modal-order-button-${meal.id}`}
                sx={{
                  bgcolor: palette.primary.main,
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3.5,
                  py: 1.25,
                  borderRadius: '8px',
                  flexGrow: 1,
                  boxShadow: `0 6px 18px rgba(190, 89, 83, 0.2)`,
                  '&:hover': {
                    bgcolor: palette.primary.dark,
                    boxShadow: `0 10px 24px rgba(190, 89, 83, 0.3)`,
                  },
                }}
              >
                Order Now
              </Button>

              <Button
                variant="outlined"
                component="a"
                href={`tel:${businessInfo.phone}`}
                startIcon={<PhoneIcon sx={{ color: '#2D2926' }} />}
                id={`modal-call-button-${meal.id}`}
                sx={{
                  borderColor: 'rgba(45, 41, 38, 0.25)',
                  color: '#2D2926',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3.5,
                  py: 1.25,
                  borderRadius: '8px',
                  flexGrow: 1,
                  '&:hover': {
                    borderColor: '#2D2926',
                    bgcolor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                Call to Order
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  all: "Explore our complete collection of family sharing dinners and weekly specials, prepared fresh for your family table.",
  combo: "Feast Combos: Multi-course traditional Italian feasts designed to serve 4 or more with generous portions.",
  daily_special: "Weekly Specials: Limited-edition culinary creations and seasonal selections curated by our chef.",
};

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
  const [activeCategory, setActiveCategory] = useState<'all' | 'combo' | 'daily_special'>('all');
  const [activeMeal, setActiveMeal] = useState<ApiFamilyMeal | null>(null);

  const load = useCallback(async () => {
    try {
      setError(false);
      const data = await fetchFamilyMeals();
      setMeals(data);
      setActiveMeal(null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useWsRefresh(WsEvent.FAMILY_MEAL_UPDATED, load);

  const filteredMeals = meals.filter((meal) => {
    if (activeCategory === 'all') return true;
    return meal.mealType === activeCategory;
  });

  const handleCategoryChange = (val: 'all' | 'combo' | 'daily_special') => {
    setActiveCategory(val);
    setActiveMeal(null);

    // Smooth scroll to the meals grid header so the user immediately sees the filtered cards
    setTimeout(() => {
      const headerEl = document.getElementById('meals-grid-header-target');
      if (headerEl) {
        headerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <>
      <PageHero
        title="Family Meals"
        subtitle="Complete meal packages for the whole family — ready to enjoy at home or at our table."
        backgroundImage={getImage(
          'hero_family_meals',
          '/restaurant/family-meals-hero-light.png',
        )}
        kenBurns
        parallax
        overlay={0.25}
        titleSx={{
          background: 'linear-gradient(135deg, #FFF 0%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))',
        }}
      />

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs colors={['#BE5953', '#2C5530', '#C9A96E']} count={2} opacity={0.06} blur={90} />

        <Container maxWidth="lg">
          {error && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={load} id="retry-load-button">
                  Retry
                </Button>
              }
              sx={{ mb: 4 }}
            >
              Unable to load family meals. Please try again.
            </Alert>
          )}

          {/* Intro Section Header */}
          <Box id="meals-grid-header-target" sx={{ textAlign: 'center', mb: 6, scrollMarginTop: '100px' }}>
            <Typography
              variant="overline"
              sx={{
                color: palette.secondary.main,
                fontFamily: fonts.display,
                fontWeight: 800,
                letterSpacing: '0.18em',
                fontSize: '0.78rem',
              }}
            >
              For the Whole Family
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: fonts.display,
                fontWeight: 900,
                color: palette.charcoal,
                fontSize: { xs: '2rem', md: '2.8rem' },
                mt: 1,
                mb: 2,
              }}
            >
              Family Combo Packages & Specials
            </Typography>
            <Box sx={{ width: 48, height: 3, bgcolor: palette.gold, mx: 'auto', borderRadius: 2 }} />
          </Box>

          {!loading && meals.length > 0 && (
            <>
              {/* Luxury Minimal Text Toggler */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 8 }}>
                <Stack
                  direction="row"
                  spacing={{ xs: 3, md: 6 }}
                  sx={{
                    position: 'relative',
                    borderBottom: '1px solid rgba(201, 169, 110, 0.25)',
                    pb: 1.5,
                    mb: 2.5,
                  }}
                >
                  {CATEGORY_TABS.map((tab) => {
                    const isActive = activeCategory === tab.value;
                    return (
                      <Button
                        key={tab.value}
                        onClick={() => handleCategoryChange(tab.value)}
                        id={`category-tab-${tab.value}`}
                        sx={{
                          minWidth: 0,
                          p: 0,
                          pb: 0.5,
                          fontSize: { xs: '0.85rem', md: '1.05rem' },
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontFamily: fonts.display,
                          color: isActive ? palette.charcoal : 'rgba(45, 41, 38, 0.45)',
                          transition: 'color 0.3s ease',
                          position: 'relative',
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: palette.charcoal,
                          },
                        }}
                      >
                        {tab.label}
                        {isActive && (
                          <Box
                            component={motion.div}
                            layoutId="activeUnderline"
                            sx={{
                              position: 'absolute',
                              bottom: -13,
                              left: 0,
                              right: 0,
                              height: '3px',
                              bgcolor: palette.gold,
                              borderRadius: '99px',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -2.5,
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                bgcolor: palette.gold,
                                boxShadow: '0 0 8px rgba(201, 169, 110, 0.8)',
                              }}
                            />
                          </Box>
                        )}
                      </Button>
                    );
                  })}
                </Stack>

                {/* Serif description explaining the active category */}
                <AnimatePresence mode="wait">
                  <Typography
                    key={activeCategory}
                    component={motion.p}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                    variant="body1"
                    sx={{
                      fontFamily: fonts.display,
                      fontStyle: 'italic',
                      color: palette.text.secondary,
                      textAlign: 'center',
                      fontSize: { xs: '0.9rem', md: '1.05rem' },
                      maxWidth: '600px',
                      px: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {CATEGORY_DESCRIPTIONS[activeCategory]}
                  </Typography>
                </AnimatePresence>
              </Box>

              {/* Premium Showcase Grid */}
              <Box sx={{ my: 6 }}>
                <Grid container spacing={4}>
                  <AnimatePresence mode="popLayout">
                    {filteredMeals.map((meal, idx) => {
                      return (
                        <Grid
                          key={meal.id}
                          size={{ xs: 12, sm: 6, md: 4 }}
                          component={motion.div}
                          layout
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            delay: idx * 0.05,
                          }}
                        >
                          <Showcard
                            meal={meal}
                            getImage={getImage}
                            onSelect={() => {
                              setActiveMeal(meal);
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </AnimatePresence>
                </Grid>
              </Box>

              {/* Immersive Details Modal */}
              <FeastDetailsModal
                meal={activeMeal}
                open={Boolean(activeMeal)}
                onClose={() => setActiveMeal(null)}
                getImage={getImage}
              />
            </>
          )}

          {/* Skeleton Loaders */}
          {loading && (
            <Grid container spacing={3}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, md: 6 }}>
                  <MealCardSkeleton />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty state */}
          {!loading && filteredMeals.length === 0 && !error && (
            <EmptyState
              icon={<RestaurantOutlinedIcon />}
              title="Family meals are being updated"
              description="We're refreshing our combo packages. In the meantime, you can order any of our dishes online."
              action={{ label: "Order Online", href: businessInfo.orderUrl }}
            />
          )}

          {/* ─── Order CTA Banner ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Box
              sx={{
                mt: 8,
                py: 6,
                px: 4,
                bgcolor: palette.charcoal,
                color: '#fff',
                borderRadius: '20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(45, 41, 38, 0.15)',
              }}
            >
              <FloatingOrbs colors={['#BE5953', '#2C5530', '#C9A96E']} count={2} opacity={0.25} blur={90} />
              <GrainOverlay opacity={0.05} />
              
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: palette.gold,
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    fontSize: '0.72rem',
                    mb: 1,
                    display: 'block',
                  }}
                >
                  Bring Corrado's Home
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: fonts.display,
                    fontWeight: 900,
                    fontSize: { xs: '1.75rem', md: '2.4rem' },
                    color: '#fff',
                    mb: 2,
                  }}
                >
                  Order Your Family Feast Today
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: fonts.body,
                    fontSize: '0.95rem',
                    mb: 4,
                    maxWidth: 550,
                    mx: 'auto',
                    lineHeight: 1.6,
                  }}
                >
                  Generous portions, freshly cooked ingredients, and authentic Italian taste.
                  Available for curbside takeout, delivery, or in-house family dining.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
                    href={businessInfo.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<ShoppingBagOutlinedIcon />}
                    id="order-cta-main"
                    sx={{
                      bgcolor: palette.primary.main,
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 5,
                      py: 1.5,
                      borderRadius: '8px',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        bgcolor: palette.primary.dark,
                      },
                    }}
                  >
                    Order Now
                  </Button>
                  <Button
                    variant="outlined"
                    component="a"
                    href={`tel:${businessInfo.phone}`}
                    id="call-cta-main"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.4)',
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 5,
                      py: 1.5,
                      borderRadius: '8px',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        borderColor: '#fff',
                        bgcolor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Call {businessInfo.phone}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
