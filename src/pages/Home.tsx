import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessibleIcon from '@mui/icons-material/Accessible';
import DeckIcon from '@mui/icons-material/Deck';
import GroupsIcon from '@mui/icons-material/Groups';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LiquorIcon from '@mui/icons-material/Liquor';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import AppleIcon from '@mui/icons-material/Apple';
import ShopIcon from '@mui/icons-material/Shop';
import { SectionHeader } from '../components';
import { businessInfo, menuCategories, specials, familyMeals, testimonials, events } from '../data';
import { palette } from '../theme';

export default function Home() {
  const featuredCategories = menuCategories.slice(0, 4);
  const featuredSpecials = specials.slice(0, 3);
  const featuredEvents = events.slice(0, 3);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(20, 15, 12, 0.6)', zIndex: 1 }} />
        <Container sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          <Box sx={{ maxWidth: 680 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: palette.gold,
                mb: 2,
                letterSpacing: '0.2em',
                fontSize: '0.85rem',
              }}
            >
              AUTHENTIC ITALIAN DINING &bull; EST. 2010
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: '#fff',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                lineHeight: 1.1,
                textShadow: '0 2px 40px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to{' '}
              <Box component="span" sx={{ color: palette.primary.main }}>
                Corrado's
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#ddd',
                fontWeight: 400,
                mb: 4,
                maxWidth: 520,
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.15rem' },
              }}
            >
              Experience the warmth of Italian hospitality and the taste of homemade
              family recipes. From fresh pasta to wood-fired pizza, every dish tells
              a story.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{ px: 4, py: 1.5, fontSize: '0.9rem' }}
              >
                Order Online
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/menus"
                startIcon={<RestaurantMenuIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '0.9rem',
                  borderColor: '#fff',
                  color: '#fff',
                  '&:hover': { borderColor: palette.primary.main, color: palette.primary.main },
                }}
              >
                View Menus
              </Button>
              <Button
                variant="text"
                size="large"
                component={RouterLink}
                to="/contact"
                startIcon={<PhoneIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  color: '#ccc',
                  '&:hover': { color: '#fff' },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ─── INFO STRIP ─── */}
      <Box sx={{ bgcolor: palette.primary.main, color: '#fff', py: 2 }}>
        <Container>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 1, md: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                {businessInfo.hours}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PlaceIcon fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                {businessInfo.address}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon fontSize="small" />
              <Typography
                component="a"
                href={`tel:${businessInfo.phone}`}
                variant="body2"
                sx={{ fontWeight: 600, color: '#fff', textDecoration: 'none' }}
              >
                {businessInfo.phone}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ─── INTRO / ABOUT TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80"
                alt="Corrado's Restaurant interior"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: palette.primary.main, mb: 1, letterSpacing: '0.15em' }}
              >
                OUR STORY
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                A Taste of Italy in Whitby
              </Typography>
              <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}>
                Since 2010, Corrado's has been the neighbourhood's favourite destination
                for authentic Italian cuisine. From our family to yours, we prepare every
                dish with fresh ingredients, time-honoured recipes, and a genuine passion
                for hospitality.
              </Typography>
              <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}>
                Whether you're here for a casual weeknight dinner, a special celebration,
                or cheering on your team during the big game — there's always a seat at
                our table for you.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/about"
                endIcon={<ArrowForwardIcon />}
              >
                Our Story
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURED MENU CATEGORIES ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="OUR MENU"
          title="Explore Our Kitchen"
          description="From handmade pasta to stone-oven pizza, our menu celebrates the best of Italian cuisine with a Canadian twist."
        />
        <Container>
          <Grid container spacing={3}>
            {featuredCategories.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  component={RouterLink}
                  to="/menus"
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      cat.id === 'appetizers'
                        ? 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80'
                        : cat.id === 'pasta'
                        ? 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80'
                        : cat.id === 'pizza'
                        ? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'
                        : 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80'
                    }
                    alt={cat.name}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: palette.charcoal }}>
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, mt: 0.5 }}>
                      {cat.items.length} items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/menus"
              endIcon={<ArrowForwardIcon />}
              size="large"
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── DAILY SPECIALS PREVIEW ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="DAILY SPECIALS"
          title="Something Special Every Day"
          description="Take advantage of our rotating daily deals — great food at even better prices."
        />
        <Container>
          <Grid container spacing={3}>
            {featuredSpecials.map((special) => (
              <Grid key={special.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={special.day}
                        size="small"
                        sx={{
                          bgcolor: palette.primary.main,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                      {special.badge && (
                        <Chip
                          label={special.badge}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: palette.gold,
                            color: palette.gold,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {special.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.7 }}>
                      {special.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: palette.primary.main, fontWeight: 700, mt: 'auto' }}
                    >
                      {special.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/specials"
              endIcon={<ArrowForwardIcon />}
            >
              View All Specials
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── FAMILY MEALS HIGHLIGHT ─── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: palette.charcoal,
          backgroundImage: 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(30, 25, 22, 0.85)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <SectionHeader
            subtitle="FAMILY MEALS"
            title="Share the Table, Share the Love"
            description="Ready-to-enjoy family meal packages perfect for every occasion. From classic Italian dinners to pizza party packs."
            light
          />
          <Container>
            <Grid container spacing={3}>
              {familyMeals.slice(0, 3).map((meal) => (
                <Grid key={meal.id} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        {meal.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: palette.text.secondary, mb: 2 }}>
                        {meal.description}
                      </Typography>
                      <Chip
                        label={`Serves ${meal.serves}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Typography
                        variant="h5"
                        sx={{ color: palette.primary.main, fontWeight: 700, mt: 2 }}
                      >
                        {meal.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/family-meals"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Family Meals
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ─── PARTY / CATERING HIGHLIGHT ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: palette.primary.main, mb: 1, letterSpacing: '0.15em' }}
              >
                PRIVATE EVENTS & CATERING
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Host Your Next Event at Corrado's
              </Typography>
              <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.8 }}>
                From intimate gatherings to large celebrations, we have the perfect
                space and menu for your event. Birthday parties, corporate dinners,
                sports viewing parties, and more.
              </Typography>
              <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}>
                Our dedicated event coordinator will work with you to customize every detail,
                from menu selection to seating arrangement. Starting at just $25 per person.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/party-menus"
                  endIcon={<ArrowForwardIcon />}
                >
                  Party Menus
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                >
                  Get in Touch
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1529543544282-ea25407407b0?w=700&q=80"
                alt="Private event at Corrado's"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── EVENTS TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="UPCOMING EVENTS"
          title="What's Happening at Corrado's"
          description="Live music, sports nights, wine tastings, and more — there's always something exciting going on."
        />
        <Container>
          <Grid container spacing={3}>
            {featuredEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Chip
                      label={event.category.replace('-', ' ')}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: palette.secondary.main,
                        color: '#fff',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.primary.main, fontWeight: 600, mb: 1 }}
                    >
                      {event.date} &bull; {event.time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, lineHeight: 1.7 }}>
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/events"
              endIcon={<ArrowForwardIcon />}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── GALLERY TEASER ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="GALLERY"
          title="A Glimpse Inside Corrado's"
          description="Explore our beautiful space, delicious dishes, and memorable events."
        />
        <Container>
          <Grid container spacing={2}>
            {[
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
              'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
              'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
            ].map((src, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Box
                  component="img"
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  sx={{
                    width: '100%',
                    height: { xs: 160, md: 220 },
                    objectFit: 'cover',
                    borderRadius: 1,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.03)' },
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/gallery"
              endIcon={<ArrowForwardIcon />}
            >
              View Full Gallery
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── MOBILE APPS SECTION ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: palette.primary.main, mb: 1, letterSpacing: '0.15em' }}
              >
                MOBILE APP
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Order From Anywhere
              </Typography>
              <Typography variant="body1" sx={{ color: palette.text.secondary, mb: 3, lineHeight: 1.8 }}>
                Download the Corrado's app and get your favourite Italian dishes
                delivered right to your door. Browse our full menu, customize your
                order, track delivery, and earn rewards with every purchase.
              </Typography>
              <Stack direction="row" spacing={2}>
                {/* TODO: Replace href with actual App Store URL when available */}
                <Button
                  variant="contained"
                  href="#"
                  startIcon={<AppleIcon />}
                  sx={{
                    bgcolor: '#000',
                    color: '#fff',
                    px: 3,
                    py: 1.2,
                    '&:hover': { bgcolor: '#333' },
                    textTransform: 'none',
                    fontSize: '0.85rem',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.6rem', lineHeight: 1, textAlign: 'left' }}>
                      Download on the
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                      App Store
                    </Typography>
                  </Box>
                </Button>
                {/* TODO: Replace href with actual Google Play URL when available */}
                <Button
                  variant="contained"
                  href="#"
                  startIcon={<ShopIcon />}
                  sx={{
                    bgcolor: '#000',
                    color: '#fff',
                    px: 3,
                    py: 1.2,
                    '&:hover': { bgcolor: '#333' },
                    textTransform: 'none',
                    fontSize: '0.85rem',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.6rem', lineHeight: 1, textAlign: 'left' }}>
                      GET IT ON
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                      Google Play
                    </Typography>
                  </Box>
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 280, md: 400 },
                  bgcolor: palette.cream,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 380,
                    bgcolor: '#222',
                    borderRadius: '24px',
                    border: '4px solid #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80"
                    alt="App preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── WHY CHOOSE US ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.cream }}>
        <SectionHeader
          subtitle="WHY CORRADO'S"
          title="What Makes Us Special"
          description="There are many reasons families in Whitby and Oshawa choose Corrado's for dining, takeout, and events."
        />
        <Container>
          <Grid container spacing={3}>
            {[
              { icon: <LocalDiningIcon />, title: 'Authentic Italian', text: 'Traditional recipes with the freshest ingredients' },
              { icon: <GroupsIcon />, title: 'Family Dining', text: 'Warm, welcoming atmosphere for the whole family' },
              { icon: <CelebrationIcon />, title: 'Private Events', text: 'Customizable party and catering packages' },
              { icon: <LiquorIcon />, title: 'Extensive Wine List', text: 'Curated Italian and international wines' },
              { icon: <DeckIcon />, title: 'Beautiful Patio', text: 'Enjoy outdoor dining in the warmer months' },
              { icon: <ChildCareIcon />, title: "Kids' Menu", text: 'Child-friendly options the little ones will love' },
              { icon: <WifiIcon />, title: 'Free WiFi', text: 'Stay connected while you dine' },
              { icon: <LocalParkingIcon />, title: 'Free Parking', text: 'Convenient parking for all guests' },
              { icon: <AccessibleIcon />, title: 'Wheelchair Accessible', text: 'Fully accessible dining space' },
            ].map((feature, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ color: palette.primary.main, mb: 1.5, '& svg': { fontSize: 36 } }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                    {feature.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── TESTIMONIALS ─── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: palette.background.default }}>
        <SectionHeader
          subtitle="WHAT OUR GUESTS SAY"
          title="Loved by Families Across Whitby"
        />
        <Container>
          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid key={t.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Rating value={t.rating} readOnly size="small" sx={{ mb: 1.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        fontStyle: 'italic',
                        lineHeight: 1.7,
                        mb: 2,
                      }}
                    >
                      "{t.text}"
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {t.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary, fontSize: '0.75rem' }}>
                      via {t.source}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CONTACT STRIP ─── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.primary.main, color: '#fff' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Ready to Dine with Us?
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 0 }}>
                Visit us, order online, or give us a call. We'd love to serve you and your family.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent={{ md: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  href={businessInfo.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  sx={{
                    bgcolor: '#fff',
                    color: palette.primary.main,
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#f5f5f5' },
                  }}
                >
                  Order Online
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href={`tel:${businessInfo.phone}`}
                  startIcon={<PhoneIcon />}
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  {businessInfo.phone}
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href={`mailto:${businessInfo.email}`}
                  startIcon={<EmailIcon />}
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Email Us
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
