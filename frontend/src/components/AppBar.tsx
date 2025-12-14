import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useNavigate } from 'react-router-dom';

interface AppBarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function AppBar({ onMenuClick, title = 'Gym Management' }: AppBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        {onMenuClick && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
              <Avatar
                sx={{ cursor: 'pointer', bgcolor: 'secondary.main' }}
                onClick={handleMenuOpen}
              >
                {user.firstName.charAt(0)}
              </Avatar>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;
