import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
} from '@mui/material';
import {
  FitnessCenter,
  Add,
  Edit,
  Delete,
  Schedule,
  Person,
  Group,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
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
    schedule: 'Mon, Wed, Fri',
    time: '8:00 AM',
    difficulty: 'Beginner',
    status: 'Active',
    avatar: 'SJ',
  },
  {
    id: 2,
    name: 'HIIT Training',
    instructor: 'Mike Chen',
    category: 'HIIT',
    duration: 45,
    capacity: 15,
    enrolled: 15,
    schedule: 'Tue, Thu',
    time: '6:30 AM',
    difficulty: 'Advanced',
    status: 'Active',
    avatar: 'MC',
  },
  {
    id: 3,
    name: 'Pilates Core',
    instructor: 'Emily Davis',
    category: 'Pilates',
    duration: 50,
    capacity: 12,
    enrolled: 10,
    schedule: 'Mon, Wed, Fri',
    time: '10:00 AM',
    difficulty: 'Intermediate',
    status: 'Active',
    avatar: 'ED',
  },
  {
    id: 4,
    name: 'Strength Training',
    instructor: 'David Wilson',
    category: 'Strength',
    duration: 60,
    capacity: 25,
    enrolled: 8,
    schedule: 'Daily',
    time: '5:00 PM',
    difficulty: 'All Levels',
    status: 'Active',
    avatar: 'DW',
  },
];

const ClassesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    category: 'Yoga',
    duration: 60,
    capacity: 20,
    schedule: 'Mon, Wed, Fri',
    time: '8:00 AM',
    difficulty: 'Beginner',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: classes = mockClasses, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockClasses;
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: async (updatedClass: any) => {
      console.log('Updating class:', updatedClass);
      return updatedClass;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setDialogOpen(false);
      setSelectedClass(null);
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      console.log('Deleting class:', classId);
      return classId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const handleEdit = (classItem: any) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      instructor: classItem.instructor,
      category: classItem.category,
      duration: classItem.duration,
      capacity: classItem.capacity,
      schedule: classItem.schedule,
      time: classItem.time,
      difficulty: classItem.difficulty,
    });
    setDialogOpen(true);
  };

  const handleDelete = (classId: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClassMutation.mutate(classId);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...selectedClass,
      ...formData,
      enrolled: selectedClass ? selectedClass.enrolled : 0,
      status: 'Active',
      avatar: formData.instructor.split(' ').map(n => n[0]).join(''),
    };
    updateClassMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    switch (category.toLowerCase()) {
      case 'yoga':
        return '#4CAF50';
      case 'hiit':
        return '#FF5722';
      case 'pilates':
        return '#9C27B0';
      case 'strength':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Class',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            mr: 2, 
            width: 32, 
            height: 32, 
            bgcolor: getCategoryColor(params.row.category),
            fontSize: '0.8rem'
          }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.category}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'instructor',
      headerName: 'Instructor',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 1, width: 24, height: 24, fontSize: '0.7rem' }}>
            {params.row.avatar}
          </Avatar>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 100,
      renderCell: (params) => `${params.value} min`,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
      renderCell: (params) => {
        const enrolled = params.row.enrolled;
        return `${enrolled}/${params.value}`;
      },
    },
    {
      field: 'schedule',
      headerName: 'Schedule',
      width: 150,
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 100,
    },
    {
      field: 'difficulty',
      headerName: 'Level',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getDifficultyColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Classes Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedClass(null);
            setFormData({
              name: '',
              instructor: '',
              category: 'Yoga',
              duration: 60,
              capacity: 20,
              schedule: 'Mon, Wed, Fri',
              time: '8:00 AM',
              difficulty: 'Beginner',
            });
            setDialogOpen(true);
          }}
        >
          Add Class
        </Button>
      </Box>

      {/* Class Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {classes.length}
              </Typography>
              <Typography color="text.secondary">
                Active Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Group color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {classes.reduce((sum, cls) => sum + cls.enrolled, 0)}
              </Typography>
              <Typography color="text.secondary">
                Total Enrolled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {new Set(classes.map(cls => cls.instructor)).size}
              </Typography>
              <Typography color="text.secondary">
                Instructors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {Math.round((classes.reduce((sum, cls) => sum + cls.enrolled, 0) / 
                           classes.reduce((sum, cls) => sum + cls.capacity, 0)) * 100)}%
              </Typography>
              <Typography color="text.secondary">
                Utilization Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={classes}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Class Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Class Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instructor"
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <MenuItem value="Yoga">Yoga</MenuItem>
                <MenuItem value="HIIT">HIIT</MenuItem>
                <MenuItem value="Pilates">Pilates</MenuItem>
                <MenuItem value="Strength">Strength Training</MenuItem>
                <MenuItem value="Cardio">Cardio</MenuItem>
                <MenuItem value="CrossFit">CrossFit</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Difficulty Level"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="All Levels">All Levels</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="8:00 AM"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Schedule"
                value={formData.schedule}
                onChange={(e) => handleInputChange('schedule', e.target.value)}
                placeholder="Mon, Wed, Fri"
                helperText="Enter days separated by comma"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name || !formData.instructor}
          >
            {selectedClass ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassesManager;