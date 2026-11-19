import { Container, CssBaseline, Grid, Typography } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import Building from "./Building";
import BuildingUnit from "./BuildingUnit";
import Business from "./Business";
import Home from "./Home";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainContainer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("home");
  const [value, setValue] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const switchComponent = (component) => {
    setActiveComponent(component);
  };

  // Function to render active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <Home />;
      case "maintenance":
        return <Home />;
      case "business":
        return <Business />;
      case "tenant":
        return <Home />;
      case "building":
        return <Building />;
      case "buildingUnit":
        return <BuildingUnit />;
      case "leases":
        return <Home />;
      case "payment":
        return <Home />;
      default:
        return null; // Default to null or fallback component
    }
  };

  return (
    <>
      <CssBaseline />
      <Navbar onMenuClick={toggleSidebar} />
      <Grid container>
        <Grid item md={isSidebarOpen ? 3 : 0} lg={isSidebarOpen ? 2 : 0}>
          <div
            className={` ${
              isSidebarOpen
                ? "h-screen border-r fixed shadow-sm lg:w-64"
                : "hidden lg:block"
            }`}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
              switchComponent={switchComponent}
              activeComponent={activeComponent}
            />
          </div>
        </Grid>
        <Grid item md={9} lg={10} className="flex">
          <Container maxWidth="lg" className="overflow-auto h-fit py-16">
            {renderActiveComponent()}
            <Paper
              sx={{ position: "fixed", bottom: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                className="bg-gray-200 py-4"
              >
                <footer>
                  <Container maxWidth="lg">
                    <Typography
                      variant="body2"
                      align="center"
                      color="textSecondary"
                    >
                      &copy; {new Date().getFullYear()} Skylink. All rights
                      reserved.
                    </Typography>
                  </Container>
                </footer>
              </BottomNavigation>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default MainContainer;
