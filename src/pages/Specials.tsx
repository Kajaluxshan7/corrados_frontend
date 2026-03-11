import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { PageHero } from '../components';
import { specials, businessInfo } from '../data';
import { palette } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";

export default function Specials() {
  return (
    <>
      <PageHero
        title="Daily Specials"
        subtitle="Great food at even better prices — something new every day of the week."
        backgroundImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          <Grid container spacing={3}>
            {specials.map((special) => (
              <Grid key={special.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={special.day}
                        size="small"
                        sx={{
                          bgcolor: palette.primary.main,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.7rem",
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
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {formatAmpersand(special.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        mb: 2,
                        lineHeight: 1.7,
                        flex: 1,
                      }}
                    >
                      {special.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: palette.primary.main, fontWeight: 700 }}
                    >
                      {special.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Order CTA */}
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              py: 5,
              px: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
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
              Don't Miss Out!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: palette.text.secondary,
                mb: 3,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              These specials are available for dine-in, takeout, and delivery.
              Order now and enjoy.
            </Typography>
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
          </Box>
        </Container>
      </Box>
    </>
  );
}
