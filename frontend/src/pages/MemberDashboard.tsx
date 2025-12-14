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
  Chip,
  Button,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Schedule,
  TrendingUp,
  Assignment,
  History,
  Receipt,
  LocalHospital,
} from '@mui/icons-material';
import MainLayout from '@layouts/MainLayout';
import KPICard from '@components/KPICard';
import MemberProfile from '@components/member/MemberProfile';
import ClassCatalog from '@components/member/ClassCatalog';
import WorkoutHistory from '@components/member/WorkoutHistory';
import PTSessionBooking from '@components/member/PTSessionBooking';
import AttendanceLog from '@components/member/AttendanceLog';
import InvoiceHistory from '@components/member/InvoiceHistory';

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
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const MemberDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Mock member data
  const memberData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    membershipType: 'Premium',
    membershipStatus: 'Active',
    joinDate: '2023-06-15',
    avatar: 'AJ',
  };

  // Mock KPI data for member dashboard
  const memberMetrics = [
    {
      title: 'Workouts This Month',
      value: 18,
      icon: <FitnessCenter />,
      color: 'primary' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Classes Booked',
      value: 24,
      icon: <Schedule />,
      color: 'secondary' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Goal Progress',
      value: 73,
      unit: '%',
      icon: <TrendingUp />,
      color: 'success' as const,
      progress: 73,
    },
    {
      title: 'PT Sessions',
      value: 6,
      icon: <LocalHospital />,
      color: 'info' as const,
      trend: { value: 2, isPositive: true },
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getMembershipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'suspended':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout title="Member Dashboard">
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
                {memberData.avatar}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {memberData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {memberData.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={memberData.membershipType}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={memberData.membershipStatus}
                  color={getMembershipColor(memberData.membershipStatus)}
                  size="small"
                />
              </Box>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {memberMetrics.map((metric, index) => (
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
              startIcon={<Schedule />}
              onClick={() => setCurrentTab(1)}
              sx={{ py: 2 }}
            >
              Book Class
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LocalHospital />}
              onClick={() => setCurrentTab(3)}
              sx={{ py: 2 }}
            >
              PT Session
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Assignment />}
              onClick={() => setCurrentTab(2)}
              sx={{ py: 2 }}
            >
              View Workouts
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Receipt />}
              onClick={() => setCurrentTab(5)}
              sx={{ py: 2 }}
            >
              View Invoices
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Member Features Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="member dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<FitnessCenter />} label="Classes" />
            <Tab icon={<Assignment />} label="Workouts" />
            <Tab icon={<LocalHospital />} label="PT Sessions" />
            <Tab icon={<History />} label="Attendance" />
            <Tab icon={<Receipt />} label="Invoices" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <MemberProfile memberData={memberData} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <ClassCatalog />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <WorkoutHistory />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <PTSessionBooking />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <AttendanceLog />
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <InvoiceHistory />
        </TabPanel>
      </Paper>
    </MainLayout>
  );
};

export default MemberDashboard;