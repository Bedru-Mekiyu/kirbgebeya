import WifiOffIcon from "@mui/icons-material/WifiOff";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const NoInternetPage = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setOnline(navigator.onLine);
    }, 2000); // Simulate retrying connection for 2 seconds
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <WifiOffIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h4" gutterBottom>
          No Internet Connection
        </Typography>
        {!retrying ? (
          <Typography variant="body1">
            Please check your internet connection and try again.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body1">Retrying...</Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleRetry}
          disabled={retrying}
          sx={{ mt: 4 }}
        >
          Retry Connection
        </Button>
      </Box>
    </Container>
  );
};

export default NoInternetPage;
