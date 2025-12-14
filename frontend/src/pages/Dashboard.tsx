import { Grid, Box } from '@mui/material';
import MainLayout from '@layouts/MainLayout';
import KPICard from '@components/KPICard';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export function DashboardPage() {
  // Mock data - replace with actual API calls using React Query
  const kpiMetrics = [
    {
      title: 'Total Members',
      value: 1250,
      icon: <PeopleIcon />,
      color: 'primary' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Active Subscriptions',
      value: 980,
      icon: <TrendingUpIcon />,
      color: 'success' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Monthly Revenue',
      value: '$45,250',
      icon: <AccountBalanceIcon />,
      color: 'info' as const,
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Class Utilization',
      value: 85,
      unit: '%',
      icon: <FitnessCenterIcon />,
      color: 'warning' as const,
      progress: 85,
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {kpiMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <KPICard {...metric} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <h3>Welcome to Gym Management System</h3>
            <p>
              This is a sample dashboard demonstrating the layout structure with KPI cards
              and responsive grid system.
            </p>
          </Box>
        </Grid>
      </Grid>
    </MainLayout>
  );
}

export default DashboardPage;
