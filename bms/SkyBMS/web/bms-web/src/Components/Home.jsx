import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaAddressBook, FaBuilding, FaHandshake } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthService from "../Services/auth.service";
import BuildingUnitService from "../Services/buildingUnit.service";
import LeaseService from "../Services/lease.service";
import TenantService from "../Services/tenant.service";
import UserService from "../Services/user.service";
import AppCurrentVisits from "./dashboard components/app-current-visits";
import AppWebsiteVisits from "./dashboard components/app-website-visits";
import AppWidgetSummary from "./dashboard components/app-widget-summary";

// Dummy data
const dummyRecentLeases = [
  { id: 1, tenantName: "John Doe", dueDate: "2024-08-15" },
  { id: 2, tenantName: "Jane Smith", dueDate: "2024-07-30" },
  { id: 3, tenantName: "Michael Johnson", dueDate: "2024-08-05" },
];

const dummyUpcomingMaintenance = [
  { id: 1, unitName: "Unit A", maintenanceDate: "2024-07-20" },
  { id: 2, unitName: "Unit B", maintenanceDate: "2024-07-25" },
  { id: 3, unitName: "Unit C", maintenanceDate: "2024-08-01" },
];

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || [];
  });
  const [totalBuildingUnits, setTotalBuildingUnits] = useState(0);
  const [totalAvailableUnits, setTotalAvailableUnits] = useState(0);
  const [totalOccupiedUnits, setTotalOccupiedUnits] = useState(0);

  const [totalTenants, setTotalTenants] = useState(0);
  const [totalLeases, setTotalLeases] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [pendingPayments, setPendingPayments] = useState();
  const [paidPayments, setPaidPayments] = useState();
  const [latePayments, setLatePayments] = useState();

  const [recentLeases, setRecentLeases] = useState(dummyRecentLeases);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState(
    dummyUpcomingMaintenance
  );

  // Sample data for charts (replace with your actual data)
  const barChartData = [
    { name: "January", sales: 65 },
    { name: "February", sales: 59 },
    { name: "March", sales: 80 },
    { name: "April", sales: 81 },
    { name: "May", sales: 56 },
  ];

  const lineChartData = [
    { name: "January", visitors: 65 },
    { name: "February", visitors: 59 },
    { name: "March", visitors: 80 },
    { name: "April", visitors: 81 },
    { name: "May", visitors: 56 },
  ];

  const pieChartData = [
    { name: "Red", value: 12 },
    { name: "Blue", value: 19 },
    { name: "Yellow", value: 3 },
    { name: "Green", value: 5 },
    { name: "Purple", value: 2 },
  ];

  const COLORS = ["#f44336", "#2196f3", "#ffeb3b", "#4caf50", "#9c27b0"];

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fetchBuildingUnitsCount = async () => {
    try {
      const count = await BuildingUnitService.getBuildingUnitsCount();
      setTotalBuildingUnits(count.total_count);
      setTotalAvailableUnits(count.available_count);
      setTotalOccupiedUnits(count.occupied_count);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchTenantCount = async () => {
    try {
      const count = await TenantService.getTenantCount();
      setTotalTenants(count);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchPendingPaymentsData = async () => {
    try {
      const data = await LeaseService.getPendingPaymentsByMonth();
      const sortedKeys = Object.keys(data).sort();
      const sortedData = {};
      sortedKeys.forEach((key) => {
        sortedData[key] = data[key];
      });
      const arrayData = Object.values(sortedData);
      const finalData = arrayData.length === 0 ? [] : arrayData;
      setPendingPayments(finalData);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchPaidPaymentsData = async () => {
    try {
      const data = await LeaseService.getPaidPaymentsByMonth();
      const sortedKeys = Object.keys(data).sort();
      const sortedData = {};
      sortedKeys.forEach((key) => {
        sortedData[key] = data[key];
      });
      const arrayData = Object.values(sortedData);
      const finalData = arrayData.length === 0 ? [] : arrayData;
      console.log(finalData);
      setPaidPayments(finalData);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchLatePaymentsData = async () => {
    try {
      const data = await LeaseService.getLatePaymentsByMonth();
      const sortedKeys = Object.keys(data).sort();
      const sortedData = {};
      sortedKeys.forEach((key) => {
        sortedData[key] = data[key];
      });
      const arrayData = Object.values(sortedData);
      const finalData = arrayData.length === 0 ? [] : arrayData;
      setLatePayments(finalData);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchLeaseData = async () => {
    try {
      const count = await LeaseService.getLeaseCount();
      setTotalLeases(count.count);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const count = await UserService.getUserCount();
      setTotalUsers(count);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const fetchUpcomingMaintenance = async () => {
    // try {
    //   const maintenance = await BuildingUnitService.getUpcomingMaintenance(); // Example function to fetch upcoming maintenance
    //   setUpcomingMaintenance(maintenance);
    // } catch (error) {
    //   handleFetchError(error);
    // }
  };
  const handleFetchError = (error) => {
    console.error("Error fetching data:", error);
    const newState = { vertical: "bottom", horizontal: "center" };
    setState({ ...newState, open: true });
    setSuccessMessage(null);
    setError(error.response ? error.response.data.message : error.message);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = AuthService.isLoggedIn();
      if (!loggedIn) {
        navigate("/login");
      }
    };
    checkLoggedIn();
  }, [navigate]);

  function generateLabels() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const labels = [];

    // Generate labels for the past 11 months from the current month
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i); // Subtracting months to get previous months

      // Format the date as YYYY-MM-DD
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-01`;
      labels.push(formattedDate);
    }

    return labels;
  }

  const labels = generateLabels();

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  useEffect(() => {
    fetchUserData();
    fetchBuildingUnitsCount();
    fetchTenantCount();
    fetchLeaseData();
    fetchUpcomingMaintenance();
    fetchPendingPaymentsData();
    fetchPaidPaymentsData();
    fetchLatePaymentsData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Helmet>
        <title>SkyBMS - {t("title.dashboard")}</title>
      </Helmet>
      <Typography variant="h5" sx={{ mb: 5, mt: 5, color: "#909aab" }}>
        {t("home.welcome")} 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t("home.totalUsers")}
            total={totalUsers}
            color="success"
            icon={<FiUsers fontSize={40} color="gray" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t("home.totalBuildingUnits")}
            total={totalBuildingUnits}
            color="info"
            icon={<FaBuilding fontSize={40} color="gray" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t("home.totalTenants")}
            total={totalTenants}
            color="warning"
            icon={<FaAddressBook fontSize={40} color="gray" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t("home.totalLeases")}
            total={totalLeases}
            color="error"
            icon={<FaHandshake fontSize={40} color="gray" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title={t("home.paymentInfo")}
            chart={{
              labels: labels,
              series: [
                {
                  name: t("home.paid"),
                  type: "column",
                  fill: "solid",
                  data: paidPayments,
                },
                {
                  name: t("home.pending"),
                  type: "column",
                  fill: "solid",
                  data: pendingPayments,
                },
                {
                  name: t("home.late"),
                  type: "line",
                  fill: "solid",
                  data: latePayments,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title={t("home.buildingUnitStatistics")}
            chart={{
              series: [
                { label: t("home.availableUnits"), value: totalAvailableUnits },
                { label: t("home.occupiedUnits"), value: totalOccupiedUnits },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: "Italy", value: 400 },
                { label: "Japan", value: 430 },
                { label: "China", value: 448 },
                { label: "Canada", value: 470 },
                { label: "France", value: 540 },
                { label: "Germany", value: 580 },
                { label: "South Korea", value: 690 },
                { label: "Netherlands", value: 1100 },
                { label: "United States", value: 1200 },
                { label: "United Kingdom", value: 1380 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: [
                "English",
                "History",
                "Physics",
                "Geography",
                "Chinese",
                "Math",
              ],
              series: [
                { name: "Series 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Series 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Series 3", data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: "FaceBook",
                value: 323234,
                // icon: (
                //   <Iconify
                //     icon="eva:facebook-fill"
                //     color="#1877F2"
                //     width={32}
                //   />
                // ),
              },
              {
                name: "Google",
                value: 341212,
                // icon: (
                //   <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />
                // ),
              },
              {
                name: "Linkedin",
                value: 411213,
                // icon: (
                //   <Iconify
                //     icon="eva:linkedin-fill"
                //     color="#006097"
                //     width={32}
                //   />
                // ),
              },
              {
                name: "Twitter",
                value: 443232,
                // icon: (
                //   <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />
                // ),
              },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}

export default Home;
