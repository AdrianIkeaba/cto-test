import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Rating,
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
  Star,
  BookOnline,
  Cancel,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock classes data
const mockClasses = [
  {
    id: 1,
    name: 'Yoga Flow',
    instructor: 'Sarah Johnson',
    category: 'Yoga',
    duration: 60,
    capacity: 20,
    enrolled: 16,
    schedule: ['Monday', 'Wednesday', 'Friday'],
    time: '8:00 AM',
    difficulty: 'Beginner',
    description: 'A gentle flow practice focusing on breath and movement coordination.',
    rating: 4.8,
    reviews: 24,
    image: '🧘‍♀️',
    equipment: ['Yoga Mat', 'Blocks'],
    benefits: ['Flexibility', 'Balance', 'Stress Relief'],
  },
  {
    id: 2,
    name: 'HIIT Training',
    instructor: 'Mike Chen',
    category: 'HIIT',
    duration: 45,
    capacity: 15,
    enrolled: 15,
    schedule: ['Tuesday', 'Thursday'],
    time: '6:30 AM',
    difficulty: 'Advanced',
    description: 'High-intensity interval training for maximum calorie burn and endurance.',
    rating: 4.9,
    reviews: 18,
    image: '💪',
    equipment: ['Kettlebells', 'Battle Ropes', 'Medicine Balls'],
    benefits: ['Weight Loss', 'Cardio', 'Strength'],
  },
  {
    id: 3,
    name: 'Pilates Core',
    instructor: 'Emily Davis',
    category: 'Pilates',
    duration: 50,
    capacity: 12,
    enrolled: 10,
    schedule: ['Monday', 'Wednesday', 'Friday'],
    time: '10:00 AM',
    difficulty: 'Intermediate',
    description: 'Core-focused Pilates class to strengthen your center and improve posture.',
    rating: 4.7,
    reviews: 31,
    image: '🤸‍♀️',
    equipment: ['Reformer', 'Pilates Ball', 'Resistance Bands'],
    benefits: ['Core Strength', 'Posture', 'Flexibility'],
  },
  {
    id: 4,
    name: 'Strength Training',
    instructor: 'David Wilson',
    category: 'Strength',
    duration: 60,
    capacity: 25,
    enrolled: 8,
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    time: '5:00 PM',
    difficulty: 'All Levels',
    description: 'Progressive strength training program focusing on compound movements.',
    rating: 4.6,
    reviews: 42,
    image: '🏋️‍♂️',
    equipment: ['Barbells', 'Dumbbells', 'Bench'],
    benefits: ['Muscle Building', 'Bone Density', 'Metabolism'],
  },
  {
    id: 5,
    name: 'Spin Class',
    instructor: 'Lisa Rodriguez',
    category: 'Cardio',
    duration: 45,
    capacity: 20,
    enrolled: 18,
    schedule: ['Monday', 'Wednesday', 'Friday'],
    time: '6:00 PM',
    difficulty: 'Intermediate',
    description: 'High-energy indoor cycling class with motivating music and varying terrain.',
    rating: 4.8,
    reviews: 67,
    image: '🚴‍♀️',
    equipment: ['Stationary Bike', 'Towel', 'Water Bottle'],
    benefits: ['Cardiovascular Health', 'Leg Strength', 'Endurance'],
  },
  {
    id: 6,
    name: 'Zumba Dance',
    instructor: 'Carlos Martinez',
    category: 'Dance',
    duration: 55,
    capacity: 30,
    enrolled: 22,
    schedule: ['Tuesday', 'Thursday', 'Saturday'],
    time: '7:00 PM',
    difficulty: 'All Levels',
    description: 'Fun dance fitness class combining Latin and international music.',
    rating: 4.9,
    reviews: 53,
    image: '💃',
    equipment: ['Comfortable Shoes'],
    benefits: ['Cardio', 'Coordination', 'Fun'],
  },
];

const ClassCatalog = () => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: classes = mockClasses, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockClasses;
    },
  });

  const bookClassMutation = useMutation({
    mutationFn: async (booking: any) => {
      // Mock API call
      console.log('Booking class:', booking);
      return booking;
    },
    onSuccess: () => {
      setSnackbarMessage('Class booked successfully!');
      setSnackbarOpen(true);
      setBookingDialogOpen(false);
      setSelectedClass(null);
    },
    onError: () => {
      setSnackbarMessage('Failed to book class. Please try again.');
      setSnackbarOpen(true);
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      console.log('Cancelling booking:', bookingId);
      return bookingId;
    },
    onSuccess: () => {
      setSnackbarMessage('Booking cancelled successfully!');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleBookClass = (classItem: any) => {
    setSelectedClass(classItem);
    setBookingData({
      date: '',
      time: '',
    });
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingData.date || !bookingData.time) return;
    
    bookClassMutation.mutate({
      classId: selectedClass.id,
      className: selectedClass.name,
      ...bookingData,
    });
  };

  const handleCancelBooking = (classId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(classId);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  // Filter classes
  const filteredClasses = classes.filter(classItem => {
    const categoryMatch = filterCategory === 'All' || classItem.category === filterCategory;
    const difficultyMatch = filterDifficulty === 'All' || classItem.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      case 'all levels':
        return 'info';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Yoga': '#4CAF50',
      'HIIT': '#FF5722',
      'Pilates': '#9C27B0',
      'Strength': '#2196F3',
      'Cardio': '#FF9800',
      'Dance': '#E91E63',
    };
    return colors[category] || '#757575';
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Class Catalog
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="All">All Categories</MenuItem>
            <MenuItem value="Yoga">Yoga</MenuItem>
            <MenuItem value="HIIT">HIIT</MenuItem>
            <MenuItem value="Pilates">Pilates</MenuItem>
            <MenuItem value="Strength">Strength</MenuItem>
            <MenuItem value="Cardio">Cardio</MenuItem>
            <MenuItem value="Dance">Dance</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={filterDifficulty}
            label="Difficulty"
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <MenuItem value="All">All Levels</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
            <MenuItem value="All Levels">All Levels</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Classes Grid */}
      <Grid container spacing={3}>
        {filteredClasses.map((classItem) => {
          const isFullyBooked = classItem.enrolled >= classItem.capacity;
          
          return (
            <Grid item xs={12} sm={6} lg={4} key={classItem.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <Box
                  sx={{
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    bgcolor: getCategoryColor(classItem.category),
                    color: 'white',
                  }}
                >
                  {classItem.image}
                </Box>

                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {classItem.name}
                    </Typography>
                    <Chip
                      label={classItem.difficulty}
                      color={getDifficultyColor(classItem.difficulty)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.instructor}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.schedule.join(', ')} at {classItem.time}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={classItem.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({classItem.reviews})
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {classItem.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {classItem.benefits.slice(0, 2).map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {classItem.benefits.length > 2 && (
                      <Chip
                        label={`+${classItem.benefits.length - 2}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {classItem.enrolled}/{classItem.capacity} spots
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {classItem.duration} min
                    </Typography>
                  </Box>

                  {isFullyBooked && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Class is fully booked
                    </Alert>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  {!isFullyBooked ? (
                    <Button
                      variant="contained"
                      startIcon={<BookOnline />}
                      onClick={() => handleBookClass(classItem)}
                      fullWidth
                    >
                      Book Class
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<Schedule />}
                      disabled
                      fullWidth
                    >
                      Full
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Book {selectedClass?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Instructor: {selectedClass?.instructor}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Duration: {selectedClass?.duration} minutes
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available spots: {selectedClass?.capacity - selectedClass?.enrolled}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Select Date"
            type="date"
            value={bookingData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Select Time"
            value={bookingData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            sx={{ mb: 2 }}
          >
            {selectedClass?.schedule.map((day: string, index: number) => (
              <MenuItem key={index} value={selectedClass.time}>
                {day} at {selectedClass.time}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Special Requests (Optional)"
            multiline
            rows={2}
            placeholder="Any specific requirements or preferences?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBookingSubmit}
            variant="contained"
            disabled={!bookingData.date || !bookingData.time}
          >
            Confirm Booking
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
  );
};

export default ClassCatalog;