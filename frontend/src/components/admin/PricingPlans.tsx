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
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Star,
  AttachMoney,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock pricing plans data
const mockPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      'Up to 100 members',
      'Basic class scheduling',
      'Simple reporting',
      'Email support',
      'Mobile app access',
    ],
    isPopular: false,
    isActive: true,
    color: 'primary',
    description: 'Perfect for small gyms and fitness studios',
  },
  {
    id: 2,
    name: 'Premium',
    price: 79,
    billingPeriod: 'monthly',
    features: [
      'Up to 500 members',
      'Advanced analytics',
      'Equipment management',
      'Priority support',
      'Custom branding',
      'API access',
      'Member portal',
    ],
    isPopular: true,
    isActive: true,
    color: 'secondary',
    description: 'Ideal for growing fitness centers',
  },
  {
    id: 3,
    name: 'Elite',
    price: 149,
    billingPeriod: 'monthly',
    features: [
      'Unlimited members',
      'Multi-location support',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security',
      'White-label solution',
      '24/7 phone support',
      'Custom reporting',
    ],
    isPopular: false,
    isActive: true,
    color: 'warning',
    description: 'For large gym chains and fitness enterprises',
  },
  {
    id: 4,
    name: 'Trial',
    price: 0,
    billingPeriod: 'one-time',
    features: [
      '14-day free trial',
      'Full feature access',
      'Email support',
      'Setup assistance',
    ],
    isPopular: false,
    isActive: false,
    color: 'info',
    description: 'Try all features risk-free for 14 days',
  },
];

const PricingPlans = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingPeriod: 'monthly',
    features: '',
    isPopular: false,
    isActive: true,
    color: 'primary',
    description: '',
  });
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: plans = mockPlans, isLoading } = useQuery({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockPlans;
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (updatedPlan: any) => {
      console.log('Updating plan:', updatedPlan);
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
      setDialogOpen(false);
      setSelectedPlan(null);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      console.log('Deleting plan:', planId);
      return planId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
    },
  });

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      billingPeriod: plan.billingPeriod,
      features: plan.features.join('\n'),
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      color: plan.color,
      description: plan.description,
    });
    setDialogOpen(true);
  };

  const handleDelete = (planId: number) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      deletePlanMutation.mutate(planId);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...selectedPlan,
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.split('\n').filter(f => f.trim()),
    };
    updatePlanMutation.mutate(updatedData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getColorChip = (color: string) => {
    const colors = {
      primary: { bg: '#2196F3', text: 'white' },
      secondary: { bg: '#9C27B0', text: 'white' },
      warning: { bg: '#FF9800', text: 'white' },
      info: { bg: '#03DAC6', text: 'black' },
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Pricing Plans Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedPlan(null);
            setFormData({
              name: '',
              price: '',
              billingPeriod: 'monthly',
              features: '',
              isPopular: false,
              isActive: true,
              color: 'primary',
              description: '',
            });
            setDialogOpen(true);
          }}
        >
          Add Plan
        </Button>
      </Box>

      {/* Pricing Plans Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {plans.map((plan) => {
          const chipStyle = getColorChip(plan.color);
          return (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  border: plan.isPopular ? '2px solid' : '1px solid',
                  borderColor: plan.isPopular ? 'primary.main' : 'grey.300',
                  opacity: plan.isActive ? 1 : 0.7,
                }}
              >
                {plan.isPopular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    icon={<Star />}
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  />
                )}
                {!plan.isActive && (
                  <Chip
                    label="Inactive"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      zIndex: 1,
                    }}
                  />
                )}
                <CardContent sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={plan.name}
                      sx={{
                        bgcolor: chipStyle.bg,
                        color: chipStyle.text,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" component="span" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${plan.price}
                    </Typography>
                    {plan.billingPeriod !== 'one-time' && (
                      <Typography variant="h6" component="span" color="text.secondary">
                        /{plan.billingPeriod}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>

                  <List dense sx={{ flexGrow: 1 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant={plan.isPopular ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Plan Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {plans.filter(p => p.isActive).length}
              </Typography>
              <Typography color="text.secondary">
                Active Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {plans.filter(p => p.isPopular).length}
              </Typography>
              <Typography color="text.secondary">
                Popular Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${Math.min(...plans.filter(p => p.price > 0).map(p => p.price))}
              </Typography>
              <Typography color="text.secondary">
                Lowest Price
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${Math.max(...plans.filter(p => p.price > 0).map(p => p.price))}
              </Typography>
              <Typography color="text.secondary">
                Highest Price
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plan Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Color Theme"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              >
                <MenuItem value="primary">Blue</MenuItem>
                <MenuItem value="secondary">Purple</MenuItem>
                <MenuItem value="warning">Orange</MenuItem>
                <MenuItem value="info">Teal</MenuItem>
                <MenuItem value="success">Green</MenuItem>
                <MenuItem value="error">Red</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Price ($)"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Billing Period"
                value={formData.billingPeriod}
                onChange={(e) => handleInputChange('billingPeriod', e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="one-time">One-time</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Features (one per line)"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                multiline
                rows={4}
                placeholder="Feature 1
Feature 2
Feature 3"
                helperText="Enter each feature on a new line"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPopular}
                    onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                  />
                }
                label="Mark as Popular Plan"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                }
                label="Active Plan"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name || !formData.price}
          >
            {selectedPlan ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PricingPlans;