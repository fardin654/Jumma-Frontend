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
  Box,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { AutoContactsContext } from '../context/AutoContactsContext';
import { useNavigate } from 'react-router-dom';

const AddUpdateContact = () => {
  const [mode, setMode] = useState('add');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const { members, addContact, updateContact } = useContext(AutoContactsContext);
  const navigate = useNavigate();

  // Reset form when mode changes
  useEffect(() => {
    setName('');
    setContact('');
    setDescription('');
    setSelectedContactId('');
    console.log(members);
  }, [mode]);

  // Pre-fill form when a contact is selected for update
  useEffect(() => {
    if (selectedContactId && mode === 'update') {
      const contactToUpdate = members.find(c => String(c._id) === selectedContactId);
      if (contactToUpdate) {
        setName(contactToUpdate.name || '');
        setContact(contactToUpdate.contact || '');
        setDescription(contactToUpdate.description || '');
      }
    }
  }, [selectedContactId, members, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await addContact({ name, contact, description });
      } else if (mode === 'update' && selectedContactId) {
        await updateContact(selectedContactId, { name, contact, description });
      }
      navigate('/auto-contact');
    } catch (err) {
      console.error(err);
    }
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="contact mode"
          >
            <ToggleButton value="add" aria-label="add contact">
              Add Contact
            </ToggleButton>
            <ToggleButton value="update" aria-label="update contact">
              Update Contact
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="h5" gutterBottom>
          {mode === 'add' ? 'Add New Contact' : 'Update Existing Contact'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {mode === 'update' && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="contact-select-label">Select Contact</InputLabel>
              <Select
                labelId="contact-select-label"
                value={selectedContactId}
                label="Select Contact"
                onChange={(e) => setSelectedContactId(e.target.value)}
              >
                {members.map((contact) => (
                  <MenuItem key={contact._id} value={contact._id}>
                    {contact.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            style={{ marginTop: 20 }}
            disabled={mode === 'update' && !selectedContactId}
          >
            {mode === 'add' ? 'Add Contact' : 'Update Contact'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddUpdateContact;