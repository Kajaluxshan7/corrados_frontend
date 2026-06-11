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
import { PageHero, FloatingOrbs, GrainOverlay, CountUp } from "../components";
import { palette, fonts } from "../theme";
import { businessInfo } from "../data";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

export default function About() {
  usePageMeta({
    title: "Our Story | About Corrado's Restaurant",
    description: "Corrado's Restaurant & Bar has been Whitby's cornerstone Italian dining destination since 2010. Discover the family story, our passion for authentic Italian cuisine, and what makes us a community favourite.",
    ogImage: "/restaurant/about-hero-light.png",
  });
  const { getImage } = useSiteImages();

  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="Authentic Italian cuisine, family warmth, and a passion for hospitality — since 2010."
        backgroundImage={getImage("hero_about", "/restaurant/about-hero-light.png")}
        kenBurns
        parallax
        overlay={0.32}
        titleSx={{
          background: "linear-gradient(135deg, #FFF 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))",
        }}
      />

      {/* ── Heritage / Story ─────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        {/* Glowing visual depth orbs */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            {/* Text column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                {/* Vintage gold crest above header */}
                <Box sx={{ color: palette.gold, fontSize: "1.5rem", mb: 1, display: "flex" }}>⚜</Box>
                <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em", fontWeight: 700, fontFamily: fonts.body }}>
                  ABOUT CORRADO'S
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{ mb: 3.5, fontWeight: 900, fontFamily: fonts.display, fontSize: { xs: "1.75rem", md: "2.4rem" }, lineHeight: 1.2, color: palette.text.primary }}
              >
                Where Family, Food & Tradition Come Together
              </Typography>

              {/* Lead Paragraph in bold serif feel */}
              <Box>
                <Typography variant="body1" sx={{ color: palette.text.primary, mb: 2.5, lineHeight: 1.8, fontSize: "1.08rem", fontWeight: 600 }}>
                  Corrado's Restaurant and Bar has been a cornerstone of the Whitby dining scene since 2010. What started as a family dream — to bring the authentic flavours of Italy to our neighbourhood — has grown into one of the area's most beloved restaurants.
                </Typography>
              </Box>

              {/* Supporting details paragraphs */}
              <Box>
                <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 2.5, lineHeight: 1.8, fontSize: "0.95rem" }}>
                  Our kitchen is rooted in tradition. Every sauce is simmered slowly, every pasta dish is crafted with care, and every pizza is stretched by hand and baked to perfection. We source the freshest ingredients to deliver flavours that remind you of an Italian grandmother's kitchen — warm, generous, and full of love.
                </Typography>
              </Box>

              <Box>
                <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 4, lineHeight: 1.8, fontSize: "0.95rem" }}>
                  But Corrado's is more than great food. It's a place where families gather, friends reconnect, sports fans cheer, and community bonds are strengthened.
                </Typography>
              </Box>

              <Box>
                <Button variant="contained" color="primary" component={RouterLink} to="/menus" endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                    px: 4, 
                    py: 1.5,
                    borderRadius: "30px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    boxShadow: "0 6px 20px rgba(190, 89, 83, 0.25)",
                    "&:hover": { 
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(190, 89, 83, 0.35)",
                    } 
                  }}>
                  Explore Our Menus
                </Button>
              </Box>
            </Grid>

            {/* Overlapping gold framed image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", px: { xs: 1, md: 2 } }}>
                {/* Premium gold double frame behind/overlapping */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: -12,
                    border: "1px solid rgba(201, 169, 110, 0.3)",
                    borderRadius: "16px",
                    zIndex: 0,
                    pointerEvents: "none",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 4,
                      border: "1px dashed rgba(201, 169, 110, 0.18)",
                      borderRadius: "12px",
                    }
                  }}
                />
                <Box sx={{ borderRadius: 12, height: { xs: 320, md: 480 }, position: "relative", zIndex: 1, overflow: "hidden" }}>
                  <Box
                    component="img"
                    loading="lazy"
                    src={getImage("about_heritage", "/restaurant/menu-spread.jpeg")}
                    alt="Corrado's signature dishes"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1.5 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── What We Offer ────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={2} opacity={0.05} blur={90} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Box sx={{ color: palette.gold, fontSize: "1.5rem", mb: 1, display: "inline-flex" }}>⚜</Box>
            <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em", fontWeight: 700 }}>
              WHAT WE OFFER
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 950, fontFamily: fonts.display, fontSize: { xs: "1.75rem", md: "2.4rem" }, color: palette.text.primary }}>
              More Than Just a Restaurant
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 5 }}>
            {[
              { icon: <RestaurantIcon sx={{ fontSize: 32 }} />, title: "Authentic Italian Cuisine", text: "From handmade pasta and wood-fired pizza to classic Italian entrées — our menu celebrates the rich culinary traditions of Italy with a modern Canadian touch.", image: getImage("about_offer_cuisine", "/restaurant/gnocchi-tomato-cream.jpeg") },
              { icon: <FamilyRestroomIcon sx={{ fontSize: 32 }} />, title: "Family-Friendly Atmosphere", text: "A warm and casual dining space where families feel at home. With a dedicated kids' menu, spacious seating, and a welcoming vibe, every visit is an occasion.", image: getImage("about_offer_family", "/restaurant/family-meal-takeout.jpeg") },
              { icon: <LocalBarIcon sx={{ fontSize: 32 }} />, title: "Curated Bar & Wine", text: "Our bar features an extensive selection of Italian wines, craft cocktails, and Canadian beers on tap. The perfect complement to any meal.", image: getImage("about_offer_bar", "/restaurant/valentine-martini.jpeg") },
              { icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />, title: "Events & Entertainment", text: "From live jazz nights and trivia to NHL playoffs and private celebrations — Corrado's is the hub for community events, sports viewings, and good times.", image: getImage("about_offer_events", "/restaurant/catering-dessert-display.jpeg") },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <Card sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid rgba(201, 169, 110, 0.22)",
                  bgcolor: palette.cream,
                  boxShadow: "0 4px 24px rgba(45, 41, 38, 0.02)",
                  transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "rgba(201, 169, 110, 0.45)",
                    boxShadow: "0 20px 40px rgba(190, 89, 83, 0.08)",
                  },
                  "&:hover img": {
                    transform: "scale(1.06)",
                  },
                }}>
                  <Box sx={{ overflow: "hidden", height: { xs: 180, md: 220 }, position: "relative" }}>
                    {/* Elegant gold double border overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 12,
                        border: "1px solid rgba(201, 169, 110, 0.25)",
                        borderRadius: "8px",
                        zIndex: 3,
                        pointerEvents: "none",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 3,
                          border: "1px dashed rgba(201, 169, 110, 0.15)",
                          borderRadius: "6px",
                        }
                      }}
                    />
                    <Box component="img" loading="lazy" src={item.image} alt={item.title}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                  </Box>
                  <CardContent sx={{ p: { xs: 3, md: 3.5 }, position: "relative" }}>
                    {/* Serif Display Number in background */}
                    <Typography
                      sx={{
                        position: "absolute",
                        top: 24,
                        right: 28,
                        fontFamily: fonts.display,
                        fontSize: "2.8rem",
                        fontWeight: 900,
                        color: "rgba(201, 169, 110, 0.18)",
                        lineHeight: 1,
                        pointerEvents: "none",
                      }}
                    >
                      {`0${i + 1}`}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Box sx={{ color: palette.primary.main, display: "flex" }}>{item.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: fonts.display, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                        {formatAmpersand(item.title)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, lineHeight: 1.7, fontSize: "0.88rem" }}>
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Quick Facts — FloatingOrbs + GrainOverlay + CountUp ─────────── */}
      <Box sx={{ 
        py: { xs: 7, md: 9 }, 
        background: "linear-gradient(135deg, #FDF8F4 0%, #F5EDE4 100%)", 
        color: palette.text.primary, 
        position: "relative", 
        overflow: "hidden", 
        borderTop: "1px solid rgba(201, 169, 110, 0.25)",
        borderBottom: "1px solid rgba(201, 169, 110, 0.25)"
      }}>
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={90} />
        <GrainOverlay opacity={0.03} />
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} justifyContent="center">
            {[
              { to: 2010, label: "Established", suffix: "", prefix: "" },
              { to: 50,   label: "Menu Items",  suffix: "+", prefix: "" },
              { to: 7,    label: "Days a Week", suffix: "", prefix: "" },
              { to: 4.5,  label: "Avg Rating",  suffix: "★", prefix: "", decimals: 1 },
            ].map((stat, i) => (
              <Grid key={i} size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ color: palette.primary.main, fontWeight: 800, fontSize: { xs: "2rem", md: "2.85rem" } }}>
                    <CountUp
                      from={0}
                      to={stat.to}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      decimals={(stat as { decimals?: number }).decimals ?? 0}
                      duration={2.2}
                      delay={i * 0.15}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.text.secondary, mt: 0.5, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 700 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Visit / CTA ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative", overflow: "hidden" }}>
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.06} blur={80} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            {/* Callout Image with Premium frame */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ position: "relative", px: { xs: 1, md: 2 } }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: -12,
                    border: "1px solid rgba(201, 169, 110, 0.3)",
                    borderRadius: "16px",
                    zIndex: 0,
                    pointerEvents: "none",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 4,
                      border: "1px dashed rgba(201, 169, 110, 0.18)",
                      borderRadius: "12px",
                    }
                  }}
                />
                <Box sx={{ borderRadius: 12, height: { xs: 320, md: 440 }, position: "relative", zIndex: 1, overflow: "hidden" }}>
                  <Box
                    component="img"
                    loading="lazy"
                    src={getImage("about_cta", "/restaurant/pork-roll-jus.jpeg")}
                    alt="Corrado's signature Italian entrée"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1.5 }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Visit Details Box */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Box>
                <Box sx={{ color: palette.gold, fontSize: "1.5rem", mb: 1, display: "flex" }}>⚜</Box>
                <Typography variant="subtitle2" sx={{ color: palette.primary.main, mb: 1, letterSpacing: "0.15em", fontWeight: 700 }}>
                  VISIT US
                </Typography>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 900, fontFamily: fonts.display, fontSize: { xs: "1.75rem", md: "2.4rem" }, color: palette.text.primary }}>
                  We'd Love to See You
                </Typography>

                {/* Editorial Row Details List */}
                <Stack spacing={2} sx={{ mb: 4.5 }}>
                  {[
                    { label: "Address", val: businessInfo.address },
                    { label: "Hours",   val: businessInfo.hours },
                    { label: "Phone",   val: businessInfo.phone },
                    { label: "Cuisine", val: "Italian, Pasta, Pizza, Wings, Canadian" },
                    { label: "Price Range", val: "Moderate ($10 – $20)" },
                    { label: "Payments",    val: "Visa, MasterCard, American Express, Interac" },
                  ].map((row, i) => (
                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(201, 169, 110, 0.22)", pb: 1.5, gap: 3 }}>
                      <Typography sx={{ color: palette.primary.main, fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                        {row.label}
                      </Typography>
                      <Typography sx={{ color: palette.text.secondary, textAlign: "right", fontSize: "0.88rem", fontWeight: 500, fontFamily: fonts.body }}>
                        {row.val}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={2.5}>
                  <Button variant="contained" color="primary" component={RouterLink} to="/contact"
                    sx={{ 
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      px: 4.5, 
                      py: 1.5,
                      borderRadius: "30px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      boxShadow: "0 6px 20px rgba(190, 89, 83, 0.25)",
                      "&:hover": { 
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(190, 89, 83, 0.35)",
                      } 
                    }}>
                    Contact Us
                  </Button>
                  <Button variant="outlined" color="primary" href={businessInfo.orderUrl} target="_blank" rel="noopener noreferrer"
                    sx={{ 
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      px: 4, 
                      py: 1.5,
                      borderRadius: "30px",
                      fontWeight: 750,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderWidth: "1.5px",
                      "&:hover": { 
                        transform: "translateY(-2px)",
                        borderWidth: "1.5px",
                      } 
                    }}>
                    Order Online
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
