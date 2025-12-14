import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ClassesIcon from '@mui/icons-material/FitnessCenter';
import BookingIcon from '@mui/icons-material/EventAvailable';
import UsersIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthStore();

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'MEMBER':
        return '/member';
      case 'TRAINER':
        return '/trainer';
      default:
        return '/dashboard';
    }
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: user ? getDashboardRoute(user.role) : '/dashboard', 
      roles: ['ADMIN', 'MEMBER', 'TRAINER', 'STAFF'] 
    },
    { 
      label: 'Admin Panel', 
      icon: <AdminPanelSettingsIcon />, 
      path: '/admin', 
      roles: ['ADMIN'] 
    },
    { 
      label: 'Member Portal', 
      icon: <PersonIcon />, 
      path: '/member', 
      roles: ['MEMBER'] 
    },
    { 
      label: 'Trainer Hub', 
      icon: <FitnessCenterIcon />, 
      path: '/trainer', 
      roles: ['TRAINER'] 
    },
    { label: 'Classes', icon: <ClassesIcon />, path: '/classes', roles: ['MEMBER', 'TRAINER'] },
    { label: 'My Bookings', icon: <BookingIcon />, path: '/bookings', roles: ['MEMBER'] },
    { label: 'Members', icon: <UsersIcon />, path: '/members', roles: ['ADMIN', 'TRAINER', 'STAFF'] },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      {/* User Role Indicator */}
      {user && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Logged in as:
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {user.role}
          </Typography>
        </Box>
      )}
      
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? 'action.selected'
                  : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 2 }} />
      
      {/* Quick Actions */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Quick Actions
        </Typography>
        <Typography 
          variant="caption" 
          color="primary" 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate('/logout')}
        >
          Logout
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer anchor="left" open={open} onClose={onClose}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              mt: 8,
              height: 'calc(100vh - 64px)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export default Sidebar;
