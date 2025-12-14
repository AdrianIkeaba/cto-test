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
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FitnessCenter,
  TrendingUp,
  CalendarToday,
  Speed,
  LocalFireDepartment,
  AutoGraph,
  Download,
  Visibility,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

// Mock workout data
const mockWorkoutHistory = [
  {
    id: 1,
    date: '2024-01-10',
    type: 'Strength Training',
    duration: 60,
    calories: 320,
    exercises: 8,
    maxWeight: '225 lbs',
    notes: 'Great session, felt strong today!',
    rating: 5,
    avatar: '🏋️‍♂️',
  },
  {
    id: 2,
    date: '2024-01-08',
    type: 'Yoga Flow',
    duration: 45,
    calories: 180,
    exercises: 12,
    maxWeight: 'Body Weight',
    notes: 'Flexible and balanced session',
    rating: 4,
    avatar: '🧘‍♀️',
  },
  {
    id: 3,
    date: '2024-01-06',
    type: 'HIIT',
    duration: 30,
    calories: 280,
    exercises: 15,
    maxWeight: 'Weighted',
    notes: 'High intensity, burned lots of calories',
    rating: 5,
    avatar: '⚡',
  },
  {
    id: 4,
    date: '2024-01-04',
    type: 'Cardio',
    duration: 40,
    calories: 250,
    exercises: 5,
    maxWeight: 'Body Weight',
    notes: 'Steady pace, good endurance',
    rating: 4,
    avatar: '🏃‍♂️',
  },
  {
    id: 5,
    date: '2024-01-02',
    type: 'Pilates',
    duration: 50,
    calories: 200,
    exercises: 10,
    maxWeight: 'Light Weights',
    notes: 'Core strengthening focused',
    rating: 4,
    avatar: '🤸‍♀️',
  },
];

const mockWeeklyProgress = [
  { week: 'Week 1', workouts: 3, calories: 850, duration: 165 },
  { week: 'Week 2', workouts: 4, calories: 1020, duration: 210 },
  { week: 'Week 3', workouts: 5, calories: 1280, duration: 245 },
  { week: 'Week 4', workouts: 4, calories: 980, duration: 200 },
];

const mockExerciseProgress = [
  { exercise: 'Bench Press', current: 185, previous: 175, improvement: 10 },
  { exercise: 'Squat', current: 225, previous: 215, improvement: 10 },
  { exercise: 'Deadlift', current: 275, previous: 265, improvement: 10 },
  { exercise: 'Pull-ups', current: 12, previous: 8, improvement: 4 },
];

const mockWorkoutTypeData = [
  { name: 'Strength', value: 40, color: '#2196F3' },
  { name: 'Cardio', value: 25, color: '#4CAF50' },
  { name: 'Yoga', value: 20, color: '#9C27B0' },
  { name: 'HIIT', value: 15, color: '#FF5722' },
];

const WorkoutHistory = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1month');

  const workoutStats = {
    totalWorkouts: mockWorkoutHistory.length,
    totalCalories: mockWorkoutHistory.reduce((sum, w) => sum + w.calories, 0),
    avgDuration: Math.round(mockWorkoutHistory.reduce((sum, w) => sum + w.duration, 0) / mockWorkoutHistory.length),
    avgRating: (mockWorkoutHistory.reduce((sum, w) => sum + w.rating, 0) / mockWorkoutHistory.length).toFixed(1),
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Strength Training': '#2196F3',
      'Yoga Flow': '#9C27B0',
      'HIIT': '#FF5722',
      'Cardio': '#4CAF50',
      'Pilates': '#E91E63',
    };
    return colors[type] || '#757575';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'success';
    if (rating >= 4) return 'warning';
    if (rating >= 3) return 'info';
    return 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Workout History & Progress
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" title="Export Data">
            <Download />
          </IconButton>
        </Box>
      </Box>

      {/* Workout Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {workoutStats.totalWorkouts}
              </Typography>
              <Typography color="text.secondary">
                Total Workouts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalFireDepartment color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {workoutStats.totalCalories}
              </Typography>
              <Typography color="text.secondary">
                Calories Burned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Speed color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {workoutStats.avgDuration}
              </Typography>
              <Typography color="text.secondary">
                Avg Duration (min)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {workoutStats.avgRating}
              </Typography>
              <Typography color="text.secondary">
                Avg Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Weekly Progress
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockWeeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#2196F3"
                  strokeWidth={3}
                  name="Workouts"
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#FF5722"
                  strokeWidth={3}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Workout Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockWorkoutTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockWorkoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Exercise Progress */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Exercise Progress
            </Typography>
            <Grid container spacing={3}>
              {mockExerciseProgress.map((exercise, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {exercise.exercise}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Current: {exercise.current}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        +{exercise.improvement}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(exercise.current / (exercise.current + 50)) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Previous: {exercise.previous}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Workout History Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Workouts
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workout</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Exercises</TableCell>
                    <TableCell>Max Weight</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockWorkoutHistory.map((workout) => (
                    <TableRow key={workout.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: getWorkoutTypeColor(workout.type) }}>
                            {workout.avatar}
                          </Avatar>
                          {workout.type}
                        </Box>
                      </TableCell>
                      <TableCell>{workout.date}</TableCell>
                      <TableCell>{workout.duration} min</TableCell>
                      <TableCell>{workout.calories}</TableCell>
                      <TableCell>{workout.exercises}</TableCell>
                      <TableCell>{workout.maxWeight}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${workout.rating}/5`}
                          color={getRatingColor(workout.rating)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                          {workout.notes}
                        </Typography>
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

export default WorkoutHistory;