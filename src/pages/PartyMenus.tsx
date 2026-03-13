import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';
import { PageHero } from '../components';
import { partyPackages, businessInfo } from '../data';
import { palette } from '../theme';

const partyImages: Record<string, string> = {
  'casual-gathering': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80',
  'classic-dinner': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'premium-celebration': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
  'sports-party': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
};

export default function PartyMenus() {
  return (
    <>
      <PageHero
        title="Party Menus & Catering"
        subtitle="Customizable packages for every occasion — from casual gatherings to premium celebrations."
        backgroundImage="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={3}>
            {partyPackages.map((pkg) => (
              <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
                    },
                    '&:hover img': { transform: 'scale(1.05)' },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: 170, md: 190 } }}>
                    <Box
                      component="img"
                      src={partyImages[pkg.id]}
                      alt={pkg.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {pkg.name}
                      </Typography>
                      <Chip
                        label={`Min ${pkg.minGuests} guests`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: palette.sage,
                          color: palette.secondary.main,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: palette.primary.main,
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {pkg.pricePerPerson}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: palette.text.secondary, ml: 0.5 }}
                      >
                        / person
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        mb: 2,
                        lineHeight: 1.7,
                      }}
                    >
                      {pkg.description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontSize: "0.8rem",
                        color: palette.charcoal,
                      }}
                    >
                      WHAT'S INCLUDED:
                    </Typography>
                    <List dense sx={{ flex: 1 }}>
                      {pkg.includes.map((item, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon
                              sx={{
                                fontSize: 16,
                                color: palette.secondary.main,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: palette.text.secondary,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Contact CTA */}
          <Box
            sx={{
              mt: 8,
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Ready to Plan Your Event?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: palette.text.secondary,
                mb: 3,
                maxWidth: 550,
                mx: "auto",
              }}
            >
              Contact our event coordinator to customize any package to your
              needs. We'll make your event unforgettable.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/contact"
                size="large"
              >
                Contact Us
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href={`tel:${businessInfo.phone}`}
                startIcon={<PhoneIcon />}
                size="large"
              >
                {businessInfo.phone}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href={`mailto:${businessInfo.email}`}
                startIcon={<EmailIcon />}
                size="large"
              >
                Email Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
