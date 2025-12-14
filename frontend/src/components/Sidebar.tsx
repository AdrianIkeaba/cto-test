import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
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

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['ADMIN', 'MEMBER', 'TRAINER', 'STAFF'] },
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
