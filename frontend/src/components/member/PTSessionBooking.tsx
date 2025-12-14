import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  LocalHospital,
  Person,
  Schedule,
  CheckCircle,
  Cancel,
  Star,
  Message,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock trainers data
const mockTrainers = [
  {
    id: 1,
    name: 'Sarah Williams',
    specialization: 'Strength & Conditioning',
    experience: '5 years',
    rating: 4.9,
    price: 75,
    avatar: 'SW',
    certifications: ['NASM-CPT', 'CSCS', 'Precision Nutrition'],
    bio: 'Expert in strength training and athletic performance optimization.',
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    specialization: 'Weight Loss & Nutrition',
    experience: '7 years',
    rating: 4.8,
    price: 65,
    avatar: 'MR',
    certifications: ['ACE-CPT', 'Precision Nutrition Level 2', 'TRX'],
    bio: 'Specialized in helping clients achieve sustainable weight loss through training and nutrition.',
  },
  {
    id: 3,
    name: 'Emily Chen',
    specialization: 'Yoga & Mindfulness',
    experience: '8 years',
    rating: 4.9,
    price: 55,
    avatar: 'EC',
    certifications: ['RYT-500', 'Meditation Teacher', 'Bali Yoga'],
    bio: 'Combines traditional yoga practices with modern mindfulness techniques.',
  },
];

const mockSessions = [
  {
    id: 1,
    trainerId: 1,
    trainerName: 'Sarah Williams',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: 60,
    status: 'Completed',
    type: 'Strength Training',
    notes: 'Great progress on deadlift form!',
    rating: 5,
    price: 75,
    avatar: 'SW',
  },
  {
    id: 2,
    trainerId: 2,
    trainerName: 'Mike Rodriguez',
    date: '2024-01-12',
    time: '2:00 PM',
    duration: 45,
    status: 'Completed',
    type: 'Weight Loss Program',
    notes: 'Focused on cardio and nutrition planning',
    rating: 4,
    price: 65,
    avatar: 'MR',
  },
  {
    id: 3,
    trainerId: 1,
    trainerName: 'Sarah Williams',
    date: '2024-01-18',
    time: '10:00 AM',
    duration: 60,
    status: 'Scheduled',
    type: 'Strength Training',
    notes: 'Next session will focus on squats',
    rating: null,
    price: 75,
    avatar: 'SW',
  },
];

const PTSessionBooking = () => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [sessionData, setSessionData] = useState({
    trainerId: '',
    date: null as Date | null,
    time: '',
    duration: 60,
    type: 'Strength Training',
    goals: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: trainers = mockTrainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTrainers;
    },
  });

  const { data: sessions = mockSessions, isLoading: sessionsLoading } = useMutation({
    queryKey: ['pt-sessions'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSessions;
    },
  });

  const bookSessionMutation = useMutation({
    mutationFn: async (session: any) => {
      console.log('Booking PT session:', session);
      return session;
    },
    onSuccess: () => {
      setSnackbarMessage('PT session booked successfully!');
      setSnackbarOpen(true);
      setBookingDialogOpen(false);
      setSelectedTrainer(null);
      queryClient.invalidateQueries({ queryKey: ['pt-sessions'] });
    },
    onError: () => {
      setSnackbarMessage('Failed to book session. Please try again.');
      setSnackbarOpen(true);
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
      queryClient.invalidateQueries({ queryKey: ['pt-sessions'] });
    },
  });

  const handleBookSession = () => {
    if (!sessionData.trainerId || !sessionData.date || !sessionData.time) return;
    
    const trainer = trainers.find(t => t.id === parseInt(sessionData.trainerId));
    bookSessionMutation.mutate({
      ...sessionData,
      trainerName: trainer?.name,
      price: trainer?.price,
    });
  };

  const handleCancelSession = (sessionId: number) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      cancelSessionMutation.mutate(sessionId);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Personal Training Sessions
          </Typography>
          <Button
            variant="contained"
            startIcon={<LocalHospital />}
            onClick={() => setBookingDialogOpen(true)}
          >
            Book Session
          </Button>
        </Box>

        {/* Session Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LocalHospital color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessions.filter(s => s.status === 'Completed').length}
                </Typography>
                <Typography color="text.secondary">
                  Completed Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessions.filter(s => s.status === 'Scheduled').length}
                </Typography>
                <Typography color="text.secondary">
                  Upcoming Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {sessions.length > 0 ? (sessions.filter(s => s.rating).reduce((sum, s) => sum + s.rating, 0) / sessions.filter(s => s.rating).length).toFixed(1) : '0'}
                </Typography>
                <Typography color="text.secondary">
                  Avg Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${sessions.reduce((sum, s) => sum + s.price, 0)}
                </Typography>
                <Typography color="text.secondary">
                  Total Invested
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Available Trainers */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Available Trainers
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {trainers.map((trainer) => (
            <Grid item xs={12} sm={6} lg={4} key={trainer.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                      }}
                    >
                      {trainer.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {trainer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trainer.specialization}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {trainer.rating} ({trainer.experience})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {trainer.bio}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Certifications:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {trainer.certifications.map((cert, index) => (
                        <Chip
                          key={index}
                          label={cert}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${trainer.price}/session
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSessionData({
                          trainerId: trainer.id.toString(),
                          date: null,
                          time: '',
                          duration: 60,
                          type: 'General Training',
                          goals: '',
                        });
                        setSelectedTrainer(trainer);
                        setBookingDialogOpen(true);
                      }}
                    >
                      Book Session
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Session History */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Session History
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <List>
                {sessions.map((session) => (
                  <ListItem key={session.id}>
                    <ListItemAvatar>
                      <Avatar>{session.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {session.trainerName}
                          </Typography>
                          <Chip
                            label={session.status}
                            color={getStatusColor(session.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {session.date} at {session.time} • {session.duration} min • {session.type}
                          </Typography>
                          {session.notes && (
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              "{session.notes}"
                            </Typography>
                          )}
                          {session.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Star color="warning" fontSize="small" />
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {session.rating}/5
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ${session.price}
                      </Typography>
                      {session.status === 'Scheduled' && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleCancelSession(session.id)}
                          sx={{ mt: 1 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Book PT Session with {selectedTrainer?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Specialization: {selectedTrainer?.specialization}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rate: ${selectedTrainer?.price}/session
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Session Type"
                  value={sessionData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="Strength Training">Strength Training</MenuItem>
                  <MenuItem value="Weight Loss Program">Weight Loss Program</MenuItem>
                  <MenuItem value="Cardio Training">Cardio Training</MenuItem>
                  <MenuItem value="Rehabilitation">Rehabilitation</MenuItem>
                  <MenuItem value="General Training">General Training</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Session Date"
                  value={sessionData.date}
                  onChange={(date) => handleInputChange('date', date)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Time Slot"
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
              
              <Grid item xs={12}>
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
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Training Goals (Optional)"
                  multiline
                  rows={3}
                  value={sessionData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="Describe your fitness goals and what you want to focus on..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleBookSession}
              variant="contained"
              disabled={!sessionData.trainerId || !sessionData.date || !sessionData.time}
            >
              Book Session
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
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

export default PTSessionBooking;