import type { MenuCategory } from '../types';

export const menuCategories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal with our handcrafted Italian starters',
    items: [
      { name: 'Bruschetta Classica', description: 'Toasted ciabatta topped with fresh tomatoes, basil, garlic, and extra virgin olive oil', price: '$12.99', tags: ['vegetarian'] },
      { name: 'Calamari Fritti', description: 'Lightly breaded calamari rings fried golden and served with marinara and lemon aioli', price: '$14.99' },
      { name: 'Caprese Salad', description: 'Fresh buffalo mozzarella, vine-ripened tomatoes, and basil with balsamic reduction', price: '$13.99', tags: ['vegetarian', 'gluten-free'] },
      { name: 'Garlic Bread', description: 'House-baked bread with roasted garlic butter and herbs', price: '$8.99', tags: ['vegetarian'] },
      { name: 'Meatballs al Forno', description: 'Oven-baked meatballs in our signature tomato sauce with melted mozzarella', price: '$13.99' },
      { name: 'Spinach & Artichoke Dip', description: 'Creamy spinach and artichoke dip served with warm pita and tortilla chips', price: '$13.99', tags: ['vegetarian'] },
    ],
  },
  {
    id: 'pasta',
    name: 'Pasta',
    description: 'Traditional Italian pasta dishes made fresh daily',
    items: [
      { name: 'Spaghetti Bolognese', description: 'Classic meat sauce slow-simmered with San Marzano tomatoes over spaghetti', price: '$17.99' },
      { name: 'Fettuccine Alfredo', description: 'Creamy parmesan alfredo sauce tossed with fettuccine, add chicken or shrimp', price: '$16.99', tags: ['vegetarian'] },
      { name: 'Penne Arrabbiata', description: 'Penne in a spicy tomato sauce with garlic, chili flakes, and fresh parsley', price: '$15.99', tags: ['vegetarian'] },
      { name: 'Lasagna al Forno', description: 'Layers of fresh pasta, meat ragù, béchamel, and three cheeses baked to perfection', price: '$18.99' },
      { name: 'Linguine alle Vongole', description: 'Linguine with fresh clams in a white wine, garlic, and butter sauce', price: '$21.99' },
      { name: 'Rigatoni alla Vodka', description: 'Rigatoni in a creamy tomato vodka sauce with fresh basil and parmesan', price: '$17.99' },
      { name: 'Gnocchi Gorgonzola', description: 'Potato gnocchi in a rich gorgonzola cream sauce with toasted walnuts', price: '$18.99', tags: ['vegetarian'] },
    ],
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'Hand-tossed pizzas baked in our stone oven',
    items: [
      { name: 'Margherita', description: 'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil', price: '$15.99', tags: ['vegetarian'] },
      { name: 'Pepperoni', description: 'Classic pepperoni with mozzarella and our signature tomato sauce', price: '$16.99' },
      { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesan, and fontina cheese blend', price: '$17.99', tags: ['vegetarian'] },
      { name: 'Meat Lovers', description: 'Pepperoni, Italian sausage, bacon, and ham with mozzarella', price: '$19.99' },
      { name: 'Vegetale', description: 'Grilled zucchini, roasted peppers, mushrooms, olives, and goat cheese', price: '$17.99', tags: ['vegetarian'] },
      { name: 'BBQ Chicken', description: 'Grilled chicken, red onion, cilantro, and mozzarella with BBQ sauce', price: '$18.99' },
    ],
  },
  {
    id: 'wings',
    name: 'Wings',
    description: 'Crispy wings with your choice of sauce',
    items: [
      { name: 'Classic Buffalo Wings', description: '1 lb of crispy wings tossed in our signature buffalo sauce, served with blue cheese dip', price: '$15.99' },
      { name: 'Honey Garlic Wings', description: '1 lb of wings glazed in a sweet honey garlic sauce', price: '$15.99' },
      { name: 'BBQ Wings', description: '1 lb of wings smothered in smoky BBQ sauce', price: '$15.99' },
      { name: 'Salt & Pepper Wings', description: '1 lb of dry-rubbed wings with cracked pepper and sea salt', price: '$14.99', tags: ['gluten-free'] },
      { name: 'Parmesan Garlic Wings', description: '1 lb of wings tossed in garlic butter and parmesan cheese', price: '$16.99' },
    ],
  },
  {
    id: 'mains',
    name: 'Main Courses',
    description: 'Hearty entrées prepared with care',
    items: [
      { name: 'Chicken Parmigiana', description: 'Breaded chicken breast topped with marinara and melted mozzarella, served with spaghetti', price: '$19.99' },
      { name: 'Veal Marsala', description: 'Tender veal scallopini in a Marsala wine and mushroom sauce with roasted potatoes', price: '$24.99' },
      { name: 'Salmon alla Griglia', description: 'Grilled Atlantic salmon with lemon butter, capers, and seasonal vegetables', price: '$23.99', tags: ['gluten-free'] },
      { name: 'Eggplant Parmigiana', description: 'Layers of breaded eggplant, marinara, and melted cheese, served with a side salad', price: '$17.99', tags: ['vegetarian'] },
      { name: '10oz NY Striploin', description: 'Grilled to your liking, served with garlic mashed potatoes and seasonal vegetables', price: '$29.99', tags: ['gluten-free'] },
      { name: 'Fish & Chips', description: 'Beer-battered Atlantic cod with fries, coleslaw, and tartar sauce', price: '$17.99' },
    ],
  },
  {
    id: 'salads',
    name: 'Salads',
    description: 'Fresh and vibrant salad selections',
    items: [
      { name: 'Caesar Salad', description: 'Crisp romaine, house-made caesar dressing, croutons, and shaved parmesan', price: '$12.99' },
      { name: 'Greek Salad', description: 'Tomatoes, cucumbers, red onion, olives, and feta with lemon-oregano dressing', price: '$13.99', tags: ['vegetarian', 'gluten-free'] },
      { name: 'Arugula & Pear Salad', description: 'Baby arugula, sliced pear, candied walnuts, gorgonzola, and honey vinaigrette', price: '$14.99', tags: ['vegetarian', 'gluten-free'] },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings to complete your dining experience',
    items: [
      { name: 'Tiramisu', description: 'Classic Italian tiramisu with layers of espresso-soaked ladyfingers and mascarpone cream', price: '$10.99', tags: ['vegetarian'] },
      { name: 'Cannoli', description: 'Crispy pastry shells filled with sweet ricotta, chocolate chips, and pistachio', price: '$9.99', tags: ['vegetarian'] },
      { name: 'Panna Cotta', description: 'Vanilla bean panna cotta with mixed berry compote', price: '$9.99', tags: ['vegetarian', 'gluten-free'] },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla gelato', price: '$11.99', tags: ['vegetarian'] },
    ],
  },
];
