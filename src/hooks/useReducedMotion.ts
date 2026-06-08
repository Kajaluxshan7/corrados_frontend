import { useEffect, useState } from "react";

/**
 * Single source of truth for honoring the user's "reduce motion" OS setting.
 * Re-exported so every animated component can gate its effects through one hook
 * instead of each re-implementing matchMedia checks (Phase 0 motion governance).
 *
 * Returns `true` when the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    // Safari < 14 uses addListener/removeListener.
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return reduced;
}

export default useReducedMotion;
