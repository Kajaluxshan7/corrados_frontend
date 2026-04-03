import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { PageHero } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";
import {
  fetchPrimaryCategories,
  type ApiPrimaryCategory,
  type ApiMenuItem,
} from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";

// Fallback banner images keyed by lower-cased category name keywords
const fallbackBanners: [string, string][] = [
  [
    "appetizer",
    "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=1200&q=80",
  ],
  [
    "pasta",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80",
  ],
  [
    "pizza",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
  ],
  [
    "main",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
  ],
  [
    "wing",
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1200&q=80",
  ],
  [
    "dessert",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=80",
  ],
  [
    "salad",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  ],
  [
    "drink",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80",
  ],
  [
    "soup",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80",
  ],
];

function getCategoryBanner(name: string, imageUrl: string | null): string {
  if (imageUrl) return resolveImageUrl(imageUrl);
  const lower = name.toLowerCase();
  for (const [keyword, url] of fallbackBanners) {
    if (lower.includes(keyword)) return url;
  }
  return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";
}

function formatPrice(item: ApiMenuItem): string {
  if (item.price !== null && item.price !== undefined) {
    return `$${Number(item.price).toFixed(2)}`;
  }
  if (item.hasMeasurements && item.measurements?.length) {
    const prices = item.measurements.map((m) => m.price).sort((a, b) => a - b);
    return prices.length > 1
      ? `$${prices[0].toFixed(2)} – $${prices[prices.length - 1].toFixed(2)}`
      : `$${prices[0].toFixed(2)}`;
  }
  return "";
}

// Flatten all sub-categories from all primary categories into one list for tabs
function flattenCategories(primaries: ApiPrimaryCategory[]) {
  return primaries.flatMap((pc) =>
    (pc.categories ?? []).filter((c) => c.isActive),
  );
}

export default function Menus() {
  const [primaries, setPrimaries] = useState<ApiPrimaryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const loadMenu = useCallback(() => {
    setLoading(true);
    fetchPrimaryCategories()
      .then((data) => {
        const active = data.filter((pc) => pc.isActive);
        setPrimaries(active);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load the menu. Please try again later.");
        setPrimaries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Real-time updates via WebSocket
  useWsRefresh(WsEvent.MENU_UPDATED, loadMenu);
  useWsRefresh(WsEvent.MENU_ITEM_CREATED, loadMenu);
  useWsRefresh(WsEvent.MENU_ITEM_UPDATED, loadMenu);
  useWsRefresh(WsEvent.MENU_ITEM_DELETED, loadMenu);

  const allCategories = flattenCategories(primaries);
  const activeCategory = allCategories[activeTab] ?? null;

  return (
    <>
      <PageHero
        title="Our Menus"
        subtitle="Authentic Italian dishes made with fresh ingredients and time-honoured recipes."
        backgroundImage="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1600&q=80"
        cta={{ label: "Order Online", href: businessInfo.orderUrl }}
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

          {!loading && !error && allCategories.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                py: 10,
                color: palette.text.secondary,
              }}
            >
              No menu items available yet. Check back soon!
            </Typography>
          )}

          {!loading && allCategories.length > 0 && (
            <>
              {/* Category Tabs */}
              <Box sx={{ mb: 5, borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
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
                  {allCategories.map((cat) => (
                    <Tab key={cat.id} label={cat.name} />
                  ))}
                </Tabs>
              </Box>

              {/* Category banner */}
              {activeCategory && (
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 160, md: 200 },
                    borderRadius: 1,
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={getCategoryBanner(
                      activeCategory.name,
                      activeCategory.imageUrl,
                    )}
                    alt={activeCategory.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      p: { xs: 2, md: 3 },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#fff" }}
                      >
                        {activeCategory.name}
                      </Typography>
                      {activeCategory.description && (
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.85)", mt: 0.5 }}
                        >
                          {activeCategory.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Menu items */}
              {activeCategory && (
                <Grid container spacing={3}>
                  {(activeCategory.menuItems ?? [])
                    .filter((item) => item.isAvailable)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((item) => {
                      const imgSrc = item.imageUrls?.[0]
                        ? resolveImageUrl(item.imageUrls[0])
                        : null;
                      const priceLabel = formatPrice(item);

                      return (
                        <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                          <Card
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "box-shadow 0.3s",
                              "&:hover": {
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            {/* Item image or restaurant logo fallback */}
                            <Box
                              sx={{
                                height: 140,
                                overflow: "hidden",
                                position: "relative",
                                bgcolor: palette.cream,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {imgSrc ? (
                                <Box
                                  component="img"
                                  src={
                                    failedImages.has(item.id)
                                      ? "/logos/logo-blue.png"
                                      : imgSrc
                                  }
                                  alt={
                                    failedImages.has(item.id)
                                      ? "Corrado's"
                                      : item.name
                                  }
                                  sx={
                                    failedImages.has(item.id)
                                      ? {
                                          height: 64,
                                          width: "auto",
                                          objectFit: "contain",
                                        }
                                      : {
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          display: "block",
                                        }
                                  }
                                  onError={() => {
                                    setFailedImages((prev) =>
                                      new Set(prev).add(item.id),
                                    );
                                  }}
                                />
                              ) : (
                                <Box
                                  component="img"
                                  src="/logos/logo-blue.png"
                                  alt="Corrado's Restaurant"
                                  sx={{
                                    height: 64,
                                    width: "auto",
                                    objectFit: "contain",
                                  }}
                                />
                              )}
                            </Box>

                            <CardContent sx={{ p: 3, flex: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "1.05rem",
                                    flex: 1,
                                  }}
                                >
                                  {formatAmpersand(item.name)}
                                </Typography>
                                {priceLabel && (
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: palette.primary.main,
                                      fontWeight: 700,
                                      fontSize: "1.05rem",
                                      ml: 2,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {priceLabel}
                                  </Typography>
                                )}
                              </Box>
                              <Divider sx={{ mb: 1.5 }} />
                              {item.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: palette.text.secondary,
                                    lineHeight: 1.7,
                                    mb: 1.5,
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                              {item.dietaryInfo &&
                                item.dietaryInfo.length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {item.dietaryInfo.map((tag) => (
                                      <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          fontSize: "0.65rem",
                                          height: 22,
                                          borderColor: palette.sage,
                                          color: palette.secondary.main,
                                          textTransform: "capitalize",
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              )}
            </>
          )}

          {/* Order CTA */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Ready to Order?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: palette.text.secondary, mb: 3 }}
            >
              Place your order online for pickup or delivery.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={businessInfo.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ px: 5 }}
            >
              Order Now
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
