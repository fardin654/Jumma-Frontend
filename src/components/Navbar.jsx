import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';

// Import Icons for the menu
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';


const Navbar = ({ AccessCode, Admin, setAccessCode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed to 'md' for better tablet support
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // --- Data-Driven Navigation Links ---
  // This makes adding/removing/hiding links much easier
  const navLinks = [
    { text: 'Rounds', to: '/rounds', icon: <AccountTreeIcon />, requiresAuth: true },
    { text: 'Requests', to: '/requests', icon: <RuleFolderIcon />, adminOnly: true },
    { text: 'Contacts', to: '/auto-contact', icon: <ContactPageIcon /> },
    { text: 'Members', to: '/members', icon: <PeopleIcon /> },
    { text: 'Add Member', to: '/add-member', icon: <AddCircleOutlineIcon /> },
    { text: 'Add Payment', to: '/add-payment', icon: <PaymentIcon /> },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    handleMenuClose();
    setAccessCode(null);
    navigate("/authenticate");
  };

  // --- Style for Active NavLink ---
  const activeLinkStyle = {
    backgroundColor: theme.palette.action.selected,
    fontWeight: 600,
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{
      backgroundColor: 'background.paper',
      color: 'text.primary',
    }}>
      <Toolbar sx={{
        maxWidth: 'xl',
        width: '95%',
        mx: 'auto',
        px: { xs: 1, sm: 3 }
      }}>
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}>
          <TravelExploreIcon sx={{
            mr: 1,
            color: theme.palette.primary.main,
            fontSize: { xs: '1.8rem', sm: '2rem' }
          }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            PayCircle
          </Typography>
        </Box>

        {/* --- Desktop Navigation --- */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => {
              // Conditional rendering logic
              if (link.requiresAuth && !AccessCode) return null;
              if (link.adminOnly && Admin !== "YES") return null;

              return (
                <Button
                  key={link.text}
                  component={NavLink}
                  to={link.to}
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  sx={{ color: 'text.primary', textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
                >
                  {link.text}
                </Button>
              );
            })}

            {AccessCode && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
                <IconButton onClick={handleLogout} title="Log Out" color="error">
                  <LogoutIcon />
                </IconButton>
              </>
            )}
          </Box>
        ) : (
          /* --- Mobile Navigation --- */
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
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
                  minWidth: 220,
                  borderRadius: 2,
                  boxShadow: '0px 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              {navLinks.map((link) => {
                 if (link.requiresAuth && !AccessCode) return null;
                 if (link.adminOnly && Admin !== "YES") return null;

                return (
                  <MenuItem
                    key={link.text}
                    component={NavLink}
                    to={link.to}
                    onClick={handleMenuClose}
                     style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  >
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText>{link.text}</ListItemText>
                  </MenuItem>
                );
              })}

              {AccessCode && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Log Out</ListItemText>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;