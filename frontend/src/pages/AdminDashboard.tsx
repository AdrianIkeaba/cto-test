import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Group,
  FitnessCenter,
  Schedule,
  Analytics,
  Settings,
  TrendingUp,
  AttachMoney,
  Inventory,
  Class,
} from '@mui/icons-material';
import MainLayout from '@layouts/MainLayout';
import KPICard from '@components/KPICard';
import MembersTable from '@components/admin/MembersTable';
import StaffTable from '@components/admin/StaffTable';
import ClassesManager from '@components/admin/ClassesManager';
import EquipmentInventory from '@components/admin/EquipmentInventory';
import RevenueAnalytics from '@components/admin/RevenueAnalytics';
import PricingPlans from '@components/admin/PricingPlans';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Mock KPI data - replace with actual API calls
  const kpiMetrics = [
    {
      title: 'Total Members',
      value: 1250,
      icon: <People />,
      color: 'primary' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Staff Members',
      value: 45,
      icon: <Group />,
      color: 'secondary' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Monthly Revenue',
      value: '$85,750',
      icon: <AttachMoney />,
      color: 'success' as const,
      trend: { value: 15, isPositive: true },
    },
    {
      title: 'Equipment Status',
      value: 95,
      unit: '%',
      icon: <Inventory />,
      color: 'warning' as const,
      progress: 95,
    },
    {
      title: 'Active Classes',
      value: 28,
      icon: <Class />,
      color: 'info' as const,
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Utilization Rate',
      value: 87,
      unit: '%',
      icon: <TrendingUp />,
      color: 'success' as const,
      progress: 87,
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <MainLayout title="Admin Dashboard">
      {/* KPI Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
          {kpiMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <KPICard {...metric} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Management Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Analytics />} label="Analytics" />
            <Tab icon={<People />} label="Members" />
            <Tab icon={<Group />} label="Staff" />
            <Tab icon={<Schedule />} label="Classes" />
            <Tab icon={<FitnessCenter />} label="Equipment" />
            <Tab icon={<Settings />} label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <RevenueAnalytics />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <MembersTable />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <StaffTable />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <ClassesManager />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <EquipmentInventory />
        </TabPanel>

        <TabPanel value={currentTab} index={5}>
          <PricingPlans />
        </TabPanel>
      </Paper>
    </MainLayout>
  );
};

export default AdminDashboard;