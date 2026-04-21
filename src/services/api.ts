/**
 * Corrado's frontend API service.
 * All functions fetch live data from the NestJS backend (port 5000).
 * The static data files in src/data/ serve as UI development fallbacks only.
 */
import { API_BASE_URL } from '../config/api';

// ─── Shared fetch helper ──────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 15_000;

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // If caller passes a signal, abort our controller when it fires
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Backend shapes ───────────────────────────────────────────────────────────

export interface ApiMenuItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  imageUrls: string[];
  dietaryInfo: string[];
  allergens: string[];
  isAvailable: boolean;
  sortOrder: number;
  hasMeasurements: boolean;
  measurements?: ApiMeasurement[];
}

export interface ApiMeasurement {
  id: string;
  price: number;
  isAvailable: boolean;
  sortOrder: number;
  measurementTypeEntity: { id: string; name: string; description: string | null } | null;
}

export interface ApiMenuCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  menuItems: ApiMenuItem[];
}

export interface ApiPrimaryCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  categories: ApiMenuCategory[];
}

export interface ApiSpecial {
  id: string;
  title: string;
  description: string;
  type: string;
  dayOfWeek: string | null;
  isActive: boolean;
  imageUrls: string[];
  sortOrder: number;
  displayStartDate: string | null;
  displayEndDate: string | null;
}

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  eventStartDate: string;
  eventEndDate: string;
  displayStartDate: string;
  displayEndDate: string;
  isActive: boolean;
  imageUrls: string[];
  ticketLink: string | null;
}

export interface ApiPartyMenuItem {
  id: string;
  name: string;
  description: string;
  notes: string;
  isAvailable: boolean;
  sortOrder: number;
}

export interface ApiPartySection {
  id: string;
  title: string;
  sectionType: string;
  instruction: string;
  sortOrder: number;
  items: ApiPartyMenuItem[];
}

export interface ApiPartyMenu {
  id: string;
  name: string;
  menuType: 'cocktail' | 'party';
  pricePerPerson: number;
  minimumGuests: number | null;
  maximumGuests: number | null;
  description: string;
  isActive: boolean;
  imageUrls: string[];
  sortOrder: number;
  sections: ApiPartySection[];
}

// ─── Stories (Gallery) ────────────────────────────────────────────────────────

export interface ApiFamilyMealAddon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  sortOrder: number;
}

export interface ApiFamilyMeal {
  id: string;
  name: string;
  description: string | null;
  serves: string;
  basePrice: number;
  priceLabel: string;
  mealType: 'combo' | 'daily_special';
  availableFor: string[];
  items: string[];
  isActive: boolean;
  sortOrder: number;
  imageUrls: string[];
  addons: ApiFamilyMealAddon[];
}

// ─── Stories (Gallery) ────────────────────────────────────────────────────────

export interface ApiStory {
  id: string;
  categoryId: string;
  imageUrls: string[];
  isActive: boolean;
  sortOrder: number;
  category?: ApiStoryCategory;
}

export interface ApiStoryCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  stories: ApiStory[];
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const fetchPrimaryCategories = () =>
  get<ApiPrimaryCategory[]>('/menu/primary-categories');

export const fetchItemsByCategory = (categoryId: string) =>
  get<ApiMenuItem[]>(`/menu/categories/${categoryId}/items`);

export const fetchSpecials = () => get<ApiSpecial[]>('/specials/active');

export const fetchEvents = () => get<ApiEvent[]>('/events/active');

export const fetchPartyMenus = () => get<ApiPartyMenu[]>('/party-menu');

export const fetchFamilyMeals = () => get<ApiFamilyMeal[]>("/family-meals");

export const fetchStoryCategories = () =>
  get<ApiStoryCategory[]>('/stories/categories');

/**
 * Fetch the site-images map (key → imageUrl) from the backend.
 * Used by the SiteImagesContext to power dynamic images across all pages.
 */
export const fetchSiteImages = () =>
  get<Record<string, string>>('/site-images');
