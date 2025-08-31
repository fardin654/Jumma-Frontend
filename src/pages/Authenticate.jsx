import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useUsers } from '../context/UsersContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthenticationPage = ({setAccessCode, setAdmin, AccessCode}) => {
  const [mode, setMode] = useState('view');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [temp, setTemp] = useState(null);
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

  const { 
    registerUser, 
    loginUser,
    EnterByAccessCode, 
    currentUser, 
    logoutUser, 
    loading, 
    error,
    clearError 
  } = useUsers();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    accessCode: ''
  });

  // View form state
  const [filteredUsers, setFilteredUsers] = useState([]);

  const navigate = useNavigate();

  // Clear errors when mode changes
  useEffect(() => {
    setMessage({ type: '', text: '' });
  }, [mode]);

  // Show context error as message
  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: error });
    }
  }, [error]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setMessage({ type: '', text: '' });
      clearError();
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(loginData.username, loginData.password);
      if (user) {
        setAccessCode(user.AccessCode);
        setAdmin(user.Admin);
        navigate("/");
      }
      if(error){
        toast.error(message.text, toastOptions);
      }
    } catch (err) {
      toast.error("Login failed", toastOptions);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(registerData.username, registerData.email, registerData.password, registerData.accessCode);
      if (result.success) {
        setAccessCode(registerData.accessCode);
        setAdmin("YES");
        navigate("/");
      } else {
        toast.error(result.error, toastOptions);
      }
    } catch (err) {
      toast.error("Registration failed", toastOptions);
    }
  };

  const handleViewSubmit = (e) => {
    e.preventDefault();
    try{
      setAccessCode(temp);
      EnterByAccessCode(temp);
      if(error){
        toast.error(message.text, toastOptions);
      }
    } catch(err){
      toast.error("Error fetching user by access code", toastOptions);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setMessage({ type: 'success', text: 'You have been logged out' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 24, marginTop: 20 }}>
        {/* User status */}
        {currentUser && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">
              Logged in as: <strong>{currentUser.username}</strong>
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}

        {/* Mode Toggle */}
        <Box display="flex" justifyContent="center" mb={3}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="authentication mode"
          >
            <ToggleButton value="view" aria-label="view">
              View
            </ToggleButton>
            <ToggleButton value="login" aria-label="login">
              Login
            </ToggleButton>
            <ToggleButton value="register" aria-label="register">
              Register
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Login Section */}
        {mode === 'login' && (
          <Box component="form" onSubmit={handleLoginSubmit}>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <TextField
              label="Username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={loginData.password}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              style={{ marginTop: 20 }}
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        )}

        {/* Register Section */}
        {mode === 'register' && (
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <Typography variant="h5" gutterBottom>
              Register New Account
            </Typography>
            <TextField
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={registerData.password}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Access Code"
              name="accessCode"
              value={registerData.accessCode}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              style={{ marginTop: 20 }}
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        )}

        {/* View Section */}
        {mode === 'view' && (
          <Box component="form" onSubmit={handleViewSubmit}>
            <Typography variant="h5" gutterBottom>
              View by Access Code
            </Typography>
            <TextField
              label="Access Code"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              fullWidth
              margin="normal"
              disabled = {loading}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              style={{ marginTop: 20, marginBottom: 20 }}
              disabled = {loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24}/> : "Enter"}
            </Button>

            {filteredUsers.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Users with Access Code: {AccessCode}
                </Typography>
                <List>
                  {filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={user.username}
                          secondary={
                            <>
                              <Typography variant="body2" color="text.primary">
                                Email: {user.email}
                              </Typography>
                              <Typography variant="body2" color="text.primary">
                                Registered: {new Date(user.createdAt).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < filteredUsers.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default AuthenticationPage;