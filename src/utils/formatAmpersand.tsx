/**
 * Previously wrapped ampersands in a Lato span to override Playfair Display's
 * stylistic italic & glyph. Now a no-op: the AmpersandFix @font-face in
 * index.css handles this globally via unicode-range, so no JS wrapper is needed.
 */
export function formatAmpersand(text: string): string {
  return text;
}
