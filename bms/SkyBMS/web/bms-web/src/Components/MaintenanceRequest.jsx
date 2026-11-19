import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
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
import Checkbox from "@mui/material/Checkbox";
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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import MaintenanceContractorService from "../Services/maintenanceContractor.service";
import MaintenanceRequestService from "../Services/maintenanceRequest.service";
import WorkOrderService from "../Services/workOrder.service";

function EnhancedTableHead(props) {
  const { t } = props;
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceRequest.num"),
    },
    {
      id: "request_id",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceRequest.requestId"),
    },
    {
      id: "building_unit",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceRequest.buildingUnit"),
    },

    {
      id: "request_date",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceRequest.requestDate"),
    },
    {
      id: "description",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceRequest.description"),
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceRequest.status"),
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceRequest.action"),
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
            {selected.name} {t("maintenanceRequest.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("maintenanceRequest.delete")}>
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
          {t("maintenanceRequest.deleteRequest")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("maintenanceRequest.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("maintenanceRequest.no")}
          </Button>
          <Button
            onClick={() => handleDeleteRequest(selected.id)}
            color="info"
            autoFocus
            disabled={loading}
          >
            {t("maintenanceRequest.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const MaintenanceRequest = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
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

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const maintenanceRequests =
        await MaintenanceRequestService.getAllMaintenanceRequests();
      const sortedRequests = maintenanceRequests.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else {
          return 1;
        }
      });
      setMaintenanceRequests(sortedRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchContractors = async () => {
    try {
      setContractorLoading(true);

      const contractors =
        await MaintenanceContractorService.getAllMaintenanceContractors();

      const sortedResponse = contractors.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
        if (a.created_at < b.created_at) {
          return 1;
        }
        return 0;
      });

      setTimeout(() => {
        setContractors(sortedResponse);
        setContractorLoading(false);
      }, 3000);
    } catch (error) {
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
      setContractorLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      formData.request_id = selectedRequest;
      formData.contractor_id = contractorId;
      const newWorkOrder = await WorkOrderService.createWorkOrder(formData);
      if (newWorkOrder.status === 201) {
        setLoading(false);
        setFormData({
          contractor_id: "",
          request_id: "",
          work_description: "",
          scheduled_date: "",
          completion_date: "",
          cost: "",
        });

        setSnackbarMessage(newWorkOrder);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      setModalIsOpen(false);
      fetchMaintenanceRequests();
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(null);
      console.error("Error creating Work Order:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
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
  const handleDelete = (id) => {
    const updatedUsers = maintenanceRequests.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setSelected(null);
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

  const handleDeleteRequest = async (selected) => {
    setLoading(true);
    try {
      await MaintenanceRequestService.deleteMaintenanceRequest(selected);
      setTimeout(() => {
        setSelected(null);
        setOpenDialog(false);
        fetchMaintenanceRequests();
        setLoading(false);
      }, 500);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, maintenanceRequests.length - page * rowsPerPage);

  const visibleRows = maintenanceRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);
  useEffect(() => {
    fetchContractors();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.maintenanceRequests")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("maintenanceRequest.maintenanceRequestInformation")}
            </Typography>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
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
              <IconButton onClick={closeModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h6" gutterBottom className="pb-3">
              {t("maintenanceRequest.createWorkOrder")}
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("maintenanceRequest.contractor")} *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={contractorId}
                  onChange={handleContractorChange}
                  label={t("maintenanceRequest.contractor")}
                  required
                >
                  {contractors.map((contractor) => (
                    <MenuItem key={contractor.id} value={contractor.id}>
                      {contractor.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t("maintenanceRequest.workDescription")}
                margin="dense"
                multiline
                rows={3}
                fullWidth
                name="work_description"
                value={formData.work_description}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                label={t("maintenanceRequest.scheduledDate")}
                type="date"
                fullWidth
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="normal"
                label={t("maintenanceRequest.completionDate")}
                type="date"
                fullWidth
                name="completion_date"
                value={formData.completion_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="normal"
                label={t("maintenanceRequest.cost")}
                type="number"
                fullWidth
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
              />
              <div className="flex justify-end space-x-6 mt-4">
                <Button type="submit" variant="contained" color="inherit">
                  {t("maintenanceRequest.submit")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closeModal}
                >
                  {t("maintenanceRequest.cancel")}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
        <Box sx={{ backgroundColor: "white" }}>
          <EnhancedTableToolbar
            selected={
              selected !== null
                ? maintenanceRequests.find((payment) => payment.id === selected)
                : null
            }
            t={t}
            handleDeleteRequest={handleDeleteRequest}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            loading={loading}
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
                        {t("maintenanceRequest.loading")}
                      </TableCell>
                    </TableRow>
                  ) : maintenanceRequests.length !== 0 ? (
                    visibleRows.map((row, index) => (
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
                        <TableCell component="th" scope="row" padding="normal">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.id.substring(0, 5)}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.building_unit?.building.name.substring(0, 3)} -{" "}
                          {row.building_unit?.floor_no} -{" "}
                          {row.building_unit?.unit_number}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {new Date(row.request_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.description}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.status === "completed" ? (
                            <span style={{ color: "green" }}>
                              {t("maintenanceRequest.completed")}
                            </span>
                          ) : row.status === "pending" ? (
                            <span style={{ color: "orange" }}>
                              {t("maintenanceRequest.pending")}
                            </span>
                          ) : row.status === "processing" ? (
                            <span style={{ color: "orange" }}>
                              {t("maintenanceRequest.processing")}
                            </span>
                          ) : row.status === "canceled" ? (
                            <span style={{ color: "red" }}>
                              {t("maintenanceRequest.canceled")}
                            </span>
                          ) : (
                            <span style={{ color: "gray" }}>
                              {t("maintenanceRequest.unknown")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {row.status === "pending" ? (
                            <>
                              <Tooltip
                                title={t("maintenanceRequest.assignContractor")}
                                style={{ color: "green" }}
                                onClick={(event) =>
                                  handleCreateWorkOrder(event, row.id)
                                }
                              >
                                <AssignmentTurnedInOutlinedIcon />
                              </Tooltip>
                            </>
                          ) : (
                            <div>
                              {row.status === "completed" ? (
                                <span style={{ color: "green" }}>
                                  {t("maintenanceRequest.completed")}
                                </span>
                              ) : row.status === "processing" ? (
                                <span style={{ color: "orange" }}>
                                  {t("maintenanceRequest.processing")}
                                </span>
                              ) : row.status === "canceled" ? (
                                <span style={{ color: "red" }}>
                                  {t("maintenanceRequest.canceled")}
                                </span>
                              ) : (
                                <span style={{ color: "gray" }}>
                                  {t("maintenanceRequest.unknown")}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t("maintenanceRequest.noRequestDataAvailable")}
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

export default MaintenanceRequest;
