import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  PersonAdd,
  AdminPanelSettings,
  FitnessCenter,
  Security,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@services/adminApi';

// Mock staff data
const mockStaff = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    role: 'Trainer',
    department: 'Fitness',
    status: 'Active',
    joinDate: '2023-01-15',
    avatar: 'JS',
    specialties: ['Strength Training', 'Cardio'],
    hourlyRate: '$35',
  },
  {
    id: 2,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1234567891',
    role: 'Admin',
    department: 'Management',
    status: 'Active',
    joinDate: '2022-11-20',
    avatar: 'ED',
    specialties: ['Member Relations', 'Operations'],
    hourlyRate: '$25',
  },
  {
    id: 3,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1234567892',
    role: 'Maintenance',
    department: 'Facilities',
    status: 'Active',
    joinDate: '2023-03-10',
    avatar: 'DW',
    specialties: ['Equipment Repair', 'Cleaning'],
    hourlyRate: '$20',
  },
];

const StaffTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Trainer',
    department: 'Fitness',
    specialties: '',
    hourlyRate: '',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls - replace with actual API when backend is ready
  const { data: staff = mockStaff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockStaff;
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: async (updatedStaff: any) => {
      // Mock API call
      console.log('Updating staff:', updatedStaff);
      return updatedStaff;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setDialogOpen(false);
      setSelectedStaff(null);
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId: number) => {
      // Mock API call
      console.log('Deleting staff:', staffId);
      return staffId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const handleEdit = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      department: staffMember.department,
      specialties: staffMember.specialties.join(', '),
      hourlyRate: staffMember.hourlyRate.replace('$', ''),
    });
    setDialogOpen(true);
  };

  const handleDelete = (staffId: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaffMutation.mutate(staffId);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...selectedStaff,
      ...formData,
      specialties: formData.specialties.split(', ').filter(s => s.trim()),
      hourlyRate: `$${formData.hourlyRate}`,
    };
    updateStaffMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'trainer':
        return <FitnessCenter />;
      case 'admin':
        return <AdminPanelSettings />;
      case 'maintenance':
        return <Security />;
      default:
        return <PersonAdd />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'trainer':
        return 'primary';
      case 'admin':
        return 'secondary';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department.toLowerCase()) {
      case 'fitness':
        return 'success';
      case 'management':
        return 'info';
      case 'facilities':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Staff Member',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
            {params.row.avatar}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getRoleIcon(params.value)}
          label={params.value}
          color={getRoleColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getDepartmentColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'hourlyRate',
      headerName: 'Rate/Hr',
      width: 80,
    },
    {
      field: 'specialties',
      headerName: 'Specialties',
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.value.slice(0, 2).map((specialty: string, index: number) => (
            <Chip
              key={index}
              label={specialty}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
          {params.value.length > 2 && (
            <Typography variant="caption" color="text.secondary">
              +{params.value.length - 2} more
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 120,
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
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => {
            setSelectedStaff(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              role: 'Trainer',
              department: 'Fitness',
              specialties: '',
              hourlyRate: '',
            });
            setDialogOpen(true);
          }}
        >
          Add Staff
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={staff}
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

      {/* Add/Edit Staff Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <MenuItem value="Trainer">Trainer</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <MenuItem value="Fitness">Fitness</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
                <MenuItem value="Facilities">Facilities</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hourly Rate"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Specialties (comma-separated)"
                value={formData.specialties}
                onChange={(e) => handleInputChange('specialties', e.target.value)}
                placeholder="Strength Training, Yoga, Nutrition"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name || !formData.email}
          >
            {selectedStaff ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffTable;