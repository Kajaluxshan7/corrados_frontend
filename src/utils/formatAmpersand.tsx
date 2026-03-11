import { Fragment } from "react";

/**
 * Renders text with ampersands (&) in the body font (Lato)
 * instead of the heading font (Playfair Display).
 */
export function formatAmpersand(text: string) {
  const parts = text.split("&");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <span style={{ fontFamily: '"Lato", sans-serif' }}>&amp;</span>
      )}
    </Fragment>
  ));
}
