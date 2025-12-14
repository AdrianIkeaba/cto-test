import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Receipt,
  Download,
  Visibility,
  CreditCard,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock invoice data
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 79.99,
    status: 'Paid',
    description: 'Premium Membership - January 2024',
    type: 'Membership',
    paymentMethod: 'Credit Card',
    paidDate: '2024-01-01',
    downloadUrl: '/api/invoices/INV-2024-001.pdf',
    avatar: '💳',
  },
  {
    id: 2,
    invoiceNumber: 'INV-2023-012',
    date: '2023-12-01',
    dueDate: '2023-12-31',
    amount: 79.99,
    status: 'Paid',
    description: 'Premium Membership - December 2023',
    type: 'Membership',
    paymentMethod: 'Credit Card',
    paidDate: '2023-12-01',
    downloadUrl: '/api/invoices/INV-2023-012.pdf',
    avatar: '💳',
  },
  {
    id: 3,
    invoiceNumber: 'INV-2023-011',
    date: '2023-11-01',
    dueDate: '2023-11-30',
    amount: 79.99,
    status: 'Paid',
    description: 'Premium Membership - November 2023',
    type: 'Membership',
    paymentMethod: 'Credit Card',
    paidDate: '2023-11-01',
    downloadUrl: '/api/invoices/INV-2023-011.pdf',
    avatar: '💳',
  },
  {
    id: 4,
    invoiceNumber: 'INV-2023-010',
    date: '2023-10-15',
    dueDate: '2023-10-30',
    amount: 75.00,
    status: 'Paid',
    description: 'Personal Training Sessions (3 sessions)',
    type: 'Personal Training',
    paymentMethod: 'Credit Card',
    paidDate: '2023-10-15',
    downloadUrl: '/api/invoices/INV-2023-010.pdf',
    avatar: '🏃‍♂️',
  },
  {
    id: 5,
    invoiceNumber: 'INV-2023-009',
    date: '2023-10-01',
    dueDate: '2023-10-31',
    amount: 79.99,
    status: 'Paid',
    description: 'Premium Membership - October 2023',
    type: 'Membership',
    paymentMethod: 'Credit Card',
    paidDate: '2023-10-01',
    downloadUrl: '/api/invoices/INV-2023-009.pdf',
    avatar: '💳',
  },
  {
    id: 6,
    invoiceNumber: 'INV-2024-002',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 225.00,
    status: 'Overdue',
    description: 'Personal Training Package (5 sessions)',
    type: 'Personal Training',
    paymentMethod: 'Credit Card',
    paidDate: null,
    downloadUrl: '/api/invoices/INV-2024-002.pdf',
    avatar: '🏃‍♂️',
  },
];

const InvoiceHistory = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  
  const queryClient = useQueryClient();

  // Mock API calls
  const { data: invoices = mockInvoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockInvoices;
    },
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      console.log('Downloading invoice:', invoiceId);
      // Mock download - in real app, this would trigger actual download
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        // Create a mock download URL
        const link = document.createElement('a');
        link.href = invoice.downloadUrl;
        link.download = invoice.invoiceNumber + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return invoiceId;
    },
    onSuccess: () => {
      // Show success message
      console.log('Invoice downloaded successfully');
    },
  });

  const payInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      console.log('Processing payment for invoice:', invoiceId);
      // Mock payment processing
      return invoiceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setDetailsDialogOpen(false);
    },
  });

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const statusMatch = filterStatus === 'All' || invoice.status === filterStatus;
    const typeMatch = filterType === 'All' || invoice.type === filterType;
    return statusMatch && typeMatch;
  });

  // Calculate statistics
  const invoiceStats = {
    totalPaid: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    thisMonth: invoices.filter(inv => {
      const invoiceDate = new Date(inv.date);
      const now = new Date();
      return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear();
    }).reduce((sum, inv) => sum + inv.amount, 0),
    avgAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length,
  };

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDetailsDialogOpen(true);
  };

  const handleDownload = (invoiceId: number) => {
    downloadInvoiceMutation.mutate(invoiceId);
  };

  const handlePayNow = (invoiceId: number) => {
    if (window.confirm('Proceed to payment?')) {
      payInvoiceMutation.mutate(invoiceId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      case 'Cancelled':
        return 'default';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle />;
      case 'Pending':
        return <CreditCard />;
      case 'Overdue':
        return <Warning />;
      case 'Cancelled':
        return <Error />;
      default:
        return <CreditCard />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Membership':
        return 'primary';
      case 'Personal Training':
        return 'secondary';
      case 'Equipment Rental':
        return 'info';
      case 'Other':
        return 'default';
      default:
        return 'primary';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Invoice History & Billing
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              // Download all invoices as a ZIP
              console.log('Downloading all invoices');
            }}
          >
            Download All
          </Button>
        </Box>
      </Box>

      {/* Invoice Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${invoiceStats.totalPaid.toFixed(2)}
              </Typography>
              <Typography color="text.secondary">
                Total Paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CreditCard color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {invoiceStats.pending}
              </Typography>
              <Typography color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Error color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {invoiceStats.overdue}
              </Typography>
              <Typography color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Receipt color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${invoiceStats.thisMonth.toFixed(2)}
              </Typography>
              <Typography color="text.secondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${invoiceStats.avgAmount.toFixed(2)}
              </Typography>
              <Typography color="text.secondary">
                Avg Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Overdue Alert */}
      {invoiceStats.overdue > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          You have {invoiceStats.overdue} overdue invoice(s). Please pay them as soon as to avoid service interruption.
          <Button size="small" sx={{ ml: 1 }} onClick={() => setFilterStatus('Overdue')}>
            View Overdue
          </Button>
        </Alert>
      )}

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Membership">Membership</MenuItem>
              <MenuItem value="Personal Training">Personal Training</MenuItem>
              <MenuItem value="Equipment Rental">Equipment Rental</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Invoices Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2, fontSize: '1.5rem' }}>{invoice.avatar}</Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {invoice.invoiceNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {invoice.paymentMethod}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={invoice.status === 'Overdue' ? 'error.main' : 'text.primary'}
                          sx={{ fontWeight: invoice.status === 'Overdue' ? 'bold' : 'normal' }}
                        >
                          {invoice.dueDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.type}
                          color={getTypeColor(invoice.type)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${invoice.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(invoice.status)}
                          label={invoice.status}
                          color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(invoice)}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => handleDownload(invoice.id)}
                          >
                            PDF
                          </Button>
                          {invoice.status !== 'Paid' && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handlePayNow(invoice.id)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Invoice Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Invoice Details - {selectedInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  value={selectedInvoice.invoiceNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedInvoice.status}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date"
                  value={selectedInvoice.date}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  value={selectedInvoice.dueDate}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={selectedInvoice.description}
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={`$${selectedInvoice.amount.toFixed(2)}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Payment Method"
                  value={selectedInvoice.paymentMethod}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {selectedInvoice.paidDate && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Paid Date"
                    value={selectedInvoice.paidDate}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedInvoice?.status !== 'Paid' && (
            <Button
              variant="contained"
              onClick={() => handlePayNow(selectedInvoice.id)}
            >
              Pay Now
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload(selectedInvoice.id)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceHistory;