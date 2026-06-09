import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Dialog,
  IconButton,
  Chip,
  Skeleton,
  Grid,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import { palette, fonts } from "../theme";
import { fetchStoryCategories, type ApiStoryCategory } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Magnet, EmptyState, PageHero, InfiniteMarquee, TiltCard } from "../components";
import { useSiteImages } from "../hooks/useSiteImages";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  categoryId: string;
  categoryName: string;
  isVideo?: boolean;
}

const categoryColorPool = [
  palette.primary.main,
  palette.navy,
  palette.secondary.main,
  palette.wine,
  palette.gold,
];

// Inner Subcomponent for individual gallery cards inside categories
interface GalleryCardProps {
  item: GalleryImage;
  categoryColorMap: Record<string, string>;
  onClick: () => void;
}

function GalleryCard({
  item,
  categoryColorMap,
  onClick,
}: GalleryCardProps) {
  const isVideo = item.isVideo || /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.src);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0; // reset preview
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 3) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <TiltCard maxRotate={6}>
      <Box
        className="gallery-item-animated"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View ${item.alt}`}
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          "&:hover img": { transform: "scale(1.04)" },
          "&:hover video": { transform: "scale(1.04)" },
          "&:hover .overlay": { opacity: 1, transform: "translateY(0)" },
          "&:hover .zoom-icon": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          "&:focus-visible .overlay": { opacity: 1, transform: "translateY(0)" },
        }}
      >
        {isVideo ? (
          <Box
            component="video"
            ref={videoRef}
            src={item.src}
            muted
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ) : (
          <Box
            component="img"
            src={item.src}
            alt={item.alt}
            loading="lazy"
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        )}

        {/* Magnetic Video Play Overlay Icon */}
        {isVideo && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <Magnet padding={120} strength={3}>
              <Box
                className="play-icon-overlay"
                sx={{
                  bgcolor: "rgba(18, 14, 12, 0.65)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "50%",
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  opacity: isHovered ? 0.75 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", fontSize: 26, ml: 0.3 }} />
              </Box>
            </Magnet>
          </Box>
        )}

        {/* Light-Theme Glassmorphism Caption Overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(8px)",
            borderTop: `1px solid rgba(190, 89, 83, 0.15)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 1.5, md: 2 },
            opacity: 0,
            transform: "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            zIndex: 3,
          }}
        >
          <Chip
            label={item.categoryName}
            size="small"
            sx={{
              mb: 0.8,
              alignSelf: "flex-start",
              bgcolor: categoryColorMap[item.categoryId] || palette.primary.main,
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "capitalize",
              height: 18,
              borderRadius: "4px",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: palette.text.primary,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
              fontWeight: 600,
              lineHeight: 1.3,
              fontFamily: fonts.body,
            }}
          >
            {item.alt}
          </Typography>
        </Box>

        {/* Zoom Icon (for images) */}
        {!isVideo && (
          <Box
            className="zoom-icon"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.7)",
              opacity: 0,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              bgcolor: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(190, 89, 83, 0.2)",
              zIndex: 2,
            }}
          >
            <ZoomInIcon sx={{ color: palette.primary.main, fontSize: 20 }} />
          </Box>
        )}
      </Box>
    </TiltCard>
  );
}

// Inner Subcomponent for Marquee Media Tiles
function MarqueeTile({ item, onClick }: { item: GalleryImage; onClick: () => void }) {
  const isVideo = item.isVideo || /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.src);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Box
      className="marquee-tile"
      onClick={onClick}
      onMouseEnter={() => isVideo && videoRef.current?.play()}
      onMouseLeave={() => isVideo && videoRef.current?.pause()}
      sx={{ cursor: "pointer", boxShadow: "0 8px 24px rgba(45,41,38,0.10)" }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {isVideo && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayArrowIcon sx={{ color: "#fff", fontSize: 16, ml: 0.1 }} />
        </Box>
      )}
    </Box>
  );
}

export default function Gallery() {
  usePageMeta({
    title: "Gallery | Inside Corrado's Restaurant Whitby",
    description:
      "Take a visual tour of Corrado's Restaurant & Bar in Whitby — our charming exterior, cosy booths, upstairs dining room, beautiful patio, full bar, and the Italian dishes our guests love.",
    ogImage: "/orrdos/interior-upstairs.jpg",
  });
  const { getImage } = useSiteImages();
  const [categories, setCategories] = useState<ApiStoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const loadGallery = useCallback(() => {
    fetchStoryCategories()
      .then((data) => {
        const active = data
          .filter((c) => c.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        setCategories(active);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load gallery. Please try again later.");
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useWsRefresh(WsEvent.STORY_UPDATED, loadGallery);

  // Build flat image list from stories (data-driven; no mock/external media).
  const allImages = useMemo<GalleryImage[]>(() => {
    const images: GalleryImage[] = [];
    for (const cat of categories) {
      for (const story of (cat.stories ?? [])
        .filter((s) => s.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)) {
        (story.imageUrls ?? []).forEach((url, idx) => {
          images.push({
            id: `${story.id}-${url}`,
            src: resolveImageUrl(url),
            alt: `${cat.name} — Corrado's Restaurant (photo ${idx + 1})`,
            categoryId: cat.id,
            categoryName: cat.name,
          });
        });
      }
    }
    return images;
  }, [categories]);

  // Filter the masonry grid by the active category tab (null = "All").
  const filteredImages = useMemo(
    () => (activeTab ? allImages.filter((img) => img.categoryId === activeTab) : allImages),
    [allImages, activeTab],
  );

  // Build color map
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat, i) => {
      map[cat.id] = categoryColorPool[i % categoryColorPool.length];
    });
    return map;
  }, [categories]);

  const tabList = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  // Separate all media items into Row 1 & Row 2 for autoscrolling marquee
  const marqueeRows = useMemo(() => {
    const half = Math.ceil(allImages.length / 2);
    const firstHalf = allImages.slice(0, half);
    const secondHalf = allImages.slice(half);

    return {
      row1: firstHalf,
      row2: secondHalf,
    };
  }, [allImages]);

  const handleTabClick = (value: string) => {
    setActiveTab(value === "all" ? null : value);
  };

  return (
    <>
      <PageHero
        title="The Gallery"
        subtitle="Step inside Corrado's through our lens — handmade pasta and stone-oven pizza fresh from the kitchen, warm dining rooms, our patio in summer, and the celebrations we're proud to host. A taste of the experience that awaits you."
        backgroundImage={getImage("hero_gallery", "/restaurant/gallery-hero.png")}
        kenBurns
        parallax
        height="55vh"
        overlay={0.3}
        titleSx={{
          background: `linear-gradient(135deg, #FFFFFF 15%, ${palette.gold} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.38))',
        }}
      />

      {/* 2. Automated GPU-Accelerated Infinite Marquee Section */}
      {allImages.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default, overflowX: "clip" }}>
          {/* Row 1 moves LEFT */}
          <InfiniteMarquee speed={40} direction="left" pauseOnHover={true}>
            <Box sx={{ display: "flex", gap: 3, px: 1.5 }}>
              {marqueeRows.row1.map((item, idx) => (
                <MarqueeTile
                  key={`${item.id}-r1-${idx}`}
                  item={item}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </Box>
          </InfiniteMarquee>

          {/* Row 2 moves RIGHT */}
          <Box sx={{ mt: 3 }}>
            <InfiniteMarquee speed={45} direction="right" pauseOnHover={true}>
              <Box sx={{ display: "flex", gap: 3, px: 1.5 }}>
                {marqueeRows.row2.map((item, idx) => (
                  <MarqueeTile
                    key={`${item.id}-r2-${idx}`}
                    item={item}
                    onClick={() => setSelectedImage(item)}
                  />
                ))}
              </Box>
            </InfiniteMarquee>
          </Box>
        </Box>
      )}

      {/* Main Categories Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: palette.background.default }}>
        <Container>
          {loading && (
            <Grid container spacing={2}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 4 }}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={i % 3 === 0 ? 280 : 200}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {/* Custom Animated Category Filter Pills */}
              <Box
                sx={{
                  mb: 8,
                  display: "flex",
                  gap: 1.5,
                  overflowX: "auto",
                  pb: 1.5,
                  justifyContent: { xs: "flex-start", sm: "center" },
                  "&::-webkit-scrollbar": {
                    height: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0,0,0,0.03)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: "2px",
                  },
                }}
              >
                {/* synthetic "All" tab */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTabClick("all")}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    padding: "10px 22px",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: activeTab === null ? "transparent" : palette.warmGray,
                    color: activeTab === null ? "#fff" : palette.text.secondary,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    backgroundColor: "transparent",
                    fontFamily: fonts.body,
                    outline: "none",
                  }}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>All</span>
                  {activeTab === null && (
                    <motion.div
                      layoutId="activeGalleryPill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: palette.primary.main,
                        borderRadius: "9999px",
                        zIndex: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>

                {tabList.map((cat) => {
                  const active = activeTab === cat.value;
                  return (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleTabClick(cat.value)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        padding: "10px 22px",
                        borderRadius: "9999px",
                        border: "1px solid",
                        borderColor: active ? "transparent" : palette.warmGray,
                        color: active ? "#fff" : palette.text.secondary,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        backgroundColor: "transparent",
                        fontFamily: fonts.body,
                        outline: "none",
                      }}
                    >
                      <span style={{ position: "relative", zIndex: 2 }}>{cat.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeGalleryPill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: palette.primary.main,
                            borderRadius: "9999px",
                            zIndex: 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </Box>

              {filteredImages.length > 0 ? (
                /* Premium masonry "spotlight" grid with staggered idle floating animations */
                <Box className="gallery-grid">
                  {filteredImages.map((item, i) => (
                    <Box
                      className="gallery-card-wrapper gallery-card-floating"
                      key={item.id}
                      style={{
                        ["--float-delay" as any]: i,
                      }}
                    >
                      <GalleryCard
                        item={item}
                        categoryColorMap={categoryColorMap}
                        onClick={() => setSelectedImage(item)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <EmptyState
                  icon={<PhotoLibraryOutlinedIcon />}
                  title="Our gallery is being curated"
                  description="We're adding fresh photos of our dishes, dining rooms and events. Check back soon for a closer look."
                  action={{ label: "View the Menu", to: "/menus" }}
                />
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Lightbox dialog - Cinematic expanded view */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(45, 41, 38, 0.85)", // Warm, soft charcoal-brown tint matches the brand
            },
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(253, 248, 244, 0.95)", // Matches default warm ivory background
            backgroundImage: "none",
            border: `1px solid ${palette.primary.main}20`,
            borderRadius: 6,
            boxShadow: "0 24px 50px rgba(190, 89, 83, 0.15)",
            overflow: "hidden",
          },
        }}
      >
        {selectedImage && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: palette.primary.main,
                bgcolor: "rgba(255,255,255,0.75)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                zIndex: 10,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Content Display */}
            <Box sx={{ display: "flex", justifyContent: "center", bgcolor: "#000" }}>
              {selectedImage.isVideo ||
                /\.(mp4|webm|ogg|mov)($|\?)/i.test(selectedImage.src) ? (
                <Box
                  component="video"
                  src={selectedImage.src}
                  controls
                  autoPlay
                  loop
                  sx={{
                    width: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  sx={{
                    width: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}
            </Box>

            {/* Footer metadata details */}
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid rgba(190, 89, 83, 0.08)",
                bgcolor: "rgba(253, 248, 244, 0.98)",
              }}
            >
              <Chip
                label={selectedImage.categoryName}
                size="small"
                sx={{
                  mb: 1,
                  bgcolor:
                    categoryColorMap[selectedImage.categoryId] ||
                    palette.primary.main,
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  borderRadius: "4px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: palette.text.primary,
                  fontWeight: 600,
                  fontFamily: fonts.body,
                  lineHeight: 1.4,
                }}
              >
                {selectedImage.alt}
              </Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}

