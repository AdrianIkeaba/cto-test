import { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  PlayArrow,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock workout plans data
const mockWorkoutPlans = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Alex Johnson',
    clientAvatar: 'AJ',
    name: 'Strength Building Program',
    description: 'Progressive strength training focused on compound movements',
    level: 'Intermediate',
    duration: '8 weeks',
    frequency: '3x per week',
    status: 'Active',
    createdDate: '2024-01-01',
    lastModified: '2024-01-10',
    exercises: [
      {
        day: 'Day 1 - Upper Body',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8-10', rest: '2-3 min', notes: 'Focus on form' },
          { name: 'Pull-ups', sets: 3, reps: '6-8', rest: '2 min', notes: 'Assisted if needed' },
          { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
          { name: 'Bent-over Rows', sets: 3, reps: '8-10', rest: '2 min', notes: '' },
          { name: 'Tricep Dips', sets: 3, reps: '12-15', rest: '90 sec', notes: '' },
        ],
      },
      {
        day: 'Day 2 - Lower Body',
        exercises: [
          { name: 'Squats', sets: 4, reps: '8-10', rest: '3 min', notes: 'Add weight progressively' },
          { name: 'Deadlifts', sets: 3, reps: '5-8', rest: '3-4 min', notes: 'Focus on technique' },
          { name: 'Lunges', sets: 3, reps: '10 per leg', rest: '90 sec', notes: 'Walking lunges' },
          { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '60 sec', notes: '' },
        ],
      },
      {
        day: 'Day 3 - Full Body',
        exercises: [
          { name: 'Burpees', sets: 3, reps: '10-12', rest: '2 min', notes: 'Modify as needed' },
          { name: 'Kettlebell Swings', sets: 4, reps: '15-20', rest: '90 sec', notes: '' },
          { name: 'Mountain Climbers', sets: 3, reps: '20 per leg', rest: '60 sec', notes: '' },
          { name: 'Plank', sets: 3, reps: '45-60 sec', rest: '60 sec', notes: '' },
        ],
      },
    ],
    goals: ['Build muscle mass', 'Improve strength', 'Enhance endurance'],
    equipment: ['Barbell', 'Dumbbells', 'Pull-up bar', 'Kettlebell'],
    progress: 75,
    completionRate: 85,
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Sarah Wilson',
    clientAvatar: 'SW',
    name: 'Flexibility & Recovery Program',
    description: 'Gentle yoga and stretching routine for flexibility and stress relief',
    level: 'Beginner',
    duration: '6 weeks',
    frequency: '2x per week',
    status: 'Active',
    createdDate: '2023-12-15',
    lastModified: '2024-01-08',
    exercises: [
      {
        day: 'Session 1 - Morning Flow',
        exercises: [
          { name: 'Sun Salutation A', sets: 3, reps: 'Flow', rest: 'Breath', notes: 'Slow and controlled' },
          { name: 'Cat-Cow Pose', sets: 2, reps: '10-12', rest: '30 sec', notes: '' },
          { name: 'Warrior II', sets: 2, reps: '30-45 sec each side', rest: '30 sec', notes: 'Hold gently' },
          { name: 'Child\'s Pose', sets: 2, reps: '60-90 sec', rest: '30 sec', notes: 'Relax and breathe' },
          { name: 'Seated Forward Fold', sets: 2, reps: '45-60 sec', rest: '30 sec', notes: 'Don\'t force' },
        ],
      },
      {
        day: 'Session 2 - Evening Stretch',
        exercises: [
          { name: 'Gentle Twists', sets: 2, reps: '30 sec each side', rest: '30 sec', notes: '' },
          { name: 'Hip Openers', sets: 2, reps: '45-60 sec each side', rest: '30 sec', notes: '' },
          { name: 'Neck and Shoulder Release', sets: 1, reps: '2-3 min', rest: 'None', notes: 'Very gentle' },
          { name: 'Legs Up the Wall', sets: 1, reps: '3-5 min', rest: 'None', notes: 'Final relaxation' },
        ],
      },
    ],
    goals: ['Improve flexibility', 'Reduce stress', 'Better sleep quality'],
    equipment: ['Yoga mat', 'Yoga blocks', 'Yoga strap'],
    progress: 60,
    completionRate: 90,
  },
  {
    id: 3,
    clientId: 3,
    clientName: 'Mike Chen',
    clientAvatar: 'MC',
    name: 'Elite Performance Program',
    description: 'High-intensity training for competitive athletes',
    level: 'Advanced',
    duration: '12 weeks',
    frequency: '5x per week',
    status: 'Completed',
    createdDate: '2023-10-01',
    lastModified: '2023-12-30',
    exercises: [
      {
        day: 'Day 1 - Power Training',
        exercises: [
          { name: 'Olympic Lift Complex', sets: 5, reps: '3-5', rest: '3-4 min', notes: 'Explosive movements' },
          { name: 'Box Jumps', sets: 5, reps: '3-5', rest: '2-3 min', notes: 'Max height' },
          { name: 'Sprint Intervals', sets: 8, reps: '20 sec', rest: '100 sec', notes: 'Track or treadmill' },
        ],
      },
      {
        day: 'Day 2 - Strength Focus',
        exercises: [
          { name: 'Squat', sets: 5, reps: '1-3', rest: '4-5 min', notes: 'Max effort' },
          { name: 'Bench Press', sets: 5, reps: '1-3', rest: '4-5 min', notes: 'Max effort' },
          { name: 'Deadlift', sets: 3, reps: '1-3', rest: '4-5 min', notes: 'Competition style' },
        ],
      },
    ],
    goals: ['Peak performance', 'Competition prep', 'Max strength gains'],
    equipment: ['Olympic barbell', 'Competition plates', 'Box jump platform'],
    progress: 100,
    completionRate: 95,
  },
];

const WorkoutPlans = () => {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planData, setPlanData] = useState({
    clientId: '',
    name: '',
    description: '',
    level: 'Beginner',
    duration: '4 weeks',
    frequency: '3x per week',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: workoutPlans = mockWorkoutPlans } = useQuery({
    queryKey: ['workout-plans'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockWorkoutPlans;
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      console.log('Creating workout plan:', plan);
      return plan;
    },
    onSuccess: () => {
      setPlanDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      console.log('Updating workout plan:', plan);
      return plan;
    },
    onSuccess: () => {
      setPlanDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      console.log('Deleting workout plan:', planId);
      return planId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
    },
  });

  const handleCreatePlan = () => {
    createPlanMutation.mutate({
      ...planData,
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    });
  };

  const handleUpdatePlan = () => {
    if (selectedPlan) {
      updatePlanMutation.mutate({
        ...selectedPlan,
        ...planData,
        lastModified: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleDeletePlan = (planId: number) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      deletePlanMutation.mutate(planId);
    }
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setPlanData({
      clientId: plan.clientId.toString(),
      name: plan.name,
      description: plan.description,
      level: plan.level,
      duration: plan.duration,
      frequency: plan.frequency,
    });
    setPlanDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Completed':
        return 'info';
      case 'Draft':
        return 'warning';
      case 'Paused':
        return 'default';
      default:
        return 'default';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'info';
    }
  };

  // Calculate statistics
  const planStats = {
    total: workoutPlans.length,
    active: workoutPlans.filter(p => p.status === 'Active').length,
    completed: workoutPlans.filter(p => p.status === 'Completed').length,
    avgProgress: workoutPlans.length > 0 ? Math.round(workoutPlans.reduce((sum, p) => sum + p.progress, 0) / workoutPlans.length) : 0,
    avgCompletion: workoutPlans.length > 0 ? Math.round(workoutPlans.reduce((sum, p) => sum + p.completionRate, 0) / workoutPlans.length) : 0,
  };

  const uniqueClients = Array.from(new Set(workoutPlans.map(p => p.clientName))).map((name, index) => ({
    id: workoutPlans.find(p => p.clientName === name)?.clientId || index + 1,
    name,
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Workout Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedPlan(null);
            setPlanData({
              clientId: '',
              name: '',
              description: '',
              level: 'Beginner',
              duration: '4 weeks',
              frequency: '3x per week',
            });
            setPlanDialogOpen(true);
          }}
        >
          Create Plan
        </Button>
      </Box>

      {/* Plan Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {planStats.total}
              </Typography>
              <Typography color="text.secondary">
                Total Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {planStats.active}
              </Typography>
              <Typography color="text.secondary">
                Active Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Target color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {planStats.avgProgress}%
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
              <PlayArrow color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {planStats.avgCompletion}%
              </Typography>
              <Typography color="text.secondary">
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {planStats.completed}
              </Typography>
              <Typography color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workout Plans List */}
      <Grid container spacing={3}>
        {workoutPlans.map((plan) => (
          <Grid item xs={12} md={6} lg={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {plan.clientAvatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.clientName}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={plan.status}
                    color={getStatusColor(plan.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={plan.level}
                    color={getLevelColor(plan.level)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={plan.duration}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={plan.frequency}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {plan.progress}%
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${plan.progress}%`,
                        height: '100%',
                        bgcolor: plan.progress >= 80 ? 'success.main' : plan.progress >= 50 ? 'warning.main' : 'error.main',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Completion Rate: {plan.completionRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last updated: {plan.lastModified}
                </Typography>

                {/* Goals */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Goals:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {plan.goals.slice(0, 2).map((goal, index) => (
                      <Chip
                        key={index}
                        label={goal}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {plan.goals.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{plan.goals.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditPlan(plan)}
                    sx={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeletePlan(plan.id)}
                    sx={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Plan Dialog */}
      <Dialog open={planDialogOpen} onClose={() => setPlanDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={planData.clientId}
                  label="Client"
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  disabled={!!selectedPlan}
                >
                  {uniqueClients.map((client) => (
                    <MenuItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                value={planData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={planData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Level"
                value={planData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration"
                value={planData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="4 weeks"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Frequency"
                value={planData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                placeholder="3x per week"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={selectedPlan ? handleUpdatePlan : handleCreatePlan}
            disabled={!planData.name || !planData.clientId}
          >
            {selectedPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutPlans;