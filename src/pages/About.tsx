import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { formatAmpersand } from "../utils/formatAmpersand";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { PageHero } from "../components";
import { palette } from "../theme";
import { businessInfo } from "../data";

export default function About() {
  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="Authentic Italian cuisine, family warmth, and a passion for hospitality — since 2010."
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
      />

      {/* Heritage / Story */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                ABOUT CORRADO'S
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                Where Family, Food{" "}
                <span style={{ fontFamily: '"Lato", sans-serif' }}>&amp;</span>{" "}
                Tradition Come Together
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}
              >
                Corrado's Restaurant and Bar has been a cornerstone of the
                Whitby dining scene since 2010. What started as a family dream —
                to bring the authentic flavours of Italy to our neighbourhood —
                has grown into one of the area's most beloved restaurants.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}
              >
                Our kitchen is rooted in tradition. Every sauce is simmered
                slowly, every pasta dish is crafted with care, and every pizza
                is stretched by hand and baked to perfection. We source the
                freshest ingredients to deliver flavours that remind you of an
                Italian grandmother's kitchen — warm, generous, and full of
                love.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}
              >
                But Corrado's is more than great food. It's a place where
                families gather, friends reconnect, sports fans cheer, and
                community bonds are strengthened. Whether you're here for a
                casual lunch, a romantic dinner for two, a family celebration,
                or just to watch the game — you'll feel right at home.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/menus"
                endIcon={<ArrowForwardIcon />}
              >
                Explore Our Menus
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80"
                alt="Corrado's dining atmosphere"
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 450 },
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What We Offer */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: palette.primary.main,
                mb: 1,
                letterSpacing: "0.15em",
              }}
            >
              WHAT WE OFFER
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                mb: 2,
              }}
            >
              More Than Just a Restaurant
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              {
                icon: <RestaurantIcon sx={{ fontSize: 36 }} />,
                title: "Authentic Italian Cuisine",
                text: "From handmade pasta and wood-fired pizza to classic Italian entrées — our menu celebrates the rich culinary traditions of Italy with a modern Canadian touch.",
                image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
              },
              {
                icon: <FamilyRestroomIcon sx={{ fontSize: 36 }} />,
                title: "Family-Friendly Atmosphere",
                text: "A warm and casual dining space where families feel at home. With a dedicated kids' menu, spacious seating, and a welcoming vibe, every visit is an occasion.",
                image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80",
              },
              {
                icon: <LocalBarIcon sx={{ fontSize: 36 }} />,
                title: "Curated Bar & Wine",
                text: "Our bar features an extensive selection of Italian wines, craft cocktails, and Canadian beers on tap. The perfect complement to any meal or a great reason to visit on its own.",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
              },
              {
                icon: <EmojiEventsIcon sx={{ fontSize: 36 }} />,
                title: "Events & Entertainment",
                text: "From live jazz nights and trivia to NHL playoffs and private celebrations — Corrado's is the hub for community events, sports viewings, and good times.",
                image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
              },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    overflow: "hidden",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                    "&:hover img": { transform: "scale(1.05)" },
                  }}
                >
                  <Box sx={{ overflow: "hidden", height: { xs: 160, md: 180 } }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ color: palette.primary.main }}>{item.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatAmpersand(item.title)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, lineHeight: 1.7 }}
                    >
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Facts */}
      <Box
        sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.charcoal, color: "#fff" }}
      >
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {[
              { value: "2010", label: "Established" },
              { value: "50+", label: "Menu Items" },
              { value: "7 Days", label: "Open Weekly" },
              { value: "4.5★", label: "Average Rating" },
            ].map((stat, i) => (
              <Grid key={i} size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: palette.primary.main,
                      fontWeight: 700,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#bbb", mt: 0.5, letterSpacing: "0.05em" }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Visit / CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"
                alt="Fine Italian dining"
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 400 },
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.main,
                  mb: 1,
                  letterSpacing: "0.15em",
                }}
              >
                VISIT US
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                We'd Love to See You
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Address:</strong> {businessInfo.address}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Hours:</strong> {businessInfo.hours}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Phone:</strong> {businessInfo.phone}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Cuisine:</strong> Italian, Pasta, Pizza, Wings,
                  Canadian
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Price Range:</strong> Moderate ($10 – $20)
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: palette.text.secondary }}
                >
                  <strong>Payments:</strong> Visa, MasterCard, American Express,
                  Interac
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                >
                  Contact Us
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href={businessInfo.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order Online
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
