import { TextField } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Grid, IconButton, Skeleton, Typography } from "@mui/material";
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
import PermissionService from "../Services/permission.service";
import RoleService from "../Services/role.service";

function EnhancedTableHead(props) {
  const { t } = useTranslation();
  const headCells = [
    {
      id: "no",
      numeric: false,
      disablePadding: false,
      label: t("role.number"),
    },
    {
      id: "role_name",
      numeric: false,
      disablePadding: true,
      label: t("role.roleName"),
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
            {t("role.roleList")}
          </Typography>
        ) : (
          <Typography variant="subtitle1" component="div">
            {selected.full_name} {t("role.selected")}
          </Typography>
        )}
        {selected !== null && (
          <>
            <Tooltip title={t("role.edit")}>
              <IconButton onClick={() => openEditModal(selected)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("role.delete")}>
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
          {t("role.deleteRole")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("role.deleteConfirmation")}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("role.no")}
          </Button>
          <Button onClick={handleConfirmDelete} color="info" autoFocus>
            {t("role.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const SkeletonCard = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Skeleton variant="text" width="80%" height={40} />
    <Skeleton variant="text" width="80%" height={30} />
    <Skeleton variant="text" width="80%" height={30} />
    <Skeleton variant="text" width="80%" height={30} />
    <div
      style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}
    >
      <Skeleton variant="text" width={100} height={36} />
      <Skeleton
        variant="text"
        width={100}
        height={36}
        style={{ marginLeft: "10px" }}
      />
    </div>
  </Grid>
);

const Role = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
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

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({ phone_number: "" });

  const { vertical, horizontal, open } = state;

  const [formData, setFormData] = useState({
    role_name: "",
    building_write: false,
    building_view: false,
    building_edit: false,
    building_delete: false,
    buildingunit_write: false,
    buildingunit_view: false,
    buildingunit_edit: false,
    buildingunit_delete: false,
    tenant_write: false,
    tenant_view: false,
    tenant_edit: false,
    tenant_delete: false,
    users_write: false,
    users_view: false,
    users_edit: false,
    users_delete: false,
    roles_write: false,
    roles_view: false,
    roles_edit: false,
    roles_delete: false,
    lease_write: false,
    lease_view: false,
    lease_edit: false,
    lease_delete: false,
    payment_write: false,
    payment_view: false,
    payment_edit: false,
    payment_delete: false,
    maintenance_request_write: false,
    maintenance_request_view: false,
    maintenance_request_edit: false,
    maintenance_request_delete: false,
    maintenance_contractor_write: false,
    maintenance_contractor_view: false,
    maintenance_contractor_edit: false,
    maintenance_contractor_delete: false,
    work_order_write: false,
    work_order_view: false,
    work_order_edit: false,
    work_order_delete: false,
    tenant_information_report_write: false,
    tenant_information_report_view: false,
    maintenance_request_report_write: false,
    maintenance_request_report_view: false,
    financial_report_write: false,
    financial_report_view: false,
    lease_expiry_report_write: false,
    lease_expiry_report_view: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSelectedRoleName(value);
    setSelectedPermissions((prevPermissions) => {
      if (type === "checkbox") {
        if (checked) {
          return [...prevPermissions, name];
        } else {
          return prevPermissions.filter((permission) => permission !== name);
        }
      }
      return prevPermissions;
    });
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
        const response = await RoleService.createRole({
          name: selectedRoleName,
          permissions: selectedPermissions,
        });

        if (response.status === 201) {
          setCreateLoading(false);
          setError(null);
          const newState = { vertical: "bottom", horizontal: "center" };
          setState({ ...newState, open: true });
          setModalIsOpen(false);
          setSuccessMessage(response.data.message);
          fetchRoles();
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
        const response = await RoleService.updateRole(selectedRoleId, formData);

        if (response.status === 200) {
          setCreateLoading(false);
          setError(null);
          const newState = { vertical: "bottom", horizontal: "center" };
          setState({ ...newState, open: true });
          setModalIsOpen(false);
          setSuccessMessage(response.data.message);
          setFormData({
            role_name: "",
            building_write: false,
            building_view: false,
            building_edit: false,
            building_delete: false,
            buildingunit_write: false,
            buildingunit_view: false,
            buildingunit_edit: false,
            buildingunit_delete: false,
            tenant_write: false,
            tenant_view: false,
            tenant_edit: false,
            tenant_delete: false,
            users_write: false,
            users_view: false,
            users_edit: false,
            users_delete: false,
            roles_write: false,
            roles_view: false,
            roles_edit: false,
            roles_delete: false,
            lease_write: false,
            lease_view: false,
            lease_edit: false,
            lease_delete: false,
            payment_write: false,
            payment_view: false,
            payment_edit: false,
            payment_delete: false,
            maintenance_request_write: false,
            maintenance_request_view: false,
            maintenance_request_edit: false,
            maintenance_request_delete: false,
            maintenance_contractor_write: false,
            maintenance_contractor_view: false,
            maintenance_contractor_edit: false,
            maintenance_contractor_delete: false,
            work_order_write: false,
            work_order_view: false,
            work_order_edit: false,
            work_order_delete: false,
            tenant_information_report_write: false,
            tenant_information_report_view: false,
            maintenance_request_report_write: false,
            maintenance_request_report_view: false,
            financial_report_write: false,
            financial_report_view: false,
            lease_expiry_report_write: false,
            lease_expiry_report_view: false,
          });

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
      role_name: "",
      building_write: false,
      building_view: false,
      building_edit: false,
      building_delete: false,
      buildingunit_write: false,
      buildingunit_view: false,
      buildingunit_edit: false,
      buildingunit_delete: false,
      tenant_write: false,
      tenant_view: false,
      tenant_edit: false,
      tenant_delete: false,
      users_write: false,
      users_view: false,
      users_edit: false,
      users_delete: false,
      roles_write: false,
      roles_view: false,
      roles_edit: false,
      roles_delete: false,
      lease_write: false,
      lease_view: false,
      lease_edit: false,
      lease_delete: false,
      payment_write: false,
      payment_view: false,
      payment_edit: false,
      payment_delete: false,
      maintenance_request_write: false,
      maintenance_request_view: false,
      maintenance_request_edit: false,
      maintenance_request_delete: false,
      maintenance_contractor_write: false,
      maintenance_contractor_view: false,
      maintenance_contractor_edit: false,
      maintenance_contractor_delete: false,
      work_order_write: false,
      work_order_view: false,
      work_order_edit: false,
      work_order_delete: false,
      tenant_information_report_write: false,
      tenant_information_report_view: false,
      maintenance_request_report_write: false,
      maintenance_request_report_view: false,
      financial_report_write: false,
      financial_report_view: false,
      lease_expiry_report_write: false,
      lease_expiry_report_view: false,
    });
  };

  const openEditModal = (selected) => {
    setEditModalIsOpen(true);
    setSelectedRoleId(selected.id);
    setFormData({
      full_name: selected.full_name,
      role_name: selected.role_name,
      email: selected.email,
      phone_number: selected.phone_number,
    });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setFormData({
      full_name: "",
      role_name: "",
      email: "",
      phone_number: "",
    });
  };

  const fetchRoles = async () => {
    setLoading(true);

    try {
      const roles = await RoleService.getAllRoles();
      const sortedResponse = roles.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      const filteredRoles = sortedResponse.filter(
        (role) => role.name !== "admin"
      );

      setRoles(filteredRoles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setPermissionLoading(true);

    try {
      const permissions = await PermissionService.getAllPermissions();
      const sortedResponse = permissions.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setPermissions(sortedResponse);
      setPermissionLoading(false);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setSuccessMessage(null);
      setError(error.message);
      setPermissionLoading(false);
    }
  };

  const handleClick = (event, id) => {
    setSelected(selected === id ? null : id);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await RoleService.deleteRole(id);
      setTimeout(() => {
        setSelected(null);
        fetchRoles();
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
      const firstRoleId = roles.length > 0 ? roles[0].id : null;
      setSelected(firstRoleId);
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
    rowsPerPage - Math.min(rowsPerPage, roles.length - page * rowsPerPage);

  const visibleRows = roles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isSelected = (id) => selected === id;

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const groupName = permission.permission_group.name;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(permission);
    return acc;
  }, {});

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (modalIsOpen) {
      fetchPermissions();
    }
  }, [modalIsOpen]);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.roles")}</title>
      </Helmet>
      <>
        <div className="flex justify-between items-center py-7 ">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("role.listOfRoles")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className="flex items-center text-white font-bold py-2 px-4 rounded mt-4 ml-4 hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-600"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("role.createNewRole")}
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Role Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
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
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-2xl overflow-y-auto hidden-scrollbar">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("role.createNewRole")}
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
                  id="role_name"
                  label={t("role.roleName")}
                  name="role_name"
                  value={selectedRoleName}
                  onChange={handleChange}
                  autoComplete="role-name"
                  autoFocus
                />

                {/* Permissions Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 mt-2">
                    {t("role.permissions")}
                  </h3>
                  {permissionLoading ? (
                    <Grid container>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                      ))}
                    </Grid>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(groupedPermissions).map(
                        ([groupName, perms]) => (
                          <div key={groupName} className="mb-2">
                            <h4 className="font-medium text-lg mb-2">
                              {groupName}
                            </h4>
                            <label className="flex items-center mb-2 text-lg">
                              <input
                                type="checkbox"
                                className="mr-2"
                                style={{ width: "15px", height: "15px" }}
                                checked={perms.every(({ id }) =>
                                  selectedPermissions.includes(id)
                                )} // Check if all permissions in this group are selected
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    setSelectedPermissions((prev) => [
                                      ...new Set([
                                        ...prev,
                                        ...perms.map(({ id }) => id),
                                      ]),
                                    ]);
                                  } else {
                                    setSelectedPermissions((prev) =>
                                      prev.filter(
                                        (permissionId) =>
                                          !perms
                                            .map(({ id }) => id)
                                            .includes(permissionId)
                                      )
                                    );
                                  }
                                }}
                              />
                              Select All
                            </label>
                            {perms.map(({ id, name }) => (
                              <label
                                key={id}
                                className="flex items-center mb-1 text-lg"
                              >
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  style={{ width: "15px", height: "15px" }}
                                  name={name}
                                  checked={selectedPermissions.includes(id)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedPermissions((prev) => {
                                      if (isChecked) {
                                        return [...new Set([...prev, id])];
                                      } else {
                                        return prev.filter(
                                          (permissionId) => permissionId !== id
                                        );
                                      }
                                    });
                                  }}
                                />
                                {name}
                              </label>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end py-4">
                  <button
                    type="submit"
                    style={{ backgroundColor: "#3182CE", color: "white" }}
                    className="text-white py-2 px-10 rounded transition-all duration-200 self-stretch mt-4"
                  >
                    Create Role
                  </button>
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
          contentLabel="Edit Role Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
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
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-2xl overflow-y-auto hidden-scrollbar">
            <div className="flex justify-between items-center">
              <Typography variant="h6" gutterBottom>
                {t("role.editRole")}
              </Typography>
              <div className="flex justify-end">
                <IconButton onClick={closeEditModal}>
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
                  id="role_name"
                  label={t("role.roleName")}
                  name="role_name"
                  value={selectedRoleName}
                  onChange={handleChange}
                  autoComplete="role-name"
                  autoFocus
                />

                {/* Permissions Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 mt-2">
                    {t("role.permissions")}
                  </h3>
                  {permissionLoading ? (
                    <Grid container>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                      ))}
                    </Grid>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(groupedPermissions).map(
                        ([groupName, perms]) => (
                          <div key={groupName} className="mb-2">
                            <h4 className="font-medium text-lg mb-2">
                              {groupName}
                            </h4>
                            <label className="flex items-center mb-2 text-lg">
                              <input
                                type="checkbox"
                                className="mr-2"
                                style={{ width: "15px", height: "15px" }}
                                checked={perms.every(({ id }) =>
                                  selectedPermissions.includes(id)
                                )} // Check if all permissions in this group are selected
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    setSelectedPermissions((prev) => [
                                      ...new Set([
                                        ...prev,
                                        ...perms.map(({ id }) => id),
                                      ]),
                                    ]);
                                  } else {
                                    setSelectedPermissions((prev) =>
                                      prev.filter(
                                        (permissionId) =>
                                          !perms
                                            .map(({ id }) => id)
                                            .includes(permissionId)
                                      )
                                    );
                                  }
                                }}
                              />
                              Select All
                            </label>
                            {perms.map(({ id, name }) => (
                              <label
                                key={id}
                                className="flex items-center mb-1 text-lg"
                              >
                                <input
                                  type="checkbox"
                                  className="mr-2"
                                  style={{ width: "15px", height: "15px" }}
                                  name={name}
                                  checked={selectedPermissions.includes(id)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedPermissions((prev) => {
                                      if (isChecked) {
                                        return [...new Set([...prev, id])];
                                      } else {
                                        return prev.filter(
                                          (permissionId) => permissionId !== id
                                        );
                                      }
                                    });
                                  }}
                                />
                                {name}
                              </label>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end py-4">
                  <button
                    type="submit"
                    style={{ backgroundColor: "#3182CE", color: "white" }}
                    className="text-white py-2 px-10 rounded transition-all duration-200 self-stretch mt-4"
                  >
                    Create Role
                  </button>
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

        <Box sx={{ width: "100%", backgroundColor: "white" }}>
          {/* <Paper sx={{ width: "100%", mb: 2 }}> */}
          <EnhancedTableToolbar
            selected={
              selected !== null
                ? roles.find((role) => role.id === selected)
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
                      {t("role.loading")}
                    </TableCell>
                  </TableRow>
                ) : roles.length !== 0 ? (
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
                        {row.name}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} align="center">
                      {t("role.noRoleData")}
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
            count={roles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* </Paper> */}
        </Box>
        <div className="mt-8">{/* <RoleList roles={roles} /> */}</div>
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

export default Role;
