import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUsers } from "../context/UsersContext";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = ({setAccessCode, setAdmin}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { forgotPassword, verifyOtp, resetPassword, loginUser } = useUsers();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    theme: "colored",
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      toast.success(result.message || "OTP sent to your email", toastOptions);
      setLoading(false);
      setStep(2);
    } else {
        setLoading(false);
      toast.error(result.message || "Failed to send OTP", toastOptions);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyOtp(email, otp);
    if (result.success) {
      toast.success("OTP verified successfully!", toastOptions);
        setLoading(false);
      setStep(3);
    } else {
        setLoading(false);
        toast.error(result.message || "Invalid OTP", toastOptions);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await resetPassword(email, otp, newPassword);
    if (result.success) {
      setLoading(false);
      toast.success("Password reset successfully!", toastOptions);
      const user = await loginUser(email, newPassword);
        if (user) {
            setAccessCode(user.AccessCode);
            setAdmin(user.Admin);
            setEmail("");
            setOtp("");
            setNewPassword("");
            navigate("/");
        }
        else {
            toast.error("Invalid Credentials", toastOptions);
        }
    } else {
      setLoading(false);
      toast.error(result.message || "Failed to reset password", toastOptions);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 24, marginTop: 40 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        {step === 1 && (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Enter your registered email to receive a password reset OTP.
            </Typography>
            <Box component="form" onSubmit={handleSendOtp}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                style={{ marginTop: 20 }}
              >
                {loading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Enter the OTP sent to your email.
            </Typography>
            <Box component="form" onSubmit={handleVerifyOtp}>
              <TextField
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                style={{ marginTop: 20 }}
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>
            </Box>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Enter your new password.
            </Typography>
            <Box component="form" onSubmit={handleResetPassword}>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                style={{ marginTop: 20 }}
              >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default ForgotPasswordPage;
