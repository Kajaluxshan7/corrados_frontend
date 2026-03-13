import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhoneIcon from '@mui/icons-material/Phone';
import { palette } from '../theme';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: palette.background.default,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '5rem', md: '7rem' },
            fontWeight: 700,
            color: palette.primary.main,
            lineHeight: 1,
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            fontSize: { xs: '1.4rem', md: '1.8rem' },
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: palette.text.secondary,
            mb: 4,
            maxWidth: 400,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          Sorry, the page you're looking for doesn't exist or may have been
          moved. Let us help you find your way back to great Italian food.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            size="large"
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/menus"
            startIcon={<MenuBookIcon />}
            size="large"
          >
            View Menus
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/contact"
            startIcon={<PhoneIcon />}
            size="large"
          >
            Contact Us
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
