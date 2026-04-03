/**
 * API configuration for the Corrado's frontend.
 * Backend runs on port 5000; this base URL is used for all API calls.
 */
export const API_BASE_URL =
  (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env
    ?.VITE_API_BASE_URL ?? 'http://localhost:5000';

/**
 * Resolve a backend image URL to its full form.
 * - Absolute URLs (http/https) are returned as-is.
 * - Relative paths (e.g. /uploads/...) are prefixed with the API base URL.
 * - Empty / null returns an empty string so callers can fall back to the logo.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
}
