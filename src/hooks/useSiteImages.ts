import { useContext } from "react";
import { SiteImagesContext } from "../contexts/SiteImagesContext";

export function useSiteImages() {
  const ctx = useContext(SiteImagesContext);
  if (!ctx) {
    throw new Error("useSiteImages must be used inside SiteImagesProvider");
  }
  return ctx;
}
