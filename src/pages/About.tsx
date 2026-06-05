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
import { motion } from "framer-motion";
import { formatAmpersand } from "../utils/formatAmpersand";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { PageHero, SplitWordReveal, ClipReveal, FloatingOrbs, GrainOverlay, CountUp, ScrollVelocityText } from "../components";
import { palette } from "../theme";
import { businessInfo } from "../data";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

const VP = { once: true, margin: "-60px" };
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VP,
  transition: { duration: 0.6, delay, ease: EASE },
});

export default function About() {
  usePageMeta({
    title: "Our Story | About Corrado's Restaurant",
    description: "Corrado's Restaurant & Bar has been Whitby's cornerstone Italian dining destination since 2010. Discover the family story, our passion for authentic Italian cuisine, and what makes us a community favourite.",
    ogImage: "/restaurant/owner_and_logo.jpg",
  });
  const { getImage } = useSiteImages();

  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="Authentic Italian cuisine, family warmth, and a passion for hospitality — since 2010."
        backgroundImage={getImage("hero_about", "/restaurant/owner_and_logo.jpg")}
      />

      {/* ── Heritage / Story ─────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            {/* Text column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div {...fadeUp(0.05)}>
                <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em" }}>
                  ABOUT CORRADO'S
                </Typography>
              </motion.div>

              {/* SplitWordReveal on headline */}
              <Typography
                variant="h3"
                sx={{ mb: 3, fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.25rem" }, lineHeight: 1.22 }}
              >
                <SplitWordReveal
                  text="Where Family, Food & Tradition Come Together"
                  delay={0.1}
                  stagger={0.07}
                  duration={0.7}
                />
              </Typography>

              {["Corrado's Restaurant and Bar has been a cornerstone of the Whitby dining scene since 2010. What started as a family dream — to bring the authentic flavours of Italy to our neighbourhood — has grown into one of the area's most beloved restaurants.",
                "Our kitchen is rooted in tradition. Every sauce is simmered slowly, every pasta dish is crafted with care, and every pizza is stretched by hand and baked to perfection. We source the freshest ingredients to deliver flavours that remind you of an Italian grandmother's kitchen — warm, generous, and full of love.",
                "But Corrado's is more than great food. It's a place where families gather, friends reconnect, sports fans cheer, and community bonds are strengthened."
              ].map((para, i) => (
                <motion.div key={i} {...fadeUp(0.2 + i * 0.1)}>
                  <Typography variant="body1" sx={{ color: palette.text.secondary, mb: i < 2 ? 2 : 3, lineHeight: 1.8 }}>
                    {para}
                  </Typography>
                </motion.div>
              ))}

              <motion.div {...fadeUp(0.5)}>
                <Button variant="contained" color="primary" component={RouterLink} to="/menus" endIcon={<ArrowForwardIcon />}
                  sx={{ transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.04)" } }}>
                  Explore Our Menus
                </Button>
              </motion.div>
            </Grid>

            {/* ClipReveal image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ClipReveal direction="left" delay={0.15} duration={0.95} style={{ borderRadius: 8, height: { xs: 300, md: 450 } as never }}>
                <Box
                  component="img"
                  loading="lazy"
                  src={getImage("about_heritage", "/restaurant/menu-spread.jpeg")}
                  alt="Corrado's signature dishes"
                  sx={{ width: "100%", height: { xs: 300, md: 450 }, objectFit: "cover", borderRadius: 1 }}
                />
              </ClipReveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Scroll-velocity divider ─────────────────────────────────────── */}
      <Box sx={{ py: 3, bgcolor: palette.cream, overflow: "hidden" }}>
        <ScrollVelocityText
          text="Authentic Italian  ·  Handmade Pasta  ·  Wood-Fired Pizza  ·  Family Warmth  ·  Since 2010"
          baseVelocity={2}
          style={{
            fontSize: { xs: "0.85rem", md: "1rem" } as never,
            color: palette.text.secondary,
            letterSpacing: "0.06em",
            fontFamily: '"Playfair Display", serif',
          }}
        />
      </Box>

      {/* ── What We Offer ────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <motion.div {...fadeUp(0)}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em" }}>
                WHAT WE OFFER
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 2 }}>
                <SplitWordReveal text="More Than Just a Restaurant" delay={0.1} stagger={0.09} />
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {[
              { icon: <RestaurantIcon sx={{ fontSize: 36 }} />, title: "Authentic Italian Cuisine", text: "From handmade pasta and wood-fired pizza to classic Italian entrées — our menu celebrates the rich culinary traditions of Italy with a modern Canadian touch.", image: getImage("about_offer_cuisine", "/restaurant/gnocchi-tomato-cream.jpeg") },
              { icon: <FamilyRestroomIcon sx={{ fontSize: 36 }} />, title: "Family-Friendly Atmosphere", text: "A warm and casual dining space where families feel at home. With a dedicated kids' menu, spacious seating, and a welcoming vibe, every visit is an occasion.", image: getImage("about_offer_family", "/restaurant/family-meal-takeout.jpeg") },
              { icon: <LocalBarIcon sx={{ fontSize: 36 }} />, title: "Curated Bar & Wine", text: "Our bar features an extensive selection of Italian wines, craft cocktails, and Canadian beers on tap. The perfect complement to any meal.", image: getImage("about_offer_bar", "/restaurant/valentine-martini.jpeg") },
              { icon: <EmojiEventsIcon sx={{ fontSize: 36 }} />, title: "Events & Entertainment", text: "From live jazz nights and trivia to NHL playoffs and private celebrations — Corrado's is the hub for community events, sports viewings, and good times.", image: getImage("about_offer_events", "/restaurant/catering-dessert-display.jpeg") },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: EASE }}
                  style={{ height: "100%" }}
                >
                  <Card sx={{
                    height: "100%", overflow: "hidden",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 16px 40px rgba(0,0,0,0.18)" },
                    "&:hover img": { transform: "scale(1.07)" },
                  }}>
                    <Box sx={{ overflow: "hidden", height: { xs: 160, md: 200 } }}>
                      <Box component="img" loading="lazy" src={item.image} alt={item.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} />
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <Box sx={{ color: palette.primary.main }}>{item.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatAmpersand(item.title)}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: palette.text.secondary, lineHeight: 1.7 }}>{item.text}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Quick Facts — FloatingOrbs + GrainOverlay + CountUp ─────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.charcoal, color: "#fff", position: "relative", overflow: "hidden" }}>
        <FloatingOrbs colors={["#BE5953", "#8B1A1A", "#A0522D", "#6B2020"]} count={4} opacity={0.35} blur={90} />
        <GrainOverlay opacity={0.07} />
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} justifyContent="center">
            {[
              { to: 2010, label: "Established", suffix: "", prefix: "" },
              { to: 50,   label: "Menu Items",  suffix: "+", prefix: "" },
              { to: 7,    label: "Days a Week", suffix: "", prefix: "" },
              { to: 4.5,  label: "Avg Rating",  suffix: "★", prefix: "", decimals: 1 },
            ].map((stat, i) => (
              <Grid key={i} size={{ xs: 6, sm: 3 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.13, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ color: palette.primary.main, fontWeight: 700, fontSize: { xs: "2rem", md: "2.75rem" } }}>
                      <CountUp
                        from={0}
                        to={stat.to}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        decimals={(stat as { decimals?: number }).decimals ?? 0}
                        duration={2}
                        delay={i * 0.15}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb", mt: 0.5, letterSpacing: "0.05em" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Visit / CTA ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <ClipReveal direction="right" delay={0.1} duration={0.95} style={{ borderRadius: 8, height: { xs: 300, md: 400 } as never }}>
                <Box
                  component="img"
                  loading="lazy"
                  src={getImage("about_cta", "/restaurant/pork-roll-jus.jpeg")}
                  alt="Corrado's signature Italian entrée"
                  sx={{ width: "100%", height: { xs: 300, md: 400 }, objectFit: "cover", borderRadius: 1 }}
                />
              </ClipReveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div {...fadeUp(0.15)}>
                <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em" }}>
                  VISIT US
                </Typography>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
                  <SplitWordReveal text="We'd Love to See You" delay={0.1} stagger={0.1} />
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {[
                    { label: "Address", val: businessInfo.address },
                    { label: "Hours",   val: businessInfo.hours },
                    { label: "Phone",   val: businessInfo.phone },
                    { label: "Cuisine", val: "Italian, Pasta, Pizza, Wings, Canadian" },
                    { label: "Price Range", val: "Moderate ($10 – $20)" },
                    { label: "Payments",    val: "Visa, MasterCard, American Express, Interac" },
                  ].map((row, i) => (
                    <motion.div key={i} {...fadeUp(0.25 + i * 0.06)}>
                      <Typography variant="body1" sx={{ color: palette.text.secondary }}>
                        <strong>{row.label}:</strong> {row.val}
                      </Typography>
                    </motion.div>
                  ))}
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" component={RouterLink} to="/contact"
                    sx={{ transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.04)" } }}>
                    Contact Us
                  </Button>
                  <Button variant="outlined" color="primary" href={businessInfo.orderUrl} target="_blank" rel="noopener noreferrer"
                    sx={{ transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.04)" } }}>
                    Order Online
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
