import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  AccessTime,
  Today,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const mockAvailability = [
  {
    id: 1,
    dayOfWeek: 'Monday',
    startTime: '06:00',
    endTime: '22:00',
    isAvailable: true,
    notes: 'Available all day',
  },
  {
    id: 2,
    dayOfWeek: 'Tuesday',
    startTime: '06:00',
    endTime: '18:00',
    isAvailable: true,
    notes: 'Available until 6 PM',
  },
  {
    id: 3,
    dayOfWeek: 'Wednesday',
    startTime: '08:00',
    endTime: '20:00',
    isAvailable: true,
    notes: 'Later start time',
  },
  {
    id: 4,
    dayOfWeek: 'Thursday',
    startTime: '06:00',
    endTime: '22:00',
    isAvailable: true,
    notes: 'Available all day',
  },
  {
    id: 5,
    dayOfWeek: 'Friday',
    startTime: '06:00',
    endTime: '16:00',
    isAvailable: true,
    notes: 'Early finish',
  },
  {
    id: 6,
    dayOfWeek: 'Saturday',
    startTime: null,
    endTime: null,
    isAvailable: false,
    notes: 'Not available',
  },
  {
    id: 7,
    dayOfWeek: 'Sunday',
    startTime: null,
    endTime: null,
    isAvailable: false,
    notes: 'Not available',
  },
];

const mockBlockedTimes = [
  {
    id: 1,
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '12:00',
    reason: 'Personal appointment',
  },
  {
    id: 2,
    date: '2024-01-20',
    startTime: '14:00',
    endTime: '16:00',
    reason: 'Staff meeting',
  },
];

const TrainerAvailability = () => {
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [blockData, setBlockData] = useState({
    date: null as Date | null,
    startTime: '',
    endTime: '',
    reason: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: availability = mockAvailability, isLoading } = useQuery({
    queryKey: ['trainer-availability'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAvailability;
    },
  });

  const { data: blockedTimes = mockBlockedTimes, isLoading: blockedLoading } = useQuery({
    queryKey: ['blocked-times'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockBlockedTimes;
    },
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (availabilities: any[]) => {
      console.log('Updating availability:', availabilities);
      return availabilities;
    },
    onSuccess: () => {
      setSnackbarMessage('Availability updated successfully!');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['trainer-availability'] });
    },
  });

  const blockTimeMutation = useMutation({
    mutationFn: async (block: any) => {
      console.log('Blocking time:', block);
      return block;
    },
    onSuccess: () => {
      setSnackbarMessage('Time blocked successfully!');
      setSnackbarOpen(true);
      setBlockDialogOpen(false);
      setBlockData({
        date: null,
        startTime: '',
        endTime: '',
        reason: '',
      });
      queryClient.invalidateQueries({ queryKey: ['blocked-times'] });
    },
  });

  const handleSaveAvailability = () => {
    updateAvailabilityMutation.mutate(availability);
  };

  const handleBlockTime = () => {
    if (!blockData.date || !blockData.startTime || !blockData.endTime || !blockData.reason) return;
    blockTimeMutation.mutate(blockData);
  };

  const handleInputChange = (field: string, value: any) => {
    setBlockData(prev => ({ ...prev, [field]: value }));
  };

  const updateDayAvailability = (dayId: number, field: string, value: any) => {
    // In a real app, this would update the specific day's availability
    console.log('Updating day:', dayId, field, value);
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const getDayColor = (isAvailable: boolean) => {
    return isAvailable ? 'success' : 'default';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Availability Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              onClick={() => setAvailabilityDialogOpen(true)}
            >
              Set Weekly Schedule
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setBlockDialogOpen(true)}
            >
              Block Time
            </Button>
          </Box>
        </Box>

        {/* Current Availability Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Today color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {availability.filter(a => a.isAvailable).length}
                </Typography>
                <Typography color="text.secondary">
                  Days Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTime color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {availability
                    .filter(a => a.isAvailable)
                    .reduce((total, day) => {
                      if (day.startTime && day.endTime) {
                        const start = parseInt(day.startTime.split(':')[0]);
                        const end = parseInt(day.endTime.split(':')[0]);
                        return total + (end - start);
                      }
                      return total;
                    }, 0)}
                </Typography>
                <Typography color="text.secondary">
                  Weekly Hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  68%
                </Typography>
                <Typography color="text.secondary">
                  Utilization Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Cancel color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {blockedTimes.length}
                </Typography>
                <Typography color="text.secondary">
                  Blocked Periods
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Weekly Schedule */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Weekly Schedule
                </Typography>
                <Grid container spacing={2}>
                  {availability.map((day) => (
                    <Grid item xs={12} sm={6} key={day.id}>
                      <Box
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: day.isAvailable ? 'success.light' : 'grey.100',
                          opacity: day.isAvailable ? 1 : 0.7,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {day.dayOfWeek}
                          </Typography>
                          <Chip
                            label={day.isAvailable ? 'Available' : 'Unavailable'}
                            color={getDayColor(day.isAvailable)}
                            size="small"
                          />
                        </Box>
                        {day.isAvailable ? (
                          <Typography variant="body2" color="text.secondary">
                            {day.startTime} - {day.endTime}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not available
                          </Typography>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {day.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Blocked Times */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Blocked Times
                </Typography>
                <List dense>
                  {blockedTimes.map((block) => (
                    <ListItem key={block.id}>
                      <ListItemText
                        primary={`${block.date} ${block.startTime}-${block.endTime}`}
                        secondary={block.reason}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Remove this blocked time?')) {
                            console.log('Removing block:', block.id);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>
                {blockedTimes.length === 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No blocked times
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Availability Management Dialog */}
        <Dialog open={availabilityDialogOpen} onClose={() => setAvailabilityDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Set Weekly Availability
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure your available hours for each day of the week
            </Typography>
            <Grid container spacing={2}>
              {availability.map((day) => (
                <Grid item xs={12} key={day.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {day.dayOfWeek}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={day.isAvailable}
                            onChange={(e) => updateDayAvailability(day.id, 'isAvailable', e.target.checked)}
                          />
                        }
                        label={day.isAvailable ? 'Available' : 'Unavailable'}
                      />
                    </Box>
                    
                    {day.isAvailable && (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Start Time</InputLabel>
                            <Select
                              value={day.startTime || ''}
                              label="Start Time"
                              onChange={(e) => updateDayAvailability(day.id, 'startTime', e.target.value)}
                            >
                              {timeSlots.map((time) => (
                                <MenuItem key={time} value={time}>
                                  {time}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>End Time</InputLabel>
                            <Select
                              value={day.endTime || ''}
                              label="End Time"
                              onChange={(e) => updateDayAvailability(day.id, 'endTime', e.target.value)}
                            >
                              {timeSlots.map((time) => (
                                <MenuItem key={time} value={time}>
                                  {time}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAvailabilityDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveAvailability}>
              Save Availability
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Time Dialog */}
        <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Block Time
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <DatePicker
                  label="Date"
                  value={blockData.date}
                  onChange={(date) => handleInputChange('date', date)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Start Time"
                  value={blockData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="End Time"
                  value={blockData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
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
                  label="Reason"
                  value={blockData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Enter reason for blocking this time..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleBlockTime}
              disabled={!blockData.date || !blockData.startTime || !blockData.endTime || !blockData.reason}
            >
              Block Time
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

export default TrainerAvailability;