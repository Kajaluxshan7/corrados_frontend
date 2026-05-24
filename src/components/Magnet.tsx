import { useRef, useState, useEffect, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export default function Magnet({
  children,
  padding = 100,
  strength = 3,
  activeTransition = "transform 0.15s cubic-bezier(0.25, 0.61, 0.35, 1)",
  inactiveTransition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "translate3d(0px, 0px, 0px)",
    transition: inactiveTransition,
    willChange: "transform",
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < padding) {
        const moveX = distX / strength;
        const moveY = distY / strength;
        setStyle({
          transform: `translate3d(${moveX}px, ${moveY}px, 0px)`,
          transition: activeTransition,
          willChange: "transform",
        });
      } else {
        setStyle({
          transform: "translate3d(0px, 0px, 0px)",
          transition: inactiveTransition,
          willChange: "transform",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
