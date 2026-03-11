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

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Menus', path: '/menus' },
  { label: 'Specials', path: '/specials' },
  { label: 'Family Meals', path: '/family-meals' },
  { label: 'Party Menus', path: '/party-menus' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top utility bar */}
      <Box
        sx={{
          bgcolor: palette.charcoal,
          color: '#fff',
          py: 0.5,
          display: { xs: 'none', md: 'block' },
          fontSize: '0.8rem',
        }}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
            {businessInfo.phone} &nbsp;|&nbsp; {businessInfo.hours}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              href={businessInfo.giftCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<CardGiftcardOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: palette.gold,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                '&:hover': { color: '#fff' },
              }}
            >
              Gift Cards
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main navigation bar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: `1px solid ${palette.warmGray}`,
        }}
      >
        <Container>
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 1 }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: palette.primary.main,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                CORRADO'S
              </Typography>
            </Box>

            {/* Desktop nav links */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                flex: 1,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  size="small"
                  sx={{
                    color: isActive(link.path) ? palette.primary.main : palette.charcoal,
                    fontWeight: isActive(link.path) ? 700 : 600,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    px: 1.2,
                    py: 1,
                    borderBottom: isActive(link.path)
                      ? `2px solid ${palette.primary.main}`
                      : '2px solid transparent',
                    borderRadius: 0,
                    '&:hover': {
                      color: palette.primary.main,
                      bgcolor: 'transparent',
                      borderBottom: `2px solid ${palette.primary.light}`,
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Desktop CTA */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, ml: 'auto' }}>
              <Button
                variant="contained"
                color="primary"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Order Online
              </Button>
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, ml: 'auto', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', px: 2 }}
              >
                Order
              </Button>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: palette.charcoal }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 300, bgcolor: '#fff' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: palette.primary.main }}
          >
            CORRADO'S
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navLinks.map((link) => (
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
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.03em',
                  }}
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
            sx={{ borderColor: palette.gold, color: palette.gold, '&:hover': { borderColor: palette.gold, bgcolor: `${palette.gold}10` } }}
          >
            Gift Cards
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
