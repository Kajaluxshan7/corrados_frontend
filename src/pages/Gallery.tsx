import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Dialog,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PageHero } from '../components';
import { galleryItems } from '../data';
import { palette } from '../theme';
import type { GalleryItem } from '../types';

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

          {/* Gallery grid */}
          <Grid container spacing={2}>
            {filtered.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box
                  onClick={() => setSelectedImage(item)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 1,
                    '&:hover img': { transform: 'scale(1.08)' },
                    '&:hover .overlay': { opacity: 1 },
                  }}
                >
                  <Box
                    component="img"
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: { xs: 160, sm: 200, md: 240 },
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 1.5,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem' }}>
                      {item.alt}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

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
