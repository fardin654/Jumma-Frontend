import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { usePaymentsList } from '../context/PaymentsListContext';
import { MembersContext } from '../context/MembersContext';
import { ArrowBack } from "@mui/icons-material";


const MemberPayments = ({AccessCode}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  const { 
    payments, 
    loading, 
    error, 
    fetchPaymentsByMember 
  } = usePaymentsList();

  const { members, getMemberById, fetchMembers } = useContext(MembersContext);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPaymentsByMember({ id, AccessCode });
      const mem = await getMemberById(id);
      setMember(mem[0]);
    };

    fetchData();
  }, [id, AccessCode, fetchPaymentsByMember]);


  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/members')}>Back to Members</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h4">{member?.name}</Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Payment History
      </Typography>

      {payments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Round</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell sx={{width:"auto", whiteSpace: "nowrap"}}>
                    Round {payment.round}
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
                  <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.amount >= 400 ? 'paid' : 'partial'}
                      color={payment.amount >= 400 ? 'success' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" style={{ fontStyle: 'italic' }}>
          No payments found for {member?.name}.
        </Typography>
      )}
    </Container>
  );
};

export default MemberPayments;
