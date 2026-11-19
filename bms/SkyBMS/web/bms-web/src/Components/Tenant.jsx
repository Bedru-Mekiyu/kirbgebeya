import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";
import BusinessService from "../Services/business.service";
import BusinessOwnerService from "../Services/businessOwner.service";
import BusinessTypeService from "../Services/businessType.service";
import TenantService from "../Services/tenant.service";
import UserService from "../Services/user.service";
import NoDataCard from "./NoDataCard";

const Tenant = () => {
  const { t } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [tenant, setTenant] = useState("");
  const [tenantResponse, setTenantResponse] = useState([]);
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [numberOfYearsInBusiness, setNumberOfYearsInBusiness] = useState("");
  const [business, setBusiness] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState();
  const [businessOwner, setBusinessOwner] = useState([]);
  const [users, setUsers] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage, setTenantsPerPage] = useState(8);

  const [errors, setErrors] = useState({ phone_number: "" });

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newOwnerModalIsOpen, setNewOwnerModalIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };
  const [createLoading, setCreateLoading] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
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
  const handleUserInfoChange = (e) => {
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

  const fetchTenant = async () => {
    setTenantLoading(true);
    try {
      const tenant = await TenantService.getAllTenants();
      const sortedResponse = tenant.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setTenantResponse(sortedResponse);
      setTenantLoading(false);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      setTenantLoading(false);
    }
  };

  const filteredTenants = tenantResponse.filter((tenant) =>
    tenant.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstTenant,
    indexOfLastTenant
  );

  const handleItemsPerPageChange = (event) => {
    setTenantsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchTenant();
    fetchBusinessOwner();
    fetchBusiness();
    fetchUsers();
    fetchBusinessTypes();
  }, []);

  const handleChange = (selectedOption) => {
    setOwner(selectedOption);
  };

  const handleChangeBusiness = (event) => {
    setTenant(event.target.value);
  };
  const [tenantModalIsOpen, setTenantModalIsOpen] = useState(false);
  const [tenantData, setTenantData] = useState({
    name: "",
  });

  const handleChangeUser = (selectedOption) => {
    setUserId(selectedOption);
  };

  const handleChangeBusinessType = (selectedOption) => {
    setTypeOfBusiness(selectedOption);
  };

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const business = await BusinessService.getAllBusinesses();
      const sortedResponse = business.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      setBusiness(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching business:", error);
      setLoading(false);
    }
  };

  const fetchBusinessOwner = async () => {
    try {
      const businessOwner = await BusinessOwnerService.getAllBusinessOwners();
      const sortedResponse = businessOwner.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setBusinessOwner(sortedResponse);
    } catch (error) {
      console.error("Error fetching business Owner:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const fetchUsers = async () => {
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
    } catch (error) {
      console.error("Error fetching Users:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const businessTypes = await BusinessTypeService.getAllBusinessTypes();
      const sortedResponse = businessTypes.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setBusinessTypes(sortedResponse);
    } catch (error) {
      console.error("Error fetching business types:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleCreateBusiness = async () => {
    const formData = {
      name: name,
      owner_id: owner,
      business_address: businessAddress,
      business_phone_number: businessPhoneNumber,
      business_email: businessEmail,
      type_of_business: typeOfBusiness,
      number_of_years_in_business: numberOfYearsInBusiness,
    };
    try {
      setLoading(true);
      const newBuilding = await BusinessService.createBusiness(formData);
      if (newBuilding.status === 201) {
        setError(null);
        setSuccessMessage(newBuilding.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      }
      setName("");
      setOwner("");
      setBusinessAddress("");
      setBusinessPhoneNumber("");
      setBusinessEmail("");
      setTypeOfBusiness("");
      setNumberOfYearsInBusiness("");
      closeModal();
      fetchBusiness();
      closeTenantModal();
      fetchTenant();
    } catch (error) {
      console.error("Error creating tenant:", error);
      setSuccessMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async () => {
    const formData = {
      name: name,
      owner_id: owner,
      business_address: businessAddress,
      business_phone_number: businessPhoneNumber,
      business_email: businessEmail,
      type_of_business: typeOfBusiness,
      number_of_years_in_business: numberOfYearsInBusiness,
    };
    try {
      setLoading(true);
      const newBuilding = await BusinessService.updateBusiness(
        selectedBusinessId,
        formData
      );
      if (newBuilding.status === 200) {
        setError(null);
        setSuccessMessage(newBuilding.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLoading(false);
      }
      setName("");
      setOwner("");
      setBusinessAddress("");
      setBusinessPhoneNumber("");
      setBusinessEmail("");
      setTypeOfBusiness("");
      setNumberOfYearsInBusiness("");
      closeEditModal();
      fetchBusiness();
      closeTenantModal();
      fetchTenant();
    } catch (error) {
      console.error("Error creating tenant:", error);
      setSuccessMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };

  const handleDeleteBusiness = async () => {
    setLoading(true);
    try {
      await TenantService.deleteTenant(tenantToDelete.id);
      setTimeout(() => {
        setSuccessMessage(null);
        setTenantToDelete(null);
        setConfirmDeleteOpen(false);
        setTenant("");
        setSuccessMessage("Tenant deleted successfully.");
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        fetchTenant();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setSuccessMessage(null);
      setError(null);
      console.error("Error deleting Tenant:", error);
      setSnackbarMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const openEditModal = (tenantResponse) => {
    setEditModalIsOpen(true);
    setSelectedBusinessId(tenantResponse.business_id);
    setName(tenantResponse.business_name);
    setOwner(tenantResponse.owner.id);
    setBusinessAddress(tenantResponse.business_address);
    setBusinessPhoneNumber(tenantResponse.business_phone_number);
    setBusinessEmail(tenantResponse.business_email);
    setTypeOfBusiness(tenantResponse.type_of_business);
    setNumberOfYearsInBusiness(tenantResponse.number_of_years_in_business);
  };

  const openTenantModal = () => {
    setTenantModalIsOpen(true);
  };

  const handleCreateNewOwner = () => {
    setNewOwnerModalIsOpen(true);
  };

  const handleCloseNewOwnerModal = () => {
    setNewOwnerModalIsOpen(false);
    fetchBusinessOwner();
    setFormData({
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
    });
    setCitizenship("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreateLoading(true);

    const newOwnerData = {
      full_name: formData.full_name,
      user_name: formData.user_name,
      email: formData.email,
      phone_number: formData.phone_number,
      citizenship,
    };
    try {
      if (Object.values(errors).some((error) => error !== "")) {
        setNewOwnerModalIsOpen(true);
        setCreateLoading(false);
      } else {
        const newBusinessOwner = await BusinessOwnerService.createBusinessOwner(
          newOwnerData
        );
        if (newBusinessOwner.status === 201) {
          setCreateLoading(false);
          setError(null);
          setSuccessMessage(newBusinessOwner.data.message);
          const newState = { vertical: "bottom", horizontal: "center" };
          setState({ ...newState, open: true });
        }
        setFormData({
          full_name: "",
          user_name: "",
          email: "",
          phone_number: "",
        });
        setCitizenship("");
        setNewOwnerModalIsOpen(false);
        fetchBusinessOwner();
      }
    } catch (error) {
      setCreateLoading(false);
      console.error("Error creating business user:", error);
      setSuccessMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setUserId("");
      setCitizenship("");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setName("");
    setOwner("");
    setBusinessAddress("");
    setBusinessPhoneNumber("");
    setBusinessEmail("");
    setTypeOfBusiness("");
    setNumberOfYearsInBusiness("");
  };

  const closeTenantModal = () => {
    setTenantModalIsOpen(false);
  };

  const openDeleteConfirmation = (tenant) => {
    setTenantToDelete(tenant);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setTenantToDelete(null);
  };

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.tenants")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pb-7 pt-2 mt-4">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("tenant.listOfTenants")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className=" text-white font-bold py-2 px-4 rounded  float-start"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("tenant.createNewTenant")}
          </button>
        </div>
        {loading && (
          <div className=" top-0 left-0 w-full">
            <div className="h-1">
              {/* <LinearProgress
                color="info"
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#fff",
                  },
                }}
              /> */}
            </div>
          </div>
        )}
        <Grid container spacing={2} alignItems="center" className="pb-7">
          <Grid item xs={3} sm={3} lg={3}>
            <TextField
              label={t("tenant.search")}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Divider className="w-full py-2" />
        </Grid>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Tenant Modal"
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
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-md overflow-y-auto hidden-scrollbar">
            <div className="flex justify-end">
              <IconButton onClick={closeModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h5" gutterBottom>
              {t("tenant.createNewTenant")}
            </Typography>
            <div>
              <TextField
                label={t("tenant.name")}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />

              <div className="flex flex-col mb-4">
                <button
                  className="flex items-center"
                  onClick={handleCreateNewOwner}
                >
                  <IconButton>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <span className="ml-2">{t("tenant.createNewOwner")}</span>
                </button>

                <Select
                  className="w-full z-50 mt-2"
                  label={t("tenant.building")}
                  value={owner || ""}
                  required
                  margin="normal"
                  onChange={(e) => handleChange(e.target.value)}
                  displayEmpty
                  inputProps={{
                    "aria-label": t("tenant.selectAnOwner"),
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("tenant.selectAnOwner")}
                  </MenuItem>
                  {businessOwner.map((bo) => (
                    <MenuItem key={bo.id} value={bo.id}>
                      {bo.user.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <TextField
                label={t("tenant.businessAddress")}
                variant="outlined"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label={t("tenant.businessPhoneNumber")}
                variant="outlined"
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
                required
              />
              <TextField
                label={t("tenant.businessEmail")}
                variant="outlined"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <Select
                className="w-full z-50 mt-2"
                label={t("tenant.building")}
                variant="outlined"
                value={typeOfBusiness || ""}
                onChange={(e) => handleChangeBusinessType(e.target.value)}
                required
                margin="normal"
                displayEmpty
                inputProps={{
                  "aria-label": <span>{t("tenant.selectBusinessType")} *</span>,
                }}
              >
                <MenuItem value="" disabled>
                  <span>
                    {t("tenant.selectBusinessType")}{" "}
                    <span className="text-red-400">*</span>
                  </span>
                </MenuItem>
                {businessTypes.map((businessType) => (
                  <MenuItem key={businessType.id} value={businessType.id}>
                    {businessType.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label={t("tenant.numberOfYearsInBusiness")}
                variant="outlined"
                type="number"
                value={numberOfYearsInBusiness}
                onChange={(e) => setNumberOfYearsInBusiness(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div className="flex justify-end space-x-6">
              <Button
                variant="contained"
                color="inherit"
                className="mr-2"
                onClick={handleCreateBusiness}
                disabled={loading}
              >
                {loading ? t("tenant.creating") : t("tenant.create")}
              </Button>
              <Button variant="contained" color="warning" onClick={closeModal}>
                {t("tenant.cancel")}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Tenant Modal"
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
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-md overflow-y-auto hidden-scrollbar">
            <div className="flex justify-end">
              <IconButton onClick={closeEditModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h5" gutterBottom>
              {t("tenant.editTenant")}
            </Typography>
            <div>
              <TextField
                label={t("tenant.name")}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />

              <div className="flex flex-col mb-4">
                <button
                  className="flex items-center"
                  onClick={handleCreateNewOwner}
                >
                  <IconButton>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <span className="ml-2">{t("tenant.createNewOwner")}</span>
                </button>

                <Select
                  className="w-full z-50 mt-2"
                  label={t("tenant.building")}
                  value={owner || ""}
                  required
                  margin="normal"
                  onChange={(e) => handleChange(e.target.value)}
                  displayEmpty
                  inputProps={{
                    "aria-label": t("tenant.selectAnOwner"),
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("tenant.selectAnOwner")}
                  </MenuItem>
                  {businessOwner.map((bo) => (
                    <MenuItem key={bo.id} value={bo.id}>
                      {bo.user.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <TextField
                label={t("tenant.businessAddress")}
                variant="outlined"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label={t("tenant.businessPhoneNumber")}
                variant="outlined"
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                fullWidth
                required
                margin="normal"
                className="mb-4"
              />
              <TextField
                label={t("tenant.businessEmail")}
                variant="outlined"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <Select
                className="w-full z-50 mt-2"
                label={t("tenant.building")}
                variant="outlined"
                value={typeOfBusiness || ""}
                onChange={(e) => handleChangeBusinessType(e.target.value)}
                required
                margin="normal"
                displayEmpty
                inputProps={{
                  "aria-label": <span>{t("tenant.selectBusinessType")} *</span>,
                }}
              >
                <MenuItem value="" disabled>
                  <span>
                    {t("tenant.selectBusinessType")}{" "}
                    <span className="text-red-400">*</span>
                  </span>
                </MenuItem>
                {businessTypes.map((businessType) => (
                  <MenuItem key={businessType.id} value={businessType.id}>
                    {businessType.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label={t("tenant.numberOfYearsInBusiness")}
                variant="outlined"
                type="number"
                value={numberOfYearsInBusiness}
                onChange={(e) => setNumberOfYearsInBusiness(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div className="flex justify-end space-x-6">
              <Button
                variant="contained"
                color="inherit"
                className="mr-2"
                onClick={handleUpdateBusiness}
                disabled={loading}
              >
                {loading ? t("tenant.updating") : t("tenant.update")}
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={closeEditModal}
              >
                {t("tenant.cancel")}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={newOwnerModalIsOpen}
          onRequestClose={handleCloseNewOwnerModal}
          contentLabel="Create New Owner Modal"
          className="Modal absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75"
          overlayClassName="Overlay fixed inset-0"
        >
          <style>{`
      .hidden-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hidden-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
          <div className="bg-white p-6 rounded-lg max-h-[76vh] relative max-w-md overflow-y-auto hidden-scrollbar">
            <div className="flex justify-end">
              <IconButton onClick={handleCloseNewOwnerModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h6" gutterBottom>
              {t("tenant.createNewOwner")}
            </Typography>
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
                  onChange={handleUserInfoChange}
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
                  onChange={handleUserInfoChange}
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
                  onChange={handleUserInfoChange}
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
                    onChange={handleUserInfoChange}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                </div>
                <TextField
                  label={t("tenant.citizenship")}
                  variant="outlined"
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  fullWidth
                  margin="normal"
                />

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
            </div>
          </div>
        </Modal>

        <div className="mt-8">
          {tenantLoading ? (
            // <Typography variant="body1">{t("tenant.loading")}</Typography> // Loading indicator
            <Grid container>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "center",
                  }}
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
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {currentTenants && currentTenants.length > 0 ? (
                currentTenants.map((tenantResponse, index) => (
                  <Grid item key={index} xs={12} sm={8} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          {tenantResponse.business_name}
                        </Typography>
                        <Typography variant="body2">
                          {tenantResponse.business_email}
                        </Typography>
                        <Typography variant="body2">
                          {tenantResponse.business_address}
                        </Typography>
                        <Typography variant="body2">
                          {tenantResponse.business_phone_number}
                        </Typography>
                        <Typography variant="body2">
                          {tenantResponse.number_of_years_in_business}{" "}
                          {t("tenant.yearsInTheBusiness")}
                        </Typography>
                        <Typography variant="body2">
                          {t("tenant.businessOwnerName")} -{" "}
                          {tenantResponse?.owner_detail?.full_name}
                        </Typography>
                        <Typography variant="body2">
                          {t("tenant.businessOwnerPhoneNumber")} -{" "}
                          {tenantResponse?.owner_detail?.phone_number}
                        </Typography>

                        <Typography variant="body2">
                          {t("tenant.businessOwnerEmail")} -{" "}
                          {tenantResponse?.owner_detail?.email}
                        </Typography>

                        <div style={{ marginTop: "10px" }}>
                          <Button
                            variant="outlined"
                            onClick={() => openEditModal(tenantResponse)}
                          >
                            {t("buildingUnit.edit")}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              openDeleteConfirmation(tenantResponse)
                            }
                            color="error"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            {t("tenant.delete")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <NoDataCard
                    title={t("tenant.noTenantData")}
                    message={t("tenant.noTenantData")}
                  />
                </Grid>
              )}
            </Grid>
          )}

          {tenantResponse.length !== 0 && (
            <div className="pagination p-5 flex gap-8 justify-end items-center">
              <Typography variant="body1" style={{ marginRight: "6px" }}>
                Rows per page:
              </Typography>

              <Select
                labelId="items-per-page-label"
                value={tenantsPerPage}
                onChange={handleItemsPerPageChange}
                sx={{
                  marginRight: "20px",
                  border: "none",
                  "& .MuiSelect-select": {
                    padding: "10px",
                  },
                  "&:before, &:after": {
                    border: "none",
                  },
                }}
              >
                {[4, 8, 16, 32, 64].map((count) => (
                  <MenuItem key={count} value={count}>
                    {count}
                  </MenuItem>
                ))}
              </Select>
              <Pagination
                count={Math.ceil(filteredTenants.length / tenantsPerPage)}
                page={currentPage}
                onChange={(event, page) => paginate(page)}
                variant="outlined"
                shape="rounded"
              />
            </div>
          )}
        </div>
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

        <Dialog
          open={confirmDeleteOpen}
          onClose={closeDeleteConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("tenant.deleteTenant")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("tenant.deleteConfirmation")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirmation} color="primary">
              {t("tenant.no")}
            </Button>
            <Button
              onClick={handleDeleteBusiness}
              color="primary"
              disabled={loading}
            >
              {t("tenant.yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default Tenant;
