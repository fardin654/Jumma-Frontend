import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container 
} from '@mui/material';
import { MembersContext } from '../context/MembersContext';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const { addMember } = useContext(MembersContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMember({ name, balance });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>Add New Member</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Initial Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
          >
            Add Member
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMember;