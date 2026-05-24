/**
 * SiteImagesContext
 *
 * Fetches the key→imageUrl map from GET /site-images once on mount,
 * then re-fetches automatically whenever the backend broadcasts
 * the `siteImages:updated` WebSocket event.
 *
 * Usage:
 *   const { getImage } = useSiteImages();
 *   const src = getImage('hero_about', '/restaurant/owner_and_logo.jpg');
 */
import {
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { fetchSiteImages } from "../services/api";
import { resolveImageUrl } from "../config/api";
import { useWsRefresh } from "../hooks/useWebSocket";
import { WsEvent } from "./WebSocketContext";

interface SiteImagesContextType {
  /** Returns the current image URL for `key`, falling back to `defaultUrl`. */
  getImage: (key: string, defaultUrl: string) => string;
  /** True while the initial fetch is in-flight. */
  loading: boolean;
}

export const SiteImagesContext = createContext<SiteImagesContextType | undefined>(
  undefined,
);

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetchSiteImages()
      .then((data) => {
        setMap(data);
        setLoading(false);
      })
      .catch(() => {
        // Silently fall back — pages use their hardcoded defaults
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live-update whenever the admin changes an image
  useWsRefresh(WsEvent.SITE_IMAGES_UPDATED, load);

  const getImage = useCallback(
    (key: string, defaultUrl: string): string => {
      const stored = map[key];
      return stored && stored.trim() ? resolveImageUrl(stored) : defaultUrl;
    },
    [map],
  );

  return (
    <SiteImagesContext.Provider value={{ getImage, loading }}>
      {children}
    </SiteImagesContext.Provider>
  );
}

