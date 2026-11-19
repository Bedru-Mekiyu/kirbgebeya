import { Container, CssBaseline, Grid, Typography } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import Box from "@mui/material/Box"; // Import Box from Material-UI
import React, { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Building from "./Components/Building";
import BuildingUnit from "./Components/BuildingUnit";
import Business from "./Components/Business";
import ForgotPasswordForm from "./Components/ForgotPasswordForm";
import Home from "./Components/Home";
import LandingPage from "./Components/LandingPage";
import Lease from "./Components/Lease";
import LoginForm from "./Components/Login";
import MaintenanceContractors from "./Components/MaintenanceContractors";
import MaintenanceRequest from "./Components/MaintenanceRequest";
import MaintenanceWorkOrders from "./Components/MaintenanceWorkOrders";
import Navbar from "./Components/Navbar";
import NoInternetPage from "./Components/NoInternetPage";
import NotFoundPage from "./Components/NotFound";
import Payment from "./Components/Payment";
import RegisterForm from "./Components/Registration";
import FinancialReport from "./Components/report components/FinancialReport";
import LeaseExpiryReport from "./Components/report components/LeaseExpiryReport";
import MaintenanceRequestReport from "./Components/report components/MaintenanceRequestReport";
import TenantInformationReport from "./Components/report components/TenantInformationReport";
import Role from "./Components/Roles";
import Sidebar from "./Components/Sidebar";
import Tenant from "./Components/Tenant";
import User from "./Components/user managment/Users";
import UserHome from "./Components/UserHome";
const App = () => {
  const [sideMenuIsExpand, setSideMenuIsExpand] = useState(true);
  return (
    <>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route exact path="/home/*" element={<MainRoutes />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/user/home" element={<UserHome />} />
            <Route exact path="/registration" element={<RegisterForm />} />
            <Route
              exact
              path="/forgot-password"
              element={<ForgotPasswordForm />}
            />
            <Route component={NotFoundPage} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
};
const MainRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth >= 1280 ? true : false
  );
  const [activeComponent, setActiveComponent] = useState("home");
  const [value, setValue] = useState(0);
  const [sideMenuIsExpand, setSideMenuIsExpand] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const switchComponent = (component) => {
    setActiveComponent(component);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar onMenuClick={toggleSidebar} className="bg-slate-50" />
      <Grid container className="bg-slate-50">
        <Grid item md={isSidebarOpen ? 3 : 1} lg={isSidebarOpen ? 2 : 1}>
          <div
            className={` ${
              isSidebarOpen
                ? "h-screen border-r fixed shadow-sm z-10"
                : "hidden"
            }`}
          >
            <Sidebar setExpand={setIsSidebarOpen} />
          </div>
        </Grid>
        <Grid item md={9} lg={10} xl={10} className="flex flex-col bg-slate-50">
          <Container
            maxWidth="auto"
            className="overflow-auto h-full pb-72 bg-slate-50 flex-grow"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/building" element={<Building />} />
              <Route path="/buildingUnit" element={<BuildingUnit />} />
              <Route path="/business" element={<Business />} />
              <Route path="/tenant" element={<Tenant />} />
              <Route path="/leases" element={<Lease />} />
              <Route path="/noInternet" element={<NoInternetPage />} />
              <Route path="/users" element={<User />} />
              <Route path="/roles" element={<Role />} />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/maintenance/request"
                element={<MaintenanceRequest />}
              />
              <Route
                path="/maintenance/contractors"
                element={<MaintenanceContractors />}
              />
              <Route
                path="/maintenance/work-orders"
                element={<MaintenanceWorkOrders />}
              />
              <Route
                path="/reports/tenant-information-report"
                element={<TenantInformationReport />}
              />
              <Route
                path="/reports/maintenance-request-report"
                element={<MaintenanceRequestReport />}
              />
              <Route
                path="/reports/financial-report"
                element={<FinancialReport />}
              />
              <Route
                path="/reports/lease-expiry-report"
                element={<LeaseExpiryReport />}
              />
            </Routes>
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                sx={{ bgcolor: "#f9fafc" }}
                className=" py-4 z-0 "
              >
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
                  </Container>
                </footer>
                {/* <footer>
                  <Container maxWidth="lg">
                    <Typography
                      variant="body2"
                      align="center"
                      color="textSecondary"
                    >
                      &copy; {new Date().getFullYear()} Jabulani Mehal Merkato
                      PLC. All rights reserved. Powered by{" "}
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
                  </Container>
                </footer> */}
              </BottomNavigation>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default App;
