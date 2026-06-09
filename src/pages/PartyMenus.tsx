import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingOrbs, TiltCard } from "../components";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link as RouterLink } from "react-router-dom";
import { PageHero, CardGridSkeleton, EmptyState } from "../components";
import { palette, fonts } from "../theme";
import { fetchPartyMenus, type ApiPartyMenu } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";
import { businessInfo } from "../data";

const RESTAURANT_LOGO = "/logos/logo-blue.png";

function getMenuImage(menu: ApiPartyMenu): string | null {
  if (menu.imageUrls?.length) return resolveImageUrl(menu.imageUrls[0]);
  return null;
}

function titleColor(menuType: string) {
  return menuType === "cocktail" ? "#0D3B6E" : "#8B2020";
}

export default function PartyMenus() {
  usePageMeta({
    title: "Party Menus | Private Event Venue Whitby",
    description: "Host your next celebration at Corrado's Restaurant in Whitby. Customisable party and catering menus for birthdays, corporate dinners, sports viewing events, and private gatherings. Upstairs dining room & patio available.",
    ogImage: "/orrdos/interior-upstairs.jpg",
  });

  const { getImage } = useSiteImages();
  const [menus, setMenus] = useState<ApiPartyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const loadPartyMenus = useCallback(() => {
    fetchPartyMenus()
      .then((data) => {
        const activeMenus = data
          .filter((m) => m.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setMenus(activeMenus);
        if (activeMenus.length > 0) {
          setSelectedMenuId(activeMenus[0].id);
        }
        setError(null);
      })
      .catch(() => {
        setError("Unable to load party menus. Please contact us directly.");
        setMenus([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPartyMenus();
  }, [loadPartyMenus]);

  useWsRefresh(WsEvent.PARTY_MENU_UPDATED, loadPartyMenus);

  // Filter menus dynamically by type to handle infinite choices cleanly
  const filteredMenus = menus.filter((menu) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "cocktail") return menu.menuType === "cocktail";
    return menu.menuType !== "cocktail";
  });

  const activeMenu = filteredMenus.find((m) => m.id === selectedMenuId) || filteredMenus[0];
  const tc = activeMenu ? titleColor(activeMenu.menuType) : "#8B2020";

  return (
    <>
      <PageHero
        title="Party Menus & Catering"
        subtitle="Customizable packages curated for celebrations — from corporate dinners to cocktail soirées."
        backgroundImage={getImage(
          "hero_party_menus",
          "/restaurant/party-menus-hero-light.png",
        )}
        kenBurns
        parallax
        overlay={0.45}
        titleSx={{
          background: "linear-gradient(135deg, #FFF 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))",
        }}
      />

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, position: "relative" }}>
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={1} opacity={0.06} blur={90} />

        <Container>
          {loading && <CardGridSkeleton count={4} columns={{ xs: 12, md: 6 }} imageHeight={220} />}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && menus.length === 0 && (
            <EmptyState
              icon={<CelebrationOutlinedIcon />}
              title="Let's plan something special"
              description="Our party packages are being refreshed. Reach out and we'll tailor a menu to your celebration."
              action={{ label: "Contact Us", to: "/contact" }}
            />
          )}

          {!loading && menus.length > 0 && (
            <>
              {/* DESKTOP VIEWPORT: Side-by-side split pane layout (filters, scrollbar pane, parchment paper card) */}
              <Grid container spacing={5} alignItems="flex-start" sx={{ display: { xs: "none", md: "flex" } }}>
                {/* Left pane: Filter & Scrollable list */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: fonts.display,
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      color: "rgba(0, 0, 0, 0.4)",
                      textTransform: "uppercase",
                      fontSize: "0.8rem",
                      mb: 2.5,
                      pl: 0.5,
                    }}
                  >
                    Dining Packages
                  </Typography>

                  {/* Category Pill Toggle Filter */}
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    {["all", "plated", "cocktail"].map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          const matching = menus.filter((m) => {
                            if (cat === "all") return true;
                            if (cat === "cocktail") return m.menuType === "cocktail";
                            return m.menuType !== "cocktail";
                          });
                          if (matching.length > 0) {
                            setSelectedMenuId(matching[0].id);
                          }
                        }}
                        size="small"
                        sx={{
                          flexGrow: 1,
                          borderRadius: "20px",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          bgcolor: activeCategory === cat ? palette.primary.main : "rgba(0, 0, 0, 0.05)",
                          color: activeCategory === cat ? palette.background.default : "rgba(0,0,0,0.6)",
                          border: `1px solid ${activeCategory === cat ? palette.primary.main : "rgba(0, 0, 0, 0.15)"}`,
                          "&:hover": {
                            bgcolor: activeCategory === cat ? palette.primary.main : "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        {cat === "all" ? "All" : cat === "plated" ? "Dinners" : "Cocktail"}
                      </Button>
                    ))}
                  </Box>

                  {/* Vertically scrollable selector pane - handles unlimited packages beautifully */}
                  <Stack
                    spacing={2}
                    sx={{
                      position: "sticky",
                      top: 110,
                      maxHeight: "calc(100vh - 200px)",
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": {
                        width: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(201, 169, 110, 0.3)",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    {filteredMenus.map((menu) => {
                      const isSelected = activeMenu && activeMenu.id === menu.id;
                      const imgSrc = getMenuImage(menu);

                      return (
                        <Box
                          key={menu.id}
                          onClick={() => setSelectedMenuId(menu.id)}
                          component={motion.div}
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            border: isSelected
                              ? `1px solid ${palette.primary.main}`
                              : "1px solid rgba(0, 0, 0, 0.08)",
                            bgcolor: isSelected
                              ? "rgba(201, 169, 110, 0.06)"
                              : "rgba(255, 255, 255, 0.6)",
                            boxShadow: isSelected
                              ? "0 8px 20px rgba(0, 0, 0, 0.05)"
                              : "none",
                            transition: "border-color 0.3s, background-color 0.3s",
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "4px",
                                bgcolor: palette.primary.main,
                              }}
                            />
                          )}

                          {/* Crop thumbnail */}
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: "6px",
                              overflow: "hidden",
                              border: `1px solid ${isSelected ? palette.primary.main : "rgba(0, 0, 0, 0.15)"}`,
                              flexShrink: 0,
                              bgcolor: "rgba(0,0,0,0.1)",
                            }}
                          >
                            {imgSrc ? (
                              <Box
                                component="img"
                                src={imgSrc}
                                alt={menu.name}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <Box
                                component="img"
                                src={RESTAURANT_LOGO}
                                alt="Corrado's"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  p: 0.75,
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              noWrap
                              sx={{
                                fontFamily: fonts.display,
                                fontWeight: 900,
                                fontSize: "0.95rem",
                                color: isSelected ? palette.primary.main : "rgba(0,0,0,0.85)",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {menu.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: fonts.body,
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: "rgba(0, 0, 0, 0.55)",
                                mt: 0.25,
                              }}
                            >
                              ${Number(menu.pricePerPerson).toFixed(2)} / guest
                            </Typography>
                          </Box>
                          <Box sx={{ color: isSelected ? palette.primary.main : "rgba(0,0,0,0.2)" }}>
                            <KeyboardArrowRightIcon sx={{ fontSize: "1.1rem" }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>

                {/* Right Pane: Menu Folio details */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <AnimatePresence mode="wait">
                    {activeMenu && (
                      <motion.div
                        key={activeMenu.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35 }}
                      >
                        <TiltCard maxRotate={1.5}>
                          <MenuFolioContent menu={activeMenu} tc={tc} />
                        </TiltCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Grid>
              </Grid>

              {/* MOBILE & TABLET VIEWPORT: Accordion vertical collapse stack layout */}
              <Stack spacing={2.5} sx={{ display: { xs: "flex", md: "none" } }}>
                {/* Category Pills at the top on mobile */}
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  {["all", "plated", "cocktail"].map((cat) => (
                    <Button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        const matching = menus.filter((m) => {
                          if (cat === "all") return true;
                          if (cat === "cocktail") return m.menuType === "cocktail";
                          return m.menuType !== "cocktail";
                        });
                        if (matching.length > 0) {
                          setSelectedMenuId(matching[0].id);
                        }
                      }}
                      size="small"
                      sx={{
                        flexGrow: 1,
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        bgcolor: activeCategory === cat ? palette.primary.main : "rgba(0,0,0,0.04)",
                        color: activeCategory === cat ? palette.background.default : "rgba(0,0,0,0.6)",
                        border: `1px solid ${activeCategory === cat ? palette.primary.main : "rgba(0,0,0,0.12)"}`,
                      }}
                    >
                      {cat === "all" ? "All" : cat === "plated" ? "Dinners" : "Cocktail"}
                    </Button>
                  ))}
                </Box>

                {filteredMenus.map((menu) => {
                  const isExpanded = selectedMenuId === menu.id;
                  const menuTc = titleColor(menu.menuType);

                  return (
                    <Accordion
                      key={menu.id}
                      expanded={isExpanded}
                      onChange={() => setSelectedMenuId(isExpanded ? null : menu.id)}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.6)",
                        border: isExpanded ? `1px solid ${palette.gold}` : "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "16px !important",
                        color: "#fff",
                        overflow: "hidden",
                        boxShadow: "none",
                        "&::before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: palette.gold }} />}
                        sx={{ px: 3, py: 1.5 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", pr: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              sx={{
                                fontFamily: fonts.display,
                                fontWeight: 900,
                                fontSize: "0.95rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                                color: "rgba(0,0,0,0.85)",
                              }}
                            >
                              {menu.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "rgba(0,0,0,0.55)",
                                mt: 0.5,
                                fontWeight: 600,
                              }}
                            >
                              ${Number(menu.pricePerPerson).toFixed(2)} per guest
                            </Typography>
                          </Box>
                          <Chip
                            label={menu.menuType === "cocktail" ? "Cocktail" : "Dinner"}
                            size="small"
                            sx={{
                              bgcolor: menuTc + "1a",
                              color: menuTc,
                              border: `1px solid ${menuTc}4d`,
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2, bgcolor: palette.background.default }}>
                        <MenuFolioContent menu={menu} tc={menuTc} />
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Stack>
            </>
          )}

          {/* Minimal Integrated CTA Section - Fixed Text Visibility to dark charcoal */}
          <Box
            sx={{
              mt: { xs: 10, md: 14 },
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: palette.gold,
                fontSize: "1.5rem",
                mb: 2.5,
                lineHeight: 1,
              }}
            >
              ✦ ✦ ✦
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 850,
                mb: 2,
                fontSize: { xs: "1.8rem", md: "2.3rem" },
                fontFamily: fonts.display,
                color: "#2D2926", // Deep contrasting charcoal-brown
                letterSpacing: "-0.01em",
              }}
            >
              Plan Your Custom Event
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#5C524D", // Muted contrasting warm brown
                mb: 4,
                lineHeight: 1.7,
                fontSize: "1rem",
              }}
            >
              Our culinary team is delighted to adapt these packages or craft a fully bespoke menu
              tailored to your celebration's theme, guest list size, or specific dietary requirements.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                component={RouterLink}
                to="/contact"
                size="large"
                sx={{
                  bgcolor: palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  boxShadow: `0 8px 20px rgba(190, 89, 83, 0.25)`,
                  "&:hover": {
                    bgcolor: palette.primary.dark,
                    boxShadow: `0 12px 28px rgba(190, 89, 83, 0.35)`,
                  },
                }}
              >
                Inquire With Coordinator
              </Button>

              <Button
                variant="outlined"
                component="a"
                href={`tel:${businessInfo.phone}`}
                size="large"
                startIcon={<PhoneIcon sx={{ color: "#2D2926" }} />}
                sx={{
                  borderColor: "rgba(45, 41, 38, 0.25)",
                  color: "#2D2926", // Contrasting dark text
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&:hover": {
                    borderColor: "#2D2926",
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
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

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: MenuFolioContent
// ─────────────────────────────────────────────────────────────────────────────
function MenuFolioContent({ menu, tc }: { menu: ApiPartyMenu; tc: string }) {
  return (
    <Box
      sx={{
        bgcolor: "#FFFEF5",
        backgroundImage: "linear-gradient(135deg, #FAF8E8 0%, #FFFEF5 65%)",
        borderRadius: "16px",
        border: "1px solid rgba(201, 169, 110, 0.3)",
        p: { xs: 4, sm: 6 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // Inset double border layout
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "8px",
          border: "1px solid rgba(201, 169, 110, 0.18)",
          borderRadius: "12px",
          pointerEvents: "none",
        },
      }}
    >
      {/* Gold crest top ornament */}
      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        <Typography
          sx={{
            color: tc,
            fontSize: "1.3rem",
            lineHeight: 1,
            letterSpacing: "0.2em",
            opacity: 0.8,
          }}
        >
          ⚜ ⚜ ⚜
        </Typography>
      </Box>

      {/* Menu Info Header */}
      <Box sx={{ textAlign: "center", mb: 3.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: fonts.display,
            color: tc,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontSize: { xs: "1.4rem", sm: "1.9rem" },
          }}
        >
          {menu.name}
        </Typography>

        {menu.description && (
          <Typography
            sx={{
              color: "#6B5F4E",
              fontStyle: "italic",
              mt: 2,
              fontSize: "0.9rem",
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {menu.description}
          </Typography>
        )}

        <Box
          sx={{
            display: "inline-block",
            mt: 2.5,
            px: 3.5,
            py: 0.8,
            bgcolor: "rgba(201, 169, 110, 0.08)",
            border: "1px solid rgba(201, 169, 110, 0.25)",
            borderRadius: "4px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.82rem",
              color: tc,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ${Number(menu.pricePerPerson).toFixed(2)} Per Guest
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(184, 176, 154, 0.4)", my: 3 }} />

      {/* Guest limits info */}
      {(menu.minimumGuests || menu.maximumGuests) && (
        <Typography
          sx={{
            fontSize: "0.72rem",
            color: "#7A6C58",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textAlign: "center",
            mb: 4,
          }}
        >
          {menu.minimumGuests && menu.maximumGuests
            ? `${menu.minimumGuests} – ${menu.maximumGuests} guests capacity`
            : menu.minimumGuests
              ? `${menu.minimumGuests} guests minimum requirement`
              : `Up to ${menu.maximumGuests} guests capacity`}
        </Typography>
      )}

      {/* Menu Sections (Appetizers, Mains, etc.) */}
      <Box sx={{ my: 1, flexGrow: 1 }}>
        {[...(menu.sections ?? [])]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((sec) => {
            const availItems = [...sec.items]
              .filter((item) => item.isAvailable)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <Box key={sec.id} sx={{ mb: 4.5 }}>
                {sec.title && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2.5,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        height: "1px",
                        bgcolor: "rgba(201, 169, 110, 0.25)",
                        flexGrow: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.display,
                        color: tc,
                        fontWeight: 900,
                        fontSize: "0.92rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {sec.title}
                    </Typography>
                    <Box
                      sx={{
                        height: "1px",
                        bgcolor: "rgba(201, 169, 110, 0.25)",
                        flexGrow: 1,
                      }}
                    />
                  </Box>
                )}

                {sec.instruction && (
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      color: "#8A7F6A",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      textAlign: "center",
                      mb: 2.5,
                    }}
                  >
                    {sec.instruction}
                  </Typography>
                )}

                <Stack spacing={2.5}>
                  {availItems.map((item) => (
                    <Box key={item.id} sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "0.92rem",
                          color: "#2C2118",
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.name}
                        {item.notes && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "0.72rem",
                              color: "#8A7F6A",
                              fontStyle: "italic",
                              fontWeight: 400,
                              ml: 0.75,
                            }}
                          >
                            ({item.notes})
                          </Box>
                        )}
                      </Typography>

                      {item.description && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "#6B5F4E",
                            fontStyle: "italic",
                            lineHeight: 1.5,
                            mt: 0.5,
                            maxWidth: 450,
                            mx: "auto",
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            );
          })}
      </Box>

      {/* PDF downloads */}
      {menu.pdfUrls && menu.pdfUrls.length > 0 && (
        <Box sx={{ mt: 5, pt: 3, borderTop: "1px dashed rgba(201, 169, 110, 0.3)", textAlign: "center" }}>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            {menu.pdfUrls.map((url, i) => (
              <Button
                key={i}
                component="a"
                href={resolveImageUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<PictureAsPdfIcon sx={{ fontSize: "0.95rem !important" }} />}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: tc,
                  borderColor: "rgba(201, 169, 110, 0.4)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderRadius: "99px",
                  px: 3.5,
                  py: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: tc,
                    bgcolor: "rgba(201, 169, 110, 0.05)",
                  },
                }}
              >
                {menu.pdfUrls.length > 1 ? `PDF Package ${i + 1}` : "Download Menu PDF"}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
