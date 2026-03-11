import type { Special } from '../types';

export const specials: Special[] = [
  {
    id: 'monday-pasta',
    title: 'Monday Pasta Night',
    description: 'Enjoy any pasta dish from our menu at a special price. Includes complimentary garlic bread with every pasta order.',
    day: 'Monday',
    price: '$13.99',
    badge: 'Most Popular',
  },
  {
    id: 'tuesday-pizza',
    title: 'Two-for-Tuesday Pizza',
    description: 'Buy any large pizza and get the second one at half price. Perfect for sharing with family and friends.',
    day: 'Tuesday',
    price: '50% off 2nd Pizza',
    badge: 'Best Deal',
  },
  {
    id: 'wednesday-wings',
    title: 'Wing Wednesday',
    description: 'All-you-can-eat wings with your choice of any sauce. Served with celery, carrots, and your choice of dip.',
    day: 'Wednesday',
    price: '$19.99',
  },
  {
    id: 'thursday-wine',
    title: 'Thirsty Thursday',
    description: 'Half-price bottles of select wines from our curated Italian wine list. Ask your server for this week\'s featured selections.',
    day: 'Thursday',
    price: '50% off Wine',
    badge: 'Wine Lovers',
  },
  {
    id: 'friday-seafood',
    title: 'Friday Seafood Feature',
    description: 'Fresh seafood specials including our chef\'s catch of the day, linguine alle vongole, and grilled calamari platter.',
    day: 'Friday',
    price: 'Starting at $18.99',
  },
  {
    id: 'weekend-brunch',
    title: 'Weekend Family Feast',
    description: 'Bring the whole family for our weekend special — a shared antipasto platter to start, followed by your choice of entrées at special family pricing.',
    day: 'Sat & Sun',
    price: '$22.99/person',
    badge: 'Family Favorite',
  },
  {
    id: 'lunch-combo',
    title: 'Lunch Combo',
    description: 'Available daily from 12pm–3pm. Choose any soup or salad plus a half sandwich, pasta, or personal pizza.',
    day: 'Daily',
    price: '$12.99',
  },
  {
    id: 'happy-hour',
    title: 'Happy Hour',
    description: 'Enjoy discounted appetizers and drink specials every day from 3pm–5pm. Great for after-work gatherings.',
    day: 'Daily 3–5pm',
    price: 'Apps from $6.99',
  },
];
