import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container 
} from '@mui/material';
import { RoundsContext } from '../context/RoundsContext';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const [fixed, setFixed] = useState();
  const { createRound } = useContext(RoundsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRound({ fixedAmount: fixed });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Create New Round</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Fixed Amount for Round"
            type="number"
            value={fixed}
            onChange={(e) => setFixed(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
          >
            Create Round
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMember;