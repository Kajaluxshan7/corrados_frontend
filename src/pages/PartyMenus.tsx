import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";
import { PageHero } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { fetchPartyMenus, type ApiPartyMenu } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";

// Fallback image map: shown when the backend provides no image
const FALLBACK_IMAGES: [string[], string][] = [
  [
    ["cocktail"],
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
  ],
  [
    ["premium", "celebration"],
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
  ],
  [
    ["classic", "dinner"],
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  ],
  [
    ["sport", "game"],
    "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
  ],
  [
    ["casual", "gathering"],
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
  ],
];

const RESTAURANT_LOGO = "/logos/logo-blue.png";

function getMenuImage(menu: ApiPartyMenu): string | null {
  if (menu.imageUrls?.length) return resolveImageUrl(menu.imageUrls[0]);
  const lower = (menu.name + " " + menu.menuType).toLowerCase();
  for (const [keywords, url] of FALLBACK_IMAGES) {
    if (keywords.some((k) => lower.includes(k))) return url;
  }
  return null; // will use logo
}

function formatSectionType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PartyMenus() {
  const [menus, setMenus] = useState<ApiPartyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const loadPartyMenus = useCallback(() => {
    fetchPartyMenus()
      .then((data) => {
        setMenus(
          data
            .filter((m) => m.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
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

  // Real-time updates via WebSocket
  useWsRefresh(WsEvent.PARTY_MENU_UPDATED, loadPartyMenus);

  return (
    <>
      <PageHero
        title="Party Menus & Catering"
        subtitle="Customizable packages for every occasion — from casual gatherings to premium celebrations."
        backgroundImage="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=80"
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

          {!loading && !error && menus.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                py: 10,
                color: palette.text.secondary,
              }}
            >
              No party packages available right now. Please contact us to
              discuss your event.
            </Typography>
          )}

          {!loading && menus.length > 0 && (
            <Grid container spacing={3}>
              {menus.map((menu) => {
                const imgSrc = getMenuImage(menu);

                return (
                  <Grid key={menu.id} size={{ xs: 12, md: 6 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        transition:
                          "transform 0.35s ease, box-shadow 0.35s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
                        },
                        "&:hover img": { transform: "scale(1.05)" },
                      }}
                    >
                      {/* Image or logo fallback */}
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          height: { xs: 170, md: 190 },
                          bgcolor: palette.cream,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {imgSrc && !failedImages.has(menu.id) ? (
                          <>
                            <Box
                              component="img"
                              src={imgSrc}
                              alt={menu.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                              }}
                              onError={() => {
                                setFailedImages((prev) =>
                                  new Set(prev).add(menu.id),
                                );
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)",
                              }}
                            />
                          </>
                        ) : (
                          <Box
                            component="img"
                            src={RESTAURANT_LOGO}
                            alt="Corrado's Restaurant"
                            sx={{
                              height: 80,
                              width: "auto",
                              objectFit: "contain",
                            }}
                          />
                        )}

                        {/* Menu type badge */}
                        <Chip
                          label={
                            menu.menuType === "cocktail" ? "Cocktail" : "Party"
                          }
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor:
                              menu.menuType === "cocktail"
                                ? palette.gold
                                : palette.primary.main,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: 3,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {menu.name}
                          </Typography>
                          {menu.minimumGuests && (
                            <Chip
                              label={`Min ${menu.minimumGuests} guests`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: palette.sage,
                                color: palette.secondary.main,
                                fontWeight: 600,
                                ml: 1,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="h4"
                          sx={{
                            color: palette.primary.main,
                            fontWeight: 700,
                            mb: 2,
                          }}
                        >
                          ${Number(menu.pricePerPerson).toFixed(2)}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: palette.text.secondary, ml: 0.5 }}
                          >
                            / person
                          </Typography>
                        </Typography>

                        {menu.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: palette.text.secondary,
                              mb: 2,
                              lineHeight: 1.7,
                            }}
                          >
                            {menu.description}
                          </Typography>
                        )}

                        {/* Sections */}
                        {menu.sections
                          ?.sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((section) => (
                            <Box key={section.id} sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontSize: "0.78rem",
                                    color: palette.charcoal,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {section.title}
                                </Typography>
                                <Chip
                                  label={formatSectionType(section.sectionType)}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.6rem",
                                    borderColor: palette.warmGray,
                                    color: palette.text.secondary,
                                  }}
                                />
                              </Box>
                              {section.instruction && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: palette.text.secondary,
                                    display: "block",
                                    mb: 0.5,
                                  }}
                                >
                                  {section.instruction}
                                </Typography>
                              )}
                              <List dense disablePadding>
                                {section.items
                                  ?.filter((it) => it.isAvailable)
                                  .sort((a, b) => a.sortOrder - b.sortOrder)
                                  .map((it) => (
                                    <ListItem
                                      key={it.id}
                                      disableGutters
                                      sx={{ py: 0.2 }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 24 }}>
                                        <CheckCircleIcon
                                          sx={{
                                            fontSize: 14,
                                            color: palette.secondary.main,
                                          }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: palette.text.secondary,
                                            }}
                                          >
                                            {it.name}
                                          </Typography>
                                        }
                                        secondary={
                                          it.description ? (
                                            <Typography variant="caption">
                                              {it.description}
                                            </Typography>
                                          ) : undefined
                                        }
                                      />
                                    </ListItem>
                                  ))}
                              </List>
                            </Box>
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Contact CTA */}
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
              Ready to Plan Your Event?
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
              Contact our event coordinator to customize any package to your
              needs. We'll make your event unforgettable.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/contact"
                size="large"
              >
                Contact Us
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href={`tel:${businessInfo.phone}`}
                startIcon={<PhoneIcon />}
                size="large"
              >
                {businessInfo.phone}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href={`mailto:${businessInfo.email}`}
                startIcon={<EmailIcon />}
                size="large"
              >
                Email Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
