import React, { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { MembersContext } from "../context/MembersContext";
import { RoundsContext } from "../context/RoundsContext";
import { useNavigate } from 'react-router-dom';
import { usePayments } from '../context/PaymentsContext';
import { RequestsContext } from '../context/RequestsContext';
import { Link as RouterLink } from 'react-router-dom';

const AddPayment = ({AccessCode, Admin}) => {
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [roundId, setRoundId] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  const [paymentType, setPaymentType] = useState('wallet'); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addPayment, loading, error } = usePayments();
  const { members, fetchMembers } = useContext(MembersContext);
  const { rounds, fetchRounds } = useContext(RoundsContext);
  const { createRequest, loading: Loading, error: Error } = useContext(RequestsContext);
  const navigate = useNavigate();

  useEffect(() => {
      if(AccessCode)  fetchMembers(AccessCode);
      if(AccessCode)  fetchRounds(AccessCode);
  }, [AccessCode])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(Admin == "YES") {
        await addPayment({ 
          amount: Number(amount), 
          paidBy, 
          roundId, 
          date: paymentDate,
          AccessCode: AccessCode
        });
        navigate('/');
      } else {
        await createRequest({
          memberId: paidBy,
          date: paymentDate,
          amount,
          roundId,
          paymentType,
          AccessCode
        });
        navigate('/');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!AccessCode) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h5">Authenticate to View Data</Typography>
        <Button
          size={isMobile ? "small" : "medium"}
          variant="contained"
          color="primary"
          component={RouterLink} 
          to="/authenticate"
          sx={{ mt: 2 }}
        >
          Authenticate
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Add New Payment</Typography>
        
        {error || Error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || Error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true, 
            }}
            required
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Paid By</InputLabel>
            <Select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              label="Paid By"
            >
              {members.map(member => (
                <MenuItem key={member._id} value={member._id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Round</InputLabel>
            <Select
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              label="Round"
            >
              {rounds.map(round => (
                <MenuItem key={round._id} value={round._id}>
                  Round {round.roundNumber} - {new Date(round.date).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          { Admin === "NO" && 
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Payment Type</InputLabel>
            <Select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              label="Payment Type"
            >
                <MenuItem key={"wallet"} value={"wallet"}>
                  Wallet
                </MenuItem>
                <MenuItem key={"expense"} value={"expense"}>
                  Expense
                </MenuItem>
              
            </Select>
          </FormControl>}
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
            disabled={loading || Loading}
            startIcon={loading || Loading ? <CircularProgress size={20} /> : null}
          >
            {loading || Loading ? 'Processing...' : 'Add Payment'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddPayment;