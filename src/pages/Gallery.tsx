import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Dialog,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { PageHero } from '../components';
import { galleryItems } from '../data';
import { palette } from '../theme';
import type { GalleryItem } from '../types';

const categoryColors: Record<string, string> = {
  food: palette.primary.main,
  interior: palette.navy,
  events: palette.secondary.main,
  drinks: palette.wine,
};

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Food', value: 'food' },
  { label: 'Interior', value: 'interior' },
  { label: 'Events', value: 'events' },
  { label: 'Drinks', value: 'drinks' },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered =
    activeTab === 'all' ? galleryItems : galleryItems.filter((item) => item.category === activeTab);

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A glimpse into the Corrado's experience — our food, our space, our events."
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: palette.background.default }}>
        <Container>
          {/* Category filter */}
          <Box sx={{ mb: 5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { fontSize: '0.8rem', minWidth: 'auto', px: 2 },
                '& .Mui-selected': { color: `${palette.primary.main} !important` },
                '& .MuiTabs-indicator': { backgroundColor: palette.primary.main },
              }}
            >
              {categories.map((cat) => (
                <Tab key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Tabs>
          </Box>

          {/* Masonry columns gallery */}
          <Box
            sx={{
              columns: { xs: 2, sm: 3, md: 4 },
              columnGap: { xs: '8px', sm: '10px', md: '12px' },
            }}
          >
            {filtered.map((item) => (
              <Box
                key={item.id}
                onClick={() => setSelectedImage(item)}
                sx={{
                  breakInside: 'avoid',
                  mb: { xs: '8px', sm: '10px', md: '12px' },
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  display: 'block',
                  bgcolor: palette.warmGray,
                  '&:hover img': { transform: 'scale(1.07)' },
                  '&:hover .overlay': { opacity: 1 },
                  '&:hover .zoom-icon': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.45s ease',
                  }}
                />
                {/* Hover overlay */}
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.72) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: { xs: 1, md: 1.5 },
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      mb: 0.6,
                      alignSelf: 'flex-start',
                      bgcolor: categoryColors[item.category] || palette.charcoal,
                      color: '#fff',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      height: 18,
                      borderRadius: '4px',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#fff',
                      fontSize: { xs: '0.72rem', md: '0.8rem' },
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.alt}
                  </Typography>
                </Box>
                {/* Zoom icon centred */}
                <Box
                  className="zoom-icon"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.7)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    bgcolor: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <ZoomInIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
              </Box>
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: palette.text.secondary }}>
                No images in this category yet. Check back soon!
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Lightbox dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#000', borderRadius: 1 } }}
      >
        {selectedImage && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedImage.src.replace('w=600', 'w=1200')}
              alt={selectedImage.alt}
              sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {selectedImage.alt}
              </Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}
