import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Fade,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { PageHero } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { formatAmpersand } from "../utils/formatAmpersand";
import {
  fetchPrimaryCategories,
  fetchItemsByCategory,
  type ApiPrimaryCategory,
  type ApiMenuCategory, // used in useMemo return type
  type ApiMenuItem,
  type ApiMeasurement,
} from "../services/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";
import { resolveImageUrl } from "../config/api";
import { useSiteImages } from "../contexts/SiteImagesContext";
import { usePageMeta } from "../hooks/usePageMeta";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(item: ApiMenuItem): string {
  if (item.hasMeasurements && item.measurements?.length) {
    const available = item.measurements
      .filter((m) => m.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (available.length === 0) return "";
    if (available.length === 1)
      return `$${Number(available[0].price).toFixed(2)}`;
    const min = Math.min(...available.map((m) => m.price));
    const max = Math.max(...available.map((m) => m.price));
    return min === max
      ? `$${min.toFixed(2)}`
      : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
  }
  if (item.price !== null && item.price !== undefined) {
    return `$${Number(item.price).toFixed(2)}`;
  }
  return "";
}

function getMeasurementName(m: ApiMeasurement, index: number): string {
  return m.measurementTypeEntity?.name ?? `Option ${index + 1}`;
}

// ── Decorative ornament ───────────────────────────────────────────────────────

function OrnamentDivider({ color = palette.gold }: { color?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        my: 0.5,
      }}
    >
      <Box sx={{ flex: 1, height: "1px", bgcolor: `${color}44` }} />
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: color,
          opacity: 0.7,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, height: "1px", bgcolor: `${color}44` }} />
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Menus() {
  usePageMeta({
    title: "Our Menus | Italian Food in Whitby",
    description: "Browse Corrado's full Italian menu — handmade pasta, stone-oven pizza, appetizers, fresh salads, seafood mains, decadent desserts, and an extensive wine & cocktail list. Something for everyone.",
    ogImage: "/restaurant/gnocchi-tomato-cream.jpeg",
  });
  const { getImage } = useSiteImages();
  const [primaries, setPrimaries] = useState<ApiPrimaryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePrimaryId, setActivePrimaryId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(true);

  const loadPrimaries = useCallback(() => {
    setLoading(true);
    fetchPrimaryCategories()
      .then((data) => {
        const active = data
          .filter((pc) => pc.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setPrimaries(active);
        setActivePrimaryId((prev) => prev ?? (active[0]?.id ?? null));
        setError(null);
      })
      .catch(() => {
        setError("Unable to load the menu. Please try again later.");
        setPrimaries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPrimaries();
  }, [loadPrimaries]);

  useWsRefresh(WsEvent.MENU_UPDATED, loadPrimaries);
  useWsRefresh(WsEvent.MENU_ITEM_CREATED, loadPrimaries);
  useWsRefresh(WsEvent.MENU_ITEM_UPDATED, loadPrimaries);
  useWsRefresh(WsEvent.MENU_ITEM_DELETED, loadPrimaries);

  // Derive subcategories directly from the already-loaded primaries data
  const subCategories = useMemo((): ApiMenuCategory[] => {
    const primary = primaries.find((p) => p.id === activePrimaryId);
    if (!primary) return [];
    return [...(primary.categories ?? [])]
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [primaries, activePrimaryId]);

  // Auto-select first subcategory when subCategories list changes
  useEffect(() => {
    setActiveCategoryId((prev) => {
      const stillExists = subCategories.some((c) => c.id === prev);
      return stillExists ? prev : (subCategories[0]?.id ?? null);
    });
  }, [subCategories]);

  // Fetch items when subcategory changes
  useEffect(() => {
    if (!activeCategoryId) {
      setMenuItems([]);
      return;
    }
    let cancelled = false;
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    setItemsVisible(false);
    setItemsLoading(true);
    fetchItemsByCategory(activeCategoryId)
      .then((items) => {
        if (cancelled) return;
        setMenuItems(
          items
            .filter((i) => i.isAvailable)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
        fadeTimer = setTimeout(() => {
          if (!cancelled) setItemsVisible(true);
        }, 80);
      })
      .catch(() => {
        if (!cancelled) setMenuItems([]);
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false);
      });

    return () => {
      cancelled = true;
      if (fadeTimer !== null) clearTimeout(fadeTimer);
    };
  }, [activeCategoryId]);

  const activeCategory = useMemo(
    () => subCategories.find((c) => c.id === activeCategoryId) ?? null,
    [subCategories, activeCategoryId],
  );

  const activePrimary = useMemo(
    () => primaries.find((p) => p.id === activePrimaryId) ?? null,
    [primaries, activePrimaryId],
  );

  function handlePrimarySelect(id: string) {
    if (id === activePrimaryId) return;
    setActivePrimaryId(id);
    setActiveCategoryId(null);
    setMenuItems([]);
  }

  function handleCategorySelect(id: string) {
    if (id === activeCategoryId) return;
    setActiveCategoryId(id);
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <PageHero
        title="Our Menus"
        subtitle="Authentic Italian dishes made with fresh ingredients and time-honoured recipes."
        backgroundImage={getImage(
          "hero_menus",
          "/restaurant/gnocchi-tomato-cream.jpeg",
        )}
        cta={{ label: "Order Online", href: businessInfo.orderUrl }}
      />

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: palette.background.default,
          minHeight: 500,
        }}
      >
        <Container>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
              <CircularProgress sx={{ color: palette.primary.main }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && primaries.length === 0 && (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <RestaurantMenuIcon
                sx={{ fontSize: 56, color: palette.warmGray, mb: 2 }}
              />
              <Typography
                variant="body1"
                sx={{ color: palette.text.secondary }}
              >
                No menu items available yet. Check back soon!
              </Typography>
            </Box>
          )}

          {!loading && primaries.length > 0 && (
            <>
              {/* Primary category tabs — consistent with Specials / Events */}
              <Box sx={{ mb: 5, borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activePrimaryId ?? false}
                  onChange={(_, v) => handlePrimarySelect(v)}
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
                  {primaries.map((pc) => (
                    <Tab key={pc.id} label={pc.name} value={pc.id} />
                  ))}
                </Tabs>
              </Box>

              {/* Active primary section title */}
              {activePrimary && (
                <Box sx={{ mb: { xs: 4, md: 5 }, textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      color: palette.charcoal,
                      fontSize: { xs: "1.8rem", md: "2.4rem" },
                      mb: 0.5,
                    }}
                  >
                    {activePrimary.name}
                  </Typography>
                  {activePrimary.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        fontStyle: "italic",
                      }}
                    >
                      {activePrimary.description}
                    </Typography>
                  )}
                  <OrnamentDivider color={palette.gold} />
                </Box>
              )}

              {subCategories.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 3, md: 5 },
                    alignItems: { xs: "stretch", md: "center" },
                    minHeight: 400,
                  }}
                >
                  {/* ── Left: Category sidebar ── */}
                  {isMobile ? (
                    /* Mobile: horizontal scrollable chips */
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        width: "100%",
                      }}
                    >
                      {subCategories.map((cat) => {
                        const isActive = activeCategoryId === cat.id;
                        return (
                          <Chip
                            key={cat.id}
                            label={cat.name}
                            onClick={() => handleCategorySelect(cat.id)}
                            sx={{
                              fontFamily: isActive
                                ? "'Playfair Display', serif"
                                : "inherit",
                              fontWeight: isActive ? 700 : 500,
                              fontSize: "0.82rem",
                              height: 34,
                              borderRadius: "2px",
                              bgcolor: isActive
                                ? palette.charcoal
                                : palette.cream,
                              color: isActive ? "#fff" : palette.charcoal,
                              border: `1px solid ${isActive ? palette.charcoal : palette.warmGray}`,
                              "&:hover": {
                                bgcolor: isActive
                                  ? palette.charcoal
                                  : palette.warmGray,
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    /* Desktop: vertical sidebar */
                    <Box
                      sx={{
                        width: 220,
                        flexShrink: 0,
                        position: "sticky",
                        top: 80,
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.25,
                        }}
                      >
                        {subCategories.map((cat) => {
                          const isActive = activeCategoryId === cat.id;
                          return (
                            <Box
                              key={cat.id}
                              onClick={() => handleCategorySelect(cat.id)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 1,
                                py: 0.8,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  "& .cat-label": {
                                    color: palette.primary.main,
                                  },
                                },
                              }}
                            >
                              {/* Bullet */}
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  bgcolor: isActive
                                    ? palette.primary.main
                                    : palette.warmGray,
                                  transition: "background-color 0.15s ease",
                                }}
                              />
                              <Typography
                                className="cat-label"
                                sx={{
                                  fontSize: "0.875rem",
                                  fontWeight: isActive ? 700 : 400,
                                  color: isActive
                                    ? palette.primary.main
                                    : palette.text.primary,
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {cat.name}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}

                  {/* ── Right: Items list with images ── */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {activeCategory && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            color: palette.charcoal,
                            fontSize: { xs: "1.5rem", md: "1.9rem" },
                            mb: 0.25,
                          }}
                        >
                          {activeCategory.name}
                        </Typography>
                        {activeCategory.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: palette.text.secondary,
                              fontStyle: "italic",
                              mt: 0.5,
                            }}
                          >
                            {activeCategory.description}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            mt: 1.5,
                            height: "1px",
                            background: `linear-gradient(90deg, ${palette.primary.main}, ${palette.gold}66, transparent)`,
                          }}
                        />
                      </Box>
                    )}

                    {itemsLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 10,
                        }}
                      >
                        <CircularProgress
                          sx={{ color: palette.primary.main }}
                          size={28}
                        />
                      </Box>
                    ) : (
                      <Fade in={itemsVisible} timeout={300}>
                        <Box>
                          <MenuItemList items={menuItems} />
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Box>
              ) : null}
            </>
          )}

          {/* Order CTA */}
          {!loading && (
            <Box
              sx={{
                mt: 8,
                py: 5,
                px: 4,
                bgcolor: palette.cream,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Ready to Order?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: palette.text.secondary,
                  mb: 3,
                  maxWidth: 550,
                  mx: "auto",
                }}
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
              >
                Order Now
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

// ── Menu Item List ────────────────────────────────────────────────────────────

function MenuItemList({ items }: { items: ApiMenuItem[] }) {
  if (items.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography
          variant="body1"
          sx={{ color: palette.text.secondary, fontStyle: "italic" }}
        >
          No items in this category yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map((item, idx) => (
        <Box key={item.id}>
          <MenuItemRow item={item} />
          {idx < items.length - 1 && (
            <Divider sx={{ borderColor: `${palette.warmGray}88` }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

// ── Menu Item Row ─────────────────────────────────────────────────────────────

function MenuItemRow({ item }: { item: ApiMenuItem }) {
  const hasMeasurements =
    item.hasMeasurements &&
    (item.measurements?.length ?? 0) > 0 &&
    item.measurements != null;
  const availableMeasurements = hasMeasurements
    ? item
        .measurements!.filter((m) => m.isAvailable)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const imgSrc =
    item.imageUrls?.length > 0 ? resolveImageUrl(item.imageUrls[0]) : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        "&:hover": {
          "& .item-name": { color: palette.primary.main },
          "& .item-img": { transform: "scale(1.05)" },
        },
        transition: "all 0.15s ease",
      }}
    >
      {/* Image thumbnail */}
      {imgSrc && (
        <Box
          sx={{
            width: { xs: 72, md: 90 },
            height: { xs: 72, md: 90 },
            flexShrink: 0,
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${palette.warmGray}`,
          }}
        >
          <Box
            className="item-img"
            component="img"
            src={imgSrc}
            alt={item.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.35s ease",
            }}
          />
        </Box>
      )}
      {/* Name + description + tags + price */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          className="item-name"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: { xs: "1rem", md: "1.05rem" },
            color: palette.charcoal,
            mb: 0.4,
            transition: "color 0.15s ease",
          }}
        >
          {formatAmpersand(item.name)}
        </Typography>

        {item.description && (
          <Typography
            variant="body2"
            sx={{
              color: palette.text.secondary,
              lineHeight: 1.7,
              mb: 0.75,
              fontStyle: "italic",
              fontSize: "0.87rem",
            }}
          >
            {item.description}
          </Typography>
        )}

        {(item.dietaryInfo?.length > 0 || item.allergens?.length > 0) && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.75 }}>
            {item.dietaryInfo?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: 18,
                  borderRadius: "2px",
                  bgcolor: `${palette.sage}1a`,
                  color: palette.secondary.dark,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  border: `1px solid ${palette.sage}44`,
                }}
              />
            ))}
            {item.allergens?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: 18,
                  borderRadius: "2px",
                  bgcolor: "rgba(190,89,83,0.08)",
                  color: palette.primary.dark,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  border: `1px solid ${palette.primary.main}33`,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Right: price or measurements */}
      <Box sx={{ flexShrink: 0, textAlign: "right" }}>
        {hasMeasurements ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.3,
              alignItems: "flex-end",
            }}
          >
            {availableMeasurements.map((m, idx) => (
              <Box
                key={m.id}
                sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
              >
                <Typography
                  sx={{
                    color: palette.text.secondary,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {getMeasurementName(m, idx)}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: palette.primary.main,
                    fontSize: "0.95rem",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  ${Number(m.price).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: palette.primary.main,
              fontSize: "1.05rem",
            }}
          >
            {formatPrice(item)}
          </Typography>
        )}
      </Box>
      </Box>
    </Box>
  );
}
