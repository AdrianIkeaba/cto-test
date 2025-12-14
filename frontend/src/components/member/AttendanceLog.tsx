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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  FitnessCenter,
  TrendingUp,
  CalendarToday,
  FilterList,
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
} from 'recharts';

// Mock attendance data
const mockAttendanceData = [
  {
    id: 1,
    date: '2024-01-10',
    type: 'Class',
    className: 'Yoga Flow',
    instructor: 'Sarah Johnson',
    checkIn: '8:00 AM',
    checkOut: '9:00 AM',
    duration: 60,
    calories: 180,
    status: 'Completed',
    avatar: '🧘‍♀️',
  },
  {
    id: 2,
    date: '2024-01-08',
    type: 'Gym Session',
    className: 'Free Weights',
    instructor: null,
    checkIn: '6:30 AM',
    checkOut: '8:00 AM',
    duration: 90,
    calories: 320,
    status: 'Completed',
    avatar: '🏋️‍♂️',
  },
  {
    id: 3,
    date: '2024-01-06',
    type: 'Class',
    className: 'HIIT Training',
    instructor: 'Mike Chen',
    checkIn: '6:30 AM',
    checkOut: '7:15 AM',
    duration: 45,
    calories: 280,
    status: 'Completed',
    avatar: '⚡',
  },
  {
    id: 4,
    date: '2024-01-04',
    type: 'Cardio',
    className: 'Spin Class',
    instructor: 'Lisa Rodriguez',
    checkIn: '6:00 PM',
    checkOut: '6:45 PM',
    duration: 45,
    calories: 350,
    status: 'Completed',
    avatar: '🚴‍♀️',
  },
  {
    id: 5,
    date: '2024-01-02',
    type: 'Gym Session',
    className: 'Strength Training',
    instructor: null,
    checkIn: '5:00 PM',
    checkOut: '6:00 PM',
    duration: 60,
    calories: 280,
    status: 'Completed',
    avatar: '🏋️‍♀️',
  },
  {
    id: 6,
    date: '2024-01-11',
    type: 'Class',
    className: 'Pilates Core',
    instructor: 'Emily Davis',
    checkIn: '10:00 AM',
    checkOut: '10:50 AM',
    duration: 50,
    calories: 200,
    status: 'Cancelled',
    avatar: '🤸‍♀️',
  },
];

const mockWeeklyAttendance = [
  { week: 'Mon', attendance: 1, goal: 3 },
  { week: 'Tue', attendance: 0, goal: 3 },
  { week: 'Wed', attendance: 1, goal: 3 },
  { week: 'Thu', attendance: 0, goal: 3 },
  { week: 'Fri', attendance: 1, goal: 3 },
  { week: 'Sat', attendance: 1, goal: 2 },
  { week: 'Sun', attendance: 0, goal: 2 },
];

const AttendanceLog = () => {
  const [filterType, setFilterType] = useState('All');
  const [filterPeriod, setFilterPeriod] = useState('1month');

  // Filter attendance data
  const filteredAttendance = mockAttendanceData.filter(record => {
    if (filterType === 'All') return true;
    return record.type === filterType;
  });

  const attendanceStats = {
    totalSessions: mockAttendanceData.filter(a => a.status === 'Completed').length,
    totalHours: mockAttendanceData
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + a.duration, 0),
    totalCalories: mockAttendanceData
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + a.calories, 0),
    avgPerWeek: (mockAttendanceData.filter(a => a.status === 'Completed').length / 4).toFixed(1),
    streak: 3,
    goal: 15,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Class':
        return 'primary';
      case 'Gym Session':
        return 'secondary';
      case 'Cardio':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'No-show':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Attendance Log
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Class">Classes</MenuItem>
              <MenuItem value="Gym Session">Gym Sessions</MenuItem>
              <MenuItem value="Cardio">Cardio</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={filterPeriod}
              label="Period"
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <MenuItem value="1week">This Week</MenuItem>
              <MenuItem value="1month">This Month</MenuItem>
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Attendance Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.totalSessions}
              </Typography>
              <Typography color="text.secondary">
                Completed Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.totalHours}
              </Typography>
              <Typography color="text.secondary">
                Total Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.totalCalories}
              </Typography>
              <Typography color="text.secondary">
                Calories Burned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.avgPerWeek}
              </Typography>
              <Typography color="text.secondary">
                Avg per Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.streak}
              </Typography>
              <Typography color="text.secondary">
                Day Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weekly Attendance Goal */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Weekly Attendance vs Goal
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockWeeklyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="goal" fill="#E0E0E0" name="Goal" />
                <Bar dataKey="attendance" fill="#2196F3" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Monthly Progress
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {attendanceStats.totalSessions}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                of {attendanceStats.goal} goal sessions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 20,
                    bgcolor: 'grey.200',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(attendanceStats.totalSessions / attendanceStats.goal) * 100}%`,
                      height: '100%',
                      bgcolor: 'primary.main',
                      borderRadius: 10,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round((attendanceStats.totalSessions / attendanceStats.goal) * 100)}% of monthly goal
                </Typography>
              </Box>
            </Box>
            
            {attendanceStats.totalSessions >= attendanceStats.goal && (
              <Alert severity="success" sx={{ mt: 2 }}>
                🎉 Congratulations! You've reached your monthly attendance goal!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Attendance History Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Sessions
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAttendance.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                            {record.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {record.className}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {record.type}
                            </Typography>
                            {record.instructor && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                with {record.instructor}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${record.duration} min`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {record.calories}
                        </Typography>
                      </TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
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

export default AttendanceLog;