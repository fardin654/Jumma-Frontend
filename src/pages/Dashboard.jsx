import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Divider,
  useMediaQuery,
  InputAdornment
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

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
          size={isMobile ? "small" : "medium"}
          variant="contained"
          color="primary"
          component={Link} 
          to="/create-round"
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
      <Grid container spacing={{ xs: 2, md: 3 }} justify-content="space-between" >
        {/* Header Section */}
        <Grid item xs={12} sx={{ minWidth: { xs: 1, md: 570 } }}>
          <Box sx={{
                height: { xs: 'auto', md: 150 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' },
                padding: { xs: 1, md: 2 },
                gap: { xs: 2, md: 0 },
                backgroundColor: '#e6f7ff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
              }}>
            <Box>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' }, fontWeight: "bold" }} fontWeight="bold">
                Round {round.roundNumber}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(round.date).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} | Fixed: {round.fixedAmount}
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 250, width: { xs: '100%', md: 'auto' }, mt: { xs: 2, md: 0 } }} size="small">
              <InputLabel>Select Round</InputLabel>
              <Select
                value={selectedRound || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    // handleNewRound(); 
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
                <MenuItem value="new" component={Link} to="/create-round">
                  <Typography fontWeight="bold" onClick={() => handleNewRound()}>+ Create New Round</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={4} md={4} sx={{ minWidth: { xs: 1, md: 270 }}}>
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
                <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' }, fontWeight: "bold" }} fontWeight="bold" >
                  ₹{balance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4} sx={{ minWidth: { xs: 1, md: 270 }}}>
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
                <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' }, fontWeight: "bold" }} fontWeight="bold">
                  ₹{totalExpenses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4} sx={{ minWidth: { xs: 1, md: 270 }}}>
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
                <Typography variant="h5" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' }, fontWeight: "bold" }} fontWeight="bold">
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
        <Grid item xs={12} md={4} sx={{ minWidth: { xs: 1, md: 250 }}}>
          <Card elevation={3} sx={{ height: '100%', backgroundColor: '#e6f7ff', minWidth: { xs: 'auto', md: 380 }}} >
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
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
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
        <Grid item xs={12} md={8} sx={{ minWidth: { xs: 1, md: 1050 }}}>
          <Card elevation={3} sx={{ height: '100%',backgroundColor: '#e6f7ff' }}>
            <CardHeader
              title={`Member Payments for Round ${round.roundNumber}`}
              action={
                <Box display="flex" gap={1}>
                  <Button 
                    size={isMobile ? "small" : "medium"}
                    variant="outlined" 
                    onClick={() => navigate(`/paymentsList/${round.roundNumber}`)} 
                  >
                    Payments List
                  </Button>
                </Box>
              }
            />
            <CardContent sx={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} sx={{ maxHeight: 500, width: '100%', overflowX: 'auto' }}>
                <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center" sx={{width:"auto", whiteSpace: "nowrap"}}>Left to Pay</TableCell>
                      <TableCell align="center">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPayments.map((payment) => {
                      const member = members.find((m) => m.name === payment.member);
                      const balance = round.fixedAmount - payment.amount<0? 0 : round.fixedAmount - payment.amount; 
                      return (
                        <TableRow key={payment._id} hover>
                          <TableCell onClick={() => navigate(`/members/${member.name}/payments`)} style={{ cursor: 'pointer' }}>
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
                                fontSize: { xs: '0.75rem', md: '1rem' } ,
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

                         <TableCell align="center">
                            <TextField
                              value={payment.amount}
                              size="small"
                              sx={{ width: 120 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ₹
                                  </InputAdornment>
                                ),
                                inputProps: {
                                  min: 0,
                                  style: { textAlign: "right" }
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`₹${balance}`}
                              color={
                                balance === 0
                                  ? 'success'
                                  : balance === round.fixedAmount
                                  ? 'error'
                                  : 'warning'
                              }
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
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
        <Grid item xs={12} md={6} sx={{ minWidth: { xs: 1, md: 1 }}}>
          <Card elevation={3} sx={{ height: '100%', backgroundColor: '#e6f7ff' }}>
            <CardHeader
              title={`Expense Records for Round ${round.roundNumber}`}
              action={
                <Button size="small" variant="outlined" color="primary" onClick={() => navigate('/add-expense')}>
                  Add Expense
                </Button>
              }
            />
            <CardContent sx={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} sx={{ maxHeight: 500, width: '100%', overflowX: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="center" sx={{width:"auto", whiteSpace: "nowrap"}}>Amount Paid</TableCell>
                      <TableCell align="center" sx={{width:"auto", whiteSpace: "nowrap"}}>Balance Left</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {round.Expenses && round.Expenses.length > 0 ? (
                      round.Expenses.map((expense, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            <Chip
                              label={new Date(expense.date).toLocaleDateString('en-GB', {
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
                            <Chip label={`₹${expense.amount}`} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={`₹${expense.balanceLeft}`} color="error" size="small"/>
                          </TableCell>
                          <TableCell sx={{ minWidth: 275,whiteSpace: 'normal', wordBreak: 'break-word'}}>
                            {expense.description}
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
