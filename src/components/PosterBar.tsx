import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { keyframes } from "@emotion/react";
import { fetchPosters, type ApiPoster } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh, WsEvent } from "../contexts/WebSocketContext";
import { palette } from "../theme";

const BAR_HEIGHT = 180;
const SPEED_PX_PER_SEC = 50;

/* Subtle shimmer sweep across the bar */
const shimmer = keyframes`
  0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
  40%  { opacity: 0.18; }
  60%  { opacity: 0.08; }
  100% { transform: translateX(120%) skewX(-18deg); opacity: 0; }
`;

/* Gentle pulse on the "NOW SHOWING" dot */
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.7); }
  50%       { box-shadow: 0 0 0 6px rgba(201, 169, 110, 0); }
`;

export default function PosterBar() {
  const [posters, setPosters] = useState<ApiPoster[]>([]);
  const [reps, setReps] = useState(2);
  const [setWidth, setSetWidth] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const loadPosters = useCallback(() => {
    fetchPosters()
      .then((data) => setPosters(data.filter((p) => p.imageUrl)))
      .catch(() => {});
  }, []);

  useEffect(() => { loadPosters(); }, [loadPosters]);
  useWsRefresh(WsEvent.POSTERS_UPDATED, loadPosters);

  useEffect(() => {
    if (!measureRef.current || posters.length === 0) return;
    const w = measureRef.current.scrollWidth;
    if (w === 0) return;
    const needed = Math.ceil((window.innerWidth * 3) / w);
    const evenNeeded = needed % 2 === 0 ? needed : needed + 1;
    setReps(Math.max(evenNeeded, 4));
    setSetWidth(w);
  }, [posters]);

  useEffect(() => {
    if (!trackRef.current || setWidth === 0) return;
    const el = trackRef.current;
    const duration = (setWidth / SPEED_PX_PER_SEC) * 1000;

    animRef.current?.cancel();
    animRef.current = el.animate(
      [
        { transform: "translateX(0)" },
        { transform: `translateX(-${setWidth}px)` },
      ],
      { duration, iterations: Infinity, easing: "linear" },
    );

    return () => { animRef.current?.cancel(); };
  }, [setWidth, reps]);

  /* Pause while lightbox is open */
  useEffect(() => {
    if (!animRef.current) return;
    if (lightboxIdx !== null) animRef.current.pause();
    else animRef.current.play();
  }, [lightboxIdx]);

  /* Keyboard navigation */
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightboxIdx((i) => i === null ? null : (i + 1) % posters.length);
      if (e.key === "ArrowLeft")  setLightboxIdx((i) => i === null ? null : (i - 1 + posters.length) % posters.length);
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, posters.length]);

  if (posters.length === 0) return null;

  const repeatedPosters = Array.from({ length: reps }, () => posters).flat();

  const openLightbox = (originalIdx: number) => setLightboxIdx(originalIdx);
  const lightboxPrev = () => setLightboxIdx((i) => i === null ? null : (i - 1 + posters.length) % posters.length);
  const lightboxNext = () => setLightboxIdx((i) => i === null ? null : (i + 1) % posters.length);

  const activePoster = lightboxIdx !== null ? posters[lightboxIdx] : null;

  const posterItems = (items: ApiPoster[], keyPrefix: string, clickable: boolean) =>
    items.map((poster, idx) => {
      const originalIdx = posters.indexOf(poster);
      return (
        <Box
          key={`${keyPrefix}-${poster.id}-${idx}`}
          onClick={clickable ? () => openLightbox(originalIdx) : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            height: BAR_HEIGHT,
            px: "10px",
            cursor: clickable ? "zoom-in" : "default",
            pointerEvents: clickable ? "auto" : "none",
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "calc(100% - 28px)",
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
              border: "1px solid rgba(201,169,110,0.18)",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
              "&:hover": clickable ? {
                transform: "translateY(-5px) scale(1.04)",
                boxShadow: `0 12px 32px rgba(0,0,0,0.55), 0 0 0 1.5px ${palette.gold}55`,
              } : {},
            }}
          >
            <Box
              component="img"
              src={resolveImageUrl(poster.imageUrl)}
              alt={poster.title ?? "Poster"}
              sx={{
                height: "100%",
                width: "auto",
                maxWidth: "none",
                objectFit: "contain",
                display: "block",
                transition: "opacity 0.25s ease",
                "&:hover": clickable ? { opacity: 0.9 } : {},
              }}
            />
            {/* Gold sheen on hover */}
            {clickable && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${palette.gold}00 40%, ${palette.gold}22 100%)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  ".MuiBox-root:hover > &": { opacity: 1 },
                  pointerEvents: "none",
                }}
              />
            )}
          </Box>
        </Box>
      );
    });

  return (
    <>
      {/* ── Poster Bar ── */}
      <Box
        sx={{
          width: "100%",
          height: BAR_HEIGHT,
          overflow: "hidden",
          position: "relative",
          isolation: "isolate",
          /* Brand-aligned background — matches site charcoal dark sections */
          background: `
            radial-gradient(ellipse at 15% 50%, rgba(190,89,83,0.22) 0%, transparent 52%),
            radial-gradient(ellipse at 85% 50%, rgba(44,85,48,0.18) 0%, transparent 52%),
            linear-gradient(180deg, ${palette.charcoal} 0%, #241C19 50%, ${palette.charcoal} 100%)
          `,
          /* Gold top + bottom accent lines */
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            background: `linear-gradient(90deg, transparent 0%, ${palette.gold}88 30%, ${palette.gold} 50%, ${palette.gold}88 70%, transparent 100%)`,
            zIndex: 3,
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            background: `linear-gradient(90deg, transparent 0%, ${palette.gold}88 30%, ${palette.gold} 50%, ${palette.gold}88 70%, transparent 100%)`,
            zIndex: 3,
            pointerEvents: "none",
          },
        }}
      >
        {/* Animated shimmer sweep */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "35%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              animation: `${shimmer} 8s ease-in-out infinite`,
            },
          }}
        />

        {/* Left fade + "NOW SHOWING" label */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: { xs: 90, sm: 130, md: 160 },
            zIndex: 4,
            pointerEvents: "none",
            background: `linear-gradient(to right, ${palette.charcoal} 0%, ${palette.charcoal} 38%, transparent 100%)`,
            display: "flex",
            alignItems: "center",
            pl: { xs: 1.5, md: 2.5 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {/* Live dot */}
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: palette.gold,
                animation: `${pulse} 2.2s ease-in-out infinite`,
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "0.52rem", md: "0.62rem" },
                fontWeight: 700,
                color: palette.gold,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                lineHeight: 1.3,
                writingMode: "horizontal-tb",
              }}
            >
              Now<br />Showing
            </Typography>
          </Box>
        </Box>

        {/* Right fade */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: { xs: 64, md: 100 },
            zIndex: 4,
            pointerEvents: "none",
            background: `linear-gradient(to left, ${palette.charcoal} 0%, transparent 100%)`,
          }}
        />

        {/* Hidden measurement row */}
        <Box
          ref={measureRef}
          sx={{
            display: "flex",
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            height: BAR_HEIGHT,
          }}
        >
          {posterItems(posters, "measure", false)}
        </Box>

        {/* Scrolling track */}
        <Box
          ref={trackRef}
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "max-content",
            willChange: "transform",
            userSelect: "none",
          }}
        >
          {posterItems(repeatedPosters, "track", true)}
        </Box>
      </Box>

      {/* ── Lightbox ── */}
      <Dialog
        open={lightboxIdx !== null}
        onClose={() => setLightboxIdx(null)}
        maxWidth={false}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: "rgba(10,7,5,0.94)",
              backdropFilter: "blur(4px)",
            },
          },
          paper: {
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              m: 0,
              maxWidth: "92vw",
              maxHeight: "90vh",
            },
          },
        }}
      >
        {activePoster && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={() => setLightboxIdx(null)}
              sx={{
                position: "absolute",
                top: -52,
                right: -8,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  bgcolor: `${palette.primary.main}CC`,
                  borderColor: palette.primary.main,
                },
                transition: "all 0.2s ease",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Image with rounded border and gold ring */}
            <Box
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1.5px ${palette.gold}55`,
                border: `1px solid ${palette.gold}33`,
              }}
            >
              <Box
                component="img"
                src={resolveImageUrl(activePoster.imageUrl)}
                alt={activePoster.title ?? "Poster"}
                sx={{
                  maxWidth: "88vw",
                  maxHeight: "76vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            {/* Title + description */}
            {(activePoster.title || activePoster.description) && (
              <Box
                sx={{
                  mt: 2.5,
                  textAlign: "center",
                  maxWidth: 560,
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {activePoster.title && (
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {activePoster.title}
                  </Typography>
                )}
                {activePoster.description && (
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}
                  >
                    {activePoster.description}
                  </Typography>
                )}
              </Box>
            )}

            {/* Counter pill */}
            {posters.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -44,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "999px",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
                  {(lightboxIdx ?? 0) + 1}
                </Typography>
                <Box sx={{ width: 14, height: 1, bgcolor: "rgba(255,255,255,0.25)", borderRadius: 1 }} />
                <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
                  {posters.length}
                </Typography>
              </Box>
            )}

            {/* Prev / Next */}
            {posters.length > 1 && (
              <>
                <IconButton
                  onClick={lightboxPrev}
                  sx={{
                    position: "absolute",
                    left: { xs: -44, md: -70 },
                    top: "45%",
                    transform: "translateY(-50%)",
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: `${palette.gold}33`, borderColor: palette.gold },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronLeftIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={lightboxNext}
                  sx={{
                    position: "absolute",
                    right: { xs: -44, md: -70 },
                    top: "45%",
                    transform: "translateY(-50%)",
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: `${palette.gold}33`, borderColor: palette.gold },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChevronRightIcon fontSize="large" />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Dialog>
    </>
  );
}
