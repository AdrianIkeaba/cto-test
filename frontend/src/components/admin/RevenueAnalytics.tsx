import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Mock data for revenue analytics
const mockRevenueData = [
  { month: 'Jan 2023', revenue: 45000, expenses: 32000, profit: 13000, members: 850 },
  { month: 'Feb 2023', revenue: 52000, expenses: 34000, profit: 18000, members: 920 },
  { month: 'Mar 2023', revenue: 48000, expenses: 31000, profit: 17000, members: 880 },
  { month: 'Apr 2023', revenue: 61000, expenses: 38000, profit: 23000, members: 1050 },
  { month: 'May 2023', revenue: 55000, expenses: 35000, profit: 20000, members: 980 },
  { month: 'Jun 2023', revenue: 67000, expenses: 42000, profit: 25000, members: 1200 },
];

const mockMembershipData = [
  { name: 'Basic', value: 45, color: '#8884d8' },
  { name: 'Premium', value: 35, color: '#82ca9d' },
  { name: 'Elite', value: 20, color: '#ffc658' },
];

const mockUtilizationData = [
  { time: '6 AM', utilization: 45 },
  { time: '7 AM', utilization: 78 },
  { time: '8 AM', utilization: 95 },
  { time: '9 AM', utilization: 65 },
  { time: '10 AM', utilization: 40 },
  { time: '11 AM', utilization: 35 },
  { time: '12 PM', utilization: 55 },
  { time: '1 PM', utilization: 25 },
  { time: '2 PM', utilization: 30 },
  { time: '3 PM', utilization: 40 },
  { time: '4 PM', utilization: 50 },
  { time: '5 PM', utilization: 85 },
  { time: '6 PM', utilization: 100 },
  { time: '7 PM', utilization: 92 },
  { time: '8 PM', utilization: 88 },
  { time: '9 PM', utilization: 65 },
  { time: '10 PM', utilization: 40 },
];

const RevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 6));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$327,000',
      change: '+15.2%',
      isPositive: true,
      period: 'vs last 6 months',
    },
    {
      title: 'Net Profit',
      value: '$116,000',
      change: '+22.8%',
      isPositive: true,
      period: 'vs last 6 months',
    },
    {
      title: 'Profit Margin',
      value: '35.5%',
      change: '+3.2%',
      isPositive: true,
      period: 'vs last 6 months',
    },
    {
      title: 'Avg Members',
      value: '1,067',
      change: '+12.4%',
      isPositive: true,
      period: 'vs last 6 months',
    },
  ];

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (range === '6months') {
      setStartDate(subMonths(new Date(), 6));
      setEndDate(new Date());
    } else if (range === '1year') {
      setStartDate(subMonths(new Date(), 12));
      setEndDate(new Date());
    } else if (range === 'custom') {
      // Keep current dates for custom
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Revenue Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => handleTimeRangeChange(e.target.value)}
              >
                <MenuItem value="3months">3 Months</MenuItem>
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {timeRange === 'custom' && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => date && setStartDate(date)}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => date && setEndDate(date)}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {kpi.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {kpi.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={kpi.change}
                      color={kpi.isPositive ? 'success' : 'error'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {kpi.period}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Revenue Trend Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Revenue Trend
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    variant={selectedMetric === 'revenue' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedMetric('revenue')}
                  >
                    Revenue
                  </Button>
                  <Button
                    variant={selectedMetric === 'profit' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedMetric('profit')}
                  >
                    Profit
                  </Button>
                  <Button
                    variant={selectedMetric === 'members' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedMetric('members')}
                  >
                    Members
                  </Button>
                </ButtonGroup>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => {
                    if (selectedMetric === 'members') return [value, 'Members'];
                    return [`$${value.toLocaleString()}`, selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)];
                  }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#2196F3"
                    strokeWidth={3}
                    dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Membership Distribution */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Membership Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockMembershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockMembershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Facility Utilization */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Daily Facility Utilization
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="utilization"
                    stroke="#FF9800"
                    fill="#FF9800"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Revenue Breakdown Table */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Monthly Revenue Breakdown
              </Typography>
              <Box sx={{ overflow: 'auto' }}>
                <Box sx={{ display: 'flex', minWidth: 800, mb: 1, fontWeight: 'bold' }}>
                  <Box sx={{ width: '20%', p: 1 }}>Month</Box>
                  <Box sx={{ width: '20%', p: 1 }}>Revenue</Box>
                  <Box sx={{ width: '20%', p: 1 }}>Expenses</Box>
                  <Box sx={{ width: '20%', p: 1 }}>Profit</Box>
                  <Box sx={{ width: '20%', p: 1 }}>Members</Box>
                </Box>
                {mockRevenueData.map((data, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    minWidth: 800, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}>
                    <Box sx={{ width: '20%', p: 1 }}>{data.month}</Box>
                    <Box sx={{ width: '20%', p: 1, color: 'primary.main', fontWeight: 'bold' }}>
                      ${data.revenue.toLocaleString()}
                    </Box>
                    <Box sx={{ width: '20%', p: 1, color: 'error.main' }}>
                      ${data.expenses.toLocaleString()}
                    </Box>
                    <Box sx={{ width: '20%', p: 1, color: 'success.main', fontWeight: 'bold' }}>
                      ${data.profit.toLocaleString()}
                    </Box>
                    <Box sx={{ width: '20%', p: 1 }}>
                      {data.members}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default RevenueAnalytics;