import IconButton from "@material-ui/core/IconButton";
import ApproveIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  default as HighlightOffIcon,
  default as RejectIcon,
} from "@mui/icons-material/HighlightOff";
import { TextField, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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
import WorkOrderService from "../Services/workOrder.service";

function EnhancedTableHead(props) {
  const { t } = props;
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceWorkOrders.num"),
    },
    {
      id: "request_id",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceWorkOrders.requestId"),
    },
    {
      id: "building_unit",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceWorkOrders.buildingUnit"),
    },
    {
      id: "contractor_name",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceWorkOrders.contractorName"),
    },
    {
      id: "work_description",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.workDescription"),
    },

    {
      id: "scheduled_date",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.scheduledDate"),
    },
    {
      id: "completion_date",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.completionDate"),
    },
    {
      id: "cost",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.cost"),
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.status"),
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: t("maintenanceWorkOrders.action"),
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
    handleDeleteWorkOrder,
    openDialog,
    setOpenDialog,
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
            {t("maintenanceWorkOrders.listOfWorkOrders")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected?.request_id.substring(0, 5)}{" "}
            {t("maintenanceWorkOrders.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("maintenanceWorkOrders.edit")}>
              <IconButton onClick={() => openEditModal(selected)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("maintenanceWorkOrders.delete")}>
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
          {t("maintenanceWorkOrders.deleteRequest")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("maintenanceWorkOrders.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("maintenanceWorkOrders.no")}
          </Button>
          <Button
            onClick={() => handleDeleteWorkOrder(selected.id)}
            color="info"
            autoFocus
          >
            {t("maintenanceWorkOrders.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const MaintenanceWorkOrders = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    contractor_id: "",
    request_id: "",
    work_description: "",
    scheduled_date: "",
    completion_date: "",
    cost: "",
  });
  const [users, setUsers] = useState([]);
  const [contractorId, setContractorId] = useState("");
  const [workOrders, setWorkOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState();
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [contractorLoading, setContractorLoading] = useState(false);

  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const workOrders = await WorkOrderService.getAllWorkOrders();
      const sortedResponse = workOrders.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
        return 0;
      });
      setWorkOrders(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching work orders:", error);
      setSuccessMessage(null);
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
      setSuccessMessage(null);
      setError(error.message);
      setContractorLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      formData.contractor_id = contractorId;
      const newWorkOrder = await WorkOrderService.updateWorkOrder(
        selectedWorkOrder,
        formData
      );
      if (newWorkOrder.status === 200) {
        setLoading(false);
        setFormData({
          contractor_id: "",
          request_id: "",
          work_description: "",
          scheduled_date: "",
          completion_date: "",
          cost: "",
        });

        setSuccessMessage(newWorkOrder);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      setEditModalIsOpen(false);
      fetchWorkOrders();
    } catch (error) {
      setLoading(false);
      setSuccessMessage(null);
      console.error("Error creating building unit:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };
  const openEditModal = (selectedWorkOrder) => {
    setEditModalIsOpen(true);
    setContractorId(selectedWorkOrder.contractor_id);
    setSelectedWorkOrder(selectedWorkOrder.id);
    setFormData({
      contractor_id: "",
      request_id: selectedWorkOrder.request_id,
      work_description: selectedWorkOrder.work_description,
      scheduled_date: selectedWorkOrder.scheduled_date,
      completion_date: selectedWorkOrder.completion_date,
      cost: selectedWorkOrder.cost,
    });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setContractorId("");
    setFormData({
      contractor_id: "",
      request_id: "",
      work_description: "",
      scheduled_date: "",
      completion_date: "",
      cost: "",
    });
  };

  const handleSelect = (event, id) => {
    setSelected(selected === id ? null : id);
  };
  const handleDelete = (id) => {
    const updatedUsers = workOrders.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setSelected(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const firstPaymentId = workOrders.length > 0 ? workOrders[0].id : null;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContractorChange = (event) => {
    setContractorId(event.target.value);
  };

  const completeWorkOrder = async (event, rowId) => {
    event.stopPropagation();
    try {
      const response = await WorkOrderService.completeWorkOrder(rowId);

      if (response.status === 200) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setSuccessMessage(t("maintenanceWorkOrders.workOrderCompleted"));
        fetchWorkOrders();
      }
    } catch (error) {
      setError("Error updating work order" + error.message);
      setSuccessMessage(null);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const cancelWorkOrder = async (event, rowId) => {
    event.stopPropagation();
    try {
      const response = await WorkOrderService.cancelWorkOrder(rowId);

      if (response.status === 200) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setSuccessMessage(t("maintenanceWorkOrders.workOrderCanceled"));
        fetchWorkOrders();
      }
    } catch (error) {
      setError("Error updating work order" + error.message);
      setSuccessMessage(null);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleDeleteWorkOrder = async (selected) => {
    setOpenDialog(false);
    setLoading(true);
    try {
      await WorkOrderService.deleteWorkOrder(selected);
      setTimeout(() => {
        setSelected(null);
        setOpenDialog(false);
        fetchWorkOrders();
        setLoading(false);
      }, 500);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, workOrders.length - page * rowsPerPage);

  const visibleRows = workOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  useEffect(() => {
    fetchWorkOrders();
  }, []);
  useEffect(() => {
    fetchContractors();
  }, [editModalIsOpen]);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.workOrders")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("maintenanceWorkOrders.workOrderInformation")}
            </Typography>
          </div>
        </div>

        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
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
              <IconButton onClick={closeEditModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h6" gutterBottom className="pb-3">
              {t("maintenanceRequest.createWorkOrder")}
            </Typography>
            <form onSubmit={handleUpdate}>
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
                  onClick={closeEditModal}
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
                ? workOrders.find((payment) => payment.id === selected)
                : null
            }
            t={t}
            handleDeleteWorkOrder={handleDeleteWorkOrder}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
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
              <Table aria-labelledby="tableTitle" sx={{ minWidth: 1000 }}>
                <EnhancedTableHead
                  numSelected={selected !== null ? 1 : 0}
                  onSelectAllClick={handleSelectAllClick}
                  t={t}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        {t("maintenanceWorkOrders.loading")}
                      </TableCell>
                    </TableRow>
                  ) : workOrders.length !== 0 ? (
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
                          {row.request?.id.substring(0, 5)}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          {row.request?.building_unit.floor_no} {" - "}{" "}
                          {row.request?.building_unit.unit_number}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.contractor?.company_name}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.work_description}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {new Date(row.scheduled_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {new Date(row.completion_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.cost}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.status === "completed" ? (
                            <span style={{ color: "green" }}>
                              {t("maintenanceWorkOrders.completed")}
                            </span>
                          ) : row.status === "in_progress" ? (
                            <span style={{ color: "orange" }}>
                              {t("maintenanceWorkOrders.inProgress")}
                            </span>
                          ) : row.status === "canceled" ? (
                            <span style={{ color: "red" }}>
                              {t("maintenanceWorkOrders.canceled")}
                            </span>
                          ) : (
                            <span style={{ color: "gray" }}>
                              {t("maintenanceWorkOrders.unknown")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.status === "in_progress" ? (
                            <div className="flex">
                              <>
                                <Tooltip
                                  title={t(
                                    "maintenanceWorkOrders.completeMaintenanceService"
                                  )}
                                  style={{
                                    color: "green",
                                    marginRight: 5,
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) =>
                                    completeWorkOrder(event, row.id)
                                  }
                                >
                                  <ApproveIcon />
                                </Tooltip>
                              </>

                              <>
                                <Tooltip
                                  title={t(
                                    "maintenanceWorkOrders.cancelMaintenanceService"
                                  )}
                                  style={{
                                    color: "red",
                                    marginRight: 5,
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) =>
                                    cancelWorkOrder(event, row.id)
                                  }
                                >
                                  <RejectIcon />
                                </Tooltip>
                              </>
                            </div>
                          ) : (
                            <div>
                              {row.status === "completed" ? (
                                <span style={{ color: "green" }}>
                                  {t("maintenanceWorkOrders.completed")}
                                </span>
                              ) : row.status === "canceled" ? (
                                <span style={{ color: "red" }}>
                                  {t("maintenanceWorkOrders.canceled")}
                                </span>
                              ) : (
                                <span style={{ color: "gray" }}>
                                  {t("maintenanceWorkOrders.unknown")}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} align="center">
                        {t("maintenanceWorkOrders.noworkOrderDataAvailable")}
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 20 * emptyRows }}>
                      <TableCell colSpan={11} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={workOrders.length}
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

export default MaintenanceWorkOrders;
