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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { PageHero } from '../components';
import { familyMeals, businessInfo } from '../data';
import { palette } from '../theme';
import { useSiteImages } from "../contexts/SiteImagesContext";
import { usePageMeta } from "../hooks/usePageMeta";

// Default fallback images keyed by meal id
const MEAL_IMAGE_DEFAULTS: Record<string, string> = {
  "classic-italian": "/restaurant/shrimp-fettuccine.jpeg",
  "pizza-party": "/restaurant/pizza-margherita.jpeg",
  "sunday-feast": "/restaurant/beef-roast-jus.jpeg",
  "date-night": "/restaurant/salmon-beurre-blanc.jpeg",
};

// Map from meal id to site-image key
const MEAL_IMAGE_KEY: Record<string, string> = {
  "classic-italian": "family_meal_classic_italian",
  "pizza-party": "family_meal_pizza_party",
  "sunday-feast": "family_meal_sunday_feast",
  "date-night": "family_meal_date_night",
};

export default function FamilyMeals() {
  usePageMeta({
    title: "Family Meals | Italian Takeout Packages Whitby",
    description: "Feed the whole family with Corrado's ready-to-enjoy family meal packages. Classic Italian dinners, pizza party packs, Sunday feasts & date-night bundles — generous portions, great value, delivered or ready for pickup.",
    ogImage: "/restaurant/family-meal-takeout.jpeg",
  });
  const { getImage } = useSiteImages();
  return (
    <>
      <PageHero
        title="Family Meals"
        subtitle="Complete meal packages for the whole family — ready to enjoy at home or at our table."
        backgroundImage={getImage(
          "hero_family_meals",
          "/restaurant/family-meal-takeout.jpeg",
        )}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={3}>
            {familyMeals.map((meal) => (
              <Grid key={meal.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    },
                    "&:hover img": { transform: "scale(1.06)" },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      height: { xs: 180, md: 200 },
                    }}
                  >
                    <Box
                      component="img"
                      src={getImage(
                        MEAL_IMAGE_KEY[meal.id],
                        MEAL_IMAGE_DEFAULTS[meal.id],
                      )}
                      alt={meal.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {meal.name}
                      </Typography>
                      <Chip
                        label={`Serves ${meal.serves}`}
                        size="small"
                        sx={{
                          bgcolor: palette.secondary.main,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: palette.primary.main,
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {meal.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        mb: 2,
                        lineHeight: 1.7,
                      }}
                    >
                      {meal.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontSize: "0.8rem",
                        color: palette.charcoal,
                      }}
                    >
                      INCLUDES:
                    </Typography>
                    <List dense sx={{ flex: 1 }}>
                      {meal.items.map((item, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon
                              sx={{
                                fontSize: 16,
                                color: palette.secondary.main,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: palette.text.secondary,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Order CTA */}
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
