import DownloadIcon from "@mui/icons-material/Download";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
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
import FinancialReportService from "../../Services/financialReport.service";

const FinancialReport = () => {
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
  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openButton = Boolean(anchorEl);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredData, setFilteredData] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchFinancialReport = async (start_date, end_date) => {
    try {
      setLoading(true);
      const formattedStartDate = start_date ? formatDate(start_date) : null;
      const formattedEndDate = end_date ? formatDate(end_date) : null;
      const financialReport = await FinancialReportService.getAllReports({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });

      setFilteredData(financialReport.data.summary);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error.message);
      setError(error.message);
      setLoading(false);
    }
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
    const filename = `Financial_Report_${formattedDate}_${formattedTime}.pdf`;

    doc.setFontSize(18);
    doc.text("Financial Report", 14, 15);

    const listData = [
      ["Report Period", `${formatDate(startDate)} - ${formatDate(endDate)}`],
      ["Total Income", filteredData?.grand_total_payment],
      ["Total Expenses", filteredData?.grandTotalWorkOrderCost],
      ["Net", filteredData?.net],
      ["Outstanding Payments", filteredData?.outstandingPayments],
    ];

    doc.setFontSize(12);
    listData.forEach((item, index) => {
      doc.text(`${item[0]}: ${item[1]}`, 14, 30 + index * 10);
    });

    autoTable(doc, {
      startY: 30 + listData.length * 10 + 10,
      head: [
        [
          "Report Period",
          "Total Income",
          "Total Expenses",
          "Net",
          "Outstanding Payments",
        ],
      ],
      body: [
        [
          `${formatDate(startDate)} - ${formatDate(endDate)}`,
          filteredData?.grand_total_payment,
          filteredData?.grandTotalWorkOrderCost,
          filteredData?.net,
          filteredData?.outstandingPayments,
        ],
      ],
      didDrawPage: (data) => {
        const { doc, pageCount } = data;
        const footerY = doc.internal.pageSize.height - 10;
        const marginLeft = data.settings.margin.left;
        const marginRight = data.settings.margin.right;

        doc.setFontSize(10);

        doc.text(
          `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          marginLeft,
          footerY - 20
        );

        doc.text(`Page URL: ${pageURL}`, marginLeft, footerY - 10);

        const pageNumberX = doc.internal.pageSize.width - marginRight;
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageNumberX,
          footerY - 10,
          { align: "right" }
        );
      },
    });
    doc.save(filename);
  };
  const handleExportToExcel = () => {
    const date = new Date();
    const formattedDate = `${date.toISOString().slice(0, 10)}`;
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const filename = `Financial_Report_${formattedDate}_${formattedTime}.xlsx`;

    const wsData = [
      [
        t("financialReport.reportPeriod"),
        `${formatDate(startDate)} - ${formatDate(endDate)}`,
      ],
      [t("financialReport.totalIncome"), filteredData?.grand_total_payment],
      [
        t("financialReport.totalExpenses"),
        filteredData?.grandTotalWorkOrderCost,
      ],
      [t("financialReport.net"), filteredData?.net],
      [
        t("financialReport.outstandingPayments"),
        filteredData?.outstandingPayments,
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    XLSX.writeFile(wb, filename);
  };
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; } h1 { text-align: left; } p { text-align: left; margin-top: 20px; font-size: 12px; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(`<h1>${t("financialReport.reportTitle")}</h1>`);
    printWindow.document.write(
      `<p>${t("financialReport.reportPeriod")}: ${formatDate(
        startDate
      )} - ${formatDate(endDate)}</p>`
    );
    printWindow.document.write(
      `<p>${t("financialReport.totalIncome")}: ${
        filteredData?.grand_total_payment
      }</p>`
    );
    printWindow.document.write(
      `<p>${t("financialReport.totalExpenses")}: ${
        filteredData?.grandTotalWorkOrderCost
      }</p>`
    );
    printWindow.document.write(
      `<p>${t("financialReport.net")}: ${filteredData?.net}</p>`
    );
    printWindow.document.write(
      `<p>${t("financialReport.outstandingPayments")}: ${
        filteredData?.outstandingPayments
      }</p>`
    );
    printWindow.document.write("<p>Page URL: " + window.location.href + "</p>"); // URL in footer
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    fetchFinancialReport(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <div>
      <Helmet>
        <title>SkyBMS - {t("title.financialReport")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("financialReport.reportTitle")}
            </Typography>
          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <div style={{ padding: 16, backgroundColor: "#fff" }}>
              <Typography
                variant="h6"
                sx={{ color: "#909aab", alignSelf: "start" }}
              >
                {t("financialReport.filterReports")}
              </Typography>

              <Grid
                container
                spacing={2}
                marginTop={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <DatePicker
                        label={t("financialReport.from")}
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                        }}
                      />
                      <DatePicker
                        label={t("financialReport.to")}
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                        }}
                      />
                    </div>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <div style={{ backgroundColor: "#fff" }}>
              <div>
                <Typography
                  variant="h6"
                  sx={{ color: "#909aab", paddingY: 1, alignSelf: "center" }}
                  align="center"
                >
                  {t("financialReport.reportView")}
                </Typography>
                {!loading &&
                  filteredData &&
                  startDate !== null &&
                  endDate !== null && (
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
                        {t("financialReport.print")}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleButtonClick}
                      >
                        {t("financialReport.export")}
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
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
                            {t("financialReport.exportExcel")}
                          </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleExportToPDF}>
                          <ListItemIcon>
                            <FileCopyIcon />
                          </ListItemIcon>
                          <ListItemText>
                            {t("financialReport.exportPDF")}
                          </ListItemText>
                        </MenuItem>

                        <MenuItem>
                          <CSVLink
                            style={{ display: "flex" }}
                            data={
                              filteredData
                                ? [
                                    {
                                      "Report Period": `${formatDate(
                                        startDate
                                      )} - ${formatDate(endDate)}`,
                                      "Total Income":
                                        filteredData.grand_total_payment,
                                      "Total Expenses":
                                        filteredData.grandTotalWorkOrderCost,
                                      Net: filteredData.net,
                                      "Outstanding Payments":
                                        filteredData.outstandingPayments,
                                    },
                                  ]
                                : []
                            }
                            filename={`Financial_Report.csv`}
                          >
                            <ListItemIcon>
                              <FileCopyIcon />
                            </ListItemIcon>
                            <ListItemText>
                              {t("financialReport.exportCSV")}
                            </ListItemText>
                          </CSVLink>
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                <Fade
                  in={loading}
                  style={{ transitionDelay: loading ? "100ms" : "0ms" }}
                  unmountOnExit
                >
                  <div style={{ padding: 16 }}>
                    <Skeleton variant="text" width={210} height={30} />
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="text" width={180} height={30} />
                    <Skeleton variant="text" width={170} height={30} />
                  </div>
                </Fade>
                <div style={{ height: "400px", paddingLeft: "10px" }}>
                  {!loading &&
                    filteredData &&
                    startDate !== null &&
                    endDate !== null && (
                      <div>
                        <Typography variant="body1">
                          {t("financialReport.reportPeriod")}:{" "}
                          {formatDate(startDate)} {"-"} {formatDate(endDate)}
                        </Typography>
                        <Typography variant="body1">
                          {t("financialReport.totalIncome")}:{" "}
                          {filteredData.grand_total_payment}
                        </Typography>
                        <Typography variant="body1">
                          {t("financialReport.totalExpenses")}:{" "}
                          {filteredData.grandTotalWorkOrderCost}
                        </Typography>
                        <Typography variant="body1">
                          {t("financialReport.net")}: {filteredData.net}
                        </Typography>
                        <Typography variant="body1">
                          {t("financialReport.outstandingPayments")}:{" "}
                          {filteredData.outstandingPayments}
                        </Typography>
                      </div>
                    )}
                  {filteredData &&
                    !loading &&
                    startDate === null &&
                    endDate === null && (
                      <div>
                        <Typography
                          variant="body1"
                          align="center"
                          justifyContent="center"
                          sx={{ color: "#909aab" }}
                        >
                          {t("financialReport.selectReportPeriod")}
                        </Typography>
                      </div>
                    )}
                  {!filteredData &&
                    !loading &&
                    startDate !== null &&
                    endDate !== null && (
                      <div>
                        <Typography variant="body1" align="center">
                          {t("financialReport.noDataFound")}
                        </Typography>
                      </div>
                    )}
                </div>
              </div>
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

export default FinancialReport;
