import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  useScrollTrigger,
  Divider,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import { businessInfo } from '../data';
import { palette } from '../theme';

// ─── Sizing constants ─────────────────────────────────────────────────────────
const LOGO_H   = 200;        // full logo height (px) when not scrolled
const APPBAR_H = 100;        // AppBar height (px) — half the logo height
const LOGO_W   = LOGO_H;     // logo is square
// The bottom (LOGO_H - APPBAR_H) px of the logo overflows below the AppBar
// into the PosterBar on the home page.

// ─── Nav links ────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  path: string;
  external?: boolean;
}

const leftNavLinks: NavLink[] = [
  { label: 'Home',         path: '/' },
  { label: 'About',        path: '/about' },
  { label: 'Digital Menu', path: '/menus' },
  { label: 'Specials',     path: '/specials' },
  { label: 'Family Meals', path: '/family-meals' },
];

const rightNavLinks: NavLink[] = [
  { label: 'Party Menus', path: '/party-menus' },
  { label: 'Events',      path: '/events' },
  { label: 'Gallery',     path: '/gallery' },
  { label: 'Contact',     path: '/contact' },
  { label: 'Order Online', path: businessInfo.orderUrl, external: true },
];

const allNavLinks = [...leftNavLinks, ...rightNavLinks];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const scrollTrigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });
  const scrolled = !isHome || scrollTrigger;
  const isActive = (path: string) => location.pathname === path;

  const navBtnSx = (path: string) => ({
    color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.78)',
    fontWeight: isActive(path) ? 700 : 500,
    fontSize: '0.72rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.09em',
    px: 1.1,
    py: 0.6,
    minWidth: 'auto',
    borderRadius: 0,
    position: 'relative',
    transition: 'color 0.2s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: isActive(path)
        ? 'translateX(-50%) scaleX(1)'
        : 'translateX(-50%) scaleX(0)',
      transformOrigin: 'center',
      width: '60%',
      height: '2px',
      bgcolor: '#fff',
      transition: 'transform 0.25s ease',
    },
    '&:hover': {
      color: '#fff',
      bgcolor: 'transparent',
      '&::after': { transform: 'translateX(-50%) scaleX(1)' },
    },
  });

  return (
    <>
      {/*
        ══════════════════════════════════════════════════════════════════
        HEADER LAYOUT STRATEGY
        ──────────────────────────────────────────────────────────────────
        • AppBar  = full 100vw, height = APPBAR_H (107px = 2/3 × 160px)
        • AppBar overflow:visible → bottom 1/3 of logo hangs into PosterBar
        • Nav items live inside a maxWidth Container, 3-col grid:
            left-nav (1fr) | invisible-spacer (LOGO_W px) | right-nav (1fr)
          The spacer reserves space so both nav sides are symmetric.
        • Logo lives DIRECTLY in AppBar (not in Container), so:
            left:50% + translateX(-50%) = exact 50% of viewport width ✓
        ══════════════════════════════════════════════════════════════════
      */}
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: palette.primary.main,
          overflow: 'visible',   // lets logo's bottom 1/3 bleed below
          borderBottom: scrolled
            ? 'none'
            : '1px solid rgba(255,255,255,0.08)',
          transition: 'box-shadow 0.3s ease, border 0.3s ease',
        }}
      >
        {/* ── Nav items (inside Container so they respect max-width) ── */}
        <Container maxWidth="xl" disableGutters>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, lg: `${APPBAR_H}px` },
              height:    { lg: `${APPBAR_H}px` },
              display: { xs: 'flex', lg: 'grid' },
              // 3-col: left-nav | spacer = logo width | right-nav
              gridTemplateColumns: { lg: `1fr ${LOGO_W}px 1fr` },
              alignItems: 'center',
              px: { xs: 2, md: 3, xl: 5 },
              overflow: 'visible',
            }}
          >
            {/* LEFT NAV — 5 items */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.25,
                pr: 2,
              }}
            >
              {leftNavLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={navBtnSx(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/*
              INVISIBLE SPACER — same width as the logo.
              Keeps the grid symmetric so nav items don't bleed under the logo.
              The actual logo floats above via position:absolute on AppBar.
            */}
            <Box
              aria-hidden="true"
              sx={{
                display: { xs: 'none', lg: 'block' },
                width: `${LOGO_W}px`,
                height: 1,
                visibility: 'hidden',
                pointerEvents: 'none',
              }}
            />

            {/* RIGHT NAV — 5 items */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 0.25,
                pl: 2,
              }}
            >
              {rightNavLinks.map((link) =>
                link.external ? (
                  <Button
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={
                      <ShoppingBagOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />
                    }
                    sx={{
                      ...navBtnSx(link.path),
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 999,
                      px: 1.6,
                      '&::after': { display: 'none' },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.7)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={navBtnSx(link.path)}
                  >
                    {link.label}
                  </Button>
                )
              )}
            </Box>

            {/* MOBILE: Logo text + hamburger */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: { xs: 'flex', lg: 'none' },
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                flexGrow: 1,
              }}
            >
              <Box
                component="img"
                src="/logos/logo-black.png"
                alt="Corrado's Restaurant and Bar"
                sx={{ height: { xs: 40, sm: 48 }, width: 'auto' }}
              />
              <Box>
                <Typography
                  sx={{
                    color: '#fff',
                    fontFamily: '"AmpersandFix", "Playfair Display", Georgia, serif',
                    fontWeight: 700,
                    fontSize: { xs: '1.05rem', sm: '1.2rem' },
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                  }}
                >
                  Corrado's
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: { xs: '0.6rem', sm: '0.66rem' },
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    lineHeight: 1.3,
                    mt: 0.25,
                  }}
                >
                  Restaurant &amp; Bar
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  px: 2,
                  bgcolor: '#fff',
                  color: palette.primary.main,
                  borderRadius: 999,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Order
              </Button>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/*
          ════════════════════════════════════════════════════════════════
          LOGO — directly inside AppBar, NOT inside the Container.
          ────────────────────────────────────────────────────────────────
          AppBar is always 100vw wide, so:
            left: 50%  +  translateX(-50%)  =  exact center of the screen

          top: 0   → logo top aligns with AppBar top
          The logo is LOGO_H (160px) tall:
            • top 2/3 (107px) = inside the AppBar background
            • bottom 1/3 (53px) = overflows onto PosterBar below
          ════════════════════════════════════════════════════════════════
        */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            position: 'absolute',
            left: '50%',               // 50% of AppBar = 50% of viewport
            transform: 'translateX(-50%)',
            top: 0,
            zIndex: 10,
            height: scrolled ? `${APPBAR_H}px` : `${LOGO_H}px`,
            width: scrolled ? `${APPBAR_H}px` : `${LOGO_W}px`,
            transition: 'height 0.3s ease, width 0.3s ease',
          }}
        >
          <Box
            component="img"
            src="/logos/logo-black.png"
            alt="Corrado's Restaurant and Bar"
            sx={{
              height: scrolled ? `${APPBAR_H * 0.8}px` : `${LOGO_H}px`,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              transition: 'height 0.3s ease, transform 0.35s ease',
              '&:hover': { transform: 'scale(1.06)' },
            }}
          />
        </Box>
      </AppBar>

      {/* ─── Mobile Drawer ─────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 300, bgcolor: '#fff' } } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            component="img"
            src="/logos/logo-black.png"
            alt="Corrado's Restaurant and Bar"
            sx={{ height: 48, width: 'auto' }}
          />
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {allNavLinks
            .filter((l) => !l.external)
            .map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(link.path)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: `${palette.primary.main}10`,
                      borderRight: `3px solid ${palette.primary.main}`,
                      color: palette.primary.main,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: isActive(link.path) ? 700 : 500, fontSize: '0.95rem', letterSpacing: '0.03em' }}>
                        {link.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            href={businessInfo.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<ShoppingBagOutlinedIcon />}
          >
            Order Online
          </Button>
          <Button
            variant="outlined"
            fullWidth
            href={businessInfo.giftCardUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<CardGiftcardOutlinedIcon />}
            sx={{
              borderColor: palette.gold,
              color: palette.gold,
              '&:hover': { borderColor: palette.gold, bgcolor: `${palette.gold}10` },
            }}
          >
            Gift Cards
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
