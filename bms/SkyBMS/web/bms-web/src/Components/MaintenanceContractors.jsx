import { TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { default as HighlightOffIcon } from "@mui/icons-material/HighlightOff";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
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

function EnhancedTableHead(props) {
  const { t } = props;
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceContractors.num"),
    },
    {
      id: "company_name",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceContractors.companyName"),
    },

    {
      id: "contact_name",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceContractors.contactName"),
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceContractors.email"),
    },
    {
      id: "Phone",
      numeric: false,
      disablePadding: true,
      label: t("maintenanceContractors.phoneNumber"),
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
    handleDeleteContractor,
    openDialog,
    setOpenDialog,
    t,
    loading,
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
            {t("maintenanceContractors.listOfContractors")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected.company_name} {t("maintenanceContractors.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("maintenanceContractors.edit")}>
              <IconButton onClick={() => openEditModal(selected)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("maintenanceContractors.delete")}>
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
          {t("maintenanceContractors.deleteContractor")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("maintenanceContractors.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("maintenanceContractors.no")}
          </Button>
          <Button
            onClick={() => handleDeleteContractor(selected.id)}
            color="info"
            autoFocus
            disabled={loading}
          >
            {t("maintenanceContractors.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const MaintenanceContractors = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedContractorId, setSelectedContractorId] = useState();

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { vertical, horizontal, open } = state;

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const fetchMaintenanceContractors = async () => {
    try {
      setLoading(true);

      const maintenanceContractors =
        await MaintenanceContractorService.getAllMaintenanceContractors();

      const sortedResponse = maintenanceContractors.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
        if (a.created_at < b.created_at) {
          return 1;
        }
        return 0;
      });

      setPayments(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching maintenance contractors:", error);
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contractorData = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      setLoading(true);
      const response =
        await MaintenanceContractorService.createMaintenanceContractor(
          contractorData
        );

      if (response) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setModalIsOpen(false);
        setSuccessMessage(
          t("maintenanceContractors.maintenanceContractorCreatedSuccessfully")
        );
        setFormData({ companyName: "", contactName: "", email: "", phone: "" });
        setLoading(false);
        fetchMaintenanceContractors();
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors);
        const errorMessage = Object.values(error.response.data.errors);
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      } else {
        const errorMessage = Object.values(error.message);
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const contractorData = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone,
    };
    try {
      setLoading(true);
      const response =
        await MaintenanceContractorService.updateMaintenanceContractor(
          selectedContractorId,
          contractorData
        );

      if (response) {
        setError(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setEditModalIsOpen(false);
        setSuccessMessage(
          t("maintenanceContractors.maintenanceContractorUpdatedSuccessfully")
        );
        setFormData({ companyName: "", contactName: "", email: "", phone: "" });
        setLoading(false);
        fetchMaintenanceContractors();
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors);
        const errorMessage = Object.values(error.response.data.errors);
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      } else {
        const errorMessage = Object.values(error.message);
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      }
    }
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const openEditModal = (selectedContractor) => {
    setEditModalIsOpen(true);
    setSelectedContractorId(selectedContractor.id);
    setFormData({
      company_name: selectedContractor.company_name,
      contact_name: selectedContractor.contact_name,
      email: selectedContractor.email,
      phone: selectedContractor.phone,
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
    });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setFormData({
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
    });
  };

  const handleSelect = (event, id) => {
    setSelected(selected === id ? null : id);
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

  const handleDeleteContractor = async (selected) => {
    setLoading(true);

    try {
      await MaintenanceContractorService.deleteMaintenanceContractor(selected);

      setTimeout(() => {
        setSelected(null);
        setOpenDialog(false);
        fetchMaintenanceContractors();
        setLoading(false);
      }, 500);
    } catch (error) {
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Allow only numbers and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, payments.length - page * rowsPerPage);

  const visibleRows = payments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  useEffect(() => {
    fetchMaintenanceContractors();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.contractors")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pt-4 pb-10">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#909aab", alignSelf: "start" }}
            >
              {t("maintenanceContractors.maintenanceContractorsInformation")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className="flex items-center text-white font-bold py-2 px-4 rounded mt-4 ml-4 hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-600"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("maintenanceContractors.createNewContractor")}
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Building Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
          overlayClassName="Overlay fixed inset-0"
        >
          <div className="bg-white lg:w-1/3 md:w-1/2 rounded-lg p-6 ">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("maintenanceContractors.createNewContractor")}
              </Typography>
              <div className="flex justify-end">
                <IconButton onClick={closeModal}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="companyName"
                  label={t("maintenanceContractors.companyName")}
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  autoComplete="company-name"
                  autoFocus
                />

                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="contactName"
                  label={t("maintenanceContractors.contactName")}
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  autoComplete="contact-name"
                />

                <TextField
                  className="mb-4 px-4 py-2 rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t("maintenanceContractors.email")}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label={t("maintenanceContractors.phoneNumber")}
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  autoComplete="phone"
                  inputProps={{
                    pattern: "\\d{10}",
                    title: t(
                      "maintenanceContractors.phoneNumberValidationTitle"
                    ),
                  }}
                  helperText={t(
                    "maintenanceContractors.phoneNumberValidationhelperText"
                  )}
                />

                <div className="flex justify-end py-4">
                  <Button type="submit" color="inherit" disabled={loading}>
                    {loading
                      ? t("maintenanceContractors.creating")
                      : t("maintenanceContractors.create")}
                  </Button>
                  <Button color="warning" onClick={closeModal} className="ml-4">
                    {t("maintenanceContractors.cancel")}
                  </Button>
                </div>
              </form>
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
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Create Building Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
          overlayClassName="Overlay fixed inset-0"
        >
          <div className="bg-white lg:w-1/3 md:w-1/2 rounded-lg p-6 ">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("maintenanceContractors.editContractor")}
              </Typography>
              <div className="flex justify-end">
                <IconButton onClick={closeEditModal}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
            </div>
            <div>
              <form onSubmit={handleUpdate}>
                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="companyName"
                  label={t("maintenanceContractors.companyName")}
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  autoComplete="company-name"
                  autoFocus
                />

                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="contactName"
                  label={t("maintenanceContractors.contactName")}
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  autoComplete="contact-name"
                />

                <TextField
                  className="mb-4 px-4 py-2 rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t("maintenanceContractors.email")}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <TextField
                  className="rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label={t("maintenanceContractors.phoneNumber")}
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  autoComplete="phone"
                  inputProps={{
                    pattern: "\\d{10}",
                    title: t(
                      "maintenanceContractors.phoneNumberValidationTitle"
                    ),
                  }}
                  helperText={t(
                    "maintenanceContractors.phoneNumberValidationhelperText"
                  )}
                />

                <div className="flex justify-end py-4">
                  <Button type="submit" color="inherit" disabled={loading}>
                    {loading
                      ? t("maintenanceContractors.updating")
                      : t("maintenanceContractors.update")}
                  </Button>
                  <Button
                    color="warning"
                    onClick={closeEditModal}
                    className="ml-4"
                  >
                    {t("maintenanceContractors.cancel")}
                  </Button>
                </div>
              </form>
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
            t={t}
            handleDeleteContractor={handleDeleteContractor}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            loading={loading}
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
                      <TableCell colSpan={7} align="center">
                        {t("maintenanceContractors.loading")}
                      </TableCell>
                    </TableRow>
                  ) : payments.length !== 0 ? (
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
                          {row.company_name}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          {row.contact_name}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          {row.email}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          {row.phone}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t("maintenanceContractors.noContractorDataAvailable")}
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 20 * emptyRows }}>
                      <TableCell colSpan={7} />
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

export default MaintenanceContractors;
