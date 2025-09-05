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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import { MembersContext } from '../context/MembersContext';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MembersList = ({ AccessCode, Admin }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { members, loading, error, fetchMembers, deleteMember } = useContext(MembersContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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
    if(AccessCode)
      !members? fetchMembers(AccessCode): null;
  }, [AccessCode]);

  const handleOpenDialog = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (Admin === "YES" && selectedMember) {
        await deleteMember(selectedMember._id);
        fetchMembers(AccessCode);
      } else {
        toast.error("You are not authorized to delete members", toastOptions);
      }
    } catch (err) {
      toast.error("Failed to delete member", toastOptions);
    } finally {
      handleCloseDialog();
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
            Fetching Members...
          </Typography>
        </Box>
      );
    }
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
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Payments</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id} hover>
                <TableCell
                  onClick={() => navigate(`/members/${member._id}/payments`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ marginRight: '10px' }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </div>
                </TableCell>
                <TableCell align="center">₹{member.balance.toFixed(2)}</TableCell>
                <TableCell align="center">
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
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/members/${member._id}/payments`)}
                  >
                    <VisibilityIcon />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDialog(member)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedMember?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default MembersList;
