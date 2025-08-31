import React, { useState, useContext, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Box
} from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoundsContext } from '../context/RoundsContext';
import { MembersContext } from '../context/MembersContext';
import { useNavigate } from 'react-router-dom';

const CreateRound = ({AccessCode, Admin}) => {
  const [fixed, setFixed] = useState();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { createRound } = useContext(RoundsContext);
  const { members, fetchMembers } = useContext(MembersContext);
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

  useEffect(() => {
    fetchMembers(AccessCode);
  }, [fetchMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(Admin == "YES"){
        await createRound({ 
          fixedAmount: fixed, 
          AccessCode: AccessCode,
          members: selectedMembers 
        });
        navigate('/');
      } else {
        toast.error("You are not authorized to create rounds", toastOptions);
      }
    } catch (err) {
      toast.error("Failed to create round", toastOptions);
    }
  };

  const handleMemberChange = (event) => {
    const value = event.target.value;

    if (value.includes("select-all")) {
      // If "Select All" is chosen → toggle
      if (selectedMembers.length === members.length) {
        setSelectedMembers([]);
      } else {
        setSelectedMembers(members.map(m => m._id));
      }
    } else {
      setSelectedMembers(value);
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
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="members-select-label">Select Members</InputLabel>
            <Select
              labelId="members-select-label"
              id="members-select"
              multiple
              value={selectedMembers}
              onChange={handleMemberChange}
              input={<OutlinedInput label="Select Members" />}
              renderValue={(selected) => `${selected.length} members selected`}
            >
              <MenuItem value="select-all">
                <Checkbox
                  checked={members.length > 0 && selectedMembers.length === members.length}
                  indeterminate={selectedMembers.length > 0 && selectedMembers.length < members.length}
                />
                <ListItemText primary="Select All" />
              </MenuItem>
              {members.map((member) => (
                <MenuItem key={member._id} value={member._id}>
                  <Checkbox checked={selectedMembers.indexOf(member._id) > -1} />
                  <ListItemText primary={member.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
            disabled={selectedMembers.length === 0}
          >
            Create Round
          </Button>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default CreateRound;