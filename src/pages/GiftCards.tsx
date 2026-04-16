import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { PageHero, SectionHeader } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';
import { useSiteImages } from '../contexts/SiteImagesContext';
import { usePageMeta } from '../hooks/usePageMeta';

export default function GiftCards() {
  usePageMeta({
    title: "Gift Cards | Give the Gift of Italian Dining",
    description: "Give someone special the gift of authentic Italian dining at Corrado's in Whitby. Purchase a gift card online in any amount — valid for dine-in, takeout, and online orders. Never expires. Perfect for any occasion.",
    ogImage: "/restaurant/tiramisu.jpeg",
  });
  const { getImage } = useSiteImages();
  return (
    <>
      <PageHero
        title="Gift Cards"
        subtitle="Give the gift of great Italian food — perfect for any occasion."
        backgroundImage={getImage('hero_gift_cards', '/restaurant/chocolate-cup-dessert.jpeg')}
      />

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
                THE PERFECT GIFT
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                Share the Taste of Italy
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}
              >
                A Corrado's gift card is the perfect present for food lovers,
                Italian cuisine enthusiasts, or anyone who appreciates a great
                dining experience. Whether it's a birthday, anniversary,
                holiday, or just because — our gift cards make everyone happy.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}
              >
                Gift cards can be used for dine-in, takeout, and online orders.
                Available in any amount, they never expire and can be purchased
                instantly online.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={businessInfo.giftCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<CardGiftcardIcon />}
                  sx={{ px: 5 }}
                >
                  Purchase Gift Card
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Gift card visual */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 420,
                    aspectRatio: "1.6 / 1",
                    bgcolor: palette.charcoal,
                    borderRadius: 2,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 120,
                      height: 120,
                      bgcolor: palette.primary.main,
                      borderRadius: "0 0 0 100%",
                      opacity: 0.3,
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        color: palette.primary.main,
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        fontSize: "1.5rem",
                      }}
                    >
                      CORRADO'S
                    </Typography>
                    <Typography
                      sx={{
                        color: "#888",
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                      }}
                    >
                      RESTAURANT{" "}
                      <span style={{ fontFamily: '"Lato", sans-serif' }}>
                        &amp;
                      </span>{" "}
                      BAR
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: palette.gold,
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        mb: 0.5,
                      }}
                    >
                      GIFT CARD
                    </Typography>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        fontSize: "2rem",
                      }}
                    >
                      $50.00
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Occasions */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="PERFECT FOR EVERY OCCASION"
          title="When to Gift Corrado's"
        />
        <Container>
          <Grid container spacing={3}>
            {[
              {
                title: "Birthdays",
                text: "Celebrate another year with a special Italian dinner on the house.",
                image: "/restaurant/catering-dessert-display.jpeg",
              },
              {
                title: "Anniversaries",
                text: "Mark the occasion with a romantic dinner at Corrado's.",
                image: "/restaurant/salmon-beurre-blanc.jpeg",
              },
              {
                title: "Holidays",
                text: "The perfect stocking stuffer or holiday gift for food lovers.",
                image: "/restaurant/tiramisu.jpeg",
              },
              {
                title: "Corporate Gifts",
                text: "Show appreciation to clients and employees with the gift of great food.",
                image: "/restaurant/menu-spread.jpeg",
              },
              {
                title: "Thank You",
                text: "A delicious way to say thanks to someone special.",
                image: "/restaurant/burrata-caprese.jpeg",
              },
              {
                title: "Just Because",
                text: "Sometimes the best gifts come for no reason at all.",
                image: "/restaurant/chocolate-lava-cake.jpeg",
              },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    height: "100%",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    },
                    "&:hover img": { transform: "scale(1.06)" },
                  }}
                >
                  <Box
                    sx={{ overflow: "hidden", height: { xs: 130, md: 150 } }}
                  >
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
                  <Box sx={{ textAlign: "center", p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Purchase CTA */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: palette.primary.main,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Get Your Gift Card Now
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 3,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Available instantly in any amount. Purchase online and send it to
            someone you love.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href={businessInfo.giftCardUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<CardGiftcardIcon />}
            sx={{
              bgcolor: "#fff",
              color: palette.primary.main,
              fontWeight: 700,
              px: 5,
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Purchase Gift Card
          </Button>
        </Container>
      </Box>
    </>
  );
}
