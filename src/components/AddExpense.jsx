// AddExpense.js
import React, { useState, useContext } from 'react';
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
import { useExpenses } from '../context/ExpensesContext';
import { WalletContext } from '../context/WalletContext';


const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [roundId, setRoundId] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { addExpense, loading, error } = useExpenses();
  const { members } = useContext(MembersContext);
  const { rounds } = useContext(RoundsContext);
  const { balance } = useContext(WalletContext);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({ 
        description,
        amount: Number(amount),
        date: expenseDate,
        balanceLeft: Number(balance-Number(amount)),
        roundId 
      });
      console.log("Expense Added");
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Add New Expense</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Expense Date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true, 
            }}
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
            required
          />
          
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
            {loading ? 'Processing...' : 'Add Expense'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddExpense;