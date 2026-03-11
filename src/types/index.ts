export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image?: string;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface Special {
  id: string;
  title: string;
  description: string;
  day?: string;
  price?: string;
  image?: string;
  badge?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
  category: 'sports' | 'live-music' | 'private' | 'seasonal' | 'community';
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'food' | 'interior' | 'events' | 'drinks';
  type: 'image' | 'video';
  videoUrl?: string;
}

export interface FamilyMeal {
  id: string;
  name: string;
  description: string;
  serves: string;
  price: string;
  items: string[];
  image?: string;
}

export interface PartyPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: string;
  minGuests: number;
  includes: string[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
  orderUrl: string;
  giftCardUrl: string;
  social: SocialLink[];
}
