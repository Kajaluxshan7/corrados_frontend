import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PageHero } from "../components";
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

export default function Menus() {
  usePageMeta({
    title: "Digital Menu | Italian Food in Whitby",
    description: "Browse Corrado's full Italian menu — handmade pasta, stone-oven pizza, appetizers, fresh salads, seafood mains, decadent desserts, and an extensive wine & cocktail list. Something for everyone.",
    ogImage: "/restaurant/gnocchi-tomato-cream.jpeg",
  });
  const { getImage } = useSiteImages();
  const [digitalPdfs, setDigitalPdfs] = useState<ApiDigitalMenuPdf[]>([]);

  useEffect(() => {
    fetchDigitalMenuPdfs()
      .then((data) => setDigitalPdfs(data))
      .catch(() => {});
  }, []);

  useWsRefresh(WsEvent.DIGITAL_MENU_UPDATED, () => {
    fetchDigitalMenuPdfs().then(setDigitalPdfs).catch(() => {});
  });


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
          py: { xs: 7, md: 9 },
          bgcolor: palette.charcoal,
          minHeight: 400,
        }}
      >
        <Container>
          {/* Section header */}
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
            <Typography
              variant="overline"
              sx={{
                color: palette.gold,
                letterSpacing: "0.22em",
                fontSize: "0.72rem",
                display: "block",
                mb: 1,
              }}
            >
              BROWSE OUR MENUS
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'AmpersandFix', 'Playfair Display', serif",
                fontWeight: 700,
                color: "#fff",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                mb: 1.5,
              }}
            >
              Our Menus
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box sx={{ width: 48, height: "1px", bgcolor: `${palette.gold}55` }} />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: palette.gold,
                  opacity: 0.7,
                }}
              />
              <Box sx={{ width: 48, height: "1px", bgcolor: `${palette.gold}55` }} />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.6)",
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Explore our full selection — tap any menu to view or download.
            </Typography>
          </Box>

          {digitalPdfs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PictureAsPdfIcon sx={{ fontSize: 52, color: `${palette.gold}55`, mb: 2 }} />
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.45)" }}>
                Our menus are being updated. Check back soon!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center">
              {digitalPdfs.map((pdf) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pdf.id}>
                  <Box
                    component="a"
                    href={resolveImageUrl(pdf.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(201,169,110,0.18)",
                      bgcolor: "#1e1a17",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                      transition: "transform 0.35s cubic-bezier(0.19,1,0.22,1), box-shadow 0.35s ease, border-color 0.35s ease",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.012)",
                        boxShadow: "0 24px 56px rgba(0,0,0,0.52), 0 0 0 1px rgba(201,169,110,0.4)",
                        borderColor: `${palette.gold}66`,
                        "& .menu-thumb": { transform: "scale(1.06)" },
                        "& .menu-open-btn": { bgcolor: palette.gold, color: palette.charcoal },
                      },
                    }}
                  >
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "3 / 4",
                        overflow: "hidden",
                        bgcolor: "#141110",
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
                            transition: "transform 0.5s cubic-bezier(0.19,1,0.22,1)",
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
                          <PictureAsPdfIcon sx={{ fontSize: 56, color: `${palette.gold}88` }} />
                          <Typography sx={{ color: `${palette.gold}88`, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            PDF Menu
                          </Typography>
                        </Box>
                      )}
                      {/* Category badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                        }}
                      >
                        <Chip
                          label={CATEGORY_LABELS[pdf.category] ?? pdf.category}
                          size="small"
                          sx={{
                            bgcolor: "rgba(20,17,15,0.78)",
                            color: palette.gold,
                            border: `1px solid ${palette.gold}55`,
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
                    <Box sx={{ p: { xs: 1.75, md: 2 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'AmpersandFix', 'Playfair Display', serif",
                          fontWeight: 700,
                          color: "#fff",
                          fontSize: "1rem",
                          mb: pdf.description ? 0.5 : 1.25,
                          lineHeight: 1.3,
                        }}
                      >
                        {pdf.title}
                      </Typography>
                      {pdf.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.78rem",
                            lineHeight: 1.55,
                            mb: 1.25,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
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
                          py: 0.85,
                          px: 1.5,
                          borderRadius: 1,
                          border: `1px solid ${palette.gold}55`,
                          color: palette.gold,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <OpenInNewIcon sx={{ fontSize: 13 }} />
                        Open Menu
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

    </>
  );
}

