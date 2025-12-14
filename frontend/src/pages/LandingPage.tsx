import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle,
  ExpandMore,
  FitnessCenter,
  Groups,
  Schedule,
  TrendingUp,
  Star,
  Speed,
  Security,
  Support,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Groups />,
      title: 'Member Management',
      description: 'Complete member profiles, membership tracking, and automated billing',
    },
    {
      icon: <Schedule />,
      title: 'Class Scheduling',
      description: 'Flexible class schedules, booking system, and automated notifications',
    },
    {
      icon: <TrendingUp />,
      title: 'Analytics & Reports',
      description: 'Real-time insights into membership growth, revenue, and facility utilization',
    },
    {
      icon: <Speed />,
      title: 'Smart Equipment',
      description: 'Equipment tracking, maintenance scheduling, and inventory management',
    },
    {
      icon: <Security />,
      title: 'Secure Access',
      description: 'Role-based access control with secure authentication and permissions',
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support and training for your team',
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for small gyms and fitness studios',
      features: [
        'Up to 100 members',
        'Basic class scheduling',
        'Simple reporting',
        'Email support',
        'Mobile app access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing fitness centers',
      features: [
        'Up to 500 members',
        'Advanced analytics',
        'Equipment management',
        'Priority support',
        'Custom branding',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Elite',
      price: '$149',
      period: '/month',
      description: 'For large gym chains and fitness enterprises',
      features: [
        'Unlimited members',
        'Multi-location support',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security',
        'White-label solution',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Gym Owner',
      avatar: 'SJ',
      content: 'GymMaster has transformed how we manage our fitness center. The member engagement features are incredible!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Fitness Trainer',
      avatar: 'MC',
      content: 'The scheduling and client management tools make my job so much easier. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Member',
      avatar: 'LR',
      content: 'Love the mobile app! Booking classes and tracking my progress has never been simpler.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How easy is it to set up GymMaster?',
      answer: 'Setup takes less than 30 minutes. Our onboarding team guides you through every step, and we offer free migration services from your existing system.',
    },
    {
      question: 'Can I integrate with my existing payment processor?',
      answer: 'Yes! GymMaster integrates with major payment processors including Stripe, PayPal, and Square. We also support custom integrations.',
    },
    {
      question: 'Is my gym data secure?',
      answer: 'Absolutely. We use enterprise-grade security with bank-level encryption, regular backups, and compliance with data protection regulations.',
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide 24/7 support via chat, email, and phone. Premium and Elite plans include dedicated account managers.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Transform Your Gym Management
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Streamline operations, boost member engagement, and grow your fitness business with our comprehensive management platform.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Person />}
                href="/signup"
                sx={{ minWidth: 160 }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Groups />}
                href="/login"
                sx={{ minWidth: 160 }}
              >
                Sign In
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/api/placeholder/600/400"
              alt="Gym Management Dashboard"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Powerful features designed specifically for gym and fitness center management
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Choose the plan that fits your gym's needs. All plans include a 14-day free trial.
          </Typography>
          <Grid container spacing={4}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    position: 'relative',
                    border: plan.popular ? '2px solid' : '1px solid',
                    borderColor: plan.popular ? 'primary.main' : 'grey.300',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}
                    />
                  )}
                  <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 2 }}>
                      <Typography variant="h3" component="span" color="primary" sx={{ fontWeight: 'bold' }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="h6" component="span" color="text.secondary">
                        {plan.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <List dense>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} disablePadding>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
                    <Button
                      variant={plan.popular ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      href={plan.name === 'Elite' ? '/contact' : '/signup'}
                    >
                      {plan.cta}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            What Our Customers Say
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Join thousands of gym owners who've transformed their business
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} color="warning" fontSize="small" />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph>
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>{testimonial.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Transform Your Gym?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of gym owners who've already made the switch to GymMaster
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<FitnessCenter />}
              href="/signup"
              sx={{ minWidth: 160 }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              startIcon={<AdminPanelSettings />}
              href="/contact"
              sx={{ minWidth: 160, borderColor: 'inherit', '&:hover': { borderColor: 'inherit', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Schedule Demo
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;