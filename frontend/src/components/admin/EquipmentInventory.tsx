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
  IconButton,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  FitnessCenter,
  Add,
  Edit,
  Delete,
  Build,
  Inventory,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock equipment data
const mockEquipment = [
  {
    id: 1,
    name: 'Treadmill Pro 2000',
    category: 'Cardio',
    brand: 'Life Fitness',
    model: 'Treadmill Pro 2000',
    purchaseDate: '2023-01-15',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    status: 'Excellent',
    condition: 95,
    location: 'Cardio Zone A',
    serialNumber: 'LF-TP2000-001',
    cost: 8500,
    assignedTo: null,
  },
  {
    id: 2,
    name: 'Dumbbell Set 50lbs',
    category: 'Strength',
    brand: 'Iron Grip',
    model: 'IG-DB-50',
    purchaseDate: '2022-08-20',
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-03-15',
    status: 'Good',
    condition: 78,
    location: 'Free Weight Area',
    serialNumber: 'IG-DB-50-001',
    cost: 1200,
    assignedTo: null,
  },
  {
    id: 3,
    name: 'Elliptical Machine',
    category: 'Cardio',
    brand: 'Precor',
    model: 'EFX 245',
    purchaseDate: '2021-11-10',
    lastMaintenance: '2023-11-20',
    nextMaintenance: '2024-02-20',
    status: 'Needs Maintenance',
    condition: 65,
    location: 'Cardio Zone B',
    serialNumber: 'PRE-EFX245-003',
    cost: 12000,
    assignedTo: null,
  },
  {
    id: 4,
    name: 'Rowing Machine',
    category: 'Cardio',
    brand: 'Concept2',
    model: 'Model D',
    purchaseDate: '2023-06-01',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    status: 'Excellent',
    condition: 92,
    location: 'Cardio Zone A',
    serialNumber: 'C2-MD-005',
    cost: 950,
    assignedTo: null,
  },
  {
    id: 5,
    name: 'Bench Press',
    category: 'Strength',
    brand: 'Powertec',
    model: 'WB-14',
    purchaseDate: '2022-03-15',
    lastMaintenance: '2023-10-20',
    nextMaintenance: '2024-01-20',
    status: 'Needs Replacement',
    condition: 45,
    location: 'Free Weight Area',
    serialNumber: 'PT-WB14-002',
    cost: 2800,
    assignedTo: null,
  },
];

const EquipmentInventory = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cardio',
    brand: '',
    model: '',
    purchaseDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'Excellent',
    condition: 100,
    location: '',
    serialNumber: '',
    cost: '',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: equipment = mockEquipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockEquipment;
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: async (updatedEquipment: any) => {
      console.log('Updating equipment:', updatedEquipment);
      return updatedEquipment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setDialogOpen(false);
      setSelectedEquipment(null);
    },
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: async (equipmentId: number) => {
      console.log('Deleting equipment:', equipmentId);
      return equipmentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });

  const handleEdit = (equipment: any) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      category: equipment.category,
      brand: equipment.brand,
      model: equipment.model,
      purchaseDate: equipment.purchaseDate,
      lastMaintenance: equipment.lastMaintenance,
      nextMaintenance: equipment.nextMaintenance,
      status: equipment.status,
      condition: equipment.condition,
      location: equipment.location,
      serialNumber: equipment.serialNumber,
      cost: equipment.cost.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = (equipmentId: number) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipmentMutation.mutate(equipmentId);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...selectedEquipment,
      ...formData,
      cost: parseFloat(formData.cost),
    };
    updateEquipmentMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 90) return 'success';
    if (condition >= 70) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'info';
      case 'Needs Maintenance':
        return 'warning';
      case 'Needs Replacement':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Needs Maintenance':
        return <Warning />;
      case 'Needs Replacement':
        return <Warning color="error" />;
      default:
        return <CheckCircle />;
    }
  };

  // Calculate statistics
  const equipmentStats = {
    total: equipment.length,
    excellent: equipment.filter(eq => eq.status === 'Excellent').length,
    needsMaintenance: equipment.filter(eq => eq.status === 'Needs Maintenance').length,
    needsReplacement: equipment.filter(eq => eq.status === 'Needs Replacement').length,
    totalValue: equipment.reduce((sum, eq) => sum + eq.cost, 0),
    avgCondition: Math.round(equipment.reduce((sum, eq) => sum + eq.condition, 0) / equipment.length),
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Equipment',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <FitnessCenter />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.brand} {params.row.model}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Cardio' ? 'primary' : 'secondary'}
          size="small"
        />
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            color={getConditionColor(params.value)}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary">
            {params.value}%
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'nextMaintenance',
      headerName: 'Next Maintenance',
      width: 160,
      renderCell: (params) => {
        const isUrgent = new Date(params.value) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        return (
          <Typography
            variant="body2"
            color={isUrgent ? 'error.main' : 'text.primary'}
            sx={{ fontWeight: isUrgent ? 'bold' : 'normal' }}
          >
            {params.value}
            {isUrgent && ' (Urgent)'}
          </Typography>
        );
      },
    },
    {
      field: 'cost',
      headerName: 'Value',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          ${params.value.toLocaleString()}
        </Typography>
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
          Equipment Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedEquipment(null);
            setFormData({
              name: '',
              category: 'Cardio',
              brand: '',
              model: '',
              purchaseDate: '',
              lastMaintenance: '',
              nextMaintenance: '',
              status: 'Excellent',
              condition: 100,
              location: '',
              serialNumber: '',
              cost: '',
            });
            setDialogOpen(true);
          }}
        >
          Add Equipment
        </Button>
      </Box>

      {/* Equipment Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {equipmentStats.total}
              </Typography>
              <Typography color="text.secondary">
                Total Equipment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {equipmentStats.excellent}
              </Typography>
              <Typography color="text.secondary">
                Excellent Condition
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Build color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {equipmentStats.needsMaintenance}
              </Typography>
              <Typography color="text.secondary">
                Need Maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {equipmentStats.needsReplacement}
              </Typography>
              <Typography color="text.secondary">
                Need Replacement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LinearProgress
                variant="determinate"
                value={equipmentStats.avgCondition}
                color={getConditionColor(equipmentStats.avgCondition)}
                sx={{ height: 20, borderRadius: 10, mb: 1 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {equipmentStats.avgCondition}%
              </Typography>
              <Typography color="text.secondary">
                Avg Condition
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${(equipmentStats.totalValue / 1000).toFixed(0)}K
              </Typography>
              <Typography color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts for urgent maintenance */}
      {(equipmentStats.needsMaintenance > 0 || equipmentStats.needsReplacement > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {equipmentStats.needsMaintenance} equipment items need maintenance, and {equipmentStats.needsReplacement} need replacement.
        </Alert>
      )}

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={equipment}
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

      {/* Add/Edit Equipment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Equipment Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Serial Number"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
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
                <MenuItem value="Cardio">Cardio</MenuItem>
                <MenuItem value="Strength">Strength</MenuItem>
                <MenuItem value="Flexibility">Flexibility</MenuItem>
                <MenuItem value="Functional">Functional</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Needs Maintenance">Needs Maintenance</MenuItem>
                <MenuItem value="Needs Replacement">Needs Replacement</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Condition (%)"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', parseInt(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Cost ($)"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Maintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next Maintenance"
                type="date"
                value={formData.nextMaintenance}
                onChange={(e) => handleInputChange('nextMaintenance', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name || !formData.brand}
          >
            {selectedEquipment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentInventory;