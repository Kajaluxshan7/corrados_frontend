import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import { PageHero, BlurText, TextReveal, CardGridSkeleton, EmptyState, FloatingOrbs } from "../components";
import { businessInfo } from "../data";
import { palette, fonts } from "../theme";
import { fetchDigitalMenuPdfs, type ApiDigitalMenuPdf } from "../services/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { resolveImageUrl } from "../config/api";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food Menu",
  drinks: "Drinks",
  wine: "Wine List",
  cocktails: "Cocktails",
  desserts: "Desserts",
  specials: "Specials",
  other: "Other",
};

export default function Menus() {
  usePageMeta({
    title: "Digital Menu | Italian Food in Whitby",
    description: "Browse Corrado's full Italian menu — handmade pasta, stone-oven pizza, appetizers, fresh salads, seafood mains, decadent desserts, and an extensive wine & cocktail list. Something for everyone.",
    ogImage: "/restaurant/gnocchi-tomato-cream.jpeg",
  });
  const { getImage } = useSiteImages();
  const [digitalPdfs, setDigitalPdfs] = useState<ApiDigitalMenuPdf[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchDigitalMenuPdfs()
      .then((pdfs) => {
        setDigitalPdfs(pdfs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useWsRefresh(WsEvent.DIGITAL_MENU_UPDATED, () => {
    fetchDigitalMenuPdfs().then(setDigitalPdfs).catch(() => {});
  });

  // Reset submenu tab when changing category
  useEffect(() => {
    setActiveSubMenuIndex(0);
  }, [activeTab]);

  const categoriesPresent = useMemo(() => {
    const cats = new Set<string>();
    digitalPdfs.forEach((pdf) => {
      if (pdf.category) {
        cats.add(pdf.category);
      }
    });
    return Array.from(cats).sort((a, b) => {
      const order = ["food", "wine", "drinks", "cocktails", "desserts", "specials"];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [digitalPdfs]);

  const filteredPdfs = useMemo(() => {
    if (activeTab === "all") return digitalPdfs;
    return digitalPdfs.filter((pdf) => pdf.category === activeTab);
  }, [digitalPdfs, activeTab]);

  const allTabs = useMemo(() => {
    return [
      { value: "all", label: "All Menus" },
      ...categoriesPresent.map((cat) => ({
        value: cat,
        label: CATEGORY_LABELS[cat] ?? cat,
      })),
    ];
  }, [categoriesPresent]);

  const activePdf = useMemo(() => {
    return filteredPdfs[activeSubMenuIndex] || filteredPdfs[0];
  }, [filteredPdfs, activeSubMenuIndex]);

  return (
    <>
      <PageHero
        title="Digital Menu"
        subtitle="Authentic Italian dishes made with fresh ingredients and time-honoured recipes."
        backgroundImage={getImage(
          "hero_menus",
          "/restaurant/menus-hero-light.png",
        )}
        kenBurns
        parallax
        overlay={0.3}
        titleSx={{
          background: "linear-gradient(135deg, #FFF 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))",
        }}
      />

      {/* Digital Menus Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 10 },
          pb: { xs: 8, md: 12 },
          bgcolor: palette.background.default,
          position: "relative",
          minHeight: 400,
          overflow: "hidden",
        }}
      >
        {/* Soft subtle glowing background orbs */}
        <FloatingOrbs colors={["#BE5953", "#D4817C", "#C9A96E"]} count={3} opacity={0.08} blur={80} />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          {/* Section header */}
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
            <Typography
              variant="overline"
              sx={{
                color: palette.primary.main,
                letterSpacing: "0.22em",
                fontSize: "0.72rem",
                display: "block",
                mb: 1,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              BROWSE OUR MENUS
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <BlurText
                text="OUR MENUS"
                className="text-[#2D2926] text-3xl md:text-5xl font-black tracking-tight"
                align="center"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box sx={{ width: 48, height: "1px", bgcolor: `${palette.primary.main}55` }} />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: palette.primary.main,
                  opacity: 0.7,
                }}
              />
              <Box sx={{ width: 48, height: "1px", bgcolor: `${palette.primary.main}55` }} />
            </Box>

            <Box sx={{ maxWidth: 520, mx: "auto" }}>
              <TextReveal
                text="Explore our full selection of hand-crafted Italian dishes, premium wines, and cocktails. Select any menu to view the digital version directly below."
                className="text-[#2D2926] opacity-80 text-sm md:text-base font-light leading-relaxed tracking-wide text-center"
                align="center"
              />
            </Box>
          </Box>

          {loading ? (
            <CardGridSkeleton count={1} columns={{ xs: 12 }} imageHeight={600} />
          ) : digitalPdfs.length === 0 ? (
            <EmptyState
              icon={<PictureAsPdfIcon />}
              title="Menus are being updated"
              description="Our team is refreshing the menu right now. In the meantime, you can start an order online."
              action={{ label: "Order Online", href: businessInfo.orderUrl }}
            />
          ) : (
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
              {/* Left Column: Vertical Magazine Index Nav */}
              <Grid size={{ xs: 12, md: 3 }} sx={{ position: { md: "sticky" }, top: 120 }}>
                {/* Index Section Title */}
                <Typography
                  sx={{
                    color: palette.gold,
                    fontFamily: fonts.body,
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    mb: { xs: 2.5, md: 4.5 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <span>Index of Menus</span>
                  <Box sx={{ flexGrow: 1, height: "1px", bgcolor: "rgba(201, 169, 110, 0.2)" }} />
                </Typography>

                {/* Vertical index of categories */}
                <Stack
                  direction={{ xs: "row", md: "column" }}
                  spacing={{ xs: 3, md: 4 }}
                  sx={{
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    pb: { xs: 2, md: 0 },
                    borderBottom: { xs: "1px solid rgba(201, 169, 110, 0.12)", md: "none" },
                    mb: { xs: 4, md: 0 },
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {allTabs.map((tab, idx) => {
                    const active = activeTab === tab.value;
                    const numberStr = `0${idx + 1}`;
                    return (
                      <Box
                        key={tab.value}
                        component="button"
                        onClick={() => setActiveTab(tab.value)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          p: 0,
                          outline: "none",
                          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          "&:hover": {
                            transform: { md: "translateX(6px)" },
                          },
                        }}
                      >
                        {/* Number */}
                        <Typography
                          sx={{
                            fontFamily: fonts.display,
                            fontSize: { xs: "1.1rem", md: "1.4rem" },
                            fontWeight: 900,
                            color: active ? palette.primary.main : "rgba(45, 41, 38, 0.22)",
                            transition: "color 0.3s ease",
                            lineHeight: 1,
                          }}
                        >
                          {numberStr}
                        </Typography>

                        {/* Label */}
                        <Typography
                          sx={{
                            fontFamily: fonts.body,
                            fontSize: { xs: "0.8rem", md: "0.9rem" },
                            fontWeight: active ? 850 : 600,
                            color: active ? "#2D2926" : "rgba(45, 41, 38, 0.5)",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tab.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                {/* Editorial text block under the index (desktop only) */}
                <Box sx={{ display: { xs: "none", md: "block" }, mt: 7, pr: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B5F4E",
                      fontSize: "0.78rem",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      borderLeft: `2px solid ${palette.gold}`,
                      pl: 2.5,
                    }}
                  >
                    Our digital selections are curated seasonally to capture the essence of Italian hospitality. PDF downloads reflect our printable dine-in menus.
                  </Typography>
                </Box>
              </Grid>

              {/* Right Column: Premium PDF Preview Component */}
              <Grid size={{ xs: 12, md: 9 }}>
                {activePdf ? (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3.5,
                      width: "100%",
                    }}
                  >
                    {/* Submenu selector pills (if there are multiple PDFs in the filtered category) */}
                    {filteredPdfs.length > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          flexWrap: "wrap",
                          pb: 1,
                          borderBottom: `1px solid rgba(201, 169, 110, 0.15)`,
                        }}
                      >
                        {filteredPdfs.map((pdf, idx) => {
                          const isSelected = activeSubMenuIndex === idx;
                          return (
                            <Box
                              key={pdf.id}
                              component="button"
                              onClick={() => setActiveSubMenuIndex(idx)}
                              sx={{
                                px: 3,
                                py: 1.2,
                                borderRadius: "30px",
                                border: "1px solid",
                                borderColor: isSelected ? palette.primary.main : "rgba(201, 169, 110, 0.3)",
                                bgcolor: isSelected ? palette.primary.main : "transparent",
                                color: isSelected ? "#fff" : palette.text.secondary,
                                fontFamily: fonts.body,
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: palette.primary.main,
                                  color: isSelected ? "#fff" : palette.primary.main,
                                },
                              }}
                            >
                              {pdf.title}
                            </Box>
                          );
                        })}
                      </Box>
                    )}

                    {/* Main Preview Card */}
                    <Box
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: "24px",
                        border: `1px solid ${palette.gold}44`,
                        boxShadow: "0 24px 64px rgba(45, 41, 38, 0.06)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Top Bar: Title & Action Buttons */}
                      <Box
                        sx={{
                          p: { xs: 3, md: 4 },
                          bgcolor: palette.cream,
                          borderBottom: `1px solid ${palette.gold}33`,
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 2.5,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: fonts.display,
                              fontWeight: 900,
                              color: palette.charcoal,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              fontSize: "1.25rem",
                              mb: 0.75,
                            }}
                          >
                            {activePdf.title}
                          </Typography>
                          {activePdf.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: palette.text.secondary,
                                fontSize: "0.85rem",
                                fontWeight: 500,
                                lineHeight: 1.5,
                              }}
                            >
                              {activePdf.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Quick Actions Stack */}
                        <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
                          <Button
                            href={resolveImageUrl(activePdf.pdfUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="medium"
                            startIcon={<OpenInNewIcon />}
                            sx={{
                              color: palette.primary.main,
                              borderColor: "rgba(190, 89, 83, 0.4)",
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 3,
                              py: 1,
                              fontSize: "0.8rem",
                              flexGrow: { xs: 1, sm: 0 },
                              "&:hover": {
                                borderColor: palette.primary.main,
                                bgcolor: "rgba(190, 89, 83, 0.04)",
                              },
                            }}
                          >
                            Fullscreen
                          </Button>

                          <Button
                            href={resolveImageUrl(activePdf.pdfUrl)}
                            download
                            variant="contained"
                            size="medium"
                            startIcon={<PictureAsPdfIcon />}
                            sx={{
                              bgcolor: palette.primary.main,
                              color: "#fff",
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 3,
                              py: 1,
                              fontSize: "0.8rem",
                              boxShadow: "none",
                              flexGrow: { xs: 1, sm: 0 },
                              "&:hover": {
                                bgcolor: palette.primary.dark,
                                boxShadow: "none",
                              },
                            }}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Box>

                      {/* Embedded Viewer Body */}
                      <Box sx={{ p: isMobile ? 3 : 0, bgcolor: "#fafafa" }}>
                        {isMobile ? (
                          // Mobile Fallback: High-Fidelity Thumbnail Card
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 3,
                              py: 4,
                            }}
                          >
                            {activePdf.thumbnailUrl ? (
                              <Box
                                sx={{
                                  width: "100%",
                                  maxWidth: 320,
                                  aspectRatio: "3 / 4",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  border: `1px solid ${palette.gold}66`,
                                  boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={resolveImageUrl(activePdf.thumbnailUrl)}
                                  alt={activePdf.title}
                                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  maxWidth: 320,
                                  aspectRatio: "3 / 4",
                                  borderRadius: "12px",
                                  background: "linear-gradient(135deg, #F5EDE4 0%, #EADDCF 100%)",
                                  border: `1px dashed ${palette.gold}`,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  p: 3,
                                  textAlign: "center",
                                }}
                              >
                                <PictureAsPdfIcon sx={{ fontSize: 56, color: palette.primary.main, mb: 2.5 }} />
                                <Typography sx={{ fontFamily: fonts.display, fontWeight: 900, color: palette.charcoal, mb: 1, textTransform: "uppercase" }}>
                                  {activePdf.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: palette.text.secondary, letterSpacing: "0.05em" }}>
                                  PDF Document
                                </Typography>
                              </Box>
                            )}

                            <Button
                              href={resolveImageUrl(activePdf.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              startIcon={<OpenInNewIcon />}
                              sx={{
                                bgcolor: palette.primary.main,
                                color: "#fff",
                                fontWeight: 700,
                                py: 1.5,
                                px: 4,
                                borderRadius: "8px",
                                textTransform: "none",
                                width: "100%",
                                maxWidth: 320,
                                boxShadow: `0 6px 18px rgba(190, 89, 83, 0.25)`,
                                "&:hover": {
                                  bgcolor: palette.primary.dark,
                                },
                              }}
                            >
                              View Full Menu PDF
                            </Button>
                          </Box>
                        ) : (
                          // Desktop Interactive Iframe Viewer
                          <Box sx={{ width: "100%", height: "850px", position: "relative" }}>
                            <iframe
                              src={`${resolveImageUrl(activePdf.pdfUrl)}#toolbar=0&navpanes=0&statusbar=0&messages=0`}
                              width="100%"
                              height="100%"
                              style={{
                                border: "none",
                                display: "block",
                                backgroundColor: "#fff",
                              }}
                              title={activePdf.title}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <EmptyState
                    icon={<PictureAsPdfIcon />}
                    title="No Menu Selected"
                    description="Please select a menu category from the index list to preview."
                  />
                )}
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
