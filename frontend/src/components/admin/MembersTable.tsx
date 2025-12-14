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
  Block,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@services/adminApi';

// Mock member data
const mockMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1234567890',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2023-06-15',
    lastVisit: '2024-01-10',
    avatar: 'AJ',
    totalBookings: 45,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1234567891',
    membershipType: 'Basic',
    status: 'Active',
    joinDate: '2023-08-22',
    lastVisit: '2024-01-09',
    avatar: 'SW',
    totalBookings: 32,
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1234567892',
    membershipType: 'Elite',
    status: 'Expired',
    joinDate: '2023-03-10',
    lastVisit: '2024-01-05',
    avatar: 'MC',
    totalBookings: 78,
  },
];

const MembersTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Basic',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls - replace with actual API when backend is ready
  const { data: members = mockMembers, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockMembers;
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async (updatedMember: any) => {
      // Mock API call
      console.log('Updating member:', updatedMember);
      return updatedMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setDialogOpen(false);
      setSelectedMember(null);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      // Mock API call
      console.log('Deleting member:', memberId);
      return memberId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
    });
    setDialogOpen(true);
  };

  const handleDelete = (memberId: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMemberMutation.mutate(memberId);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...selectedMember,
      ...formData,
    };
    updateMemberMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'suspended':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basic':
        return 'default';
      case 'premium':
        return 'primary';
      case 'elite':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Member',
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
      field: 'membershipType',
      headerName: 'Plan',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getMembershipColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 120,
    },
    {
      field: 'lastVisit',
      headerName: 'Last Visit',
      width: 120,
    },
    {
      field: 'totalBookings',
      headerName: 'Bookings',
      width: 100,
      type: 'number',
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
          Member Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => {
            setSelectedMember(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              membershipType: 'Basic',
            });
            setDialogOpen(true);
          }}
        >
          Add Member
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={members}
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

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMember ? 'Edit Member' : 'Add New Member'}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Membership Plan"
                value={formData.membershipType}
                onChange={(e) => handleInputChange('membershipType', e.target.value)}
              >
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Elite">Elite</MenuItem>
              </TextField>
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
            {selectedMember ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembersTable;