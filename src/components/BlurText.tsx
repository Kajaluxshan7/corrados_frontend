import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function BlurText({ text, className, align = "center" }: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  
  // Intersection Observer triggers on 10% visibility (amount: 0.1)
  const isInView = useInView(ref, { amount: 0.1, once: true });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        rowGap: "0.1em",
      }}
    >
      {words.map((word, i) => {
        const delay = (i * 35) / 1000; // rapid 35ms stagger

        return (
          <motion.span
            key={i}
            initial={{ filter: "blur(5px)", opacity: 0, y: 15 }}
            animate={
              isInView
                ? {
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1], // premium cubic-bezier easing curve
              delay: delay,
            }}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
