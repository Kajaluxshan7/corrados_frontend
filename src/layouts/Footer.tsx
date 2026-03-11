import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { businessInfo } from '../data';
import { palette } from '../theme';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Menus', path: '/menus' },
  { label: 'Specials', path: '/specials' },
  { label: 'Family Meals', path: '/family-meals' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const serviceLinks: Array<{ label: string; path?: string; href?: string }> = [
  { label: 'Party Menus', path: '/party-menus' },
  { label: 'Gift Cards', path: '/gift-cards' },
  { label: 'Order Online', href: businessInfo.orderUrl },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: palette.charcoal,
        color: '#fff',
        pt: 8,
        pb: 3,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: palette.primary.main,
                mb: 2,
              }}
            >
              CORRADO'S
            </Typography>
            <Typography variant="body2" sx={{ color: '#bbb', mb: 3, maxWidth: 300, lineHeight: 1.8 }}>
              Authentic Italian cuisine in the heart of Whitby. Family-owned since 2010, 
              we bring the warmth of Italy to every plate.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component="a"
              href={businessInfo.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ mb: 2 }}
            >
              Order Online
            </Button>
            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {businessInfo.social.map((s: { name: string; url: string; icon: string }) => (
                <IconButton
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  sx={{
                    color: '#999',
                    border: '1px solid #444',
                    '&:hover': { color: palette.primary.main, borderColor: palette.primary.main },
                  }}
                  size="small"
                >
                  {s.icon === 'facebook' && <FacebookIcon fontSize="small" />}
                  {s.icon === 'instagram' && <InstagramIcon fontSize="small" />}
                  {s.icon === 'yelp' && (
                    <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Y</Typography>
                  )}
                  {s.icon === 'tripadvisor' && (
                    <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>TA</Typography>
                  )}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: palette.primary.main, mb: 2, fontSize: '0.8rem' }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Typography
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: '#bbb',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: palette.primary.main },
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: palette.primary.main, mb: 2, fontSize: '0.8rem' }}
            >
              Services
            </Typography>
            <Stack spacing={1}>
              {serviceLinks.map((link) =>
                link.path ? (
                  <Typography
                    key={link.label}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#bbb',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { color: palette.primary.main },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                ) : (
                  <Typography
                    key={link.label}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#bbb',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { color: palette.primary.main },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                )
              )}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: palette.primary.main, mb: 2, fontSize: '0.8rem' }}
            >
              Contact Us
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <PlaceIcon sx={{ color: palette.primary.main, fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  {businessInfo.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <PhoneIcon sx={{ color: palette.primary.main, fontSize: 20 }} />
                <Typography
                  component="a"
                  href={`tel:${businessInfo.phone}`}
                  variant="body2"
                  sx={{ color: '#bbb', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                >
                  {businessInfo.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <EmailIcon sx={{ color: palette.primary.main, fontSize: 20 }} />
                <Typography
                  component="a"
                  href={`mailto:${businessInfo.email}`}
                  variant="body2"
                  sx={{ color: '#bbb', textDecoration: 'none', '&:hover': { color: '#fff' } }}
                >
                  {businessInfo.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <AccessTimeIcon sx={{ color: palette.primary.main, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  {businessInfo.hours}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#444', my: 4 }} />

        {/* Bottom bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: '#888', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Corrado's Restaurant and Bar. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
            38 Baldwin Street, Whitby, ON &nbsp;|&nbsp; Casual Italian Dining &nbsp;|&nbsp; Est. 2010
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
