import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";
import { PageHero } from "../components";
import { businessInfo } from "../data";
import { palette } from "../theme";
import { fetchPartyMenus, type ApiPartyMenu } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";

const RESTAURANT_LOGO = "/logos/logo-blue.png";

function getMenuImage(menu: ApiPartyMenu): string | null {
  if (menu.imageUrls?.length) return resolveImageUrl(menu.imageUrls[0]);
  return null;
}

function titleColor(menuType: string) {
  return menuType === "cocktail" ? "#0D3B6E" : "#8B2020";
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
              sx={{ textAlign: "center", py: 10, color: palette.text.secondary }}
            >
              No party packages available right now. Please contact us to discuss
              your event.
            </Typography>
          )}

          {!loading && menus.length > 0 && (
            <Grid container spacing={3}>
              {menus.map((menu) => {
                const imgSrc = getMenuImage(menu);
                const tc = titleColor(menu.menuType);
                const sortedSections = [...(menu.sections ?? [])].sort(
                  (a, b) => a.sortOrder - b.sortOrder,
                );

                return (
                  <Grid key={menu.id} size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid #DDD9C4",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
                        },
                      }}
                    >
                      {/* Hero image */}
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          height: { xs: 160, md: 180 },
                          bgcolor: "#FAF8E8",
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
                                "&:hover": { transform: "scale(1.04)" },
                              }}
                              onError={() =>
                                setFailedImages((p) => new Set(p).add(menu.id))
                              }
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.25) 100%)",
                              }}
                            />
                          </>
                        ) : (
                          <Box
                            component="img"
                            src={RESTAURANT_LOGO}
                            alt="Corrado's"
                            sx={{ height: 72, width: "auto", objectFit: "contain" }}
                          />
                        )}
                        <Chip
                          label={menu.menuType === "cocktail" ? "Cocktail" : "Party"}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor: menu.menuType === "cocktail" ? "#0D3B6E" : "#8B2020",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            letterSpacing: "0.04em",
                          }}
                        />
                      </Box>

                      {/* Printed menu body */}
                      <Box
                        sx={{
                          bgcolor: "#FFFEF5",
                          backgroundImage:
                            "linear-gradient(135deg, #FAF8E8 0%, #FFFEF5 65%)",
                          px: { xs: 2.5, md: 3 },
                          pt: 2.25,
                          pb: 2.5,
                        }}
                      >
                        {/* Name + Price */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 1,
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: { xs: "1rem", md: "1.1rem" },
                              lineHeight: 1.15,
                              color: tc,
                              textTransform: "uppercase",
                              fontStyle: "italic",
                              letterSpacing: "0.015em",
                              flex: 1,
                            }}
                          >
                            {menu.name}
                          </Typography>
                          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 900,
                                fontSize: "1.5rem",
                                color: tc,
                                lineHeight: 1,
                              }}
                            >
                              ${Number(menu.pricePerPerson).toFixed(2)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.62rem",
                                color: "#8A7F6A",
                                lineHeight: 1.3,
                                mt: 0.25,
                              }}
                            >
                              per person
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ borderColor: "#B8B09A", mb: 1 }} />

                        {/* Guest count */}
                        {(menu.minimumGuests || menu.maximumGuests) && (
                          <Typography
                            sx={{
                              fontSize: "0.68rem",
                              color: "#5C5345",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              mb: 0.75,
                            }}
                          >
                            {menu.minimumGuests && menu.maximumGuests
                              ? `${menu.minimumGuests}–${menu.maximumGuests} guests min`
                              : menu.minimumGuests
                                ? `${menu.minimumGuests} guests min`
                                : `Up to ${menu.maximumGuests} guests`}
                          </Typography>
                        )}

                        {/* Description */}
                        {menu.description && (
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#6B5F4E",
                              fontStyle: "italic",
                              mb: 1.25,
                              lineHeight: 1.5,
                            }}
                          >
                            {menu.description}
                          </Typography>
                        )}

                        {/* Sections */}
                        {sortedSections.map((sec, sIdx) => {
                          const availItems = [...sec.items]
                            .filter((i) => i.isAvailable)
                            .sort((a, b) => a.sortOrder - b.sortOrder);
                          return (
                            <Box
                              key={sec.id}
                              sx={{ mb: sIdx < sortedSections.length - 1 ? 1.5 : 0.5 }}
                            >
                              {sec.title && (
                                <Typography
                                  sx={{
                                    fontSize: "0.72rem",
                                    fontWeight: 900,
                                    color: tc,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "2px",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {sec.title}
                                </Typography>
                              )}
                              {sec.instruction && (
                                <Typography
                                  sx={{
                                    fontSize: "0.63rem",
                                    color: "#5C5345",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    lineHeight: 1.4,
                                    mb: 0.25,
                                  }}
                                >
                                  {sec.instruction}
                                </Typography>
                              )}
                              {availItems.map((item) => (
                                <Box
                                  key={item.id}
                                  sx={{ display: "flex", gap: 0.5, pl: 0.5, alignItems: "center" }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.72rem",
                                      color: "#2C2118",
                                      flexShrink: 0,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    –
                                  </Typography>
                                  <Box>
                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: "0.72rem",
                                        color: "#2C2118",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.name}
                                    </Typography>
                                    {item.notes && (
                                      <Typography
                                        component="span"
                                        sx={{
                                          fontSize: "0.65rem",
                                          color: "#8A7F6A",
                                          fontStyle: "italic",
                                          ml: 0.5,
                                        }}
                                      >
                                        ({item.notes})
                                      </Typography>
                                    )}
                                    {item.description && (
                                      <Typography
                                        sx={{
                                          fontSize: "0.65rem",
                                          color: "#6B5F4E",
                                          fontStyle: "italic",
                                          lineHeight: 1.3,
                                        }}
                                      >
                                        {item.description}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
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
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Ready to Plan Your Event?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: palette.text.secondary, mb: 3, maxWidth: 550, mx: "auto" }}
            >
              Contact our event coordinator to customize any package to your needs.
              We'll make your event unforgettable.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
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
