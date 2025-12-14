import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  CalendarToday,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock earnings data
const mockEarnings = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Alex Johnson',
    date: '2024-01-10',
    sessionType: 'Strength Training',
    duration: 60,
    rate: 75,
    amount: 75,
    status: 'Paid',
    sessionNumber: 24,
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Sarah Wilson',
    date: '2024-01-08',
    sessionType: 'Flexibility & Recovery',
    duration: 45,
    rate: 65,
    amount: 65,
    status: 'Paid',
    sessionNumber: 18,
  },
  {
    id: 3,
    clientId: 4,
    clientName: 'Emily Davis',
    date: '2024-01-09',
    sessionType: 'Weight Loss Program',
    duration: 60,
    rate: 65,
    amount: 65,
    status: 'Pending',
    sessionNumber: 8,
  },
  {
    id: 4,
    clientId: 5,
    clientName: 'David Wilson',
    date: '2024-01-11',
    sessionType: 'General Fitness',
    duration: 60,
    rate: 65,
    amount: 65,
    status: 'Pending',
    sessionNumber: 14,
  },
  {
    id: 5,
    clientId: 1,
    clientName: 'Alex Johnson',
    date: '2023-12-28',
    sessionType: 'Strength Training',
    duration: 60,
    rate: 75,
    amount: 75,
    status: 'Paid',
    sessionNumber: 23,
  },
  {
    id: 6,
    clientId: 2,
    clientName: 'Sarah Wilson',
    date: '2023-12-26',
    sessionType: 'Flexibility & Recovery',
    duration: 45,
    rate: 65,
    amount: 65,
    status: 'Paid',
    sessionNumber: 17,
  },
  {
    id: 7,
    clientId: 3,
    clientName: 'Mike Chen',
    date: '2023-12-15',
    sessionType: 'Athletic Performance',
    duration: 90,
    rate: 85,
    amount: 127.5,
    status: 'Paid',
    sessionNumber: 32,
  },
  {
    id: 8,
    clientId: 4,
    clientName: 'Emily Davis',
    date: '2023-12-30',
    sessionType: 'Weight Loss Program',
    duration: 60,
    rate: 65,
    amount: 65,
    status: 'Paid',
    sessionNumber: 7,
  },
];

// Mock monthly earnings data
const mockMonthlyEarnings = [
  { month: 'Jul 2023', earnings: 2850, sessions: 38, avgRate: 75 },
  { month: 'Aug 2023', earnings: 3125, sessions: 42, avgRate: 74 },
  { month: 'Sep 2023', earnings: 2980, sessions: 40, avgRate: 75 },
  { month: 'Oct 2023', earnings: 3350, sessions: 45, avgRate: 74 },
  { month: 'Nov 2023', earnings: 3675, sessions: 49, avgRate: 75 },
  { month: 'Dec 2023', earnings: 3525, sessions: 47, avgRate: 75 },
  { month: 'Jan 2024', earnings: 2100, sessions: 28, avgRate: 75 },
];

// Mock session type distribution
const mockSessionTypeData = [
  { name: 'Strength Training', value: 35, color: '#2196F3' },
  { name: 'Weight Loss', value: 25, color: '#FF5722' },
  { name: 'Flexibility', value: 20, color: '#9C27B0' },
  { name: 'General Fitness', value: 15, color: '#4CAF50' },
  { name: 'Athletic Performance', value: 5, color: '#FF9800' },
];

const TrainerEarnings = () => {
  const [filterPeriod, setFilterPeriod] = useState('3months');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter earnings
  const filteredEarnings = mockEarnings.filter(earning => {
    if (filterStatus === 'All') return true;
    return earning.status === filterStatus;
  });

  // Calculate statistics
  const earningsStats = {
    totalEarned: mockEarnings.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0),
    pendingAmount: mockEarnings.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0),
    totalSessions: mockEarnings.length,
    avgRate: mockEarnings.reduce((sum, e) => sum + e.rate, 0) / mockEarnings.length,
    thisMonth: mockEarnings
      .filter(e => {
        const earningDate = new Date(e.date);
        const now = new Date();
        return earningDate.getMonth() === now.getMonth() && 
               earningDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'Strength Training':
        return 'primary';
      case 'Weight Loss Program':
        return 'warning';
      case 'Flexibility & Recovery':
        return 'secondary';
      case 'Athletic Performance':
        return 'error';
      default:
        return 'info';
    }
  };

  // Calculate client revenue
  const clientRevenue = mockEarnings.reduce((acc, earning) => {
    if (!acc[earning.clientName]) {
      acc[earning.clientName] = {
        name: earning.clientName,
        totalAmount: 0,
        sessions: 0,
        avgRate: 0,
      };
    }
    acc[earning.clientName].totalAmount += earning.amount;
    acc[earning.clientName].sessions += 1;
    acc[earning.clientName].avgRate = acc[earning.clientName].totalAmount / acc[earning.clientName].sessions;
    return acc;
  }, {} as any);

  const topClients = Object.values(clientRevenue)
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Earnings & Revenue
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={filterPeriod}
              label="Period"
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <MenuItem value="1month">This Month</MenuItem>
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
              <MenuItem value="1year">This Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Earnings Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${earningsStats.totalEarned.toLocaleString()}
              </Typography>
              <Typography color="text.secondary">
                Total Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${earningsStats.pendingAmount}
              </Typography>
              <Typography color="text.secondary">
                Pending Payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${earningsStats.thisMonth}
              </Typography>
              <Typography color="text.secondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {earningsStats.totalSessions}
              </Typography>
              <Typography color="text.secondary">
                Total Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${earningsStats.avgRate.toFixed(0)}
              </Typography>
              <Typography color="text.secondary">
                Avg Rate/Session
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Earnings Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Monthly Earnings Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value, name) => {
                  if (name === 'Earnings') return [`$${value}`, 'Earnings'];
                  if (name === 'Sessions') return [value, 'Sessions'];
                  return [value, name];
                }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#2196F3"
                  strokeWidth={3}
                  name="Earnings"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#4CAF50"
                  strokeWidth={3}
                  name="Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Session Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockSessionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockSessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Clients */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Top Revenue Clients
            </Typography>
            <Grid container spacing={2}>
              {topClients.map((client: any, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={client.name}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      #{index + 1}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {client.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', my: 1 }}>
                      ${client.totalAmount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {client.sessions} sessions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${client.avgRate.toFixed(0)}/session
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Earnings Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Earnings
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Session Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEarnings.map((earning) => (
                    <TableRow key={earning.id} hover>
                      <TableCell>{earning.date}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {earning.clientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Session #{earning.sessionNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={earning.sessionType}
                          color={getSessionTypeColor(earning.sessionType)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{earning.duration} min</TableCell>
                      <TableCell>${earning.rate}/hr</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${earning.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={earning.status}
                          color={getStatusColor(earning.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainerEarnings;