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
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { PageHero } from '../components';
import { familyMeals, businessInfo } from '../data';
import { palette } from '../theme';

export default function FamilyMeals() {
  return (
    <>
      <PageHero
        title="Family Meals"
        subtitle="Complete meal packages for the whole family — ready to enjoy at home or at our table."
        backgroundImage="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={3}>
            {familyMeals.map((meal) => (
              <Grid key={meal.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {meal.name}
                      </Typography>
                      <Chip
                        label={`Serves ${meal.serves}`}
                        size="small"
                        sx={{
                          bgcolor: palette.secondary.main,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ color: palette.primary.main, fontWeight: 700, mb: 2 }}
                    >
                      {meal.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.7 }}
                    >
                      {meal.description}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.8rem', color: palette.charcoal }}>
                      INCLUDES:
                    </Typography>
                    <List dense sx={{ flex: 1 }}>
                      {meal.items.map((item, idx) => (
                        <ListItem key={idx} disableGutters sx={{ py: 0.3 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: palette.secondary.main }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{ variant: 'body2', color: palette.text.secondary }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Order CTA */}
          <Box
            sx={{
              mt: 8,
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Order Your Family Meal Today
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: palette.text.secondary, mb: 3, maxWidth: 500, mx: 'auto' }}
            >
              Available for dine-in, takeout, and delivery. Order online or call us to place your order.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={businessInfo.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{ px: 5 }}
              >
                Order Now
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component="a"
                href={`tel:${businessInfo.phone}`}
              >
                Call {businessInfo.phone}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
