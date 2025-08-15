import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" elevation={1} sx={{ 
      backgroundColor: 'background.paper',
      color: 'text.primary',
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Toolbar sx={{ 
        maxWidth: 'xl',
        mx: 'auto',
        width: '100%',
        px: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit'
        }} component={Link} to="/">
          <TravelExploreIcon sx={{ 
            mr: 1, 
            color: theme.palette.primary.main,
            fontSize: '2rem'
          }} />
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 700,
            letterSpacing: 0.5,
            display: { xs: 'none', sm: 'block' }
          }}>
            Jumma Expense
          </Typography>
        </Box>

        <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.3, sm: 1.5 }, 
            mr: { xs: 2.5, sm: 4 } // slight negative right margin
          }}>
          <Button 
            component={Link} 
            to="/"
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/members"
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            {isMobile ? 'Members' : 'Member List'}
          </Button>
          <Button 
            component={Link} 
            to="/add-member"
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            {isMobile ? 'Member' : 'Add Member'}
          </Button>
          <Button 
            component={Link} 
            to="/add-payment"
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            {isMobile ? 'Payment' : 'Add Payment'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;