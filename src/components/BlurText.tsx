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
        const delay = (i * 100) / 1000; // delay in seconds

        return (
          <motion.span
            key={i}
            initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
            animate={
              isInView
                ? {
                    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                    opacity: [0, 0.5, 1],
                    y: [50, -5, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.7, // 0.35s * 2 steps
              times: [0, 0.5, 1],
              ease: "easeOut",
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
