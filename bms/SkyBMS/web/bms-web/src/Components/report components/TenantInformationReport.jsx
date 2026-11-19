import DownloadIcon from "@mui/icons-material/Download";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import buildingService from "../../Services/building.service";
import buildingUnitService from "../../Services/buildingUnit.service";
import TenantReportService from "../../Services/tenantReport.service";

const TenantInformationReport = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFloor, setSelectedFloor] = useState("");
  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };
  const [perPage, setPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredData, setFilteredData] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const openButton = Boolean(anchorEl);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildingLoading, setBuildingLoading] = useState(true);
  const [buildings, setBuildings] = useState([]);
  const [buildingUnits, setBuildingUnits] = useState([]);

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuildingSelect = (event) => {
    setSelectedBuilding(event.target.value);
    setSelectedFloor("");
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor === "All" ? "" : floor);
  };

  const fetchTenantReport = async (status, selectedBuilding, selectedFloor) => {
    try {
      setLoading(true);
      const tenantReport = await TenantReportService.getAllReports({
        payment_status: status,
        building_id: selectedBuilding,
        floor_no: selectedFloor,
      });
      const sortedRequests = tenantReport.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else {
          return 1;
        }
      });
      setFilteredData(sortedRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchBuildingUnits = async () => {
    setLoading(true);
    try {
      const units = await buildingUnitService.getAllBuildingUnits(
        `building_id=${selectedBuilding}&floor_no=${selectedFloor}`
      );
      console.log(units);
      const sortedResponse = units.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      console.log("sorted units : ", sortedResponse);

      setBuildingUnits(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching building units:", error);
      setSnackbarMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      setBuildingLoading(true);
      const buildings = await buildingService.getAllBuildings();
      const sortedResponse = buildings.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      setTimeout(() => {
        setBuildings(sortedResponse);
        setBuildingLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const visibleRows = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClose = () => {
    setAnchorEl(null);
  };

  const handleExportToExcel = () => {
    const date = new Date();
    const formattedDate = `${date.toISOString().slice(0, 10)}`;
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const filename = `Tenant_Information_Report_${formattedDate}_${formattedTime}.xlsx`;
    const ws = XLSX.utils.json_to_sheet(
      filteredData?.flatMap((report) =>
        report.payments.map((payment) => ({
          Num: report.id,
          BusinessName: report.tenant_business_name,
          PhoneNumber: report.tenant_business_phone_number,
          OwnerName: report.tenant_name,
          BuildingUnit: report.building_unit_number,
          MonthlyRent: report.monthly_rent,
          TotalPayment: payment.total_payment,
          Status: payment.status,
        }))
      )
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tenant_Information_Report");
    XLSX.writeFile(wb, filename);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const pageURL = window.location.href;
    const date = new Date();

    const formattedDate = `${date.toISOString().slice(0, 10)}`;
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const filename = `Tenant_Information_Report_${formattedDate}_${formattedTime}.pdf`;

    doc.setFontSize(18);
    doc.text("Tenant Information Report", 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "No",
          "Business Name",
          "Phone Number",
          "Owner Name",
          "Building Unit",
          "Monthly Rent",
          "Total Payment",
          "Status",
        ],
      ],
      body: filteredData?.flatMap((report) =>
        report.payments.map((payment) => [
          report.id,
          report.tenant_business_name,
          report.tenant_business_phone_number,
          report.tenant_name,
          report.building_unit_number,
          report.monthly_rent,
          payment.total_payment,
          payment.status,
        ])
      ),
      didDrawPage: (data) => {
        const { doc, pageCount } = data;
        const footerY = doc.internal.pageSize.height - 10;
        const marginLeft = data.settings.margin.left;

        doc.setFontSize(10);
        doc.text(
          `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          marginLeft,
          footerY - 10
        );

        doc.text(`Page URL: ${pageURL}`, marginLeft, footerY - 5);

        const pageNumberX =
          doc.internal.pageSize.width - data.settings.margin.right;
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageNumberX,
          footerY - 7,
          { align: "right" }
        );
      },
    });

    doc.save(filename);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; } h1 { text-align: center; } p { text-align: center; margin-top: 20px; font-size: 12px; }</style>"
    );
    printWindow.document.write("</head><body >");
    printWindow.document.write(
      `<h1>${t("tenantInformationReport.reportTitle")}</h1>`
    ); // Title
    printWindow.document.write(document.querySelector("table").outerHTML); // Print only the table
    printWindow.document.write("<p>Page URL: " + window.location.href + "</p>"); // URL in footer
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    fetchTenantReport(statusFilter, selectedBuilding, selectedFloor);
    fetchBuildingUnits();
    fetchBuildings();
  }, [statusFilter, selectedBuilding, selectedFloor]);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.tenantInformation")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("tenantInformationReport.reportTitle")}
            </Typography>
          </div>
        </div>
        <Grid container spacing={3} alignItems="center">
          {/* Filter Section */}
          <Grid item xs={12} md={12}>
            <div style={{ padding: 12, backgroundColor: "#fff" }}>
              <Typography
                variant="h6"
                sx={{ color: "#909aab", alignSelf: "start" }}
              >
                {t("tenantInformationReport.filterReports")}
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={3} md={3} lg={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>
                      {t("tenantInformationReport.status")}
                    </InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label={t("tenantInformationReport.status")}
                    >
                      <MenuItem value="ALL">
                        {t("tenantInformationReport.all")}
                      </MenuItem>
                      <MenuItem value="paid">
                        {t("tenantInformationReport.paid")}
                      </MenuItem>
                      <MenuItem value="UNPAID">
                        {t("tenantInformationReport.unpaid")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3} sm={3} lg={3}>
                  <FormControl fullWidth className="z-0">
                    <InputLabel id="demo-simple-select-label">
                      {t("buildingUnit.building")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedBuilding}
                      onChange={handleBuildingSelect}
                      label="Building"
                    >
                      {buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name} {" - "}
                          {building.address}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} lg={4} md={3}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="flex-start"
                    style={{ alignItems: "center" }}
                  >
                    {/* Option for All Floors */}
                    <Grid item>
                      <IconButton
                        onClick={() => handleFloorSelect("All")}
                        color={selectedFloor === "" ? "primary" : "default"}
                        style={{ fontSize: "16px" }}
                      >
                        {t("buildingUnit.allFloor")}
                      </IconButton>
                    </Grid>
                    {/* Other floors */}
                    {Array.from(
                      new Set(buildingUnits.map((unit) => unit.floor_no))
                    ).map((floor) => (
                      <Grid item key={floor}>
                        <IconButton
                          style={{ fontSize: "16px" }}
                          onClick={() => handleFloorSelect(floor)}
                          color={
                            selectedFloor === floor ? "primary" : "default"
                          }
                        >
                          {floor}
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} md={12}>
            <div style={{ padding: 16, backgroundColor: "#fff" }}>
              <Typography
                variant="h6"
                sx={{ color: "#909aab", alignSelf: "start", paddingY: 1 }}
              >
                {t("tenantInformationReport.reportView")}
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  {t("tenantInformationReport.print")}
                </Button>
                <div>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleButtonClick}
                  >
                    {t("tenantInformationReport.export")}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={openButton}
                    onClose={handleButtonClose}
                    PaperProps={{
                      style: {
                        width: "200px",
                      },
                    }}
                  >
                    <MenuItem onClick={handleExportToExcel}>
                      <ListItemIcon>
                        <FileCopyIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {t("tenantInformationReport.exportExcel")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleExportToPDF}>
                      <ListItemIcon>
                        <FileCopyIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {t("tenantInformationReport.exportPDF")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem>
                      <CSVLink
                        style={{ display: "flex" }}
                        data={filteredData?.flatMap((report, index) =>
                          report.payments.map((payment) => ({
                            Num: index + 1,
                            BusinessName: report.tenant_business_name,
                            PhoneNumber: report.tenant_business_phone_number,
                            OwnerName: report.tenant_name,
                            BuildingUnit: report.building_unit_number,
                            MonthlyRent: report.monthly_rent,
                            TotalPayment: payment.total_payment,
                            Status: payment.status,
                          }))
                        )}
                        filename="Tenant_Information_Report.csv"
                      >
                        <ListItemIcon>
                          <FileCopyIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {t("tenantInformationReport.exportCSV")}
                        </ListItemText>
                      </CSVLink>
                    </MenuItem>
                  </Menu>
                </div>
              </Box>
              <TableContainer>
                <Box>
                  <Fade
                    in={loading}
                    style={{
                      transitionDelay: loading ? "100ms" : "0ms",
                    }}
                    unmountOnExit
                  >
                    <LinearProgress />
                  </Fade>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.num")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.businessName")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.phoneNumber")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.ownerName")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.buildingUnit")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.monthlyRent")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.month")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.totalPayment")}
                      </TableCell>

                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.dueDate")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("tenantInformationReport.status")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          {t("maintenanceRequest.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredData?.length !== 0 ? (
                      visibleRows?.flatMap((report, index) =>
                        report.payments.map((payment, paymentIndex) => (
                          <TableRow key={`${report.id}-${payment.id}`}>
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                            )}
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {report.tenant_business_name}
                              </TableCell>
                            )}
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {report.tenant_business_phone_number}
                              </TableCell>
                            )}
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {report.tenant_name}
                              </TableCell>
                            )}
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {report.building_unit_number}
                              </TableCell>
                            )}
                            {paymentIndex === 0 && (
                              <TableCell rowSpan={report.payments.length}>
                                {report.monthly_rent}
                              </TableCell>
                            )}
                            <TableCell>
                              {payment.end_month
                                ? `${new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  }).format(
                                    new Date(payment.start_month)
                                  )} - ${new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  }).format(new Date(payment.end_month))}`
                                : new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  }).format(new Date(payment.start_month))}
                            </TableCell>
                            <TableCell>{payment.total_payment}</TableCell>

                            <TableCell>{payment.due_date}</TableCell>
                            <TableCell>{payment.status}</TableCell>
                          </TableRow>
                        ))
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          {t("tenantInformationReport.noDataFound")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Grid>
        </Grid>

        <div className="mt-8"></div>
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
      </>
      {/* )} */}
    </div>
  );
};

export default TenantInformationReport;
