import React, { useContext, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  useTheme,
  Card,
  CardHeader,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { MembersContext } from '../context/MembersContext';
import { RoundsContext } from '../context/RoundsContext';
import { WalletContext } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentsIcon from '@mui/icons-material/Payments';

const Dashboard = () => {
  const { members } = useContext(MembersContext);
  const {
    rounds,
    currentRound,
    updatePayment,
    completeRound,
    createRound,
  } = useContext(RoundsContext);
  const { balance } = useContext(WalletContext);
  const [selectedRound, setSelectedRound] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  

  useEffect(() => {
    if (currentRound && !selectedRound) {
      setSelectedRound(currentRound._id);
    }
  }, [currentRound, selectedRound]);

  const handleRoundChange = (e) => {
    const roundId = e.target.value;
    setSelectedRound(roundId);
    if (roundId === 'new') navigate('/create-round');
  };

  const handlePaymentUpdate = async (paymentId, field, value) => {
    await updatePayment(selectedRound, paymentId, { [field]: value });
  };

  const handleCompleteRound = async () => {
    await completeRound(selectedRound);
  };

  const handleNewRound = async () => {
    const newRound = await createRound();
    setSelectedRound(newRound._id);
    navigate('/');
    window.location.reload();
  }

  const round = rounds.find((r) => r._id === selectedRound) || currentRound;

  const totalExpenses =
    round?.Expenses?.reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;

  const totalPaid =
    round?.payments?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) || 0;

  const paymentStatusCounts = round?.payments?.reduce(
    (acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    },
    { paid: 0, pending: 0, partial: 0 }
  );

  const sortedPayments = round?.payments?.slice().sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  }) || [];

  const nextToPay = [...sortedPayments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter(payment => payment.status === 'pending')
    .slice(0, 2);

  if (!round) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h5">No active round found</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNewRound()}
          sx={{ mt: 2 }}
        >
          Create New Round
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' 
    }}>
    <Box sx={{ 
        width: '100%',
        maxWidth: '1800px'
      }}>
      <Grid container spacing={5} justify-content="space-between" >
        {/* Header Section */}
        <Grid item xs={12} sx={{ minWidth: 570 }}>
          <Box sx={{
                height: 150, 
                display: 'flex',
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 2,
                backgroundColor: '#e6f7ff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
              }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Round {round.roundNumber}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(round.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 250 }} size="small">
              <InputLabel>Select Round</InputLabel>
              <Select
                value={selectedRound || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    handleNewRound(); 
                  } else {
                    handleRoundChange(e);
                  }
                }}
                label="Select Round"
              >
                {rounds.map((r) => (
                  <MenuItem key={r._id} value={r._id}>
                    Round {r.roundNumber} -{' '}
                    {new Date(r.date).toLocaleDateString('en-GB')}
                  </MenuItem>
                ))}
                <MenuItem value="new">
                  <Typography fontWeight="bold" onClick={() => handleNewRound()}>+ Create New Round</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4} sx={{width: 265}}>
            <Card sx={{ height: '100%',backgroundColor: '#90EE90' }}>
              <CardHeader
                avatar={
                  <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />   
                }
                title="Wallet Balance"
                titleTypographyProps={{ sx: { fontSize: "1.3rem", fontWeight: "bold" } }}
                sx={{ py: 1 }}
              />
              <CardContent>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: "1.8rem" }}>
                  ₹{balance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{width: 265}}>
            <Card sx={{ height: '100%', backgroundColor: '#90EE90'}}>
              <CardHeader
                avatar={
                  <PaymentIcon sx={{ fontSize: 40 }} />  
                }
                title="Total Expenses"
                titleTypographyProps={{ sx: { fontSize: "1.3rem", fontWeight: "bold" } }}
                sx={{ py: 1 }}
              />
              <CardContent>
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: "1.8rem" }}>
                  ₹{totalExpenses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{width: 265}}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#90EE90' }}>
              <CardHeader
                avatar={
                  <PaymentsIcon sx={{ fontSize: 40 }} />   
                }
                title="Payments Collected"
                titleTypographyProps={{ sx: { fontSize: "1.3rem", fontWeight: "bold" } }} 
                sx={{ py: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "1.8rem" }}>
                  ₹{totalPaid}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip label={`${paymentStatusCounts?.paid || 0} Paid`} size="small" color="success" />
                  <Chip label={`${paymentStatusCounts?.pending || 0} Pending`} size="small" color="warning" />
                  <Chip label={`${paymentStatusCounts?.partial || 0} Partial`} size="small" color="info" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Next to Pay Section */}
        <Grid item xs={12} md={4} sx={{ minWidth: 380 }}>
          <Card elevation={3} sx={{ height: '100%', backgroundColor: '#e6f7ff' }}>
            <CardHeader
              title="Next to Pay"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent>
              {nextToPay.length > 0 ? (
                <List>
                  {nextToPay.map((payment, index) => {
                    const member = members.find((m) => m.name === payment.member);
                    return (
                      <React.Fragment key={payment._id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                              {member?.name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={member?.name}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {new Date(payment.date).toLocaleDateString('en-GB', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </Typography>
                                {` - ₹${payment.amount} paid`}
                              </>
                            }
                          />
                          <Chip
                            label={payment.status}
                            color={
                              payment.status === 'paid'
                                ? 'success'
                                : payment.status === 'partial'
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        </ListItem>
                        {index < nextToPay.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No payment records found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>


        {/* Payments Table */}
        <Grid item xs={12} md={6} sx={{minWidth: 1000, marginLeft: 2}}>
          <Card elevation={3} sx={{ height: '100%',backgroundColor: '#e6f7ff' }}>
            <CardHeader
              title={`Member Payments for Round ${round.roundNumber}`}
              action={
                <Box display="flex" gap={1}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/paymentsList/${round.roundNumber}`)} 
                  >
                    Payments List
                  </Button>
                </Box>
              }
            />
            <CardContent>
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Left to Pay</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPayments.map((payment) => {
                      const member = members.find((m) => m.name === payment.member);
                      const balance = 400 - payment.amount<0? 0 : 400 - payment.amount; 
                      return (
                        <TableRow key={payment._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                                {member?.name?.charAt(0)}
                              </Avatar>
                              {member?.name}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                minWidth: 120,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor:
                                  payment.status === 'paid'
                                    ? theme.palette.success.light
                                    : payment.status === 'partial'
                                    ? theme.palette.info.light
                                    : theme.palette.warning.light,
                              }}
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={payment.amount}
                              onChange={(e) => handlePaymentUpdate(payment._id, 'amount', e.target.value)}
                              size="small"
                              sx={{ width: 100 }}
                              InputProps={{
                                startAdornment: '₹',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`₹${balance}`}
                              color={
                                balance === 0
                                  ? 'success'
                                  : balance === 400
                                  ? 'error'
                                  : 'warning'
                              }
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={new Date(payment.date).toLocaleDateString('en-GB', {
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

                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses Table */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', backgroundColor: '#e6f7ff' }}>
            <CardHeader
              title={`Expense Records for Round ${round.roundNumber}`}
              action={
                <Button variant="outlined" color="primary" onClick={() => navigate('/add-expense')}>
                  Add Expense
                </Button>
              }
            />
            <CardContent>
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount Paid</TableCell>
                      <TableCell>Balance Left</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {round.Expenses && round.Expenses.length > 0 ? (
                      round.Expenses.map((expense, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell align="right">
                            <Chip label={`₹${expense.amount}`} color="primary" size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip label={expense.balanceLeft} />
                          </TableCell>
                          <TableCell>
                            {new Date(expense.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <MoneyOffIcon color="disabled" fontSize="large" />
                            <Typography color="text.secondary" mt={1}>
                              No expense records found
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
     </Box>
    </Container>
  );
};

export default Dashboard;
