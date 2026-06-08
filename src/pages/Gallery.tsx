import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
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
import { motion } from "framer-motion";
import { palette, fonts } from "../theme";
import { fetchStoryCategories, type ApiStoryCategory } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Magnet, TextReveal, EmptyState } from "../components";

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
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // States for 3D tilt perspective
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const maxTilt = 10;
    const rY = (mouseX / (width / 2)) * maxTilt;
    const rX = -(mouseY / (height / 2)) * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.03)`,
      transition: "transform 0.1s cubic-bezier(0.25, 0.61, 0.35, 1)",
    });
  };

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
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    });

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
    <Box
      ref={cardRef}
      className="gallery-item-animated"
      onMouseMove={handleMouseMove}
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
      style={tiltStyle}
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
            fontFamily: "'Inter', sans-serif",
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
      sx={{ mr: 2, cursor: "pointer", boxShadow: "0 8px 24px rgba(45,41,38,0.10)" }}
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
        // Default to "All" (null) so guests see the full gallery first.
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
            // Descriptive alt: category + position, rather than bare category name.
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

  // Scroll offset listener for marquee horizontal animation
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = marqueeRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offsetValue = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setMarqueeOffset(offsetValue);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [allImages]);

  // Separate all media items into Row 1 & Row 2 for seamless scrolling marquee
  const marqueeRows = useMemo(() => {
    const half = Math.ceil(allImages.length / 2);
    const firstHalf = allImages.slice(0, half);
    const secondHalf = allImages.slice(half);

    // Triple images for seamless scrolling wrapping effect
    return {
      row1: [...firstHalf, ...firstHalf, ...firstHalf],
      row2: [...secondHalf, ...secondHalf, ...secondHalf],
    };
  }, [allImages]);

  // Tab selection filters the masonry grid. "all" maps to null (show everything).
  const handleTabClick = (value: string) => {
    setActiveTab(value === "all" ? null : value);
  };

  return (
    <>
      {/* Light-theme Animated Mesh Gradient Header */}
      <Box
        className="gallery-header-bg"
        sx={{
          pt: { xs: 12, sm: 14, md: 18 },
          pb: { xs: 8, sm: 10, md: 12 },
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderBottom: "1px solid rgba(190, 89, 83, 0.08)",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography
              variant="overline"
              sx={{
                color: palette.primary.main,
                fontWeight: 700,
                letterSpacing: "0.22em",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                mb: 2,
                display: "block",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              INSIDE CORRADO'S
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 85 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                fontWeight: 800,
                fontFamily: fonts.display,
                letterSpacing: "-0.01em",
                color: palette.text.primary,
                lineHeight: 1.05,
                mb: 3,
                textShadow: "0 2px 20px rgba(190, 89, 83, 0.08)",
                background: `linear-gradient(180deg, ${palette.text.primary} 0%, ${palette.primary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              The Gallery
            </Typography>
          </motion.div>

          {/* Elegant fade and unblur description in light theme */}
          <Box sx={{ mt: 2, maxWidth: 620, mx: "auto", "& p": { color: palette.text.primary } }}>
            <TextReveal
              text="Step inside Corrado's through our lens — handmade pasta and stone-oven pizza fresh from the kitchen, warm dining rooms, our patio in summer, and the celebrations we're proud to host. A taste of the experience that awaits you."
              className="text-center text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-wide opacity-80"
              align="center"
            />
          </Box>
        </Container>
      </Box>

      {/* 2. Light-Theme Horizontal Scrolling Marquee Section */}
      {allImages.length > 0 && (
        <Box
          ref={marqueeRef}
          className="marquee-section"
          sx={{ py: { xs: 8, md: 12 }, overflowX: "clip" }}
        >
          {/* Row 1 moves RIGHT */}
          <Box
            sx={{
              display: "flex",
              mb: 3,
              gap: 2,
              transform: `translateX(${marqueeOffset - 300}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {marqueeRows.row1.map((item, idx) => (
              <MarqueeTile
                key={`${item.id}-r1-${idx}`}
                item={item}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </Box>

          {/* Row 2 moves LEFT */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              transform: `translateX(${-marqueeOffset - 100}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {marqueeRows.row2.map((item, idx) => (
              <MarqueeTile
                key={`${item.id}-r2-${idx}`}
                item={item}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Main Categories Section (Light Background default) */}
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
              {/* Category tab anchors */}
              <Box sx={{ mb: 8, borderBottom: 1, borderColor: "rgba(190, 89, 83, 0.12)", display: "flex", justifyContent: "center" }}>
                <Tabs
                  value={activeTab ?? "all"}
                  onChange={(_, v) => handleTabClick(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    "& .MuiTab-root": {
                      fontSize: "0.8rem",
                      minWidth: "auto",
                      px: 3,
                      color: "rgba(45, 41, 38, 0.55)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      transition: "color 0.25s ease",
                    },
                    "& .Mui-selected": {
                      color: `${palette.primary.main} !important`,
                    },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                      backgroundColor: palette.primary.main,
                    },
                  }}
                >
                  <Tab label="All" value="all" />
                  {tabList.map((cat) => (
                    <Tab key={cat.value} label={cat.label} value={cat.value} />
                  ))}
                </Tabs>
              </Box>

              {filteredImages.length > 0 ? (
                /* Premium masonry "spotlight" grid — every photo, hover-dims the rest */
                <Box className="gallery-grid">
                  {filteredImages.map((item) => (
                    <Box className="gallery-card-wrapper" key={item.id}>
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
                  fontFamily: "'Inter', sans-serif",
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
