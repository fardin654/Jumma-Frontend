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
import { MembersContext } from '../context/MembersContext';

const MembersList = () => {
  const { members, loading, error } = useContext(MembersContext);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Members List
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/add-member')}
        style={{ marginBottom: '20px' }}
      >
        Add New Member
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id} hover>
                <TableCell onClick={() => navigate(`/members/${member._id}/payments`)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ marginRight: '10px' }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </div>
                </TableCell>
                <TableCell align="right">
                  ₹{member.balance.toFixed(2)}
                </TableCell>
                <TableCell>
                    <Chip
                        label={
                        member.balance === 0
                            ? 'In Good Standing'
                            : member.balance < 0
                            ? 'Need to Pay'
                            : 'Need to be Paid'
                        }
                        color={
                        member.balance === 0
                            ? 'success'
                            : member.balance < 0
                            ? 'error'
                            : 'primary'
                        }
                    />
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/members/${member.name}/payments`)}
                  >
                    View
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

export default MembersList;