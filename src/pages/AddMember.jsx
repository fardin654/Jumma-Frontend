import React, { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { MembersContext } from '../context/MembersContext';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMember = ({AccessCode, Admin}) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const { addMember, loading } = useContext(MembersContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      if(Admin === "YES"){
        await addMember({ name, balance, AccessCode });
        navigate('/members');
      } else {
        toast.error("You are not authorized to add members", toastOptions);
      }
    } catch (err) {
      console.error(err);
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Add Member'}
          </Button>
        </form>
      </Paper>
      <ToastContainer/>
    </Container>
  );
};

export default AddMember;