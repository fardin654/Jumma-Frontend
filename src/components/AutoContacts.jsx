import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Chip,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { AutoContactsContext } from '../context/AutoContactsContext';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const AutoContactsList = ({AccessCode, Admin}) => {
  const { members, loading, error, fetchContacts, deleteContact } = useContext(AutoContactsContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect( () => {
    if(AccessCode)
      fetchContacts(AccessCode);
  }, [AccessCode])

  const handleDeleteContact = async(id) => {
    try{
      const user = await deleteContact(id);
      fetchContacts(AccessCode);
    } catch (err) {
      console.log(err.message);
    }
  }

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


    if (loading) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="70vh" 
          flexDirection="column"
        >
          <CircularProgress size={60} thickness={5} color="primary" />
          <Typography variant="h6" mt={2} color="text.secondary">
            Fetching Contacts...
          </Typography>
        </Box>
      );
    }
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Auto Contacts List
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/add-contact')}
        style={{ marginBottom: '20px' }}
      >
        Add / Update Contact
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id} hover>
                <TableCell style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ marginRight: '10px' }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </div>
                </TableCell>
                <TableCell align="center">
                  {member.contact}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 250,whiteSpace: 'normal', wordBreak: 'break-word'}}>
                    {member.description || '-'}
                </TableCell>
                <TableCell align="center">
                  <Button 
                    size="small" 
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteContact(member._id)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AutoContactsList;