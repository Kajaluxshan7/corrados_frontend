import { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { businessInfo } from "../data";
import { usePageMeta } from "../hooks/usePageMeta";

// Data
const CATEGORIES = [
  {
    id: 'Daily',
    bg: '#5C1D18', // Brick Red (matches header theme)
    panel: '#8E3830',
    description: 'Fresh handmade pasta, rich marinara sauces, and traditional chef-crafted comfort food prepared daily.',
  },
  {
    id: 'Everyday',
    bg: '#7A352E', // Warm Crimson
    panel: '#A65147',
    description: 'Our signature wood-fired stone oven pizzas, prepared fresh every day keeping old-world Italian traditions alive.',
  },
  {
    id: 'Weekend',
    bg: '#4A1C18', // Deep Mahogany
    panel: '#73312B',
    description: 'Premium weekend dinner selections featuring fresh coastal catch and slow-simmered regional seafood specialties.',
  },
  {
    id: 'Game Time',
    bg: '#6B351E', // Rust Orange
    panel: '#945233',
    description: 'Perfect shareable platters, stone-baked pizzas, and savory appetizers designed to elevate your game day experience.',
  },
  {
    id: 'Daytime',
    bg: '#523E33', // Warm Chestnut
    panel: '#755D50',
    description: 'Light, satisfying lunch features and mid-day combinations crafted for active afternoons.',
  },
  {
    id: "Chef's Special",
    bg: '#4A121A', // Deep Wine Red
    panel: '#731F2A',
    description: 'Exclusive culinary creations, fine wine pairings, and hand-crafted seasonal masterworks directly from our head chef.',
  },
];

const SPECIALS_DATA: Record<string, Array<{
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  image: string;
}>> = {
  'Daily': [
    {
      title: 'Monday Spaghetti Bolognese',
      subtitle: 'Fresh house-made spaghetti tossed with a slow-simmered rich beef, pork, and red wine ragu, topped with shaved Parmigiano-Reggiano.',
      price: '$15.99',
      badge: 'Monday Special',
      image: '/restaurant/spaghetti-bolognese.jpeg',
    },
    {
      title: 'Tuscan Chicken Pasta',
      subtitle: 'Tender pan-seared chicken breast strips with sun-dried tomatoes and baby spinach in a creamy garlic and white wine sauce over penne.',
      price: '$16.99',
      badge: 'Tuesday Special',
      image: '/restaurant/chicken-pasta-sundried.jpeg',
    },
    {
      title: 'Gnocchi Tomato Cream',
      subtitle: 'Pillowy potato gnocchi tossed in a velvety house-made marinara with fresh basil, finished with a touch of heavy cream and melted mozzarella.',
      price: '$14.99',
      badge: 'Wednesday Special',
      image: '/restaurant/gnocchi-tomato-cream.jpeg',
    }
  ],
  'Everyday': [
    {
      title: 'Neapolitan Margherita',
      subtitle: 'Crushed San Marzano tomatoes, fresh fior di latte mozzarella, aromatic basil leaves, and a drizzle of organic extra virgin olive oil.',
      price: '$16.99',
      badge: 'Best Seller',
      image: '/restaurant/pizza-margherita.jpeg',
    },
    {
      title: 'Prosciutto White Pizza',
      subtitle: 'Fior di latte mozzarella, fresh garlic, baby arugula, extra virgin olive oil, and premium dry-cured prosciutto di Parma added post-bake.',
      price: '$19.99',
      badge: 'House Favorite',
      image: '/restaurant/pizza-prosciutto-white.jpeg',
    },
    {
      title: 'Penne Primavera',
      subtitle: 'Fresh seasonal vegetables including bell peppers, zucchini, and cherry tomatoes sauteed with garlic, white wine, and fresh herbs over penne pasta.',
      price: '$14.99',
      badge: 'Everyday Classic',
      image: '/restaurant/penne-primavera.jpeg',
    }
  ],
  'Weekend': [
    {
      title: 'Seafood Mussels & Clams',
      subtitle: 'Prince Edward Island mussels and littleneck clams steamed in a white wine garlic herb broth, served over fresh linguine.',
      price: '$26.99',
      badge: 'Seafood Feature',
      image: '/restaurant/seafood-mussels.jpeg',
    },
    {
      title: 'Seafood Linguine Marinara',
      subtitle: 'Succulent shrimp, calamari rings, and scallops sauteed in garlic and white wine, simmered in a spiced zesty marinara sauce over fresh linguine.',
      price: '$29.99',
      badge: 'Weekend Luxury',
      image: '/restaurant/seafood-linguine.jpeg',
    },
    {
      title: 'Slow-Braised Beef Short Rib',
      subtitle: 'Tender bone-in beef short rib braised in red wine and fresh herbs, served over a bed of buttery garlic mashed potatoes and glazed baby carrots.',
      price: '$32.99',
      badge: 'Chef Recommendation',
      image: '/restaurant/beef-short-rib.jpeg',
    }
  ],
  'Game Time': [
    {
      title: 'Arancini & Wings Platter',
      subtitle: 'Crispy Sicilian arborio rice balls stuffed with beef ragu and mozzarella, paired with house-rub wings and savory marinara dip.',
      price: '$18.99',
      badge: 'Game Day Share',
      image: '/restaurant/arancini-tomato.jpeg',
    },
    {
      title: 'Antipasto Misto Platter',
      subtitle: 'A premium assortment of Italian dry-cured meats, artisanal cheeses, marinated olives, roasted red peppers, and toasted garlic crostini.',
      price: '$22.99',
      badge: 'Premium Platter',
      image: '/restaurant/antipasto-platter.jpeg',
    },
    {
      title: 'Calamari Fritti Platter',
      subtitle: 'Crispy cornstarch-crusted calamari rings and tentacles fried to a golden crunch, tossed with hot cherry peppers and served with lemon aioli.',
      price: '$17.99',
      badge: 'Crowd Pleaser',
      image: '/restaurant/calamari-rings.jpeg',
    }
  ],
  'Daytime': [
    {
      title: 'Wild Mushroom Ravioli',
      subtitle: 'Fresh egg pasta pockets stuffed with wild porcini mushrooms and creamy ricotta, finished in a decadent truffle garlic reduction.',
      price: '$15.99',
      badge: 'Lunch Special',
      image: '/restaurant/ravioli-mushroom-cream.jpeg',
    },
    {
      title: 'Burrata & Caprese Salad',
      subtitle: 'Creamy local burrata cheese ball surrounded by vine-ripened tomatoes, sweet basil leaves, coarse sea salt, and aged balsamic glaze reduction.',
      price: '$13.99',
      badge: 'Light & Fresh',
      image: '/restaurant/burrata-caprese.jpeg',
    },
    {
      title: 'Shrimp & Zucchini Salad',
      subtitle: 'Pan-seared jumbo shrimp, julienned zucchini, heirloom cherry tomatoes, and mixed baby greens tossed in a zesty lemon-herb vinaigrette.',
      price: '$14.99',
      badge: 'Lunch Salad',
      image: '/restaurant/shrimp-zucchini-salad.jpeg',
    }
  ],
  "Chef's Special": [
    {
      title: 'Slow Roasted Pork Belly',
      subtitle: 'Crispy crackling pork belly served over velvety garlic whipped potatoes, fire-roasted baby carrots, and red wine reduction jus.',
      price: '$28.99',
      badge: 'Signature Dish',
      image: '/restaurant/pork-belly-mash.jpeg',
    },
    {
      title: 'Salmon Beurre Blanc',
      subtitle: 'Pan-seared Atlantic salmon fillet served over roasted asparagus spears and drizzled with a decadent, creamy lemon-herb caper beurre blanc sauce.',
      price: '$29.99',
      badge: 'Limited Creation',
      image: '/restaurant/salmon-beurre-blanc.jpeg',
    },
    {
      title: 'Traditional Chicken Marsala',
      subtitle: 'Pan-seared chicken cutlets sauteed with fresh cremini mushrooms in a rich, sweet Sicilian Marsala wine reduction sauce over fresh fettuccine.',
      price: '$24.99',
      badge: 'Chef Masterpiece',
      image: '/restaurant/chicken-marsala.jpeg',
    }
  ]
};

export default function Specials() {
  usePageMeta({
    title: "Daily Specials | Deals at Corrado's Whitby",
    description: "Don't miss Corrado's rotating daily specials — chef's features, game-time deals, daytime offers, and seasonal highlights. Great Italian food at even better prices, every day of the week.",
    ogImage: "/restaurant/ravioli-mushroom-spinach.jpeg",
  });

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Preload all food images on mount
  useEffect(() => {
    Object.values(SPECIALS_DATA).flat().forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  // Handle mobile screen check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Category transition controller (arrow buttons / tabs)
  const navigateCategory = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    const total = CATEGORIES.length;
    setActiveCategoryIndex((prev) => (direction === 'next' ? (prev + 1) % total : (prev + total - 1) % total));
    setActiveItemIndex(0); // Reset item rotation to first item in the new category
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  // Item rotation controller (clicking left/right cards)
  const navigateItem = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveItemIndex((prev) => (direction === 'next' ? (prev + 1) % 3 : (prev + 2) % 3));
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  const handleTabClick = (idx: number) => {
    if (isAnimating || idx === activeCategoryIndex) return;
    setIsAnimating(true);
    setActiveCategoryIndex(idx);
    setActiveItemIndex(0); // Reset item rotation to first item in the new category
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Derive roles within the current active category (3 items total)
  const getRole = (index: number) => {
    if (index === activeItemIndex) return 'center';
    if (index === (activeItemIndex - 1 + 3) % 3) return 'left';
    if (index === (activeItemIndex + 1) % 3) return 'right';
    return 'hidden';
  };

  const getRoleStyles = (role: 'center' | 'left' | 'right' | 'back' | 'hidden') => {
    const baseWidth = isMobile ? '82vw' : '420px';
    const baseHeight = isMobile ? '52vh' : '64vh';

    switch (role) {
      case 'center':
        return {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          width: baseWidth,
          height: baseHeight,
        };
      case 'left':
        return {
          left: isMobile ? '6%' : '18%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.78)',
          filter: 'blur(3px)',
          opacity: 0.55,
          zIndex: 10,
          width: baseWidth,
          height: baseHeight,
        };
      case 'right':
        return {
          left: isMobile ? '94%' : '82%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.78)',
          filter: 'blur(3px)',
          opacity: 0.55,
          zIndex: 10,
          width: baseWidth,
          height: baseHeight,
        };
      case 'back':
        return {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.62)',
          filter: 'blur(6px)',
          opacity: 0.3,
          zIndex: 5,
          width: baseWidth,
          height: baseHeight,
        };
      case 'hidden':
      default:
        return {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.45)',
          filter: 'blur(10px)',
          opacity: 0,
          zIndex: 0,
          width: baseWidth,
          height: baseHeight,
        };
    }
  };

  const getCategoryLabel = (category: string) => {
    if (category.toLowerCase().includes('special')) {
      return category.toUpperCase();
    }
    return `${category.toUpperCase()} SPECIALS`;
  };

  return (
    <div className="w-full flex flex-col bg-stone-950">
      {/* 1. Specials Showcase Hero Section */}
      <div
        className="relative w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-100px)] overflow-hidden transition-all duration-[650ms] cubic-bezier(0.4,0,0.2,1)"
        style={{
          backgroundColor: CATEGORIES[activeCategoryIndex].bg,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-50 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Giant Ghost Typography */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-2 transition-all duration-700"
          style={{
            top: '22%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(70px, 22vw, 300px)',
            color: 'white',
            opacity: 0.08,
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {getCategoryLabel(CATEGORIES[activeCategoryIndex].id)}
        </div>

        {/* Category Tabs (Section changer above the cards - top center) */}
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-8 z-40 max-w-[90vw] overflow-x-auto scrollbar-none py-2">
          {CATEGORIES.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            return (
              <button
                key={cat.id}
                disabled={isAnimating}
                onClick={() => handleTabClick(idx)}
                className={`relative whitespace-nowrap py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive ? 'text-white scale-105' : 'text-white/40 hover:text-white/70 scale-95'
                }`}
              >
                {cat.id}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-300 origin-center ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{
                    backgroundColor: '#B95D54',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Carousel Layer */}
        <div className="absolute inset-0 z-3">
          {SPECIALS_DATA[CATEGORIES[activeCategoryIndex].id].map((item, i) => {
            const role = getRole(i);
            const style = getRoleStyles(role);
            if (role === 'hidden') return null;

            return (
              <div
                key={item.title}
                className="absolute"
                onClick={() => {
                  if (role === 'left') navigateItem('prev');
                  if (role === 'right') navigateItem('next');
                }}
                style={{
                  ...style,
                  transitionProperty: 'transform, filter, opacity, left, top, width, height',
                  transitionDuration: '650ms',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                {/* Floating Glass Card (entire card floats on center role) */}
                <div
                  className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between ${
                    role === 'center' ? 'animate-float' : ''
                  }`}
                  style={{
                    backgroundColor: CATEGORIES[activeCategoryIndex].panel + '2b', // hex transparency (17%)
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Top-gradient highlight */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />

                  {/* Food Image (Fits card nicely as a cover banner) */}
                  <div className="w-full h-[48%] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                    />
                    {/* Shadow overlay at the bottom of the image for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Details (Lower section) */}
                  <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-between z-10">
                    <div className="flex flex-col gap-2">
                      {item.badge && (
                        <span className="w-fit px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-white/20 text-white border border-white/10">
                          {item.badge}
                        </span>
                      )}

                      <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
                        {item.title}
                      </h2>

                      <p className="text-[11px] sm:text-xs text-white/80 line-clamp-3 leading-relaxed font-normal">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="h-[1px] w-full bg-white/10" />

                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {item.price}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(businessInfo.orderUrl, '_blank');
                          }}
                          className="flex items-center gap-1 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white text-black font-semibold text-[11px] sm:text-xs tracking-wider uppercase hover:bg-neutral-100 hover:shadow-md active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Left Content */}
        <div className="absolute bottom-6 left-4 sm:bottom-12 sm:left-12 md:left-16 z-30 max-w-[280px] sm:max-w-[420px] text-white">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/60 block">
            {getCategoryLabel(CATEGORIES[activeCategoryIndex].id)}
          </span>
          <div className="h-3 sm:h-4" /> {/* Spacer for proper gap between heading and description */}
          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-medium tracking-wide">
            “{CATEGORIES[activeCategoryIndex].description}”
          </p>
          <div className="h-5 sm:h-7" /> {/* Spacer for proper gap above arrows */}

          {/* Large outline navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigateCategory('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-transparent border-2 border-white/40 text-white hover:scale-[1.08] hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigateCategory('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-transparent border-2 border-white/40 text-white hover:scale-[1.08] hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom Right CTA Link */}
        <div className="absolute bottom-6 right-4 sm:bottom-12 sm:right-12 md:right-16 z-30">
          <a
            href={businessInfo.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white opacity-70 hover:opacity-100 hover:scale-[1.02] active:scale-98 transition-all duration-300 uppercase tracking-tight no-underline"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 3.5vw, 52px)',
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            ORDER NOW
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10" strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* 2. Don't Miss Out Callout Block */}
      <Box
        sx={{
          bgcolor: "#FAF8F5", // Creamy off-white
          py: { xs: 8, md: 10 },
          px: 3,
        }}
      >
        <Container maxWidth="md">
          <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-3">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#1c1917", // warm charcoal
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Taste the Best?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#57534e", // muted warm slate
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Our chef's specialties and game-day platters are available for dine-in, fast pickup, and door-to-door delivery. Order online now to secure your table or meal.
            </Typography>
            <Button
              variant="contained"
              href={businessInfo.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: "#B95D54", // warm tomato red
                color: "#fff",
                fontWeight: 700,
                px: 5,
                py: 1.75,
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                boxShadow: "0 10px 25px -5px rgba(185, 93, 84, 0.4)",
                "&:hover": {
                  bgcolor: "#A24E46",
                  boxShadow: "0 12px 30px -5px rgba(185, 93, 84, 0.5)",
                },
              }}
            >
              Order Online Now
            </Button>
          </div>
        </Container>
      </Box>
    </div>
  );
}
