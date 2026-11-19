import DeleteIcon from "@mui/icons-material/Delete";

import DownloadIcon from "@mui/icons-material/Download";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  TablePagination,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import MaintenanceRequestReportService from "../../Services/maintenanceRequestReport.service";

function createData(id, name, email) {
  return {
    id,
    name,
    email,
  };
}

const rows = [
  createData(1, "Cupcake", "cupcake@example.com"),
  createData(2, "Donut", "donut@example.com"),
  createData(3, "Eclair", "eclair@example.com"),
  // Add more rows as needed
];

const headCells = [
  {
    id: "no",
    numeric: false,
    disablePadding: true,
    label: "No.",
  },
  {
    id: "request_id",
    numeric: false,
    disablePadding: true,
    label: "Request Id",
  },
  {
    id: "building_unit",
    numeric: false,
    disablePadding: true,
    label: "Building Unit",
  },

  {
    id: "request_date",
    numeric: false,
    disablePadding: true,
    label: "Request Date",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sx={{ color: "#909aab" }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const {
    selected,
    handleDeleteRequest,
    openDialog,
    setOpenDialog,
    t,
    loading,
  } = props;

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Toolbar>
        {selected === null ? (
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
            sx={{ color: "#909aab" }}
          >
            {t("maintenanceRequest.listOfRequests")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected.name} selected
          </Typography>
        )}
        {selected !== null && (
          <>
            {/* <Tooltip title="Edit">
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this request?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteRequest(selected.id)}
            color="info"
            autoFocus
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const MaintenanceRequestReport = () => {
  const { t } = useTranslation();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    contractor_id: "",
    request_id: "",
    work_description: "",
    scheduled_date: "",
    completion_date: "",
    cost: "",
  });
  const [contractorLoading, setContractorLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [contractorId, setContractorId] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openButton = Boolean(anchorEl);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const { vertical, horizontal, open } = state;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState();

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
  };

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContractorChange = (event) => {
    setContractorId(event.target.value);
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClose = () => {
    setAnchorEl(null);
  };

  const fetchMaintenanceRequestReport = async (
    status,
    start_date,
    end_date
  ) => {
    try {
      setLoading(true);
      const formattedStartDate = start_date ? formatDate(start_date) : null;
      const formattedEndDate = end_date ? formatDate(end_date) : null;
      const requestReport = await MaintenanceRequestReportService.getAllReports(
        {
          request_status: status,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        }
      );
      const sortedRequests = requestReport.data.sort((a, b) => {
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

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      name: "",
      email: "",
    });
  };

  const handleSelect = (event, id) => {
    setSelected(selected === id ? null : id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const firstPaymentId =
        maintenanceRequests.length > 0 ? maintenanceRequests[0].id : null;
      setSelected(firstPaymentId);
    } else {
      setSelected(null);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateWorkOrder = async (event, rowId) => {
    console.log("clicker");
    event.stopPropagation();
    setModalIsOpen(true);
    setSelectedRequest(rowId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, maintenanceRequests.length - page * rowsPerPage);

  const visibleRows = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData?.map((report, index) => ({
        Num: index + 1,
        Tenant: report.tenant_name,
        Unit: report.building_unit,
        RequestDate: report.request_date,
        RequestDescription: report.request_description,
        AdditionalDescription: report.additional_description,
        CompletionDate: report.completion_date,
        AssignContractor: report.contractor,
        Cost: report.cost,
        Status: report.status,
        PageURL: window.location.href,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Maintenance_Request_Report.xlsx");
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
    const filename = `Maintenance_Request_Report_${formattedDate}_${formattedTime}.pdf`;

    doc.setFontSize(18);
    doc.text("Maintenance Request Report", 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "No",
          "Tenant",
          "Unit",
          "Request Date",
          "Request Description",
          "Additional Description",
          "Completion Date",
          "Assign Contractor",
          "Cost",
          "Status",
        ],
      ],
      body: filteredData?.map((report, index) => [
        index + 1,
        report.tenant_name,
        report.building_unit,
        report.request_date,
        report.request_description,
        report.additional_description,
        report.completion_date,
        report.contractor,
        report.cost,
        report.status,
      ]),
      didDrawPage: (data) => {
        const { doc, pageCount } = data;
        const footerY = doc.internal.pageSize.height - 10;
        const marginLeft = data.settings.margin.left;
        const marginRight = data.settings.margin.right;

        doc.setFontSize(10);

        doc.text(
          `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          marginLeft,
          footerY + 3
        );

        doc.text(`Page URL: ${pageURL}`, marginLeft, footerY - 2);
        const pageNumberX = doc.internal.pageSize.width - marginRight;
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageNumberX,
          footerY - 2,
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
    printWindow.document.write("<h1>Maintenance Request Report</h1>");
    printWindow.document.write(document.querySelector("table").outerHTML);
    printWindow.document.write("<p>Page URL: " + window.location.href + "</p>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    fetchMaintenanceRequestReport(statusFilter, startDate, endDate);
  }, [statusFilter, startDate, endDate]);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.maintenanceRequestReport")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("maintenanceRequestReport.reportTitle")}
            </Typography>
          </div>
        </div>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12} md={3}>
            <div style={{ padding: 16, backgroundColor: "#fff" }}>
              <Typography
                variant="h6"
                sx={{ color: "#909aab", alignSelf: "start" }}
              >
                {t("maintenanceRequestReport.filterReports")}
              </Typography>

              <Grid
                container
                spacing={2}
                marginTop={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>
                      {t("maintenanceRequestReport.status")}
                    </InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label={t("maintenanceRequestReport.status")}
                    >
                      <MenuItem value="all">
                        {t("maintenanceRequestReport.all")}
                      </MenuItem>
                      <MenuItem value="pending">
                        {t("maintenanceRequestReport.pending")}
                      </MenuItem>
                      <MenuItem value="in_progress">
                        {t("maintenanceRequestReport.inprogress")}
                      </MenuItem>
                      <MenuItem value="completed">
                        {t("maintenanceRequestReport.completed")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={8} spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label={t("maintenanceRequestReport.from")}
                          value={startDate}
                          onChange={(newValue) => {
                            setStartDate(newValue);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label={t("maintenanceRequestReport.to")}
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} md={9}>
            <div style={{ padding: 16, backgroundColor: "#fff" }}>
              <Typography
                variant="h6"
                sx={{ color: "#909aab", alignSelf: "start" }}
              >
                {t("maintenanceRequestReport.reportView")}
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  {t("maintenanceRequestReport.print")}
                </Button>
                <div>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleButtonClick}
                  >
                    {t("maintenanceRequestReport.export")}
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
                        {t("maintenanceRequestReport.exportExcel")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleExportToPDF}>
                      <ListItemIcon>
                        <FileCopyIcon />
                      </ListItemIcon>
                      <ListItemText>
                        {t("maintenanceRequestReport.exportPDF")}
                      </ListItemText>
                    </MenuItem>
                    <MenuItem>
                      <CSVLink
                        style={{ display: "flex" }}
                        data={filteredData?.map((report, index) => ({
                          Num: index + 1,
                          Tenant: report.tenant_name,
                          Unit: report.building_unit,
                          RequestDate: report.request_date,
                          RequestDescription: report.request_description,
                          AdditionalDescription: report.additional_description,
                          CompletionDate: report.completion_date,
                          AssignContractor: report.contractor,
                          Cost: report.cost,
                          Status: report.status,
                          PageURL: window.location.href,
                        }))}
                        filename="Maintenance_Request_Report.csv"
                      >
                        <ListItemIcon>
                          <FileCopyIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {t("maintenanceRequestReport.exportCSV")}
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
                        {t("maintenanceRequestReport.num")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.tenant")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.unit")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.requestDate")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.requestDescription")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.additionalDescription")}
                      </TableCell>

                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.completionDate")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.assignContractor")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.cost")}
                      </TableCell>
                      <TableCell sx={{ color: "#909aab", alignSelf: "start" }}>
                        {t("maintenanceRequestReport.status")}
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
                      visibleRows.flatMap((report, index) => (
                        <TableRow
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-200`}
                        >
                          <TableCell align="center">
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell align="center">
                            {report.tenant_name}
                          </TableCell>
                          <TableCell align="center">
                            {report.building_unit}
                          </TableCell>
                          <TableCell align="center">
                            {report.request_date}
                          </TableCell>
                          <TableCell align="center">
                            {report.request_description}
                          </TableCell>
                          <TableCell align="center">
                            {report.additional_description}
                          </TableCell>
                          <TableCell align="center">
                            {report.completion_date}
                          </TableCell>
                          <TableCell align="center">
                            {report.contractor}
                          </TableCell>
                          <TableCell align="center">{report.cost}</TableCell>
                          <TableCell align="center">{report.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          {t("maintenanceRequestReport.noDataFound")}
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

export default MaintenanceRequestReport;
