import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import backgroundImage from "../Assets/New-Financial-Service-Code.jpg";

import ClipLoader from "react-spinners/ClipLoader";

import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthService from "../Services/auth.service";
import {
  setIsLoggedIn,
  setLoading,
  setMessage,
  setPassword,
  setUserName,
} from "../redux/actions";

const LoginForm = (props) => {
  const { t } = useTranslation();
  const {
    userName,
    password,
    loading,
    message,
    isLoggedIn,
    setUserName,
    setPassword,
    setLoading,
    setMessage,
    setIsLoggedIn,
  } = props;
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const userData = await AuthService.login(userName, password);

      if (userData.status === 200) {
        // Check if user has admin role
        const isAdmin = userData.data.roles.includes("admin");
        if (isAdmin) {
          localStorage.setItem("user", JSON.stringify(userData.data));
          setIsLoggedIn(true);
          // Redirect to admin dashboard
          navigate("/home");
        } else {
          localStorage.setItem("regularuser", JSON.stringify(userData.data));
          // Redirect to regular user home page
          navigate("/user/home");
        }
      }

      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Invalid username or password.");
        } else {
          setMessage(
            error.response.data.message || "An unexpected error occurred."
          );
        }
      } else if (error.request) {
        setMessage("Network error. Please check your internet connection.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }

      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  // useEffect(() => {
  //   const checkLoggedIn = async () => {
  //     const loggedIn = AuthService.isLoggedIn();
  //     setIsLoggedIn(loggedIn);
  //   };
  //   checkLoggedIn();
  //   if (isLoggedIn) {
  //     navigate("/home");
  //   }
  // }, [isLoggedIn]);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <Helmet>
        <title>SkyBMS - {t("title.login")}</title>
      </Helmet>
      <div
        className="absolute top-0 right-0 bottom-0 w-full max-w-xl bg-slate-300 bg-opacity-50 flex justify-center items-center"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="bg-white p-8 rounded-md w-full max-w-lg ">
          <Container maxWidth="xs">
            <div className="bg-white py-6 rounded-md w-full max-w-lg ">
              <Typography
                component="h1"
                variant="h5"
                align="center"
                gutterBottom
              >
                SkyBMS Login
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
                  id="user_name"
                  label="User Name"
                  name="user_name"
                  autoComplete="user_name"
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                  className="mb-4 px-4 py-2 rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember Me"
                  className="mr-4"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="bg-blue-900 text-white py-4 px-10 rounded hover:bg-blue-600 transition-all duration-200 self-stretch mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader
                      color="#3182CE"
                      loading={loading}
                      data-testid="loader"
                      size={30}
                    />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="flex items-center my-4 gap-4">
                  <Typography
                    variant="body2"
                    color="primary"
                    className="cursor-pointer"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot Password
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    className="cursor-pointer"
                  >
                    Need help? Contact Support
                  </Typography>
                </div>
              </form>
            </div>
            {message && (
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
                    {message}
                  </MuiAlert>
                </Snackbar>
              </Box>
            )}
            <footer>
              <Container maxWidth="lg">
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                >
                  &copy; {new Date().getFullYear()} All rights reserved{" "}
                  <a
                    href="https://skylinkict.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    skylinkict
                  </a>
                  .
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                >
                  SkyBMS is a specialized Building Management System providing
                  comprehensive control and monitoring solutions for efficient
                  building operations.
                </Typography>
              </Container>
            </footer>
          </Container>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  userName: state.auth.userName,
  password: state.auth.password,
  loading: state.auth.loading,
  message: state.auth.message,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
  setUserName: (userName) => dispatch(setUserName(userName)),
  setPassword: (password) => dispatch(setPassword(password)),
  setLoading: (loading) => dispatch(setLoading(loading)),
  setMessage: (message) => dispatch(setMessage(message)),
  setIsLoggedIn: (isLoggedIn) => dispatch(setIsLoggedIn(isLoggedIn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
