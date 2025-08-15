import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { MembersContext } from "../context/MembersContext";
import { RoundsContext } from "../context/RoundsContext";
import { useNavigate } from 'react-router-dom';
import { usePayments } from '../context/PaymentsContext';
import { useContext } from 'react';

const AddPayment = () => {
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [roundId, setRoundId] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  
  const { addPayment, loading, error } = usePayments();
  const { members } = useContext(MembersContext);
  const { rounds } = useContext(RoundsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPayment({ 
        amount: Number(amount), 
        paidBy, 
        roundId, 
        date: paymentDate 
      });
      navigate('/');
    } catch (err) {
      // Error is already handled in the context
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Add New Payment</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
                <MenuItem key={member._id} value={member.name}>
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
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Add Payment'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddPayment;