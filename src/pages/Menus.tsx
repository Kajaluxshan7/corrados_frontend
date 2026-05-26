import { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero, BlurText, TextReveal } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { fetchDigitalMenuPdfs, type ApiDigitalMenuPdf } from "../services/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { resolveImageUrl } from "../config/api";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

// ── Main Page ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food Menu",
  drinks: "Drinks",
  wine: "Wine List",
  cocktails: "Cocktails",
  desserts: "Desserts",
  specials: "Specials",
  other: "Other",
};

interface MenuCardProps {
  pdf: ApiDigitalMenuPdf;
}

function MenuCard({ pdf }: MenuCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const maxTilt = 8;
    const rY = (mouseX / (width / 2)) * maxTilt;
    const rX = -(mouseY / (height / 2)) * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`,
      transition: "transform 0.1s cubic-bezier(0.25, 0.61, 0.35, 1)",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  return (
    <a
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      href={resolveImageUrl(pdf.pdfUrl)}
      target="_blank"
      rel="noopener noreferrer"
      style={tiltStyle}
      className="menu-card-anchor"
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          bgcolor: "#FDF8F4", // Light warm cream matching page theme
        }}
      >
        {pdf.thumbnailUrl ? (
          <Box
            className="menu-thumb"
            component="img"
            loading="lazy"
            src={resolveImageUrl(pdf.thumbnailUrl)}
            alt={pdf.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 56, color: `${palette.primary.main}88` }} />
            <Typography sx={{ color: `${palette.primary.main}88`, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              PDF Menu
            </Typography>
          </Box>
        )}
        {/* Category badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <Chip
            label={CATEGORY_LABELS[pdf.category] ?? pdf.category}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: palette.primary.main,
              border: `1px solid rgba(190, 89, 83, 0.35)`,
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              backdropFilter: "blur(6px)",
              height: 22,
            }}
          />
        </Box>
      </Box>

      {/* Card footer */}
      <Box sx={{ p: { xs: 2.2, md: 2.8 } }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Kanit, sans-serif",
            fontWeight: 700,
            color: palette.text.primary,
            fontSize: "1.05rem",
            mb: pdf.description ? 0.75 : 2,
            lineHeight: 1.3,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {pdf.title}
        </Typography>
        {pdf.description && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(45, 41, 38, 0.65)", // Dark, legible description text
              fontSize: "0.82rem",
              lineHeight: 1.6,
              mb: 2,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.6rem",
            }}
          >
            {pdf.description}
          </Typography>
        )}
        <Box
          className="menu-open-btn"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            py: 1,
            px: 2,
            borderRadius: "9999px",
            border: `1.5px solid ${palette.primary.main}55`,
            color: palette.primary.main,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "all 0.25s ease",
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 14 }} />
          Open Menu
        </Box>
      </Box>
    </a>
  );
}

export default function Menus() {
  usePageMeta({
    title: "Digital Menu | Italian Food in Whitby",
    description: "Browse Corrado's full Italian menu — handmade pasta, stone-oven pizza, appetizers, fresh salads, seafood mains, decadent desserts, and an extensive wine & cocktail list. Something for everyone.",
    ogImage: "/restaurant/gnocchi-tomato-cream.jpeg",
  });
  const { getImage } = useSiteImages();
  const [digitalPdfs, setDigitalPdfs] = useState<ApiDigitalMenuPdf[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    fetchDigitalMenuPdfs()
      .then((data) => setDigitalPdfs(data))
      .catch(() => {});
  }, []);

  useWsRefresh(WsEvent.DIGITAL_MENU_UPDATED, () => {
    fetchDigitalMenuPdfs().then(setDigitalPdfs).catch(() => {});
  });

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

  return (
    <>
      <PageHero
        title="Digital Menu"
        subtitle="Authentic Italian dishes made with fresh ingredients and time-honoured recipes."
        backgroundImage={getImage(
          "hero_menus",
          "/restaurant/gnocchi-tomato-cream.jpeg",
        )}
        cta={{ label: "Order Online", href: businessInfo.orderUrl }}
      />

      {/* Digital Menus Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 10 },
          pb: { xs: 8, md: 12 },
          bgcolor: palette.cream, // Soft cream background (slightly darker, matches header theme)
          position: "relative",
          minHeight: 400,
          overflow: "hidden",
        }}
      >
        <Container>
          {/* Section header */}
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
            <Typography
              variant="overline"
              sx={{
                color: palette.primary.main, // Terracotta red matching header theme
                letterSpacing: "0.22em",
                fontSize: "0.72rem",
                display: "block",
                mb: 1,
                fontFamily: "Kanit, sans-serif",
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
                text="Explore our full selection of hand-crafted Italian dishes, premium wines, and cocktails. Tap any menu card to view or download the digital version."
                className="text-[#2D2926] opacity-80 text-sm md:text-base font-light leading-relaxed tracking-wide text-center"
                align="center"
              />
            </Box>
          </Box>

          {digitalPdfs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PictureAsPdfIcon sx={{ fontSize: 52, color: `${palette.primary.main}55`, mb: 2 }} />
              <Typography variant="body1" sx={{ color: "rgba(45, 41, 38, 0.55)" }}>
                Our menus are being updated. Check back soon!
              </Typography>
            </Box>
          ) : (
            <>
              {/* Category Filter Pills */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                  mb: { xs: 6, md: 8 },
                }}
              >
                {/* All Menus Pill */}
                <button
                  onClick={() => setActiveTab("all")}
                  style={{
                    backgroundColor: activeTab === "all" ? palette.primary.main : "rgba(255, 255, 255, 0.7)",
                    color: activeTab === "all" ? "#fff" : "rgba(45, 41, 38, 0.75)",
                    border: `1px solid ${activeTab === "all" ? palette.primary.main : "rgba(190, 89, 83, 0.2)"}`,
                    borderRadius: "9999px",
                    padding: "8px 24px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: activeTab === "all" ? "0 4px 12px rgba(190, 89, 83, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== "all") {
                      e.currentTarget.style.borderColor = palette.primary.main;
                      e.currentTarget.style.color = palette.primary.main;
                      e.currentTarget.style.backgroundColor = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "all") {
                      e.currentTarget.style.borderColor = "rgba(190, 89, 83, 0.2)";
                      e.currentTarget.style.color = "rgba(45, 41, 38, 0.75)";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                    }
                  }}
                >
                  All Menus
                </button>

                {categoriesPresent.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    style={{
                      backgroundColor: activeTab === cat ? palette.primary.main : "rgba(255, 255, 255, 0.7)",
                      color: activeTab === cat ? "#fff" : "rgba(45, 41, 38, 0.75)",
                      border: `1px solid ${activeTab === cat ? palette.primary.main : "rgba(190, 89, 83, 0.2)"}`,
                      borderRadius: "9999px",
                      padding: "8px 24px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: activeTab === cat ? "0 4px 12px rgba(190, 89, 83, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.03)",
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== cat) {
                        e.currentTarget.style.borderColor = palette.primary.main;
                        e.currentTarget.style.color = palette.primary.main;
                        e.currentTarget.style.backgroundColor = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== cat) {
                        e.currentTarget.style.borderColor = "rgba(190, 89, 83, 0.2)";
                        e.currentTarget.style.color = "rgba(45, 41, 38, 0.75)";
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                      }
                    }}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </button>
                ))}
              </Box>

              {/* Grid of Menu Cards */}
              <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center">
                <AnimatePresence mode="popLayout">
                  {filteredPdfs.map((pdf) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pdf.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <MenuCard pdf={pdf} />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
