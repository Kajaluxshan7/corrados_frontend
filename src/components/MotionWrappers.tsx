import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, useVelocity, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// 1. TiltCard - Gorgeous 3D Tilt Hover Effect
export function TiltCard({
  children,
  className = "",
  style = {},
  maxRotate = 24,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxRotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxRotate, -maxRotate]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxRotate, maxRotate]), {
    stiffness: 120,
    damping: 18,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if touch device to disable interactive tilt (keeps scrolling smooth)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 ${className}`}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <motion.div
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
          scale: isHovered && !isMobile ? 1.025 : 1,
        }}
        className="w-full h-full transition-shadow duration-300"
      >
        {children}
      </motion.div>
    </div>
  );
}

// 2. ParallaxImage - Moves background image inside container on scroll
export function ParallaxImage({
  src,
  alt,
  className = "",
  style = {},
  speed = 0.12,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Map progress to translate Y
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${speed * 80}px`, `${speed * 80}px`]
  );

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative w-full h-full"
      style={style}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y: isReducedMotion ? 0 : y,
          scale: isReducedMotion ? 1 : 1.1 + speed,
        }}
        className={`w-full h-full object-cover absolute inset-0 ${className}`}
        loading="lazy"
      />
    </div>
  );
}

// 3. SpotlightCard - Cursor light follow glow effect
export function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(190, 89, 83, 0.15)",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
            zIndex: 1,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

// 4. InfiniteMarquee - Smooth looping slide track
export function InfiniteMarquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden w-full flex select-none"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className={`flex gap-6 py-4 flex-shrink-0 min-w-full ${
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{
          animationDuration: `${speed}s`,
          display: "flex",
        }}
      >
        <div className="flex gap-6 flex-shrink-0">{children}</div>
        <div className="flex gap-6 flex-shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

// 5. ScrollRotate3D - Perspective rotation + float-shift based on scroll
export function ScrollRotate3D({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const rotateY = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, -6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div
      ref={ref}
      className="perspective-1000 w-full h-full flex items-center justify-center"
      style={style}
    >
      <motion.div
        style={{
          rotateY: isReducedMotion ? 0 : rotateY,
          rotateX: isReducedMotion ? 0 : rotateX,
          scale: isReducedMotion ? 1 : scale,
          transformStyle: "preserve-3d",
        }}
        className={`w-full h-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 6. TextReveal - Elegant word-by-word slide clip mask
export function TextReveal({
  text,
  className = "",
  delay = 0,
  align = "left",
}: {
  text: string;
  className?: string;
  delay?: number;
  align?: "left" | "center" | "right";
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 12, filter: "blur(2px)" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
      }}
      style={{
        textAlign: align,
        width: "100%",
      }}
    >
      {text}
    </motion.p>
  );
}

// 7. CinematicReveal - Premium card/content reveals
export function CinematicReveal({
  children,
  className = "",
  style = {},
  type = "slide-up-skew",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: "slide-up-skew" | "clip-slide-right" | "clip-slide-left" | "wipe-gold" | "fade-in";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (isReducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  // Animation variants
  const getVariants = () => {
    switch (type) {
      case "slide-up-skew":
        return {
          initial: { opacity: 0, y: 60, rotateX: 10, transformPerspective: 1000 },
          animate: { opacity: 1, y: 0, rotateX: 0 },
        };
      case "clip-slide-right":
        return {
          initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 },
          animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 },
        };
      case "clip-slide-left":
        return {
          initial: { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", opacity: 0 },
          animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 },
        };
      case "wipe-gold":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "fade-in":
      default:
        return {
          initial: { opacity: 0, y: 25 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  const isOverflowHiddenNeeded = type === "wipe-gold" || type === "clip-slide-right" || type === "clip-slide-left";

  const transition = type === "wipe-gold"
    ? { duration: duration, ease: "easeOut" as const, delay: delay + duration * 0.35 }
    : { duration: duration, ease: [0.16, 1, 0.3, 1] as const, delay: delay };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: type === "slide-up-skew" ? "1000px" : "none",
        overflow: isOverflowHiddenNeeded ? "hidden" : "visible",
        ...style,
      }}
    >
      <motion.div
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        variants={variants}
        transition={transition}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* Wipe element for gold wipe */}
      {type === "wipe-gold" && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={isInView ? { x: ["-100%", "0%", "101%"] } : { x: "-100%" }}
          transition={{
            duration: duration * 1.2,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: delay,
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #BE5953 0%, #C9A96E 50%, #BE5953 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

// 8. MouseMoveSpotlight - Smooth mouse follow glow for sections
export function MouseMoveSpotlight({
  children,
  className = "",
  glowColor = "rgba(201, 169, 110, 0.06)",
  size = 600,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.6s ease",
            background: `radial-gradient(${size}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
            zIndex: 1,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

// 9. ScrollZoomContainer - Scroll-driven zoom and fade effects
export function ScrollZoomContainer({
  children,
  className = "",
  style = {},
  scaleRange = [1, 1.15],
  opacityRange = [0.6, 0],
  scrollRange = [0, 600],
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  scaleRange?: [number, number];
  opacityRange?: [number, number];
  scrollRange?: [number, number];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Map absolute scroll position to scale and opacity
  const scale = useTransform(scrollY, scrollRange, scaleRange);
  const opacity = useTransform(scrollY, scrollRange, opacityRange);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative ${className}`}
      style={style}
    >
      <motion.div
        style={{
          scale: isReducedMotion ? 1 : scale,
          opacity: isReducedMotion ? opacityRange[0] : opacity,
          width: "100%",
          height: "100%",
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

// 10. CSS Polygons for a 10-triangle seamless unit-square grid
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

export function ShatterPortalOverlay({
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
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.78, 1] }}
        transition={{
          duration: 1.15,
          delay: 0.35,
          times: [0, 0.5, 1],
          ease: "easeInOut" as const,
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 255, 255, 0.28)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          zIndex: 1,
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
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "6px",
                    opacity: 0.45,
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

// ─────────────────────────────────────────────────────────────────────────────
// 11. SplitWordReveal — Each word slides up from an overflow-hidden mask
//     The premier "modern agency" text effect. Respects reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────
export function SplitWordReveal({
  text,
  className = "",
  style = {},
  delay = 0,
  stagger = 0.08,
  duration = 0.65,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const words = text.split(" ");
  const TagComponent = Tag as React.ElementType;

  return (
    <TagComponent
      ref={ref}
      className={className}
      style={{ display: "inline", ...style }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduced ? false : { y: "110%", opacity: 0 }}
            animate={inView || reduced ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: reduced ? 0 : duration,
              delay: reduced ? 0 : delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </TagComponent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. ClipReveal — Clip-path wipe that reveals content like a curtain lifting
//     Direction: "up" | "left" | "right". Ultra-cinematic image reveals.
// ─────────────────────────────────────────────────────────────────────────────
export function ClipReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const clipMap = {
    up:    { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
    left:  { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
    right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", ...style }}
    >
      <motion.div
        initial={reduced ? false : { clipPath: clipMap[direction].hidden }}
        animate={inView || reduced ? { clipPath: clipMap[direction].visible } : {}}
        transition={{
          duration: reduced ? 0 : duration,
          delay: reduced ? 0 : delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. FloatingOrbs — Ambient blurred gradient orbs that drift slowly
//     Drop into any section as a background layer (position: absolute, inset 0)
// ─────────────────────────────────────────────────────────────────────────────
export function FloatingOrbs({
  colors = ["#BE5953", "#8B2020", "#C9A84C", "#5C2A2A"],
  count = 4,
  opacity = 0.28,
  blur = 80,
}: {
  colors?: string[];
  count?: number;
  opacity?: number;
  blur?: number;
}) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const orbs = Array.from({ length: count }, (_, i) => ({
    color: colors[i % colors.length],
    size: 280 + (i * 60),
    x: [15, 25, 70, 55][i % 4],
    y: [20, 65, 40, 80][i % 4],
    duration: 14 + i * 3.5,
    xRange: [(-12 - i * 4), (12 + i * 4)] as [number, number],
    yRange: [(-10 - i * 3), (10 + i * 3)] as [number, number],
    delay: i * 2.2,
  }));

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            opacity,
            filter: `blur(${blur}px)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={reduced ? {} : {
            x: orb.xRange,
            y: orb.yRange,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. GrainOverlay — SVG turbulence noise texture for tactile depth
//     Overlay on any section: <GrainOverlay /> inside position:relative container
// ─────────────────────────────────────────────────────────────────────────────
export function GrainOverlay({
  opacity = 0.055,
  blendMode = "overlay",
}: {
  opacity?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
}) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        mixBlendMode: blendMode,
        zIndex: 1,
      }}
    >
      <filter id="grain-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. CountUp — Smooth animated number counter that triggers on scroll-in
//     Supports suffix ("+", "★", " Days"), prefix ("$"), and decimal
// ─────────────────────────────────────────────────────────────────────────────
export function CountUp({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.8,
  delay = 0,
  className = "",
  style = {},
}: {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(from);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (!inView || started) return;
    setStarted(true);
    if (reduced) { setDisplay(to); return; }

    let startTime: number | null = null;
    const totalMs = duration * 1000;
    const delayMs = delay * 1000;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime - delayMs;
      if (elapsed < 0) { rafRef.current = requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / totalMs, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(to);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, started, from, to, duration, delay, reduced]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. ScrollVelocityText — Marquee whose speed reacts to scroll velocity
//     Text drifts at base speed; scrolling faster makes it race.
// ─────────────────────────────────────────────────────────────────────────────
export function ScrollVelocityText({
  text,
  baseVelocity = 3,
  className = "",
  style = {},
}: {
  text: string;
  baseVelocity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const [reduced, setReduced] = useState(false);
  const directionFactor = useRef(1);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 60;
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${v % 100}%`);
  const repeated = `${text}  ·  `.repeat(8);

  return (
    <div
      className={className}
      style={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", flexWrap: "nowrap", ...style }}
    >
      <motion.div style={{ display: "flex", whiteSpace: "nowrap", x }}>
        <span style={{ display: "block", paddingRight: "2rem" }}>{repeated}</span>
        <span style={{ display: "block", paddingRight: "2rem" }}>{repeated}</span>
      </motion.div>
    </div>
  );
}


