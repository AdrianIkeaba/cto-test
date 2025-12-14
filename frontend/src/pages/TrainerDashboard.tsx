import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import {
  People,
  Schedule,
  Assignment,
  TrendingUp,
  AttachMoney,
  CalendarToday,
  BarChart,
} from '@mui/icons-material';
import MainLayout from '@layouts/MainLayout';
import KPICard from '@components/KPICard';
import TrainerClients from '@components/trainer/TrainerClients';
import TrainerAvailability from '@components/trainer/TrainerAvailability';
import SessionScheduler from '@components/trainer/SessionScheduler';
import WorkoutPlans from '@components/trainer/WorkoutPlans';
import ClientProgress from '@components/trainer/ClientProgress';
import TrainerEarnings from '@components/trainer/TrainerEarnings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trainer-tabpanel-${index}`}
      aria-labelledby={`trainer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const TrainerDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Mock trainer data
  const trainerData = {
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    specialization: 'Strength & Conditioning',
    experience: '5 years',
    avatar: 'SW',
    rating: 4.9,
  };

  // Mock KPI data for trainer dashboard
  const trainerMetrics = [
    {
      title: 'Active Clients',
      value: 24,
      icon: <People />,
      color: 'primary' as const,
      trend: { value: 15, isPositive: true },
    },
    {
      title: 'Sessions This Week',
      value: 32,
      icon: <Schedule />,
      color: 'secondary' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Monthly Earnings',
      value: '$8,750',
      icon: <AttachMoney />,
      color: 'success' as const,
      trend: { value: 22, isPositive: true },
    },
    {
      title: 'Client Satisfaction',
      value: 98,
      unit: '%',
      icon: <TrendingUp />,
      color: 'info' as const,
      progress: 98,
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <MainLayout title="Trainer Dashboard">
      {/* Profile Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                }}
              >
                {trainerData.avatar}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {trainerData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trainerData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trainerData.specialization}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Experience: {trainerData.experience}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary">
                  ⭐ {trainerData.rating}/5.0
                </Typography>
              </Box>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {trainerMetrics.map((metric, index) => (
              <Grid item xs={6} key={index}>
                <KPICard {...metric} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<People />}
              onClick={() => setCurrentTab(0)}
              sx={{ py: 2 }}
            >
              My Clients
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CalendarToday />}
              onClick={() => setCurrentTab(1)}
              sx={{ py: 2 }}
            >
              Availability
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Schedule />}
              onClick={() => setCurrentTab(2)}
              sx={{ py: 2 }}
            >
              Schedule
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Assignment />}
              onClick={() => setCurrentTab(3)}
              sx={{ py: 2 }}
            >
              Workout Plans
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Trainer Features Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="trainer dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<People />} label="Clients" />
            <Tab icon={<CalendarToday />} label="Availability" />
            <Tab icon={<Schedule />} label="Sessions" />
            <Tab icon={<Assignment />} label="Workout Plans" />
            <Tab icon={<BarChart />} label="Progress" />
            <Tab icon={<AttachMoney />} label="Earnings" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <TrainerClients />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <TrainerAvailability />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <SessionScheduler />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <WorkoutPlans />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <ClientProgress />
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <TrainerEarnings />
        </TabPanel>
      </Paper>
    </MainLayout>
  );
};

export default TrainerDashboard;