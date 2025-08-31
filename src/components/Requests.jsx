import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
  Button,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RequestsContext } from '../context/RequestsContext';
import { MembersContext } from '../context/MembersContext';
import { ArrowBack } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

const Requests = ({ AccessCode, Admin }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    requests,
    loading,
    fetchRequestsByMember,
    fetchAllRequests,
    updateRequestStatus,
  } = useContext(RequestsContext);

  const { members, fetchMembers } = useContext(MembersContext);

  useEffect(() => {
    fetchAllRequests(AccessCode);
    fetchMembers(AccessCode);
  }, [Admin, AccessCode, fetchAllRequests, fetchRequestsByMember, fetchMembers]);

  if (!Admin) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h5">Not Allowed</Typography>
        <Button
          size={isMobile ? 'small' : 'medium'}
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Dashboard
        </Button>
      </Box>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        All Requests      
      </Typography>

      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
             <TableCell>Member</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => {
                const member = members.find(m => m._id.toString() === req.member.toString());
                return (
              <TableRow key={req._id} hover>
                <TableCell>{member?.name }</TableCell>
                <TableCell>₹{req.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                        label={new Date(req.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                        })}
                        variant="filled"
                        size="small"
                        color="default"
                        sx={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 500
                        }}
                    />
                </TableCell>
                <TableCell>{req.paymentType}</TableCell>
                <TableCell align="center">
                {req.isApproved === 'pending' ? (
                    <>
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() =>
                        updateRequestStatus(req._id, {
                            isApproved: 'true',
                            AccessCode,
                        })
                        }
                    >
                        <DoneIcon />
                    </Button>
                    <Button
                        size="small"
                      npm run dev  variant="contained"
                        color="error"
                        onClick={() =>
                        updateRequestStatus(req._id, {
                            isApproved: 'false',
                            AccessCode,
                        })
                        }
                    >
                        <ClearIcon />
                    </Button>
                    </>
                ) : req.isApproved === 'true' ? (
                    <Chip label="Approved" color="success" />) : <Chip label="Rejected" color="error" />
                }
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Requests;
