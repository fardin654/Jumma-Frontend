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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MembersContext } from "../context/MembersContext";
import { RoundsContext } from "../context/RoundsContext";
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpensesContext';
import { WalletContext } from '../context/WalletContext';


const AddExpense = ({AccessCode, Admin}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [roundId, setRoundId] = useState('');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { addExpense, loading, error } = useExpenses();
  const { rounds } = useContext(RoundsContext);
  const { balance } = useContext(WalletContext);
  
  const navigate = useNavigate();
  const toastOptions = {
      position: "top-right",
      style: {
        top: "70px",
        rigth: "150px"
      },
      autoClose: 2000,
      hideProgressBar: false,
      newestOnTop: false,
      pauseOnHover: true,
      draggable: true,
      closeOnClick: true,
      theme: "colored"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if( Admin == "YES") {
        await addExpense({ 
          description,
          amount: Number(amount),
          date: expenseDate,
          balanceLeft: Number(balance-Number(amount)),
          roundId,
          AccessCode 
        });
        navigate('/');
      } else {
        toast.error("You are not authorized to add expenses", toastOptions);
      }
    } catch (err) {
      toast.error("Failed to add expense", toastOptions);
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
      <ToastContainer />
    </Container>
  );
};

export default AddExpense;