import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { PageHero } from '../components';
import { businessInfo } from '../data';
import { palette } from '../theme';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static form — show success message
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us for reservations, inquiries, or feedback."
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={5}>
            {/* Contact Info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: palette.primary.main, mb: 1, letterSpacing: '0.15em' }}
              >
                GET IN TOUCH
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Visit Us Today
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <PlaceIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                      {businessInfo.address}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      PHONE
                    </Typography>
                    <Typography
                      component="a"
                      href={`tel:${businessInfo.phone}`}
                      variant="body2"
                      sx={{ color: palette.text.secondary, textDecoration: 'none', '&:hover': { color: palette.primary.main } }}
                    >
                      {businessInfo.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <EmailIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      EMAIL
                    </Typography>
                    <Typography
                      component="a"
                      href={`mailto:${businessInfo.email}`}
                      variant="body2"
                      sx={{ color: palette.text.secondary, textDecoration: 'none', '&:hover': { color: palette.primary.main } }}
                    >
                      {businessInfo.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <AccessTimeIcon sx={{ color: palette.primary.main, mt: 0.3 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.3 }}>
                      HOURS
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.text.secondary }}>
                      {businessInfo.hours}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Social */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1.5 }}>
                  FOLLOW US
                </Typography>
                <Stack direction="row" spacing={1}>
                  {businessInfo.social.map((s) => (
                    <Button
                      key={s.name}
                      variant="outlined"
                      size="small"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        minWidth: 'auto',
                        p: 1,
                        borderColor: palette.warmGray,
                        color: palette.text.secondary,
                        '&:hover': { borderColor: palette.primary.main, color: palette.primary.main },
                      }}
                    >
                      {s.icon === 'facebook' && <FacebookIcon fontSize="small" />}
                      {s.icon === 'instagram' && <InstagramIcon fontSize="small" />}
                      {s.icon === 'yelp' && (
                        <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Y</Typography>
                      )}
                      {s.icon === 'tripadvisor' && (
                        <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>TA</Typography>
                      )}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Order CTA */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={businessInfo.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  fullWidth
                >
                  Order Online
                </Button>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Send Us a Message
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.text.secondary, mb: 3 }}>
                    Have a question or feedback? Fill out the form below and we'll get back to you.
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone"
                          type="tel"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Subject"
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={5}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ py: 1.5 }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map placeholder */}
      <Box
        sx={{
          height: { xs: 300, md: 400 },
          bgcolor: palette.warmGray,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <iframe
          title="Corrado's Restaurant Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2870.0!2d-78.9426!3d43.8745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDUyJzI4LjIiTiA3OMKwNTYnMzMuNCJX!5e0!3m2!1sen!2sca!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={submitted}
        autoHideDuration={5000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubmitted(false)} severity="success" sx={{ width: '100%' }}>
          Thank you for your message! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
}
