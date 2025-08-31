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
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoundsContext } from '../context/RoundsContext';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Rounds = ({ AccessCode, Admin }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { rounds, fetchRounds, loading, completeRound, deleteRound } = useContext(RoundsContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState(null);

  useEffect(() => {
    if(AccessCode)
      fetchRounds(AccessCode);
  }, [AccessCode]);

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

  const handleOpenDialog = (id) => {
    setSelectedRoundId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoundId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (Admin === "YES" && selectedRoundId) {
        await deleteRound(selectedRoundId);
        fetchRounds(AccessCode);
      } else {
        toast.error("You are not authorized to delete rounds", toastOptions);
      }
    } catch (err) {
      toast.error("Error deleting round: " + err.message, toastOptions);
    } finally {
      handleCloseDialog();
    }
  };

  const handleCompleteRound = async (id) => {
    try {
      if (Admin === "YES") {
        await completeRound(id);
        fetchRounds(AccessCode);
      } else {
        toast.error("You are not authorized to complete rounds", toastOptions);
      }
    } catch (err) {
      toast.error("Error completing round: " + err.message, toastOptions);
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
            Fetching Rounds data...
          </Typography>
        </Box>
      );
    }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Rounds List - '{AccessCode}'
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-round')}
        style={{ marginBottom: '20px' }}
      >
        Create New Round
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">End Date</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rounds.map((round) => (
              <TableRow key={round._id} hover>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer'  }}>
                    <Avatar style={{ marginRight: '10px' }} onClick={() => navigate(`/paymentsList/${round.roundNumber}`)}>
                      {round.roundNumber}
                    </Avatar>
                     <Typography variant="body1" noWrap onClick={() => navigate(`/paymentsList/${round.roundNumber}`)}>
                      Round {round.roundNumber}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={new Date(round.date).toLocaleDateString('en-GB', {
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
                <TableCell align="center">
                  {round.isCompleted ? (
                    <Chip
                      label={new Date(round.endDate).toLocaleDateString('en-GB', {
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
                  ) : (
                    "Active"
                  )}
                </TableCell>
                <TableCell align="center">
                  {round.isCompleted ? (
                    <Button size="small" variant="contained" disabled>
                      Completed
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleCompleteRound(round._id)}
                    >
                      Mark Completed
                    </Button>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDialog(round._id)}
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
            Are you sure you want to delete this round? This action cannot be undone.
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

export default Rounds;
