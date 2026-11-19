import { Button, Container, TextField, Typography } from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Assets/New-Financial-Service-Code.jpg";
import AuthService from "../Services/auth.service";

const RegisterForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await AuthService.register(formData);

      if (response.status === 201) {
        setError(null);
        setSuccessMessage(response.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Helmet>
        <title>SkyBMS - {t("title.resetPassword")}</title>
      </Helmet>
      <div
        className="absolute top-0 right-0 bottom-0 w-full max-w-xl bg-slate-300 bg-opacity-50 flex justify-center items-center"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <Container maxWidth="xs">
          <div className="bg-white p-8 rounded-md w-full max-w-lg my-custom-div">
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <TextField
                className="mb-4 px-4 py-2 rounded border border-gray-300"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                autoFocus
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="bg-blue-900 text-white py-4 px-10 rounded hover:bg-blue-600 transition-all duration-200 self-stretch mt-4"
              >
                Reset Password
              </Button>

              <div className="flex items-center my-10 gap-4">
                <Typography>Remember your password? </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  className="cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Sign In
                </Typography>
              </div>
            </form>
          </div>
          {successMessage && (
            <Box sx={{ width: 500 }}>
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                autoHideDuration={2000}
                key={vertical + horizontal}
              >
                <MuiAlert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {successMessage}
                </MuiAlert>
              </Snackbar>
            </Box>
          )}

          {error && (
            <Box sx={{ width: 500 }}>
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                autoHideDuration={2000}
                key={vertical + horizontal}
              >
                <MuiAlert
                  onClose={handleClose}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {error}
                </MuiAlert>
              </Snackbar>
            </Box>
          )}
        </Container>
      </div>
    </div>
  );
};
export default RegisterForm;
