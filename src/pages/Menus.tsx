import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { PageHero } from '../components';
import { menuCategories, businessInfo } from '../data';
import { palette } from '../theme';
import { formatAmpersand } from "../utils/formatAmpersand";

const categoryImages: Record<string, string> = {
  appetizers: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=1200&q=80',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80',
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
  mains: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  wings: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1200&q=80',
  desserts: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=80',
};

export default function Menus() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <PageHero
        title="Our Menus"
        subtitle="Authentic Italian dishes made with fresh ingredients and time-honoured recipes."
        backgroundImage="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1600&q=80"
        cta={{ label: "Order Online", href: businessInfo.orderUrl }}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          {/* Category Tabs */}
          <Box sx={{ mb: 5, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  fontSize: "0.8rem",
                  minWidth: "auto",
                  px: 2,
                },
                "& .Mui-selected": {
                  color: `${palette.primary.main} !important`,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: palette.primary.main,
                },
              }}
            >
              {menuCategories.map((cat) => (
                <Tab key={cat.id} label={cat.name} />
              ))}
            </Tabs>
          </Box>

          {/* Category banner + header */}
          {categoryImages[menuCategories[activeTab].id] && (
            <Box
              sx={{
                position: 'relative',
                height: { xs: 160, md: 200 },
                borderRadius: 1,
                overflow: 'hidden',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={categoryImages[menuCategories[activeTab].id]}
                alt={menuCategories[activeTab].name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: { xs: 2, md: 3 },
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                    {menuCategories[activeTab].name}
                  </Typography>
                  {menuCategories[activeTab].description && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                      {menuCategories[activeTab].description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* Menu items */}
          <Grid container spacing={3}>
            {menuCategories[activeTab].items.map((item, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, fontSize: "1.05rem", flex: 1 }}
                      >
                        {formatAmpersand(item.name)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: palette.primary.main,
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          ml: 2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.price}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: palette.text.secondary,
                        lineHeight: 1.7,
                        mb: 1.5,
                      }}
                    >
                      {item.description}
                    </Typography>
                    {item.tags && item.tags.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {item.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.65rem",
                              height: 22,
                              borderColor: palette.sage,
                              color: palette.secondary.main,
                              textTransform: "capitalize",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Order CTA */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 4,
              bgcolor: palette.cream,
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Ready to Order?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: palette.text.secondary, mb: 3 }}
            >
              Place your order online for pickup or delivery.
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
