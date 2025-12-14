import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Chip as MUIChip,
} from '@mui/material';
import {
  Person,
  Star,
  TrendingUp,
  Schedule,
  FitnessCenter,
  Edit,
  Phone,
  Email,
  Notes,
  Message,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock clients data
const mockClients = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1234567890',
    membershipType: 'Premium',
    startDate: '2023-06-15',
    avatar: 'AJ',
    status: 'Active',
    lastSession: '2024-01-10',
    sessionsCompleted: 24,
    sessionsRemaining: 6,
    goals: ['Weight Loss', 'Strength Building'],
    progress: 75,
    totalSpent: 1800,
    rating: 5,
    notes: 'Very motivated client, great progress on strength goals.',
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1234567891',
    membershipType: 'Basic',
    startDate: '2023-08-22',
    avatar: 'SW',
    status: 'Active',
    lastSession: '2024-01-08',
    sessionsCompleted: 18,
    sessionsRemaining: 2,
    goals: ['Flexibility', 'Stress Relief'],
    progress: 60,
    totalSpent: 1200,
    rating: 4,
    notes: 'Prefers morning sessions, very consistent.',
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1234567892',
    membershipType: 'Elite',
    startDate: '2023-03-10',
    avatar: 'MC',
    status: 'Paused',
    lastSession: '2023-12-15',
    sessionsCompleted: 32,
    sessionsRemaining: 8,
    goals: ['Muscle Building', 'Athletic Performance'],
    progress: 85,
    totalSpent: 2800,
    rating: 5,
    notes: 'High-performance athlete, excellent dedication.',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1234567893',
    membershipType: 'Premium',
    startDate: '2023-11-01',
    avatar: 'ED',
    status: 'Active',
    lastSession: '2024-01-09',
    sessionsCompleted: 8,
    sessionsRemaining: 12,
    goals: ['Weight Loss', 'Cardio Fitness'],
    progress: 40,
    totalSpent: 600,
    rating: 4,
    notes: 'New client, building foundational fitness.',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1234567894',
    membershipType: 'Basic',
    startDate: '2023-09-15',
    avatar: 'DW',
    status: 'Active',
    lastSession: '2024-01-11',
    sessionsCompleted: 14,
    sessionsRemaining: 6,
    goals: ['General Fitness', 'Endurance'],
    progress: 55,
    totalSpent: 1050,
    rating: 4,
    notes: 'Consistent progress, enjoys varied workout routines.',
  },
];

const TrainerClients = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: clients = mockClients, isLoading } = useQuery({
    queryKey: ['trainer-clients'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockClients;
    },
  });

  const updateClientNotesMutation = useMutation({
    mutationFn: async ({ clientId, notes }: { clientId: number, notes: string }) => {
      console.log('Updating client notes:', clientId, notes);
      return { clientId, notes };
    },
    onSuccess: () => {
      setNotesDialogOpen(false);
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['trainer-clients'] });
    },
  });

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const handleAddNotes = (client: any) => {
    setSelectedClient(client);
    setNotes(client.notes || '');
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (selectedClient) {
      updateClientNotesMutation.mutate({
        clientId: selectedClient.id,
        notes,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Paused':
        return 'warning';
      case 'Inactive':
        return 'error';
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

  // Calculate trainer statistics
  const trainerStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Active').length,
    avgRating: clients.length > 0 ? (clients.reduce((sum, c) => sum + c.rating, 0) / clients.length).toFixed(1) : '0',
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
    totalSessions: clients.reduce((sum, c) => sum + c.sessionsCompleted, 0),
    avgProgress: clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length) : 0,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Clients
        </Typography>
        <Button
          variant="contained"
          startIcon={<Person />}
          onClick={() => {
            // Handle adding new client
            console.log('Add new client');
          }}
        >
          Add Client
        </Button>
      </Box>

      {/* Trainer Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.totalClients}
              </Typography>
              <Typography color="text.secondary">
                Total Clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.activeClients}
              </Typography>
              <Typography color="text.secondary">
                Active Clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.avgRating}
              </Typography>
              <Typography color="text.secondary">
                Avg Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {trainerStats.totalSessions}
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
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${trainerStats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clients List */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <List>
              {clients.map((client) => (
                <ListItem key={client.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {client.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {client.name}
                        </Typography>
                        <Chip
                          label={client.status}
                          color={getStatusColor(client.status)}
                          size="small"
                        />
                        <Chip
                          label={client.membershipType}
                          color={getMembershipColor(client.membershipType)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <Email sx={{ fontSize: 16, mr: 0.5 }} />
                            {client.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                            {client.phone}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Goals:</strong> {client.goals.join(', ')}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            Progress:
                          </Typography>
                          <Box sx={{ width: 200, mr: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={client.progress}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {client.progress}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Sessions: {client.sessionsCompleted} completed, {client.sessionsRemaining} remaining
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last session: {client.lastSession}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                color={i < client.rating ? 'warning' : 'disabled'}
                                fontSize="small"
                              />
                            ))}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            ({client.rating}/5)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            Total spent: ${client.totalSpent}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Schedule />}
                        onClick={() => handleViewDetails(client)}
                      >
                        Schedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Notes />}
                        onClick={() => handleAddNotes(client)}
                      >
                        Notes
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Message />}
                        disabled={client.status !== 'Active'}
                      >
                        Message
                      </Button>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Client Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Client Details - {selectedClient?.name}
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedClient.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedClient.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Membership Type"
                  value={selectedClient.membershipType}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  value={selectedClient.startDate}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sessions Completed"
                  value={selectedClient.sessionsCompleted}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sessions Remaining"
                  value={selectedClient.sessionsRemaining}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goals"
                  value={selectedClient.goals.join(', ')}
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={selectedClient.notes || 'No notes available'}
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Schedule />}>
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Notes for {selectedClient?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this client..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveNotes}
            disabled={!notes.trim()}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerClients;