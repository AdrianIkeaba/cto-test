import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from '@/theme/theme';

// Pages
import LandingPage from '@pages/LandingPage';
import LoginPage from '@pages/Login';
import SignupPage from '@pages/Signup';
import VerifyEmailPage from '@pages/VerifyEmail';
import ForgotPasswordPage from '@pages/ForgotPassword';
import DashboardPage from '@pages/Dashboard';
import AdminDashboard from '@pages/AdminDashboard';
import MemberDashboard from '@pages/MemberDashboard';
import TrainerDashboard from '@pages/TrainerDashboard';
import UnauthorizedPage from '@pages/Unauthorized';

// Components
import ProtectedRoute from '@components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected dashboard routes - Role-based access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/member"
            element={
              <ProtectedRoute requiredRoles={['MEMBER']}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/trainer"
            element={
              <ProtectedRoute requiredRoles={['TRAINER']}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Error pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Catch all route - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
