import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Schedule,
  Person,
  FitnessCenter,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock sessions data
const mockSessions = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Alex Johnson',
    clientAvatar: 'AJ',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: 60,
    type: 'Strength Training',
    status: 'Scheduled',
    location: 'Main Gym Floor',
    notes: 'Focus on deadlift technique',
    goals: 'Improve deadlift form and add 10 lbs',
    clientNotes: 'Feeling strong today!',
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Sarah Wilson',
    clientAvatar: 'SW',
    date: '2024-01-15',
    time: '2:00 PM',
    duration: 45,
    type: 'Flexibility & Recovery',
    status: 'Scheduled',
    location: 'Yoga Studio',
    notes: 'Focus on hip flexibility',
    goals: 'Improve hip mobility and reduce tension',
    clientNotes: 'Back has been tight lately',
  },
  {
    id: 3,
    clientId: 3,
    clientName: 'Mike Chen',
    clientAvatar: 'MC',
    date: '2024-01-16',
    time: '9:00 AM',
    duration: 90,
    type: 'Athletic Performance',
    status: 'Scheduled',
    location: 'Training Room',
    notes: 'Pre-competition preparation',
    goals: 'Peak performance training',
    clientNotes: 'Competition next week!',
  },
  {
    id: 4,
    clientId: 4,
    clientName: 'Emily Davis',
    clientAvatar: 'ED',
    date: '2024-01-17',
    time: '11:00 AM',
    duration: 60,
    type: 'Weight Loss Program',
    status: 'Scheduled',
    location: 'Cardio Zone',
    notes: 'Continue weight loss protocol',
    goals: 'Burn 400+ calories, focus on HIIT',
    clientNotes: 'Ready to push harder!',
  },
  {
    id: 5,
    clientId: 5,
    clientName: 'David Wilson',
    clientAvatar: 'DW',
    date: '2024-01-18',
    time: '4:00 PM',
    duration: 60,
    type: 'General Fitness',
    status: 'Scheduled',
    location: 'Main Gym Floor',
    notes: 'Full body workout',
    goals: 'Build endurance and strength',
    clientNotes: 'Looking forward to variety',
  },
  {
    id: 6,
    clientId: 1,
    clientName: 'Alex Johnson',
    clientAvatar: 'AJ',
    date: '2024-01-08',
    time: '10:00 AM',
    duration: 60,
    type: 'Strength Training',
    status: 'Completed',
    location: 'Main Gym Floor',
    notes: 'Deadlift technique improved significantly',
    goals: 'Add weight to deadlift',
    clientNotes: 'Great session, felt very strong',
    rating: 5,
  },
];

const SessionScheduler = () => {
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionData, setSessionData] = useState({
    clientId: '',
    date: null as Date | null,
    time: '',
    duration: 60,
    type: 'General Fitness',
    location: 'Main Gym Floor',
    notes: '',
    goals: '',
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: sessions = mockSessions, isLoading } = useQuery({
    queryKey: ['trainer-sessions'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockSessions;
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (session: any) => {
      console.log('Creating session:', session);
      return session;
    },
    onSuccess: () => {
      setSnackbarMessage('Session scheduled successfully!');
      setSnackbarOpen(true);
      setSessionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['trainer-sessions'] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (session: any) => {
      console.log('Updating session:', session);
      return session;
    },
    onSuccess: () => {
      setSnackbarMessage('Session updated successfully!');
      setSnackbarOpen(true);
      setSessionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['trainer-sessions'] });
    },
  });

  const cancelSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      console.log('Cancelling session:', sessionId);
      return sessionId;
    },
    onSuccess: () => {
      setSnackbarMessage('Session cancelled successfully!');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['trainer-sessions'] });
    },
  });

  const handleScheduleSession = () => {
    if (!sessionData.clientId || !sessionData.date || !sessionData.time) return;
    
    const clientName = sessions.find(s => s.clientId === parseInt(sessionData.clientId))?.clientName || 'Client';
    
    createSessionMutation.mutate({
      ...sessionData,
      clientName,
      status: 'Scheduled',
      clientAvatar: clientName.split(' ').map(n => n[0]).join(''),
    });
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setSessionData({
      clientId: session.clientId.toString(),
      date: new Date(session.date),
      time: session.time,
      duration: session.duration,
      type: session.type,
      location: session.location,
      notes: session.notes,
      goals: session.goals,
    });
    setSessionDialogOpen(true);
  };

  const handleUpdateSession = () => {
    if (selectedSession) {
      updateSessionMutation.mutate({
        ...selectedSession,
        ...sessionData,
      });
    }
  };

  const handleCancelSession = (sessionId: number) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      cancelSessionMutation.mutate(sessionId);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const statusMatch = filterStatus === 'All' || session.status === filterStatus;
    let dateMatch = true;
    
    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      dateMatch = session.date === today;
    } else if (filterDate === 'week') {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      dateMatch = new Date(session.date) >= today && new Date(session.date) <= weekFromNow;
    }
    
    return statusMatch && dateMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'No-show':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
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

  // Calculate session statistics
  const sessionStats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'Scheduled').length,
    completed: sessions.filter(s => s.status === 'Completed').length,
    today: sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    thisWeek: sessions.filter(s => {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return new Date(s.date) >= today && new Date(s.date) <= weekFromNow;
    }).length,
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const sessionTypes = [
    'General Fitness',
    'Strength Training',
    'Weight Loss Program',
    'Flexibility & Recovery',
    'Athletic Performance',
    'Rehabilitation',
    'Cardio Training',
  ];

  const uniqueClients = Array.from(new Set(sessions.map(s => s.clientName))).map((name, index) => ({
    id: sessions.find(s => s.clientName === name)?.clientId || index + 1,
    name,
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Session Scheduler
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedSession(null);
              setSessionData({
                clientId: '',
                date: null,
                time: '',
                duration: 60,
                type: 'General Fitness',
                location: 'Main Gym Floor',
                notes: '',
                goals: '',
              });
              setSessionDialogOpen(true);
            }}
          >
            Schedule Session
          </Button>
        </Box>

        {/* Session Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessionStats.total}
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
                <CheckCircle color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessionStats.scheduled}
                </Typography>
                <Typography color="text.secondary">
                  Scheduled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessionStats.completed}
                </Typography>
                <Typography color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessionStats.today}
                </Typography>
                <Typography color="text.secondary">
                  Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessionStats.thisWeek}
                </Typography>
                <Typography color="text.secondary">
                  This Week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={filterDate}
                label="Date Range"
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Sessions Table */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {session.clientAvatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {session.clientName}
                            </Typography>
                            {session.goals && (
                              <Typography variant="caption" color="text.secondary">
                                Goals: {session.goals}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {session.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {session.time}
                        </Typography>
                      </TableCell>
                      <TableCell>{session.duration} min</TableCell>
                      <TableCell>
                        <Chip
                          label={session.type}
                          color={getTypeColor(session.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={session.status}
                          color={getStatusColor(session.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => handleEditSession(session)}
                            disabled={session.status === 'Completed'}
                          >
                            Edit
                          </Button>
                          {session.status === 'Scheduled' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelSession(session.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Session Dialog */}
        <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedSession ? 'Edit Session' : 'Schedule New Session'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={sessionData.clientId}
                    label="Client"
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    disabled={!!selectedSession}
                  >
                    {uniqueClients.map((client) => (
                      <MenuItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Session Date"
                  value={sessionData.date}
                  onChange={(date) => handleInputChange('date', date)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Time"
                  value={sessionData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Duration"
                  value={sessionData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Session Type"
                  value={sessionData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {sessionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={sessionData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goals"
                  value={sessionData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="Session goals and objectives..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={sessionData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Special instructions or notes..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSessionDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={selectedSession ? handleUpdateSession : handleScheduleSession}
              disabled={!sessionData.clientId || !sessionData.date || !sessionData.time}
            >
              {selectedSession ? 'Update Session' : 'Schedule Session'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default SessionScheduler;