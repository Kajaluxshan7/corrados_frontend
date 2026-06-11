import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Heavy, single-purpose transition effect used only when a Home bento tile is
// clicked. Lives in its own module so it can be lazy-loaded on demand instead
// of shipping in the main Home bundle (Phase 3 — code-splitting).

const SHARDS_POLYGONS = [
  "polygon(0% 0%, 50% 0%, 35% 45%)",
  "polygon(50% 0%, 100% 0%, 65% 45%)",
  "polygon(0% 0%, 0% 50%, 35% 45%)",
  "polygon(100% 0%, 65% 45%, 100% 50%)",
  "polygon(50% 0%, 35% 45%, 65% 45%)",
  "polygon(0% 50%, 35% 45%, 50% 100%)",
  "polygon(65% 45%, 100% 50%, 50% 100%)",
  "polygon(35% 45%, 65% 45%, 50% 100%)",
  "polygon(0% 50%, 0% 100%, 50% 100%)",
  "polygon(100% 50%, 50% 100%, 100% 100%)",
];

const getPortalShardVariants = (index: number) => {
  const randomVal = (index * 79) % 100;
  const randomSign = index % 2 === 0 ? -1 : 1;

  let dirX = 0;
  let dirY = 0;
  switch (index) {
    case 0: dirX = -0.9; dirY = -0.9; break;
    case 1: dirX = 0.9; dirY = -0.9; break;
    case 2: dirX = -1.1; dirY = -0.3; break;
    case 3: dirX = 1.1; dirY = -0.3; break;
    case 4: dirX = 0; dirY = -1.2; break;
    case 5: dirX = -1.1; dirY = 0.3; break;
    case 6: dirX = 1.1; dirY = 0.3; break;
    case 7: dirX = 0; dirY = 1.2; break;
    case 8: dirX = -0.9; dirY = 0.9; break;
    case 9: dirX = 0.9; dirY = 0.9; break;
  }

  const targetX = dirX * (45 + (randomVal % 70));
  const targetY = dirY * (45 + (randomVal % 70)) + 240;

  const rotateX = randomSign * (150 + randomVal * 2.2);
  const rotateY = -randomSign * (150 + randomVal * 1.8);
  const rotateZ = randomSign * (90 + randomVal * 0.8);

  return {
    initial: {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      scale: 1,
    },
    shattered: {
      x: targetX,
      y: targetY,
      rotateX: rotateX,
      rotateY: rotateY,
      rotateZ: rotateZ,
      opacity: [1, 0.95, 0],
      scale: [1, 2.1, 7.0],
      transition: {
        duration: 1.3,
        times: [0, 0.4, 1],
        ease: [0.19, 1, 0.22, 1] as const,
      },
    },
  };
};

export default function ShatterPortalOverlay({
  rect,
  image,
  label,
  tagline,
  previewImages,
  isTriggered,
  onComplete,
}: {
  rect: DOMRect | null;
  image: string;
  label: string;
  tagline: string;
  previewImages: string[];
  isTriggered: boolean;
  onComplete?: () => void;
}) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isTriggered && onComplete) {
      const delay = isReducedMotion ? 0 : 1500;
      const timer = setTimeout(() => {
        onComplete();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isTriggered, onComplete, isReducedMotion]);

  if (!isTriggered || !rect) return null;

  if (isReducedMotion) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(12, 10, 9, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Cinematic Full-screen Lens Flare Flash Shockwave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.75,
          delay: 0.35,
          times: [0, 0.2, 1],
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, #ffffff 0%, rgba(255, 255, 255, 0.95) 25%, rgba(201, 169, 110, 0.35) 60%, transparent 100%)",
          mixBlendMode: "screen",
          zIndex: 14,
          pointerEvents: "none",
        }}
      />

      {/* Charcoal Cross-fade Plate (cross-fades the white glass haze to theme charcoal in the final 350ms) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{
          duration: 1.5,
          times: [0, 0.76, 1],
          ease: "easeInOut" as const,
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#0C0A09",
          zIndex: 15,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          zIndex: 2,
          perspective: "1400px",
          transformStyle: "preserve-3d",
          overflow: "visible",
        }}
      >
        {/* Central Expanding Light Ring Shockwave */}
        <motion.div
          initial={{ scale: 0.1, opacity: 1 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{
            duration: 0.95,
            delay: 0,
            ease: [0.1, 0.8, 0.1, 1],
          }}
          style={{
            position: "absolute",
            left: rect.width / 2,
            top: rect.height / 2,
            width: 500,
            height: 500,
            marginLeft: -250,
            marginTop: -250,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffffff 0%, #C9A96E 30%, rgba(201, 169, 110, 0.6) 55%, rgba(201, 169, 110, 0) 80%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.15, 12.0],
            opacity: [0, 1, 1],
            rotate: [0, 180],
          }}
          transition={{
            duration: 1.15,
            delay: 0.35,
            times: [0, 0.35, 1],
            ease: [0.19, 1, 0.22, 1] as const,
          }}
          style={{
            position: "absolute",
            left: rect.width / 2,
            top: rect.height / 2,
            width: 400,
            height: 400,
            marginLeft: -200,
            marginTop: -200,
            zIndex: 1,
            pointerEvents: "none",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {/* Double-Layer Premium Frosted Crystal Glass Portal */}

          {/* 1. Outer Glass Ring Edge */}
          <div
            style={{
              position: "absolute",
              inset: -24,
              borderRadius: "50%",
              border: "1.5px solid rgba(255, 255, 255, 0.45)",
              background: "rgba(255, 255, 255, 0.04)",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* 2. Main Crystal Lens Body */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 35%, rgba(255, 255, 255, 0.03) 65%, rgba(255, 255, 255, 0.25) 100%)",
              border: "3.5px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 0 160px rgba(255, 255, 255, 0.45), inset 0 0 80px rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(35px)",
              WebkitBackdropFilter: "blur(35px)",
            }}
          />

          {/* 3. Glossy Glass Reflection Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* 3D Contextual Image Stream Tunnel */}
        {previewImages && previewImages.map((imgSrc, idx) => {
          const delay = 0.35 + 0.06 + idx * 0.09;
          const duration = 1.15 - idx * 0.05;
          const rotateDirection = idx % 2 === 0 ? 1 : -1;
          const targetRotate = rotateDirection * (15 + (idx * 6));

          // Calculate radial drift direction based on index to spread in 8 distinct directions
          const angleRad = (idx * (360 / 8) * Math.PI) / 180;
          const driftDistance = 580 + (idx * 35);
          const targetX = Math.cos(angleRad) * driftDistance;
          const targetY = Math.sin(angleRad) * driftDistance * 0.72;

          return (
            <motion.div
              key={imgSrc + idx}
              initial={{ scale: 0, opacity: 0, rotate: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 8.5],
                opacity: [0, 1, 0.9, 0],
                rotate: [0, targetRotate * 0.4, targetRotate],
                x: [0, targetX],
                y: [0, targetY],
              }}
              transition={{
                duration: duration,
                delay: delay,
                times: [0, 0.25, 0.6, 1],
                ease: [0.19, 1, 0.22, 1] as const,
              }}
              style={{
                position: "absolute",
                left: rect.width / 2,
                top: rect.height / 2,
                width: 280,
                height: 200,
                marginLeft: -140,
                marginTop: -100,
                zIndex: 5 + idx,
                pointerEvents: "none",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  border: "2px solid #C9A96E",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
                  overflow: "hidden",
                  backgroundColor: "#0C0A09",
                  position: "relative",
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Preview ${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, rgba(12, 10, 9, 0.0) 50%, rgba(12, 10, 9, 0.6) 100%)",
                  }}
                />
              </div>
            </motion.div>
          );
        })}

        {SHARDS_POLYGONS.map((polygon, i) => {
          const variants = getPortalShardVariants(i);
          return (
            <motion.div
              key={i}
              variants={variants}
              initial="initial"
              animate="shattered"
              style={{
                position: "absolute",
                inset: 0,
                clipPath: polygon,
                WebkitClipPath: polygon,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#000",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(20,15,12,0.06) 0%, rgba(20,15,12,0.65) 60%, rgba(20,15,12,0.92) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 12,
                    border: "1px solid rgba(201, 169, 110, 0.6)", // Fine gold accent outline
                    borderRadius: "6px",
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      background: "rgba(190, 89, 83, 0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      marginBottom: "6px",
                      padding: "3px 7px",
                      borderRadius: "3px",
                      width: "fit-content",
                      textTransform: "uppercase",
                    }}
                  >
                    {tagline}
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "18px",
                      letterSpacing: "0.01em",
                      textShadow: "0 3px 14px rgba(0,0,0,0.6)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
