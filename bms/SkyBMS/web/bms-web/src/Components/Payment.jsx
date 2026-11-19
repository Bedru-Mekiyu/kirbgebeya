import ApproveIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon, {
  default as RejectIcon,
} from "@mui/icons-material/HighlightOff";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { IMAGE_URL } from "../Config";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import PaymentService from "../Services/payment.service";

function createData(id, name, email) {
  return {
    id,
    name,
    email,
  };
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected } = props;
  const { t } = useTranslation();
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: false,
      label: t("payment.num"),
    },
    {
      id: "business_name",
      numeric: false,
      disablePadding: false,
      label: t("payment.businessName"),
    },

    {
      id: "owner_name",
      numeric: false,
      disablePadding: false,
      label: t("payment.ownerName"),
    },
    {
      id: "unit",
      numeric: false,
      disablePadding: false,
      label: t("payment.unit"),
    },
    {
      id: "number_of_months",
      numeric: false,
      disablePadding: false,
      label: t("payment.noOfMonths"),
    },

    {
      id: "total_fee",
      numeric: false,
      disablePadding: false,
      label: t("payment.totalFee"),
    },

    {
      id: "paid_date",
      numeric: false,
      disablePadding: false,
      label: t("payment.paidDate"),
    },
    {
      id: "invoice_number",
      numeric: false,
      disablePadding: false,
      label: t("payment.invoiceNumber"),
    },
    {
      id: "invoice_slp",
      numeric: false,
      disablePadding: false,
      label: t("payment.invoiceSlip"),
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: t("payment.status"),
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: t("payment.action"),
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

function EnhancedTableToolbar(props) {
  const {
    selected,
    handleDeletePayment,
    openDialog,
    setOpenDialog,
    loading,
    t,
    openEditModal,
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
            {t("payment.paymentsList")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected.name} {t("payment.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("payment.edit")}>
              <div>
                <IconButton onClick={() => openEditModal(selected)}>
                  <EditIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title={t("payment.delete")}>
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
        <DialogTitle id="alert-dialog-title">
          {" "}
          {t("payment.deletePayment")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("payment.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("payment.no")}
          </Button>
          <Button
            onClick={() => handleDeletePayment(selected.id)}
            color="info"
            autoFocus
            disabled={loading}
          >
            {t("payment.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Payment = () => {
  const { t } = useTranslation();
  const [paymentFormData, setPaymentFormData] = useState({
    lease_id: "",
    number_of_months: "",
    rent_fee: "",
    penalty_fee: "",
    utility_fee: "",
    other_fee: "",
    status: "",
    remarks: "",
  });
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState();
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentFrom, setPaymentFrom] = useState();
  const [paymentTo, setPaymentTo] = useState();
  const [dueDate, setDueDate] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalPaymentOpen, setPaymentModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // State for expanded details
  const [expandedDateRows, setExpandedDateRows] = useState(new Set());
  const [expandedFeeRows, setExpandedFeeRows] = useState(new Set());

  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "number_of_months" && parseInt(value) === 1) {
      setPaymentTo(null);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const payments = await PaymentService.getAllPayments();
      const sortedResponse = payments.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setPayments(sortedResponse);
      setLoading(false);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const requestBody = {
        status: paymentFormData.status,
        lease_id: paymentFormData.lease_id,
        start_month: paymentFrom ? paymentFrom.toISOString() : "",
        end_month: paymentTo ? paymentTo.toISOString() : "",
        number_of_months: paymentFormData.number_of_months,
        due_date: dueDate.toISOString(),
        rent_fee: paymentFormData.rent_fee,
        penalty_fee: paymentFormData.penalty_fee,
        utility_fee: paymentFormData.utility_fee,
        other_fee: paymentFormData.other_fee,
        remark: paymentFormData.remarks,
      };

      const response = await PaymentService.update(
        selectedPaymentId,
        requestBody
      );

      if (response.status === 200) {
        setPaymentFrom(null);
        setPaymentTo(null);
        setError(null);
        setSuccessMessage(response.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
        setPaymentModalOpen(false);
        fetchPayments();
      }
    } catch (error) {
      setSuccessMessage(null);
      console.error("Error creating payment:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      name: "",
      email: "",
    });
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handleSelect = (event, id) => {
    setSelected(selected === id ? null : id);
  };
  const handleDelete = (id) => {
    const updatedUsers = payments.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setSelected(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const firstPaymentId = payments.length > 0 ? payments[0].id : null;
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

  const openEditModal = (selectedPayment) => {
    setPaymentModalOpen(true);
    setSelectedPaymentId(selectedPayment.id);
    setPaymentFormData({
      lease_id: selectedPayment.lease_id,
      number_of_months: selectedPayment.number_of_months,
      rent_fee: selectedPayment.rent_fee,
      penalty_fee: selectedPayment.penalty_fee,
      utility_fee: selectedPayment.utility_fee,
      other_fee: selectedPayment.other_fee,
      remarks: selectedPayment.remark,
      status: selectedPayment.status,
    });
    setDueDate(dayjs(selectedPayment.due_date));
    setPaymentFrom(dayjs(selectedPayment.start_month));
    setPaymentTo(
      selectedPayment.end_month ? dayjs(selectedPayment.end_month) : ""
    );
  };

  const handleApprove = async (event, rowId) => {
    event.stopPropagation();
    try {
      const response = await PaymentService.approvePayment(rowId);

      if (response.status === 200) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setSuccessMessage(t("payment.paymentApproved"));
        fetchPayments();
      }
    } catch (error) {
      setError("Error updating payment" + error.message);
      setSuccessMessage(null);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleReject = async (event, rowId) => {
    console.log(`Payment with ID ${rowId} rejected.`);
    event.stopPropagation();
    try {
      const response = await PaymentService.rejectPayment(rowId);

      if (response.status === 200) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setSuccessMessage(t("payment.paymentApproved"));
        fetchPayments();
      }
    } catch (error) {
      setError("Error updating payment" + error.message);
      setSuccessMessage(null);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleDeletePayment = async (selected) => {
    setOpenDialog(false);

    setLoading(true);
    try {
      await PaymentService.deletePayment(selected);
      setTimeout(() => {
        setSelected(null);
        setOpenDialog(false);
        fetchPayments();
        setLoading(false);
      }, 500);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, payments.length - page * rowsPerPage);

  const visibleRows = payments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  const handleDateRowClick = (e, id) => {
    e.stopPropagation();
    setExpandedDateRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(id)) {
        newExpandedRows.delete(id);
      } else {
        newExpandedRows.add(id);
      }
      return newExpandedRows;
    });
  };

  const handleFeeRowClick = (e, id) => {
    e.stopPropagation();
    setExpandedFeeRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(id)) {
        newExpandedRows.delete(id);
      } else {
        newExpandedRows.add(id);
      }
      return newExpandedRows;
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.payments")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pb-7 pt-2 mt-4 bg-slate-50">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("payment.paymentInformation")}
            </Typography>
          </div>
        </div>

        <Modal
          isOpen={modalPaymentOpen}
          onRequestClose={closePaymentModal}
          contentLabel="Create Lease Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center "
          overlayClassName="Overlay fixed inset-0"
        >
          <style>
            {`
                .hidden-scrollbar::-webkit-scrollbar {
                  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
                }

                .hidden-scrollbar {
                  -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer and Edge */
                  scrollbar-width: none; /* Hide scrollbar for Firefox */
                }
              `}
          </style>
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-md overflow-y-auto hidden-scrollbar">
            <div className="flex justify-end">
              <IconButton onClick={closePaymentModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h6" gutterBottom className="pb-3">
              {t("payment.enterPaymentDetail")}
            </Typography>
            <div>
              <TextField
                margin="normal"
                label={t("payment.numberOfMonths")}
                type="number"
                fullWidth
                name="number_of_months"
                value={paymentFormData.number_of_months}
                onChange={handleFormChange}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              {paymentFormData.number_of_months > 1 ? (
                <>
                  <div>
                    <div className="mt-4 mb-1">{t("payment.from")}</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["month", "year"]}
                        value={paymentFrom}
                        onChange={(date) => setPaymentFrom(date)}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="MM/YYYY"
                        className="h-12 pl-2 w-full "
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="mb-5">
                    <div className="mt-5 mb-1">{t("payment.to")}</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["month", "year"]}
                        value={paymentTo}
                        onChange={(date) => setPaymentTo(date)}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="MM/YYYY"
                        className="h-12 pl-2 w-full"
                      />
                    </LocalizationProvider>
                  </div>
                </>
              ) : (
                <div className="mb-5">
                  <div className="mt-4 mb-1">{t("lease.month")}</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={["month", "year"]}
                      value={paymentFrom}
                      onChange={(date) => setPaymentFrom(date)}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="MM/YYYY"
                      className="h-12 pl-2 w-full"
                    />
                  </LocalizationProvider>
                </div>
              )}

              <div className="mb-5">
                <div className="mt-4 mb-1">{t("lease.dueDate")}</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dueDate}
                    onChange={(date) => setDueDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                    className="h-12 pl-2 w-full"
                  />
                </LocalizationProvider>
              </div>

              <TextField
                margin="normal"
                label={t("payment.rentFee")}
                type="number"
                fullWidth
                name="rent_fee"
                value={paymentFormData.rent_fee}
                onChange={handleFormChange}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              <TextField
                margin="normal"
                label={t("payment.penaltyFee")}
                type="number"
                fullWidth
                name="penalty_fee"
                value={paymentFormData.penalty_fee}
                onChange={handleFormChange}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              <TextField
                margin="normal"
                label={t("payment.utilityFee")}
                type="number"
                fullWidth
                name="utility_fee"
                value={paymentFormData.utility_fee}
                onChange={handleFormChange}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              <TextField
                margin="dense"
                label={t("payment.otherFees")}
                type="number"
                fullWidth
                name="other_fee"
                value={paymentFormData.other_fee}
                onChange={handleFormChange}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />
              <TextField
                margin="dense"
                label={t("payment.remarks")}
                multiline
                rows={3}
                fullWidth
                name="remarks"
                value={paymentFormData.remarks}
                onChange={handleFormChange}
              />

              <div className="flex justify-end space-x-6 mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={() => handleUpdate()}
                >
                  {t("payment.update")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closePaymentModal}
                >
                  {t("payment.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Box sx={{ backgroundColor: "white" }}>
          <EnhancedTableToolbar
            selected={
              selected !== null
                ? payments.find((payment) => payment.id === selected)
                : null
            }
            handleDeletePayment={handleDeletePayment}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            loading={loading}
            t={t}
            openEditModal={openEditModal}
          />
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
              <Table aria-labelledby="tableTitle" sx={{ minWidth: 600 }}>
                <EnhancedTableHead
                  numSelected={selected !== null ? 1 : 0}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={19} align="center">
                        {t("payment.loading")}
                      </TableCell>
                    </TableRow>
                  ) : payments.length !== 0 ? (
                    visibleRows.map((row, index) => (
                      <React.Fragment key={row.id}>
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
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected(row.id)}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {row.lease.tenant.business?.name}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {row.lease.tenant.business.owner.user.full_name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {row.lease.building_unit.building?.name.substring(
                              0,
                              3
                            )}{" "}
                            - {row.lease.building_unit.floor_no} -{" "}
                            {row.lease.building_unit.unit_number}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                            onClick={(e) => handleDateRowClick(e, row.id)}
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip
                              title={
                                <div>
                                  <p>
                                    <strong>{t("payment.startDate")}:</strong>{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                      month: "long",
                                      year: "numeric",
                                    }).format(new Date(row.start_month))}
                                  </p>
                                  {row.end_month && (
                                    <p>
                                      <strong>{t("payment.endDate")}:</strong>{" "}
                                      {new Intl.DateTimeFormat("en-US", {
                                        month: "long",
                                        year: "numeric",
                                      }).format(new Date(row.end_month))}
                                    </p>
                                  )}
                                  {row.due_date && (
                                    <p>
                                      <strong>{t("payment.dueDate")}:</strong>{" "}
                                      {new Date(
                                        row.due_date
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              }
                            >
                              {row.number_of_months}
                            </Tooltip>
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            onClick={(e) => handleFeeRowClick(e, row.id)}
                            sx={{ cursor: "pointer" }}
                          >
                            <Tooltip
                              title={
                                <div>
                                  <Typography variant="subtitle2">
                                    {t("payment.fees")}:
                                  </Typography>
                                  <p>
                                    <strong>{t("payment.rentFee")}:</strong>{" "}
                                    {row.rent_fee}
                                  </p>
                                  <p>
                                    <strong>{t("payment.utilityFee")}:</strong>{" "}
                                    {row.utility_fee}
                                  </p>
                                  <p>
                                    <strong>{t("payment.otherFee")}:</strong>{" "}
                                    {row.other_fee}
                                  </p>
                                  <p>
                                    <strong>{t("payment.penaltyFee")}:</strong>{" "}
                                    {row.penalty_fee}
                                  </p>
                                  <p>
                                    <strong>{t("payment.totalFee")}:</strong>{" "}
                                    {parseFloat(row.rent_fee ?? 0) *
                                      parseFloat(row.number_of_months ?? 1) +
                                      parseFloat(row.utility_fee ?? 0) +
                                      parseFloat(row.other_fee ?? 0) +
                                      parseFloat(row.penalty_fee ?? 0)}
                                  </p>
                                </div>
                              }
                            >
                              {parseFloat(row.rent_fee ?? 0) *
                                parseFloat(row.number_of_months ?? 1) +
                                parseFloat(row.utility_fee ?? 0) +
                                parseFloat(row.other_fee ?? 0) +
                                parseFloat(row.penalty_fee ?? 0)}
                            </Tooltip>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {row.paid_date
                              ? new Date(row.paid_date).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {row.invoice_number}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                          >
                            {row.slip ? (
                              <Tooltip
                                title={<p> {t("payment.viewInvoiceSlip")}</p>}
                              >
                                {row.bank_name ? "(" + row.bank_name + ")" : ""}
                                <br />
                                <a
                                  href={`${IMAGE_URL}/${row.slip}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {t("payment.viewSlip")}
                                </a>
                              </Tooltip>
                            ) : (
                              t("payment.noSlipAvailable")
                            )}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {row.status === "paid" ? (
                              <span style={{ color: "green" }}>
                                {t("payment.paid")}
                              </span>
                            ) : row.status === "pending" ? (
                              <span style={{ color: "orange" }}>
                                {t("payment.pending")}
                              </span>
                            ) : row.status === "late" ? (
                              <span style={{ color: "red" }}>
                                {t("payment.late")}
                              </span>
                            ) : row.status === "canceled" ? (
                              <span style={{ color: "red" }}>
                                {t("payment.canceled")}
                              </span>
                            ) : row.status === "awaiting approval" ? (
                              <span style={{ color: "gray" }}>
                                {t("payment.awaitingApproval")}
                              </span>
                            ) : (
                              <span style={{ color: "gray" }}>
                                {t("payment.unknown")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {row.status === "awaiting approval" ? (
                              <div className="flex">
                                <div
                                  style={{
                                    color: "green",
                                    marginRight: 5,
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) =>
                                    handleApprove(event, row.id)
                                  }
                                >
                                  <ApproveIcon />
                                </div>
                                <div
                                  style={{ color: "red", cursor: "pointer" }}
                                  onClick={(event) =>
                                    handleReject(event, row.id)
                                  }
                                >
                                  <RejectIcon />
                                </div>
                              </div>
                            ) : (
                              <div>
                                {row.status === "paid" ? (
                                  <span style={{ color: "green" }}>
                                    {t("payment.paid")}
                                  </span>
                                ) : row.status === "pending" ? (
                                  <span style={{ color: "orange" }}>
                                    {t("payment.pending")}
                                  </span>
                                ) : row.status === "late" ? (
                                  <span style={{ color: "red" }}>
                                    {t("payment.late")}
                                  </span>
                                ) : row.status === "canceled" ? (
                                  <span style={{ color: "gray" }}>
                                    {t("payment.canceled")}
                                  </span>
                                ) : row.status === "awaiting approval" ? (
                                  <span style={{ color: "gray" }}>
                                    {t("payment.canceled")}
                                  </span>
                                ) : (
                                  <span style={{ color: "gray" }}>
                                    {t("payment.unknown")}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedDateRows.has(row.id) && (
                          <TableRow>
                            <TableCell
                              colSpan={19}
                              style={{
                                padding: "16px",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <div>
                                <p>
                                  <strong>{t("payment.startDate")}:</strong>{" "}
                                  {new Intl.DateTimeFormat("en-US", {
                                    month: "long",
                                    year: "numeric",
                                  }).format(new Date(row.start_month))}
                                </p>
                                {row.end_month && (
                                  <p>
                                    <strong>{t("payment.endDate")}:</strong>{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                      month: "long",
                                      year: "numeric",
                                    }).format(new Date(row.end_month))}
                                  </p>
                                )}
                                {row.due_date && (
                                  <p>
                                    <strong>{t("payment.dueDate")}:</strong>{" "}
                                    {new Date(
                                      row.due_date
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {expandedFeeRows.has(row.id) && (
                          <TableRow>
                            <TableCell
                              colSpan={19}
                              style={{
                                padding: "16px",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <div>
                                <p>
                                  <strong>{t("payment.fees")}:</strong>
                                </p>
                                <ul>
                                  <li>
                                    {t("payment.rentFee")}: {row.rent_fee}
                                  </li>
                                  <li>
                                    {t("payment.utilityFee")}: {row.utility_fee}
                                  </li>
                                  <li>
                                    {t("payment.otherFee")}: {row.other_fee}
                                  </li>
                                  <li>
                                    {t("payment.penaltyFee")}: {row.penalty_fee}
                                  </li>
                                  <li>
                                    {t("payment.totalFee")}:{" "}
                                    {parseFloat(row.rent_fee ?? 0) *
                                      parseFloat(row.number_of_months ?? 1) +
                                      parseFloat(row.utility_fee ?? 0) +
                                      parseFloat(row.other_fee ?? 0) +
                                      parseFloat(row.penalty_fee ?? 0)}
                                  </li>
                                </ul>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={19} align="center">
                        {t("payment.nopaymentDataAvailable")}
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 20 * emptyRows }}>
                      <TableCell colSpan={19} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={payments.length}
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

export default Payment;
