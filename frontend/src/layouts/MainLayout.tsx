import { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import AppBar from '@components/AppBar';
import Sidebar from '@components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar onMenuClick={handleSidebarToggle} title={title} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          ml: isMobile ? 0 : '250px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
