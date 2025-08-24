import React, { useContext } from 'react';
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
  Button
} from '@mui/material';
import { AutoContactsContext } from '../context/AutoContactsContext';

const AutoContactsList = () => {
  const { members, loading, error } = useContext(AutoContactsContext);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
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
                <TableCell align="center">
                    {member.description || '-'}
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