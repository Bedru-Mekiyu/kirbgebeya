import DownloadIcon from "@mui/icons-material/Download";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import "react-report-builder/lib/main.css";
import * as XLSX from "xlsx";

import LeaseExpiryReportService from "../../Services/leaseExpiryReport.service";

function EnhancedTableHead(props) {
  const { t } = props;
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: true,
      label: t("leaseExpiryReport.num"),
    },
    {
      id: "tenant_name",
      numeric: false,
      disablePadding: true,
      label: t("leaseExpiryReport.tenantName"),
    },
    {
      id: "unit_number",
      numeric: false,
      disablePadding: true,
      label: t("leaseExpiryReport.unitNumber"),
    },

    {
      id: "start_date",
      numeric: false,
      disablePadding: true,
      label: t("leaseExpiryReport.startDate"),
    },
    {
      id: "end_date",
      numeric: false,
      disablePadding: false,
      label: t("leaseExpiryReport.endDate"),
    },
    {
      id: "notice_given",
      numeric: false,
      disablePadding: false,
      label: t("leaseExpiryReport.noticeGiven"),
    },
    {
      id: "renewal_status",
      numeric: false,
      disablePadding: false,
      label: t("leaseExpiryReport.renewalStatus"),
    },
  ];
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

const LeaseExpiryReport = () => {
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
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [contractorId, setContractorId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openButton = Boolean(anchorEl);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClose = () => {
    setAnchorEl(null);
  };

  const fetchLeaseExpiryReport = async () => {
    try {
      setLoading(true);
      const leaseExpiryReport = await LeaseExpiryReportService.getAllReports();
      const sortedReport = leaseExpiryReport.data.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else {
          return 1;
        }
      });
      setMaintenanceRequests(sortedReport);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      setError(error.message);
      setLoading(false);
    }
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

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, maintenanceRequests.length - page * rowsPerPage);

  const visibleRows = maintenanceRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const pageURL = window.location.href;
    const date = new Date();

    const formattedDate = `${date.toISOString().slice(0, 10)}`;
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const filename = `Lease_Expiry_Report_${formattedDate}_${formattedTime}.pdf`;

    doc.setFontSize(18);
    doc.text("Lease Expiry Report", 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "No",
          "Tenant",
          "Building Unit",
          "Start Date",
          "End Date",
          "Notice Given",
          "Renewal Status",
        ],
      ],
      body: visibleRows?.map((row, index) => [
        page * rowsPerPage + index + 1,
        row.tenant.name,
        `${row.building_unit?.building.name.substring(0, 3)} - ${
          row.building_unit?.floor_no
        } - ${row.building_unit?.unit_number}`,
        new Date(row.start_date).toLocaleDateString(),
        new Date(row.end_date).toLocaleDateString(),

        row.status === "completed"
          ? "Completed"
          : row.status === "pending"
          ? "Pending"
          : row.status === "processing"
          ? "Processing"
          : row.status === "canceled"
          ? "Canceled"
          : "Unknown",
        row.status === "active"
          ? "Active"
          : row.status === "new"
          ? "New"
          : row.status === "expired"
          ? "Expired"
          : "Unknown",
      ]),
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

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      visibleRows?.map((row, index) => ({
        Num: page * rowsPerPage + index + 1,
        Tenant: row.tenant.name,
        Unit: `${row.building_unit?.building.name.substring(0, 3)} - ${
          row.building_unit?.floor_no
        } - ${row.building_unit?.unit_number}`,
        StartDate: new Date(row.start_date).toLocaleDateString(),
        EndDate: new Date(row.end_date).toLocaleDateString(),
        NoticeGiven:
          row.status === "completed"
            ? "Completed"
            : row.status === "pending"
            ? "Pending"
            : row.status === "processing"
            ? "Processing"
            : row.status === "canceled"
            ? "Canceled"
            : "Unknown",
        CurrentStatus:
          row.status === "active"
            ? "Active"
            : row.status === "new"
            ? "New"
            : row.status === "expired"
            ? "Expired"
            : "Unknown",
        PageURL: window.location.href,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("leaseExpiryReport.reportView"));
    XLSX.writeFile(wb, "Lease_Expiry_Report.xlsx");
  };

  const csvData = visibleRows.map((row, index) => ({
    Num: page * rowsPerPage + index + 1,
    Tenant: row.tenant.name,
    Unit: `${row.building_unit?.building.name.substring(0, 3)} - ${
      row.building_unit?.floor_no
    } - ${row.building_unit?.unit_number}`,
    StartDate: new Date(row.start_date).toLocaleDateString(),
    EndDate: new Date(row.end_date).toLocaleDateString(),
    NoticeGiven:
      row.status === "completed"
        ? "Completed"
        : row.status === "pending"
        ? "Pending"
        : row.status === "processing"
        ? "Processing"
        : row.status === "canceled"
        ? "Canceled"
        : "Unknown",
    CurrentStatus:
      row.status === "active"
        ? "Active"
        : row.status === "new"
        ? "New"
        : row.status === "expired"
        ? "Expired"
        : "Unknown",
  }));

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>" +
        "table { width: 100%; border-collapse: collapse; } " +
        "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } " +
        "th { background-color: #f2f2f2; } " +
        "h1 { text-align: center; } " +
        "p { text-align: center; margin-top: 20px; font-size: 12px; } " +
        "</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(
      `<h1>${t("leaseExpiryReport.reportTitle")}</h1>`
    );
    printWindow.document.write(document.querySelector("table").outerHTML);
    printWindow.document.write("<p>Page URL: " + window.location.href + "</p>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    fetchLeaseExpiryReport();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.leaseExpiryReport")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("leaseExpiryReport.reportTitle")}
            </Typography>
          </div>
        </div>

        <Box sx={{ backgroundColor: "white" }}>
          <Typography
            variant="h6"
            sx={{ color: "#909aab", alignSelf: "start", paddingY: 2 }}
          >
            {t("leaseExpiryReport.reportView")}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            paddingX={2}
          >
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              {t("leaseExpiryReport.print")}
            </Button>
            <div>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleButtonClick}
              >
                {t("leaseExpiryReport.export")}
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
                    {t("leaseExpiryReport.exportExcel")}
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportToPDF}>
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {t("leaseExpiryReport.exportPDF")}
                  </ListItemText>
                </MenuItem>
                <MenuItem>
                  <CSVLink
                    style={{ display: "flex" }}
                    data={csvData}
                    filename="Lease_Expiry_Report.csv"
                  >
                    <ListItemIcon>
                      <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {t("leaseExpiryReport.exportCSV")}
                    </ListItemText>
                  </CSVLink>
                </MenuItem>
              </Menu>
            </div>
          </Box>

          <TableContainer sx={{ overflowX: "auto", maxWidth: "100%" }}>
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
            <div>
              <Table aria-labelledby="tableTitle" sx={{ minWidth: 1000 }}>
                <EnhancedTableHead
                  numSelected={selected !== null ? 1 : 0}
                  onSelectAllClick={handleSelectAllClick}
                  t={t}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t("leaseExpiryReport.loading")}
                      </TableCell>
                    </TableRow>
                  ) : maintenanceRequests.length !== 0 ? (
                    visibleRows?.map((row, index) => (
                      <TableRow
                        hover
                        onClick={(e) => handleSelect(e, row.id)}
                        role="checkbox"
                        aria-checked={isSelected(row.id)}
                        key={row.id}
                        selected={isSelected(row.id)}
                        sx={{ cursor: "pointer" }}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-200`}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.tenant.name}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.building_unit?.building.name.substring(0, 3)} -{" "}
                          {row.building_unit?.floor_no} -{" "}
                          {row.building_unit?.unit_number}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {new Date(row.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {new Date(row.end_date).toLocaleDateString()}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.status === "completed" ? (
                            <span style={{ color: "green" }}>Completed</span>
                          ) : row.status === "pending" ? (
                            <span style={{ color: "orange" }}>Pending</span>
                          ) : row.status === "processing" ? (
                            <span style={{ color: "orange" }}>Processing</span>
                          ) : row.status === "canceled" ? (
                            <span style={{ color: "red" }}>Canceled</span>
                          ) : (
                            <span style={{ color: "gray" }}>Unknown</span>
                          )}
                        </TableCell>
                        <TableCell align="left">
                          <div>
                            {row.status === "active" ? (
                              <span style={{ color: "green" }}>Active</span>
                            ) : row.status === "new" ? (
                              <span style={{ color: "gray" }}>New</span>
                            ) : row.status === "expired" ? (
                              <span style={{ color: "red" }}>Expired</span>
                            ) : (
                              <span style={{ color: "gray" }}>Unknown</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No request data available
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 20 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={maintenanceRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        <div className="mt-8">{/* <UserList users={users} /> */}</div>
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

export default LeaseExpiryReport;
