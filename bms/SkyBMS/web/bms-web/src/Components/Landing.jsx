import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom"; // Assuming you are using React Router

import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  hero: {
    color: theme.palette.common.black,
    padding: theme.spacing(8, 0),
    textAlign: "center",
    backgroundImage: `linear-gradient(45deg, #e0e0e0, #f5f5f5)`, // Initial gradient
  },

  section: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0),
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(4),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  footer: {
    background: `linear-gradient(45deg, #d7ccc8, #efebe9)`, // Lighter brown to even lighter brown gradient
    color: theme.palette.common.black,
    padding: theme.spacing(4, 0),
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
}));

function BuildingAdminSystem() {
  const classes = useStyles();

  // Dummy data for features
  const features = [
    {
      title: "Building Management",
      description: "Add, edit, and manage building details.",
    },
    {
      title: "Unit Management",
      description: "Maintain details of building units and their statuses.",
    },
    {
      title: "Lease Management",
      description: "Track lease agreements and their terms.",
    },
    {
      title: "Financial Management",
      description: "Monitor financial transactions and expenses.",
    },
    {
      title: "Tenant Management",
      description: "Manage tenant information and communications.",
    },
  ];

  // Dummy data for common IT services with details
  const commonITServices = [
    {
      title: "Software Development",
      description:
        "We provide custom software solutions tailored to your business needs. Our team of developers uses the latest technologies to create scalable and efficient applications.",
    },
    {
      title: "Network Installation",
      description:
        "Our experts design and implement robust network infrastructures that ensure reliable connectivity and seamless communication across your organization.",
    },
    {
      title: "Security Camera Installation",
      description:
        "We specialize in installing advanced security camera systems to enhance safety and surveillance capabilities in residential and commercial properties.",
    },
    {
      title: "IT Consulting",
      description:
        "Our experienced consultants offer strategic IT guidance to help you optimize technology investments and achieve your business objectives.",
    },
    {
      title: "Data Backup Solutions",
      description:
        "We provide secure and automated data backup solutions to safeguard your critical business data against unforeseen events and ensure business continuity.",
    },
    {
      title: "Cloud Services",
      description:
        "We offer comprehensive cloud computing solutions, including migration, management, and optimization services, to maximize efficiency and scalability.",
    },
  ];

  // Dummy customer testimonials
  const testimonials = [
    {
      quote:
        "The building management system provided by Skylink Tech has significantly improved our operational efficiency.",
      author: "John Doe",
    },
    {
      quote:
        "Their customer service is excellent, always responsive and helpful.",
      author: "Jane Smith",
    },
    {
      quote:
        "We are very satisfied with the financial management tools they offer.",
      author: "David Brown",
    },
  ];

  // Dummy function to handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Replace with actual logic to handle form submission
    console.log("Contact form submitted!");
  };

  return (
    <div>
      <main>
        {/* Hero unit */}
        <Paper className={classes.hero} square>
          <Container maxWidth="md">
            <Typography component="h1" variant="h2" gutterBottom>
              Building Administration System
            </Typography>
            <Typography variant="h5" paragraph>
              Manage your buildings, units, leases, finances, and tenants with
              ease.
            </Typography>
            <div className="flex justify-center gap-4 mt-8">
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="primary"
              >
                Sign In
              </Button>
            </div>
          </Container>
        </Paper>

        {/* Customer Satisfaction section */}
        <Paper className={classes.section} square>
          <Container maxWidth="md">
            <Typography component="h2" variant="h4" gutterBottom>
              Customer Satisfaction
            </Typography>
            <Grid container spacing={4} justify="center">
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper className={classes.paper}>
                    <Typography variant="body1">
                      "{testimonial.quote}"
                    </Typography>
                    <Typography variant="h6" align="right">
                      - {testimonial.author}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Paper>

        {/* About Us section */}
        <Paper className={classes.hero} square>
          <Container maxWidth="md">
            <Typography component="h2" variant="h4" gutterBottom>
              About Skylink Tech
            </Typography>
            <Typography variant="body1" paragraph>
              Skylink Tech is a leading provider of technology solutions,
              specializing in:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Software Development:</strong> We develop tailored
              software solutions to meet your business needs.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Network Installation:</strong> Our experts design and
              implement robust network infrastructures.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Security Camera Installation:</strong> We install advanced
              security camera systems for enhanced safety and surveillance.
            </Typography>
            <Typography variant="body1" paragraph>
              In addition to these core services, we offer a range of IT
              consulting and support services to ensure your technology operates
              efficiently and securely.
            </Typography>
          </Container>
        </Paper>

        {/* Key Features section */}
        <Paper className={classes.section} square>
          <Container maxWidth="md">
            <Typography component="h2" variant="h4" gutterBottom>
              Key Features
            </Typography>
            <Grid container spacing={4} justify="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Paper>

        {/* Common IT Services section */}
        <Paper className={classes.section} square>
          <Container maxWidth="md">
            <Typography component="h2" variant="h4" gutterBottom>
              Common IT Services
            </Typography>
            <Grid container spacing={4} justify="center">
              {commonITServices.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body1">
                      {service.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Paper>

        {/* Contact section */}
        <Paper className={classes.section} square>
          <Container maxWidth="md">
            <Typography component="h2" variant="h4" gutterBottom>
              Contact Us
            </Typography>
            <div className="mt-8">
              <form onSubmit={handleContactSubmit}>
                <Grid container spacing={2} justify="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="fullName"
                      label="Full Name"
                      name="fullName"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      rows={4}
                      id="message"
                      label="Message"
                      name="message"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </Paper>

        {/* Footer section */}
        <Paper className={classes.footer} square>
          <Container maxWidth="md">
            <Typography variant="body1">
              &copy; {new Date().getFullYear()} Skylink. All rights reserved.
            </Typography>
          </Container>
        </Paper>
      </main>
    </div>
  );
}

export default BuildingAdminSystem;
