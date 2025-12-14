import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import type { UserRole } from '@typings/index';
import { useEffect, useState } from 'react';
import apiClient from '@services/api';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check if we have a valid token
      const hasValidToken = apiClient.isAuthenticated();
      
      if (hasValidToken && !user) {
        // Try to load user from token or fetch from API
        // For now, we'll assume the user is set elsewhere
        setIsInitialized(true);
      } else {
        setIsInitialized(true);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [user, setUser]);

  if (isLoading || !isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!apiClient.isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
