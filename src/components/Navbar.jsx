import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            display: { xs: 'block', sm: 'block' }
          }}>
            Jumma Expense
          </Typography>
        </Box>

        {!isMobile ? (
          // Desktop view - buttons visible
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.3, sm: 1.5 }, 
            mr: { xs: 2.5, sm: 4 } 
          }}>
            <Button 
              component={Link} 
              to="/auto-contact"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              Contacts
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
              Members
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
              Add Member
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
              Add Payment
            </Button>
          </Box>
        ) : (
          // Mobile view - menu icon
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ ml: 0, mr: 3 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  mr: 3,
                }
              }}
            >
              <MenuItem 
                component={Link} 
                to="/auto-contact"
                onClick={handleMenuClose}
              >
                Contacts
              </MenuItem>
              <Divider />
              <MenuItem 
                component={Link} 
                to="/members"
                onClick={handleMenuClose}
              >
                Members
              </MenuItem>
              <Divider />
              <MenuItem 
                component={Link} 
                to="/add-member"
                onClick={handleMenuClose}
              >
                Add Member
              </MenuItem>
              <Divider />
              <MenuItem 
                component={Link} 
                to="/add-payment"
                onClick={handleMenuClose}
              >
                Add Payment
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;