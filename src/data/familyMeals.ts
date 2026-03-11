import type { FamilyMeal } from '../types';

export const familyMeals: FamilyMeal[] = [
  {
    id: 'classic-italian',
    name: 'Classic Italian Family Dinner',
    description: 'Our most popular family meal — a complete Italian dining experience for the whole family.',
    serves: '4–6',
    price: '$69.99',
    items: [
      'Mixed garden salad with house dressing',
      'Garlic bread (full loaf)',
      'Choice of pasta: Spaghetti Bolognese, Fettuccine Alfredo, or Penne Arrabbiata (full tray)',
      'Chicken Parmigiana (4 pieces)',
      'Tiramisu (6 portions)',
    ],
  },
  {
    id: 'pizza-party',
    name: 'Pizza Party Pack',
    description: 'Perfect for game nights, kids\' parties, or a casual family evening at home.',
    serves: '4–6',
    price: '$59.99',
    items: [
      '3 large pizzas (choose from our full pizza menu)',
      '2 lbs of wings (choice of 2 sauces)',
      'Garlic bread sticks (12 pieces)',
      'Caesar salad (large)',
      '2-litre soft drink',
    ],
  },
  {
    id: 'sunday-feast',
    name: 'Sunday Italian Feast',
    description: 'A hearty spread inspired by traditional Italian Sunday family dinners.',
    serves: '6–8',
    price: '$99.99',
    items: [
      'Bruschetta platter',
      'Caprese salad (large)',
      'Lasagna al Forno (full tray)',
      'Chicken Marsala (6 portions)',
      'Roasted seasonal vegetables',
      'Garlic bread (2 loaves)',
      'Cannoli platter (8 pieces)',
    ],
  },
  {
    id: 'date-night',
    name: 'Date Night for Two',
    description: 'A romantic Italian dinner for two with wine pairing — no cooking required.',
    serves: '2',
    price: '$54.99',
    items: [
      'Bruschetta Classica',
      'Caesar salad for two',
      '2 pasta entrées of your choice',
      'Bottle of select Italian wine',
      '2 slices of tiramisu',
    ],
  },
];
