import { useEffect } from "react";

interface PageMetaOptions {
  /** Short page title — site name is appended automatically */
  title: string;
  description?: string;
  /** Relative path e.g. "/orrdos/exterior-building.jpg" */
  ogImage?: string;
  /** og:type — defaults to "website"; use "article" for blog-style pages */
  ogType?: string;
}

const SITE_DOMAIN = "https://www.corradosrestaurant.com";
const SITE_NAME   = "Corrado's Restaurant and Bar";
const DEFAULT_IMAGE = "/orrdos/exterior-building.jpg";
const DEFAULT_DESCRIPTION =
  "Corrado's Restaurant & Bar — authentic Italian dining in Whitby, ON since 2010. Handmade pasta, stone-oven pizza, daily specials, family meals & private events.";

/**
 * Updates document title, canonical link, and all OG / Twitter meta tags
 * for the current page. Resets on unmount.
 */
export function usePageMeta({
  title,
  description,
  ogImage,
  ogType = "website",
}: PageMetaOptions) {
  useEffect(() => {
    const fullTitle   = `${title} | ${SITE_NAME}`;
    const metaDescription = description ?? DEFAULT_DESCRIPTION;
    const imageRelative = ogImage ?? DEFAULT_IMAGE;
    const imageAbsolute = `${SITE_DOMAIN}${imageRelative}`;
    const canonicalUrl  = `${SITE_DOMAIN}${window.location.pathname}`;

    // ── Document title ───────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Canonical ────────────────────────────────────────────────────────
    setLink("canonical", canonicalUrl);

    // ── OG ──────────────────────────────────────────────────────────────
    setMeta("og:type",        ogType,        "property");
    setMeta("og:title",       fullTitle,     "property");
    setMeta("og:url",         canonicalUrl,  "property");
    setMeta("og:image",       imageAbsolute, "property");
    setMeta("og:image:secure_url", imageAbsolute, "property");
    setMeta("og:site_name",   SITE_NAME,     "property");
    setMeta("og:locale",      "en_CA",       "property");
    setMeta("og:description", metaDescription, "property");

    // ── Twitter ──────────────────────────────────────────────────────────
    setMeta("twitter:card",  "summary_large_image", "name");
    setMeta("twitter:title", fullTitle,             "name");
    setMeta("twitter:image", imageAbsolute,         "name");
    setMeta("twitter:description", metaDescription, "name");

    // ── Primary description ──────────────────────────────────────────────
    setMeta("description", metaDescription, "name");

    // ── Robots (all pages are indexable) ─────────────────────────────────
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large", "name");

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, ogImage, ogType]);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function setMeta(key: string, content: string, attr: "property" | "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
