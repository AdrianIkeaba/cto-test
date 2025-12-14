import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  CalendarToday,
  FitnessCenter,
  TrendingUp,
} from '@mui/icons-material';

interface MemberProfileProps {
  memberData: {
    name: string;
    email: string;
    membershipType: string;
    membershipStatus: string;
    joinDate: string;
    avatar: string;
  };
}

const MemberProfile: React.FC<MemberProfileProps> = ({ memberData }) => {
  const profileStats = {
    totalWorkouts: 45,
    favoriteClass: 'Yoga Flow',
    longestStreak: 12,
    goalsCompleted: 3,
    currentGoals: 2,
  };

  const goals = [
    { name: 'Lose 10 lbs', progress: 70, target: 10, achieved: 7 },
    { name: 'Do 50 push-ups', progress: 60, target: 50, achieved: 30 },
    { name: 'Attend 20 classes', progress: 100, target: 20, achieved: 20 },
    { name: 'Run 5K without stopping', progress: 30, target: 5, achieved: 1.5 },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Profile Information
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Personal Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {memberData.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {memberData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {memberData.joinDate}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={memberData.membershipType}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={memberData.membershipStatus}
                      color="success"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2">{memberData.email}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2">Birthday: March 15, 1990</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2">Emergency Contact: Jane Johnson</Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Edit />}
                sx={{ mt: 3 }}
                fullWidth
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fitness Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Fitness Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>
                      {profileStats.totalWorkouts}
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Total Workouts
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.contrastText' }}>
                      {profileStats.favoriteClass}
                    </Typography>
                    <Typography variant="body2" color="secondary.contrastText">
                      Favorite Class
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.contrastText' }}>
                      {profileStats.longestStreak}
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Day Streak
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.contrastText' }}>
                      {profileStats.goalsCompleted}
                    </Typography>
                    <Typography variant="body2" color="warning.contrastText">
                      Goals Completed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                sx={{ mt: 2 }}
                fullWidth
              >
                View Detailed Stats
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fitness Goals */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Fitness Goals
              </Typography>
              
              <Grid container spacing={3}>
                {goals.map((goal, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        height: '100%',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {goal.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            mr: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${goal.progress}%`,
                              height: '100%',
                              bgcolor: goal.progress === 100 ? 'success.main' : 'primary.main',
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: 35 }}>
                          {goal.progress}%
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {goal.achieved} / {goal.target} {goal.name.includes('lbs') ? 'lbs' : goal.name.includes('push-ups') ? 'push-ups' : goal.name.includes('classes') ? 'classes' : 'km'}
                      </Typography>
                      
                      {goal.progress === 100 && (
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
              >
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberProfile;