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
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { motion, useScroll, useTransform } from "framer-motion";
import { palette } from "../theme";
import { fetchStoryCategories, type ApiStoryCategory } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Magnet, TextReveal } from "../components";

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
  scrollDrivenSupported: boolean;
  index: number;
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
        width: "100%",
        height: "100%",
        borderRadius: "28px",
        overflow: "hidden",
        "&:hover img": { transform: "scale(1.01)" },
        "&:hover video": { transform: "scale(1.01)" },
        "&:hover .overlay": { opacity: 1, transform: "translateY(0)" },
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
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.45s ease",
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
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.45s ease",
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
                opacity: isHovered ? 0.25 : 1,
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
            fontFamily: "Outfit, Inter, sans-serif",
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
      sx={{ mr: 2, cursor: "pointer", boxShadow: "0 8px 24px rgba(190, 89, 83, 0.04)" }}
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

// Inner Subcomponent for Sticky Stacking Category Cards
interface StickyCardProps {
  categoryName: string;
  categoryId: string;
  items: GalleryImage[];
  index: number;
  totalCards: number;
  categoryColorMap: Record<string, string>;
  onMediaClick: (item: GalleryImage) => void;
  scrollDrivenSupported: boolean;
  progress: any;
}

function StickyStackedCard({
  categoryName,
  categoryId,
  items,
  index,
  totalCards,
  categoryColorMap,
  onMediaClick,
  scrollDrivenSupported,
  progress,
}: StickyCardProps) {
  // Scale down background cards progressively so earlier cards stack underneath.
  // The scaling is driven by the parent scroll progress container of the entire deck.
  const targetScale = 1 - (totalCards - 1 - index) * 0.04;
  const startProgress = index / totalCards;
  const scale = useTransform(progress, [startProgress, 1], [1, targetScale]);
  const opacity = useTransform(progress, [startProgress, 1], [1, 0.85]);

  // Take first 3 images/videos for the card's two-column highlights grid
  const cardItems = useMemo(() => items.slice(0, 3), [items]);

  // Format index string (e.g. 01, 02)
  const formatIndex = (index + 1).toString().padStart(2, "0");

  return (
    <div
      id={`category-card-${categoryId}`}
      style={{
        position: "sticky",
        top: 0,
        height: "85vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pointerEvents: "none", // Allow clicks to fall through to elements below
      }}
    >
      <Box
        component={motion.div}
        style={{
          scale,
          opacity,
          zIndex: index + 1,
          transformOrigin: "top", // Scale relative to top edge
        }}
        sx={{
          position: "relative",
          pointerEvents: "auto", // Re-enable pointer events for the card itself
          top: {
            xs: `calc(96px + ${index * 20}px)`,
            md: `calc(128px + ${index * 28}px)`,
          },
        }}
        className="w-full max-w-5xl gallery-stack-card"
      >
        {/* Card Header Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(190, 89, 83, 0.15)",
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: palette.primary.main,
                fontWeight: 900,
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontFamily: "Kanit, sans-serif",
                lineHeight: 0.9,
              }}
            >
              {formatIndex}
            </Typography>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: palette.gold,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: 2,
                  display: "block",
                }}
              >
                Category Highlights
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: palette.text.primary,
                  fontWeight: 700,
                  fontFamily: "Kanit, sans-serif",
                  fontSize: { xs: "1.2rem", md: "1.8rem" },
                  textTransform: "uppercase",
                }}
              >
                {categoryName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => onMediaClick(items[0])}
              style={{
                borderRadius: "9999px",
                border: `2px solid ${palette.primary.main}`,
                color: palette.primary.main,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 600,
                padding: "8px 20px",
                fontSize: "0.75rem",
                cursor: "pointer",
                background: "transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${palette.primary.main}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              View Media
            </button>
          </Box>
        </Box>

        {/* Card Two-Column Media Grid (Left 40%, Right 60%) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "4.2fr 5.8fr" },
            gap: { xs: 2, md: 3 },
            mt: 3,
          }}
        >
          {/* Left Column (40% width): 2 stacked media items */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
            }}
          >
            {cardItems[0] && (
              <Box
                sx={{
                  height: { xs: 160, sm: 200, md: "clamp(130px, 15vw, 230px)" },
                  borderRadius: "28px",
                  overflow: "hidden",
                }}
              >
                <GalleryCard
                  item={cardItems[0]}
                  categoryColorMap={categoryColorMap}
                  onClick={() => onMediaClick(cardItems[0])}
                  scrollDrivenSupported={scrollDrivenSupported}
                  index={0}
                />
              </Box>
            )}
            {cardItems[1] && (
              <Box
                sx={{
                  height: { xs: 200, sm: 250, md: "clamp(160px, 20vw, 340px)" },
                  borderRadius: "28px",
                  overflow: "hidden",
                }}
              >
                <GalleryCard
                  item={cardItems[1]}
                  categoryColorMap={categoryColorMap}
                  onClick={() => onMediaClick(cardItems[1])}
                  scrollDrivenSupported={scrollDrivenSupported}
                  index={1}
                />
              </Box>
            )}
          </Box>

          {/* Right Column (60% width): 1 tall media item */}
          {cardItems[2] && (
            <Box
              sx={{
                height: { xs: 250, sm: 350, md: "100%" },
                minHeight: { xs: 200, md: 400 },
                borderRadius: "28px",
                overflow: "hidden",
              }}
            >
              <GalleryCard
                item={cardItems[2]}
                categoryColorMap={categoryColorMap}
                onClick={() => onMediaClick(cardItems[2])}
                scrollDrivenSupported={scrollDrivenSupported}
                index={2}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
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
  const [scrollDrivenSupported, setScrollDrivenSupported] = useState(true);

  const deckRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: deckScrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  // Detect scroll-driven animations support
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      window.CSS &&
      window.CSS.supports &&
      window.CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
    setScrollDrivenSupported(supported);
  }, []);

  const loadGallery = useCallback(() => {
    fetchStoryCategories()
      .then((data) => {
        const active = data
          .filter((c) => c.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        // Inject mock categories to demonstrate how multiple sections from the backend stack
        if (active.length > 0) {
          const mockCats: ApiStoryCategory[] = [
            {
              id: "mock-booths-bar",
              name: "Booths & Bar",
              description: "Explore our cosy booths and fully-stocked bar.",
              isActive: true,
              sortOrder: 10,
              stories: [
                {
                  id: "mock-story-booths-1",
                  categoryId: "mock-booths-bar",
                  isActive: true,
                  sortOrder: 1,
                  imageUrls: [
                    `${window.location.origin}/restaurant/penne-primavera.jpeg`,
                    `${window.location.origin}/restaurant/pizza-margherita.jpeg`,
                    `${window.location.origin}/restaurant/antipasto-platter.jpeg`
                  ],
                }
              ]
            },
            {
              id: "mock-patio",
              name: "Patio Experience",
              description: "Enjoy al fresco dining on our charming patio.",
              isActive: true,
              sortOrder: 20,
              stories: [
                {
                  id: "mock-story-patio-1",
                  categoryId: "mock-patio",
                  isActive: true,
                  sortOrder: 1,
                  imageUrls: [
                    `${window.location.origin}/restaurant/spaghetti-bolognese.jpeg`,
                    `${window.location.origin}/restaurant/ravioli-mushroom-cream.jpeg`,
                    `${window.location.origin}/restaurant/penne-primavera.jpeg`
                  ],
                }
              ]
            },
            {
              id: "mock-dining",
              name: "Upstairs Dining",
              description: "Take a visual tour of our second floor dining space.",
              isActive: true,
              sortOrder: 30,
              stories: [
                {
                  id: "mock-story-dining-1",
                  categoryId: "mock-dining",
                  isActive: true,
                  sortOrder: 1,
                  imageUrls: [
                    `${window.location.origin}/restaurant/pizza-margherita.jpeg`,
                    `${window.location.origin}/restaurant/antipasto-platter.jpeg`,
                    `${window.location.origin}/restaurant/ravioli-mushroom-cream.jpeg`
                  ],
                }
              ]
            }
          ];
          active.push(...mockCats);
        }

        setCategories(active);
        setActiveTab((prev) => prev ?? active[0]?.id ?? null);
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

  // Build flat image list from stories and inject mock videos
  const allImages = useMemo<GalleryImage[]>(() => {
    const images: GalleryImage[] = [];
    for (const cat of categories) {
      for (const story of (cat.stories ?? [])
        .filter((s) => s.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)) {
        for (const url of story.imageUrls ?? []) {
          images.push({
            id: `${story.id}-${url}`,
            src: resolveImageUrl(url),
            alt: cat.name,
            categoryId: cat.id,
            categoryName: cat.name,
          });
        }
      }
    }

    // Append cinematic mock videos to demonstrate video previews and lightbox play
    const btsCat = categories.find(
      (c) =>
        c.name.toLowerCase().includes("behind") ||
        c.name.toLowerCase().includes("scenes"),
    );
    const foodCat = categories.find(
      (c) =>
        c.name.toLowerCase().includes("food") ||
        c.name.toLowerCase().includes("drink"),
    );

    if (btsCat) {
      images.push({
        id: "mock-video-bts-1",
        src: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41584-large.mp4",
        alt: "Chef Preparing Culinary Fresh Salad",
        categoryId: btsCat.id,
        categoryName: btsCat.name,
        isVideo: true,
      });
    }

    if (foodCat) {
      images.push({
        id: "mock-video-food-1",
        src: "https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-professional-kitchen-41588-large.mp4",
        alt: "Searing Hot Seafood in Pan",
        categoryId: foodCat.id,
        categoryName: foodCat.name,
        isVideo: true,
      });
      images.push({
        id: "mock-video-food-2",
        src: "https://assets.mixkit.co/videos/preview/mixkit-pouring-red-wine-into-a-glass-in-slow-motion-42289-large.mp4",
        alt: "Pouring Rich Italian Red Wine",
        categoryId: foodCat.id,
        categoryName: foodCat.name,
        isVideo: true,
      });
    }

    return images;
  }, [categories]);

  // Group media into categories for the Stacking Cards view
  const categoryBlocks = useMemo(() => {
    const map: Record<string, { categoryName: string; categoryId: string; items: GalleryImage[] }> = {};
    allImages.forEach((img) => {
      if (!map[img.categoryId]) {
        map[img.categoryId] = {
          categoryName: img.categoryName,
          categoryId: img.categoryId,
          items: [],
        };
      }
      map[img.categoryId].items.push(img);
    });

    // Return sorted blocks based on categories order
    return categories
      .map((cat) => map[cat.id])
      .filter((block): block is NonNullable<typeof block> => !!block);
  }, [allImages, categories]);

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

  // Smooth scroll handler when tabs are clicked
  const handleTabClick = (categoryId: string) => {
    setActiveTab(categoryId);
    const element = document.getElementById(`category-card-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
                letterSpacing: 4,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                mb: 2,
                display: "block",
                fontFamily: "Kanit, sans-serif",
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
                fontWeight: 900,
                fontFamily: "Kanit, sans-serif",
                textTransform: "uppercase",
                letterSpacing: -1,
                color: palette.text.primary,
                lineHeight: 1.0,
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
              text="With more than five years of experience in design, we focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
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
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
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
                  value={activeTab ?? false}
                  onChange={(_, v) => handleTabClick(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      fontSize: "0.85rem",
                      minWidth: "auto",
                      px: 3,
                      color: "rgba(45, 41, 38, 0.6)",
                      fontFamily: "Kanit, sans-serif",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    },
                    "& .Mui-selected": {
                      color: `${palette.primary.main} !important`,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: palette.primary.main,
                    },
                  }}
                >
                  {tabList.map((cat) => (
                    <Tab key={cat.value} label={cat.label} value={cat.value} />
                  ))}
                </Tabs>
              </Box>

              {/* Stacking Cards Container */}
              <Box ref={deckRef} sx={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
                {categoryBlocks.map((block, idx) => (
                  <StickyStackedCard
                    key={block.categoryId}
                    categoryId={block.categoryId}
                    categoryName={block.categoryName}
                    items={block.items}
                    index={idx}
                    totalCards={categoryBlocks.length}
                    categoryColorMap={categoryColorMap}
                    onMediaClick={(item) => setSelectedImage(item)}
                    scrollDrivenSupported={scrollDrivenSupported}
                    progress={deckScrollYProgress}
                  />
                ))}
              </Box>

              {categoryBlocks.length === 0 && (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "rgba(45, 41, 38, 0.4)" }}
                  >
                    No images in this category yet. Check back soon!
                  </Typography>
                </Box>
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
                  fontFamily: "Playfair Display, serif",
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
