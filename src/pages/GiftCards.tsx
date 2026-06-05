import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { PageHero, SectionHeader, SplitWordReveal, FloatingOrbs, GrainOverlay, ClipReveal } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';
import { useSiteImages } from '../hooks/useSiteImages';
import { usePageMeta } from '../hooks/usePageMeta';

const VP = { once: true, margin: "-60px" };
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

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

      {/* ── Hero intro ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            {/* Text */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -48 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                transition={{ duration: 0.6, ease: EASE }}>
                <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em" }}>
                  THE PERFECT GIFT
                </Typography>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.25rem" }, lineHeight: 1.22 }}>
                  <SplitWordReveal text="Share the Taste of Italy" delay={0.1} stagger={0.09} duration={0.7} />
                </Typography>
                <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}>
                  A Corrado's gift card is the perfect present for food lovers, Italian cuisine enthusiasts, or anyone who
                  appreciates a great dining experience. Whether it's a birthday, anniversary, holiday, or just because —
                  our gift cards make everyone happy.
                </Typography>
                <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}>
                  Gift cards can be used for dine-in, takeout, and online orders. Available in any amount, they never
                  expire and can be purchased instantly online.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="contained" color="primary" size="large"
                    href={businessInfo.giftCardUrl} target="_blank" rel="noopener noreferrer"
                    startIcon={<CardGiftcardIcon />}
                    sx={{ px: 5, transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.04)" } }}>
                    Purchase Gift Card
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Gift card visual — ClipReveal + floating glow */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ClipReveal direction="left" delay={0.2} duration={0.95}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <motion.div
                    whileHover={{ rotateY: 8, rotateX: -4, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    style={{ perspective: 1000, width: "100%", maxWidth: 420 }}
                  >
                    <Box sx={{
                      width: "100%", maxWidth: 420, aspectRatio: "1.6 / 1",
                      bgcolor: palette.charcoal, borderRadius: 2, p: 4,
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                      position: "relative", overflow: "hidden",
                      boxShadow: "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
                    }}>
                      {/* Animated orb inside card */}
                      <FloatingOrbs colors={["#BE5953", "#8B1A1A"]} count={2} opacity={0.4} blur={50} />
                      <GrainOverlay opacity={0.08} />
                      <Box sx={{ position: "absolute", top: 0, right: 0, width: 120, height: 120,
                        bgcolor: palette.primary.main, borderRadius: "0 0 0 100%", opacity: 0.3 }} />
                      <Box sx={{ position: "relative", zIndex: 2 }}>
                        <Typography sx={{ color: palette.primary.main, fontFamily: '"AmpersandFix", "Playfair Display", serif', fontWeight: 700, fontSize: "1.5rem" }}>
                          CORRADO'S
                        </Typography>
                        <Typography sx={{ color: "#888", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
                          RESTAURANT <span style={{ fontFamily: '"Lato", sans-serif' }}>&amp;</span> BAR
                        </Typography>
                      </Box>
                      <Box sx={{ position: "relative", zIndex: 2 }}>
                        <Typography sx={{ color: palette.gold, fontSize: "0.7rem", letterSpacing: "0.15em", mb: 0.5 }}>
                          GIFT CARD
                        </Typography>
                        <Typography sx={{ color: "#fff", fontFamily: '"AmpersandFix", "Playfair Display", serif', fontWeight: 700, fontSize: "2rem" }}>
                          $50.00
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              </ClipReveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Occasions ────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.cream }}>
        <SectionHeader subtitle="PERFECT FOR EVERY OCCASION" title="When to Gift Corrado's" />
        <Container>
          <Grid container spacing={3}>
            {[
              { title: "Birthdays",       text: "Celebrate another year with a special Italian dinner on the house.",          image: getImage('gift_card_birthday',    '/restaurant/catering-dessert-display.jpeg') },
              { title: "Anniversaries",   text: "Mark the occasion with a romantic dinner at Corrado's.",                      image: getImage('gift_card_anniversary', '/restaurant/salmon-beurre-blanc.jpeg') },
              { title: "Holidays",        text: "The perfect stocking stuffer or holiday gift for food lovers.",               image: getImage('gift_card_holiday',     '/restaurant/tiramisu.jpeg') },
              { title: "Corporate Gifts", text: "Show appreciation to clients and employees with the gift of great food.",    image: getImage('gift_card_corporate',   '/restaurant/menu-spread.jpeg') },
              { title: "Thank You",       text: "A delicious way to say thanks to someone special.",                           image: getImage('gift_card_thank_you',   '/restaurant/burrata-caprese.jpeg') },
              { title: "Just Because",    text: "Sometimes the best gifts come for no reason at all.",                         image: getImage('gift_card_just_because','/restaurant/chocolate-lava-cake.jpeg') },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  style={{ height: "100%" }}
                >
                  <Box sx={{
                    borderRadius: 1, overflow: "hidden", bgcolor: "#fff", height: "100%",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 16px 40px rgba(0,0,0,0.18)" },
                    "&:hover img": { transform: "scale(1.08)" },
                  }}>
                    <Box sx={{ overflow: "hidden", height: { xs: 130, md: 160 } }}>
                      <Box component="img" loading="lazy" src={item.image} alt={item.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} />
                    </Box>
                    <Box sx={{ textAlign: "center", p: 2.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: palette.text.secondary }}>{item.text}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Purchase CTA — FloatingOrbs + Grain + SplitWordReveal ────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.primary.main, color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <FloatingOrbs colors={["#ffffff", "#ffcccc", "#ff9999"]} count={3} opacity={0.12} blur={70} />
        <GrainOverlay opacity={0.06} blendMode="soft-light" />
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
            transition={{ duration: 0.55, ease: EASE }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1.5rem", md: "2rem" } }}>
              <SplitWordReveal text="Get Your Gift Card Now" delay={0.1} stagger={0.1} style={{ color: "#fff" }} />
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mb: 3, maxWidth: 500, mx: "auto" }}>
              Available instantly in any amount. Purchase online and send it to someone you love.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
              <Button variant="contained" size="large"
                href={businessInfo.giftCardUrl} target="_blank" rel="noopener noreferrer"
                startIcon={<CardGiftcardIcon />}
                sx={{ bgcolor: "#fff", color: palette.primary.main, fontWeight: 700, px: 5, "&:hover": { bgcolor: "#f5f5f5" } }}>
                Purchase Gift Card
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
