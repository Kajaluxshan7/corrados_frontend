import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
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
