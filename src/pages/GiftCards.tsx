import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { PageHero, SectionHeader, Section } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';
import { useSiteImages } from '../hooks/useSiteImages';
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

      <Section tone="default" container={false}>
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
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 440,
                    aspectRatio: "1.6 / 1",
                    background: `linear-gradient(135deg, #1a1613 0%, ${palette.charcoal} 60%, #2e2420 100%)`,
                    borderRadius: 4,
                    p: { xs: 3.5, md: 4.5 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Decorative gold arc top-right */}
                  <Box sx={{
                    position: "absolute", top: -40, right: -40,
                    width: 180, height: 180,
                    border: `2px solid ${palette.gold}`,
                    borderRadius: "50%",
                    opacity: 0.18,
                  }} />
                  <Box sx={{
                    position: "absolute", top: -10, right: -10,
                    width: 100, height: 100,
                    border: `1px solid ${palette.gold}`,
                    borderRadius: "50%",
                    opacity: 0.12,
                  }} />
                  {/* Subtle grain overlay */}
                  <Box sx={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px", opacity: 0.6,
                  }} />
                  <Box sx={{ position: "relative" }}>
                    <Typography sx={{
                      color: palette.gold,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 800,
                      fontSize: { xs: "1.4rem", md: "1.6rem" },
                      letterSpacing: "0.05em",
                    }}>
                      CORRADO'S
                    </Typography>
                    <Typography sx={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.22em",
                      mt: 0.25,
                    }}>
                      RESTAURANT &amp; BAR
                    </Typography>
                  </Box>
                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ width: 36, height: 2, bgcolor: palette.gold, mb: 1.5, opacity: 0.7 }} />
                    <Typography sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      mb: 0.5,
                      textTransform: "uppercase",
                    }}>
                      Gift Card
                    </Typography>
                    <Typography sx={{
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      letterSpacing: "-0.01em",
                    }}>
                      $50.00
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* Occasions */}
      <Section tone="cream" container={false}>
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
                image: getImage('gift_card_birthday', '/restaurant/catering-dessert-display.jpeg'),
              },
              {
                title: "Anniversaries",
                text: "Mark the occasion with a romantic dinner at Corrado's.",
                image: getImage('gift_card_anniversary', '/restaurant/salmon-beurre-blanc.jpeg'),
              },
              {
                title: "Holidays",
                text: "The perfect stocking stuffer or holiday gift for food lovers.",
                image: getImage('gift_card_holiday', '/restaurant/tiramisu.jpeg'),
              },
              {
                title: "Corporate Gifts",
                text: "Show appreciation to clients and employees with the gift of great food.",
                image: getImage('gift_card_corporate', '/restaurant/menu-spread.jpeg'),
              },
              {
                title: "Thank You",
                text: "A delicious way to say thanks to someone special.",
                image: getImage('gift_card_thank_you', '/restaurant/burrata-caprese.jpeg'),
              },
              {
                title: "Just Because",
                text: "Sometimes the best gifts come for no reason at all.",
                image: getImage('gift_card_just_because', '/restaurant/chocolate-lava-cake.jpeg'),
              },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
                    },
                    "&:hover img": { transform: "scale(1.06)" },
                  }}
                >
                  <Box
                    sx={{ overflow: "hidden", height: { xs: 160, md: 180 } }}
                  >
                    <Box
                      component="img"
                      loading="lazy"
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
                  <Box sx={{ textAlign: "center", p: 3 }}>
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
      </Section>

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
