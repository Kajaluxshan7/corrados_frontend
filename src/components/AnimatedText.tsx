import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: "body" | "heading";
}

export default function AnimatedText({
  text,
  className,
  variant = "body",
}: AnimatedTextProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.85", "end 0.2"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={targetRef}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: variant === "heading" ? "center" : "flex-start",
      }}
    >
      {words.map((word, wIdx) => {
        // Splitting into words is cleaner than characters to prevent mid-word wrapping breaks
        const wordChars = word.split("");
        const wordGlobalStartIdx = text.split(" ").slice(0, wIdx).join(" ").length + (wIdx > 0 ? 1 : 0);

        return (
          <span
            key={wIdx}
            style={{ display: "inline-flex", marginRight: "0.35em" }}
          >
            {wordChars.map((char, cIdx) => {
              const charIdx = wordGlobalStartIdx + cIdx;
              const start = charIdx / text.length;
              const end = (charIdx + 1) / text.length;

              // Opacity maps from 0.2 to 1.0 sequentially
              const opacity = useTransform(
                scrollYProgress,
                [0, 0.1 + start * 0.75, 0.25 + end * 0.75],
                [0.2, 0.2, 1.0],
              );

              return (
                <motion.span
                  key={cIdx}
                  style={{ opacity }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
}
