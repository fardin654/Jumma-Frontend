import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  Avatar,
  Chip,
  useTheme,
  Grid,
  Card,
  CardHeader,
  CardContent
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

function PaymentsList() {
  const { roundNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://jumma-backend.onrender.com/api/payments/round/${roundNumber}`);
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data = await res.json();
        setPayments(data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [roundNumber]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6" gutterBottom>
          Error loading payments
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Retry
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Round {roundNumber} Payments
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label={`Total Collected: ₹${totalAmount.toFixed(2)}`} 
            color="primary"
            variant="outlined"
            size="medium"
          />
          <Chip 
            label={`${payments.length} ${payments.length === 1 ? 'Payment' : 'Payments'}`} 
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {payments.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No payments found for this round.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined">
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow 
                    key={payment._id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.875rem'
                        }}>
                          {payment.member?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {payment.member}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        ₹{payment.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.amount >= 400 ? 'paid' : payment.amount > 0 ? 'partial' : 'pending'}
                        color={payment.amount >= 400 ? 'success' : payment.amount > 0 ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={new Date(payment.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        variant="filled"
                        size="small"
                        color="default"
                        sx={{
                          backgroundColor: '#f5f5f5',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  );
}

export default PaymentsList;
