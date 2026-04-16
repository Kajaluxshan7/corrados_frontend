import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollProgressButton } from '../components';
import { WebSocketProvider } from "../contexts/WebSocketContext";
import { SiteImagesProvider } from "../contexts/SiteImagesContext";

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <WebSocketProvider>
      <SiteImagesProvider>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <Outlet />
          </Box>
          <Footer />
          <ScrollProgressButton />
        </Box>
      </SiteImagesProvider>
    </WebSocketProvider>
  );
}
