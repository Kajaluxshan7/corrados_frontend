import { Outlet, useLocation } from 'react-router-dom';
import { Box, Collapse, Typography } from "@mui/material";
import { useEffect } from "react";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import Header from "./Header";
import Footer from "./Footer";
import { ScrollProgressButton } from "../components";
import { WebSocketProvider, useWs } from "../contexts/WebSocketContext";
import { SiteImagesProvider } from "../contexts/SiteImagesContext";

function WsStatusBanner() {
  const { connected } = useWs();
  return (
    <Collapse in={!connected}>
      <Box
        sx={{
          bgcolor: "#b45309",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 0.75,
          px: 2,
          fontSize: "0.8rem",
          textAlign: "center",
        }}
      >
        <WifiOffIcon sx={{ fontSize: 16 }} />
        <Typography variant="body2" sx={{ fontSize: "inherit" }}>
          Live updates paused — reconnecting…
        </Typography>
      </Box>
    </Collapse>
  );
}

function LayoutContent() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <WsStatusBanner />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <ScrollProgressButton />
    </Box>
  );
}

export default function MainLayout() {
  return (
    <WebSocketProvider>
      <SiteImagesProvider>
        <LayoutContent />
      </SiteImagesProvider>
    </WebSocketProvider>
  );
}
