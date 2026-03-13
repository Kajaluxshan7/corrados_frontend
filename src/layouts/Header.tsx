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
          bgcolor: palette.navy,
          color: "#fff",
          py: 1.5,
          display: { xs: "none", md: "block" },
          fontSize: "0.8rem",
        }}
      >
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            columnGap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#ccc", fontSize: "0.8rem", justifySelf: "start" }}
          >
            {businessInfo.phone} &nbsp;|&nbsp; {businessInfo.hours}
          </Typography>

          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifySelf: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/logos/logo-blue.png"
              alt="Corrado's Restaurant and Bar"
              sx={{
                height: { md: 68, lg: 78 },
                width: "auto",
                display: "block",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifySelf: "end" }}>
            <Button
              href={businessInfo.giftCardUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<CardGiftcardOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: palette.gold,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                "&:hover": { color: "#fff" },
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
          bgcolor: palette.primary.main,
          transition: "all 0.3s ease",
          boxShadow: scrolled ? 3 : 1,
        }}
      >
        <Container>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 78 },
              gap: 1,
              position: 'relative',
              display: { xs: 'flex', lg: 'grid' },
              gridTemplateColumns: { lg: '1fr auto 1fr' },
              alignItems: 'center',
            }}
          >
            {/* Desktop nav links */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                justifyContent: 'center',
                gridColumn: { lg: '2 / 3' },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 0.9,
                  py: 0.8,
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    size="small"
                    sx={{
                      color: isActive(link.path)
                        ? palette.primary.main
                        : 'rgba(255,255,255,0.9)',
                      bgcolor: isActive(link.path)
                        ? '#fff'
                        : 'transparent',
                      fontWeight: isActive(link.path) ? 700 : 600,
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      px: 1.45,
                      py: 0.9,
                      minWidth: 'auto',
                      borderRadius: 999,
                      transition: 'all 0.22s ease',
                      boxShadow: isActive(link.path)
                        ? '0 8px 18px rgba(0,0,0,0.14)'
                        : 'none',
                      '&:hover': {
                        color: isActive(link.path)
                          ? palette.primary.main
                          : '#fff',
                        bgcolor: isActive(link.path)
                          ? 'rgba(255,255,255,0.96)'
                          : 'rgba(255,255,255,0.12)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Desktop CTA */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                gap: 1,
                gridColumn: { lg: '3 / 4' },
                justifySelf: 'end',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  borderRadius: 999,
                  bgcolor: '#fff',
                  color: palette.primary.main,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.14)',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.92)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Order Online
              </Button>
            </Box>

            {/* Mobile menu button */}
            <Box
              sx={{
                display: { xs: "flex", lg: "none" },
                ml: "auto",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  px: 2,
                  bgcolor: "#fff",
                  color: palette.primary.main,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                Order
              </Button>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "#fff" }}
              >
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
          sx: { width: 300, bgcolor: "#fff" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/logos/logo-black.png"
            alt="Corrado's Restaurant and Bar"
            sx={{ height: 48, width: "auto" }}
          />
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
                  "&.Mui-selected": {
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
                    fontSize: "0.95rem",
                    letterSpacing: "0.03em",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
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
              "&:hover": {
                borderColor: palette.gold,
                bgcolor: `${palette.gold}10`,
              },
            }}
          >
            Gift Cards
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
