import { useState, useEffect, useCallback, useMemo } from "react";
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
import { PageHero } from "../components";
import { palette } from "../theme";
import { fetchStoryCategories, type ApiStoryCategory } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "../contexts/WebSocketContext";
import { useSiteImages } from "../hooks/useSiteImages";
import { usePageMeta } from "../hooks/usePageMeta";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  categoryId: string;
  categoryName: string;
}

// Assign colours to categories by index
const categoryColorPool = [
  palette.primary.main,
  palette.navy,
  palette.secondary.main,
  palette.wine,
  palette.gold,
];

export default function Gallery() {
  usePageMeta({
    title: "Gallery | Inside Corrado's Restaurant Whitby",
    description: "Take a visual tour of Corrado's Restaurant & Bar in Whitby — our charming exterior, cosy booths, upstairs dining room, beautiful patio, full bar, and the Italian dishes our guests love.",
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

  // Build flat image list from stories
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
    return images;
  }, [categories]);

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

  const filtered = activeTab
    ? allImages.filter((img) => img.categoryId === activeTab)
    : allImages;

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A glimpse into the Corrado's experience — our food, our space, our events."
        backgroundImage={getImage(
          "hero_gallery",
          "/restaurant/seafood-linguine.jpeg",
        )}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
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
              {/* Category filter */}
              <Box sx={{ mb: 5, borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab ?? false}
                  onChange={(_, v) => setActiveTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTab-root": {
                      fontSize: "0.8rem",
                      minWidth: "auto",
                      px: 2,
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

              {/* Masonry columns gallery */}
              <Box
                sx={{
                  columns: { xs: 2, sm: 3, md: 4 },
                  columnGap: { xs: "8px", sm: "10px", md: "12px" },
                }}
              >
                {filtered.map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedImage(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${item.alt}`}
                    sx={{
                      breakInside: "avoid",
                      mb: { xs: "8px", sm: "10px", md: "12px" },
                      position: "relative",
                      cursor: "pointer",
                      overflow: "hidden",
                      borderRadius: 1.5,
                      display: "block",
                      bgcolor: palette.warmGray,
                      "&:hover img": { transform: "scale(1.06)" },
                      "&:hover .overlay": { opacity: 1 },
                      "&:hover .zoom-icon": {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        transition: "transform 0.45s ease",
                      }}
                    />
                    {/* Hover overlay */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.72) 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        p: { xs: 1, md: 1.5 },
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Chip
                        label={item.categoryName}
                        size="small"
                        sx={{
                          mb: 0.6,
                          alignSelf: "flex-start",
                          bgcolor:
                            categoryColorMap[item.categoryId] ||
                            palette.charcoal,
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
                          color: "#fff",
                          fontSize: { xs: "0.72rem", md: "0.8rem" },
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.alt}
                      </Typography>
                    </Box>
                    {/* Zoom icon centred */}
                    <Box
                      className="zoom-icon"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) scale(0.7)",
                        opacity: 0,
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        bgcolor: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "50%",
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1.5px solid rgba(255,255,255,0.4)",
                      }}
                    >
                      <ZoomInIcon sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>
                  </Box>
                ))}
              </Box>

              {filtered.length === 0 && (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: palette.text.secondary }}
                  >
                    No images in this category yet. Check back soon!
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Lightbox dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: "#000", borderRadius: 1 } } }}
      >
        {selectedImage && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#fff",
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedImage.src}
              alt={selectedImage.alt}
              sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {selectedImage.categoryName}
              </Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}
