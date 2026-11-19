// NotFound.js
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(8),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h2" className={classes.title}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Go Back to Home
      </Button>
    </div>
  );
}

export default NotFound;
