import { TextField } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, Typography } from "@mui/material";
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
import ClipLoader from "react-spinners/ClipLoader";
import AuthService from "../../Services/auth.service";
import UserService from "../../Services/user.service";

function EnhancedTableHead(props) {
  const { t } = useTranslation();
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: false,
      label: t("user.number"),
    },
    {
      id: "full_name",
      numeric: false,
      disablePadding: true,
      label: t("user.fullName"),
    },
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: t("user.userName"),
    },

    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: t("user.email"),
    },
    {
      id: "phone_number",
      numeric: false,
      disablePadding: false,
      label: t("user.phone_number"),
    },
    {
      id: "password",
      numeric: false,
      disablePadding: false,
      label: t("user.password"),
    },
  ];

  return (
    <TableHead>
      <TableRow style={{ paddingLeft: "10px" }}>
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
  const { t } = useTranslation();

  const { selected, onDelete, openEditModal } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(selected.id);
    setOpenDialog(false);
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
            {t("user.userList")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected.full_name} {t("user.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("user.edit")}>
              <IconButton onClick={() => openEditModal(selected)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("user.delete")}>
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
          {t("user.deleteUser")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("user.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("user.no")}
          </Button>
          <Button onClick={handleConfirmDelete} color="info" autoFocus>
            {t("user.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const User = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({ phone_number: "" });

  const { vertical, horizontal, open } = state;

  const [formData, setFormData] = useState({
    full_name: "",
    user_name: "",
    email: "",
    phone_number: "",
  });
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(number);
  };
  const handleChange = (e) => {
    if (e.target.name === "phone_number") {
      if (!validatePhoneNumber(e.target.value)) {
        setErrors({
          ...errors,
          phone_number: t("user.invalidPhoneNumber"),
        });
      } else {
        setErrors({
          ...errors,
          phone_number: "",
        });
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    try {
      if (Object.values(errors).some((error) => error !== "")) {
        setModalIsOpen(true);
        setCreateLoading(false);
      } else {
        const response = await AuthService.register(formData);

        if (response.status === 201) {
          setCreateLoading(false);
          setError(null);
          const newState = { vertical: "bottom", horizontal: "center" };
          setState({ ...newState, open: true });
          setModalIsOpen(false);
          setSuccessMessage(response.data.message);
          setFormData({
            full_name: "",
            user_name: "",
            email: "",
            phone_number: "",
          });
          setConfirmPassword("");
          window.location.reload();
        }
      }
    } catch (error) {
      setCreateLoading(false);
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors);
        const errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      } else {
        console.error("Error:", error);
      }
    }
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    try {
      if (Object.values(errors).some((error) => error !== "")) {
        setModalIsOpen(true);
        setCreateLoading(false);
      } else {
        const response = await UserService.updateUser(selectedUserId, formData);

        if (response.status === 200) {
          setCreateLoading(false);
          setError(null);
          const newState = { vertical: "bottom", horizontal: "center" };
          setState({ ...newState, open: true });
          setModalIsOpen(false);
          setSuccessMessage(response.data.message);
          setFormData({
            full_name: "",
            user_name: "",
            email: "",
            phone_number: "",
          });
          setConfirmPassword("");
          window.location.reload();
        }
      }
    } catch (error) {
      setCreateLoading(false);
      if (error.response && error.response.data.errors) {
        console.log(error.response.data.errors);
        const errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMessage);
        setSuccessMessage(null);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      } else {
        console.error("Error:", error);
      }
    }
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
    });
  };

  const openEditModal = (selected) => {
    setEditModalIsOpen(true);
    setSelectedUserId(selected.id);
    setFormData({
      full_name: selected.full_name,
      user_name: selected.user_name,
      email: selected.email,
      phone_number: selected.phone_number?.startsWith("+251")
        ? selected.phone_number?.slice(4)
        : selected.phone_number,
    });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setFormData({
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
    });
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const users = await UserService.getAllUsers();
      const sortedResponse = users.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      const filteredUsers = sortedResponse.filter((user) => {
        return !user.roles.some((role) => role.name === "admin");
      });

      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setSelected(selected === id ? null : id);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await UserService.deleteUser(id);
      setTimeout(() => {
        setSelected(null);
        fetchUsers();
        setLoading(false);
      }, 500);
    } catch (error) {
      setSuccessMessage(null);
      setError(error);
      setLoading(false);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const firstUserId = users.length > 0 ? users[0].id : null;
      setSelected(firstUserId);
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

  const handleTogglePasswordVisibility = (event, id) => {
    event.stopPropagation();
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [id]: !prevVisibility[id],
    }));
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  const visibleRows = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.users")}</title>
      </Helmet>
      <>
        <div className="flex justify-between items-center py-7 ">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("user.listOfUsers")}
            </Typography>
          </div>

          {/* <button
            onClick={openModal}
            className="flex items-center text-white font-bold py-2 px-4 rounded mt-4 ml-4 hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-600"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("user.createNewUser")}
          </button> */}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create User Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
          overlayClassName="Overlay fixed inset-0"
        >
          <div className="bg-white lg:w-1/3 md:w-1/2 rounded-lg p-6 ">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("user.createNewUser")}
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
                  className=" rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label={t("user.fullName")}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  autoFocus
                />
                <TextField
                  className=" rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="user_name"
                  label={t("user.userName")}
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                />

                <TextField
                  className="mb-4 px-4 py-2 rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t("user.emailAddress")}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div className="flex items-center mb-4">
                  <div className="mr-2 text-gray-700 text-l">+251</div>

                  <TextField
                    className="mb-4 px-4 py-2 rounded border border-gray-300"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="phone_number"
                    label={t("user.phone_number")}
                    name="phone_number"
                    autoComplete="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                </div>

                <div className="flex justify-end py-4 ">
                  {createLoading ? (
                    <ClipLoader
                      color="#3182CE"
                      loading={createLoading}
                      data-testid="loader"
                      size={30}
                    />
                  ) : (
                    <button
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: "#3182CE", color: "white" }}
                      className="text-white py-2 px-10 rounded  transition-all duration-200 self-stretch mt-4"
                    >
                      {t("user.create")}
                    </button>
                  )}
                </div>
              </form>{" "}
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
          contentLabel="Edit User Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
          overlayClassName="Overlay fixed inset-0"
        >
          <div className="bg-white lg:w-1/3 md:w-1/2 rounded-lg p-6 ">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("user.editUser")}
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
                  className=" rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label={t("user.fullName")}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  autoFocus
                />
                <TextField
                  className=" rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="user_name"
                  label={t("user.userName")}
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                />

                <TextField
                  className="mb-4 px-4 py-2 rounded border border-gray-300"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t("user.emailAddress")}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div className="flex items-center mb-4">
                  <div className="mr-2 text-gray-700 text-l">+251</div>

                  <TextField
                    className="mb-4 px-4 py-2 rounded border border-gray-300"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="phone_number"
                    label={t("user.phone_number")}
                    name="phone_number"
                    autoComplete="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                </div>

                <div className="flex justify-end py-4 ">
                  {createLoading ? (
                    <ClipLoader
                      color="#3182CE"
                      loading={createLoading}
                      data-testid="loader"
                      size={30}
                    />
                  ) : (
                    <button
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: "#3182CE", color: "white" }}
                      className="text-white py-2 px-10 rounded  transition-all duration-200 self-stretch mt-4"
                    >
                      {t("user.update")}
                    </button>
                  )}
                </div>
              </form>{" "}
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
        <Box sx={{ width: "100%", backgroundColor: "white" }}>
          {/* <Paper sx={{ width: "100%", mb: 2 }}> */}
          <EnhancedTableToolbar
            selected={
              selected !== null
                ? users.find((user) => user.id === selected)
                : null
            }
            onDelete={handleDelete}
            openEditModal={openEditModal}
          />
          <TableContainer>
            <Box sx={{ width: "100%" }}>
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

            <Table
              aria-labelledby="tableTitle"
              className="min-w-full divide-y divide-gray-200 shadow-md border border-gray-200 rounded-lg overflow-hidden"
            >
              <EnhancedTableHead
                numSelected={selected !== null ? 1 : 0}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={16} align="center">
                      {t("user.loading")}
                    </TableCell>
                  </TableRow>
                ) : users.length !== 0 ? (
                  visibleRows.map((row, index) => (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isSelected(row.id)}
                      key={row.id}
                      selected={isSelected(row.id)}
                      sx={{ cursor: "pointer" }}
                      className={`hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <TableCell
                        padding="checkbox"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <Checkbox
                          color="primary"
                          checked={isSelected(row.id)}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="normal"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {row.full_name}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {row.user_name}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {row.phone_number}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="px-6 py-4 whitespace-nowrap flex items-center"
                      >
                        {passwordVisibility[row.id]
                          ? row.unhashed_password
                          : "******"}
                        <IconButton
                          onClick={(event) =>
                            handleTogglePasswordVisibility(event, row.id)
                          }
                          size="small"
                          aria-label={
                            passwordVisibility[row.id]
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {passwordVisibility[row.id] ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} align="center">
                      {t("user.noUserData")}
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 20 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* </Paper> */}
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

export default User;
