import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  ShowChart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Mock client progress data
const mockClientProgress = [
  {
    clientId: 1,
    clientName: 'Alex Johnson',
    avatar: 'AJ',
    goals: [
      { name: 'Weight Loss', current: 75, target: 100, unit: 'lbs lost' },
      { name: 'Strength', current: 80, target: 100, unit: '% improvement' },
      { name: 'Endurance', current: 65, target: 100, unit: '% improvement' },
      { name: 'Flexibility', current: 70, target: 100, unit: '% improvement' },
    ],
    overallProgress: 73,
    trend: 'up',
    sessionsCompleted: 24,
    lastSession: '2024-01-10',
    notes: 'Excellent progress on strength goals. Weight loss target nearly achieved.',
  },
  {
    clientId: 2,
    clientName: 'Sarah Wilson',
    avatar: 'SW',
    goals: [
      { name: 'Flexibility', current: 85, target: 100, unit: '% improvement' },
      { name: 'Stress Relief', current: 90, target: 100, unit: '% improvement' },
      { name: 'Balance', current: 75, target: 100, unit: '% improvement' },
      { name: 'Core Strength', current: 60, target: 100, unit: '% improvement' },
    ],
    overallProgress: 78,
    trend: 'up',
    sessionsCompleted: 18,
    lastSession: '2024-01-08',
    notes: 'Fantastic improvement in flexibility and stress management. Core work continues.',
  },
  {
    clientId: 3,
    clientName: 'Mike Chen',
    avatar: 'MC',
    goals: [
      { name: 'Athletic Performance', current: 95, target: 100, unit: '% peak' },
      { name: 'Speed', current: 88, target: 100, unit: '% improvement' },
      { name: 'Power', current: 92, target: 100, unit: '% improvement' },
      { name: 'Recovery', current: 85, target: 100, unit: '% improvement' },
    ],
    overallProgress: 90,
    trend: 'up',
    sessionsCompleted: 32,
    lastSession: '2023-12-15',
    notes: 'Near peak performance. Ready for competition season.',
  },
  {
    clientId: 4,
    clientName: 'Emily Davis',
    avatar: 'ED',
    goals: [
      { name: 'Weight Loss', current: 40, target: 100, unit: 'lbs lost' },
      { name: 'Cardio Fitness', current: 45, target: 100, unit: '% improvement' },
      { name: 'Muscle Tone', current: 50, target: 100, unit: '% improvement' },
      { name: 'Energy Levels', current: 35, target: 100, unit: '% improvement' },
    ],
    overallProgress: 43,
    trend: 'up',
    sessionsCompleted: 8,
    lastSession: '2024-01-09',
    notes: 'Good start. Building foundational fitness. Consistency is improving.',
  },
];

// Mock progress trends over time
const mockProgressTrends = [
  { month: 'Sep', avgProgress: 45, completedSessions: 18 },
  { month: 'Oct', avgProgress: 52, completedSessions: 24 },
  { month: 'Nov', avgProgress: 61, completedSessions: 28 },
  { month: 'Dec', avgProgress: 68, completedSessions: 32 },
  { month: 'Jan', avgProgress: 73, completedSessions: 20 },
];

const ClientProgress = () => {
  // Calculate overall trainer statistics
  const trainerStats = {
    totalClients: mockClientProgress.length,
    avgProgress: Math.round(mockClientProgress.reduce((sum, c) => sum + c.overallProgress, 0) / mockClientProgress.length),
    topPerformer: mockClientProgress.reduce((top, current) => 
      current.overallProgress > top.overallProgress ? current : top
    ),
    improvingClients: mockClientProgress.filter(c => c.trend === 'up').length,
    totalSessions: mockClientProgress.reduce((sum, c) => sum + c.sessionsCompleted, 0),
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    if (progress >= 40) return 'info';
    return 'error';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Client Progress Tracking
        </Typography>
      </Box>

      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BarChart color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.totalClients}
              </Typography>
              <Typography color="text.secondary">
                Total Clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShowChart color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.avgProgress}%
              </Typography>
              <Typography color="text.secondary">
                Avg Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.improvingClients}
              </Typography>
              <Typography color="text.secondary">
                Improving
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {trainerStats.topPerformer.overallProgress}%
              </Typography>
              <Typography color="text.secondary">
                Top Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.totalSessions}
              </Typography>
              <Typography color="text.secondary">
                Total Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Trends Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Overall Progress Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProgressTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgProgress"
                    stroke="#2196F3"
                    strokeWidth={3}
                    name="Average Progress (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="completedSessions"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    name="Completed Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Top Performer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                  {trainerStats.topPerformer.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trainerStats.topPerformer.clientName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(trainerStats.topPerformer.trend)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {trainerStats.topPerformer.overallProgress}% overall progress
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {trainerStats.topPerformer.notes}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Sessions Completed: {trainerStats.topPerformer.sessionsCompleted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Session: {trainerStats.topPerformer.lastSession}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Individual Client Progress */}
      <Grid container spacing={3}>
        {mockClientProgress.map((client) => (
          <Grid item xs={12} md={6} lg={4} key={client.clientId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {client.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {client.clientName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTrendIcon(client.trend)}
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {client.sessionsCompleted} sessions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    label={`${client.overallProgress}%`}
                    color={getProgressColor(client.overallProgress)}
                    size="small"
                  />
                </Box>

                {/* Progress Radar Chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={client.goals}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 8 }}
                      tickCount={5}
                    />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#2196F3"
                      fill="#2196F3"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#4CAF50"
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Goal Progress */}
                <Box sx={{ mt: 2 }}>
                  {client.goals.slice(0, 3).map((goal, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">
                          {goal.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {goal.current}{goal.unit}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(goal.current / goal.target) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                  Last session: {client.lastSession}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  "{client.notes}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClientProgress;