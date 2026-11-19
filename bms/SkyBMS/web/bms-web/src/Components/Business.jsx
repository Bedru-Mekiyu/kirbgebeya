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
  TextField,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Helmet } from "react-helmet-async";

import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import Select from "react-select";
import BusinessService from "../Services/business.service";
import BusinessOwnerService from "../Services/businessOwner.service";
import BusinessTypeService from "../Services/businessType.service";
import UserService from "../Services/user.service";
import NoDataCard from "./NoDataCard";

const Business = () => {
  const { t } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [numberOfYearsInBusiness, setNumberOfYearsInBusiness] = useState("");
  const [business, setBusiness] = useState([]);
  const [businessOwner, setBusinessOwner] = useState([]);
  const [users, setUsers] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(8);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State for new owner modal
  const [newOwnerModalIsOpen, setNewOwnerModalIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [citizenship, setCitizenship] = useState("");

  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  useEffect(() => {
    fetchBusinessOwner();
    fetchBusiness();
    fetchUsers();
    fetchBusinessTypes();
  }, []);

  const handleChange = (selectedOption) => {
    setOwner(selectedOption.value);
  };

  const handleChangeUser = (selectedOption) => {
    setUserId(selectedOption.value);
  };

  const handleChangeBusinessType = (selectedOption) => {
    setTypeOfBusiness(selectedOption.value);
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
      console.log(business);
      setBusiness(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching business:", error);
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredBusinesses = business.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      const newBusiness = await BusinessService.createBusiness(formData);
      if (newBusiness.status === 201) {
        setError(null);
        setSuccessMessage(newBusiness.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
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
    } catch (error) {
      console.error("Error creating business:", error);
      setSuccessMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleDeleteBusiness = async () => {
    try {
      await BusinessService.deleteBusiness(businessToDelete.id);

      setTimeout(() => {
        setSuccessMessage(null);
        setBusinessToDelete(null);
        setConfirmDeleteOpen(false);
        setSuccessMessage("Business deleted successfully.");
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        fetchBusiness();
      }, 1000);
    } catch (error) {
      setSuccessMessage(null);
      setError(null);
      console.error("Error deleting Business:", error);
      setSnackbarMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const handleCreateNewOwner = () => {
    // Logic to create a new owner
    console.log("Creating new owner...");
    setNewOwnerModalIsOpen(true);
  };

  const handleCloseNewOwnerModal = () => {
    // Close the new owner modal
    setNewOwnerModalIsOpen(false);
    fetchBusinessOwner();
  };

  const handleNewOwnerSubmit = async () => {
    // Handle submission of the new owner form
    const newOwnerData = {
      user_id: userId,
      citizenship,
    };
    console.log(newOwnerData);
    // Reset form fields if needed
    try {
      const newBusinessOwner = await BusinessOwnerService.createBusinessOwner(
        newOwnerData
      );
      if (newBusinessOwner.status === 201) {
        setError(null);
        setSuccessMessage(newBusinessOwner.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      setUserId("");
      setCitizenship("");
      setNewOwnerModalIsOpen(false);
      fetchBusinessOwner();
    } catch (error) {
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
    // setName("");
    // setAddress("");
    // setImage("");
  };

  const openDeleteConfirmation = (business) => {
    setBusinessToDelete(business);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setBusinessToDelete(null);
  };

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.businesses")}</title>
      </Helmet>
      <>
        <div className="flex justify-between items-center py-7">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              List of Businesses
            </Typography>
          </div>

          <button
            onClick={openModal}
            className=" text-white font-bold py-2 px-4 rounded mt-4 float-start"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("business.createNewBusiness")}
          </button>
        </div>

        {loading && (
          <div className=" top-0 left-0 w-full">
            <div className="h-1">
              <LinearProgress
                color="info"
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#fff",
                  },
                }}
              />
            </div>
          </div>
        )}
        <Grid container spacing={2} alignItems="center" className="pb-7">
          <Grid item xs={3} sm={3} lg={3}>
            <TextField
              label="Search"
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
          contentLabel="Create Business Modal"
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
              {t("business.createNewBusiness")}
            </Typography>
            <div>
              <TextField
                label="Name"
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
                  <span className="ml-2">Create New Owner</span>
                </button>

                <Select
                  className="w-full z-50 mt-2"
                  label="Building"
                  variant="outlined"
                  value={{
                    value: owner,
                    label:
                      businessOwner.find(
                        (businessOwner) => businessOwner.id === owner
                      )?.user.name || "Select Business Owner ... ",
                  }}
                  required
                  margin="normal"
                  onChange={(selectedOption) => handleChange(selectedOption)}
                  options={[
                    {
                      value: "",
                      label: "Select an owner...",
                      isDisabled: true,
                    },
                    ...businessOwner.map((businessOwner) => ({
                      value: businessOwner.length !== 0 ? businessOwner.id : "",
                      label:
                        businessOwner.length !== 0
                          ? businessOwner.user.name
                          : "",
                    })),
                  ]}
                />
              </div>

              <TextField
                label="Business Address"
                variant="outlined"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label="Business Phone Number"
                variant="outlined"
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <TextField
                label="Business Email"
                variant="outlined"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
              />
              <Select
                className="w-full z-50 mt-2"
                label="Building"
                variant="outlined"
                value={{
                  value: typeOfBusiness,
                  label:
                    businessTypes.find(
                      (businessType) => businessType.id === typeOfBusiness
                    )?.name || "Select Business Type ... ",
                }}
                required
                margin="normal"
                onChange={(selectedOption) =>
                  handleChangeBusinessType(selectedOption)
                }
                options={[
                  {
                    value: "",
                    label: "Select a business type...",
                    isDisabled: true,
                  },
                  ...businessTypes.map((businessType) => ({
                    value: businessType.id,
                    label: businessType.name,
                  })),
                ]}
              />
              <TextField
                label="Number of Years in Business"
                variant="outlined"
                type="number"
                value={numberOfYearsInBusiness}
                onChange={(e) => setNumberOfYearsInBusiness(e.target.value)}
                fullWidth
                margin="normal"
                className="mb-4"
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
                {loading ? "Creating..." : "Create"}
              </Button>
              <Button variant="contained" color="warning" onClick={closeModal}>
                Cancel
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
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-end">
              <IconButton onClick={handleCloseNewOwnerModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h6" gutterBottom>
              Create New Owner
            </Typography>
            <div>
              <Select
                className="w-full z-50"
                label="Building"
                variant="outlined"
                value={{
                  value: userId,
                  label:
                    users.find((user) => user.id === userId)?.name ||
                    "Select User ... ",
                }}
                required
                margin="normal"
                onChange={(selectedOption) => handleChangeUser(selectedOption)}
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
              />
              <TextField
                label="Citizenship"
                variant="outlined"
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
            <div className="flex justify-end space-x-6">
              <Button
                variant="contained"
                color="inherit"
                onClick={handleNewOwnerSubmit}
              >
                Create
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleCloseNewOwnerModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        <div className="mt-8">
          {loading ? (
            <Typography variant="body1">Loading...</Typography> // Loading indicator
          ) : (
            <Grid container spacing={2}>
              {currentBusinesses && currentBusinesses.length > 0 ? (
                currentBusinesses.map((business, index) => (
                  <Grid item key={index} xs={12} sm={8} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{business.name}</Typography>
                        <Typography variant="body2">
                          {business.business_email}
                        </Typography>
                        <Typography variant="body2">
                          {business.business_address}
                        </Typography>
                        <Typography variant="body2">
                          {business.business_phone_number}
                        </Typography>
                        <Typography variant="body2">
                          {business.number_of_years_in_business} Years in the
                          business
                        </Typography>
                        <Typography variant="body2">
                          Business Owner Name - {business.owner_detail.name}
                        </Typography>
                        <Typography variant="body2">
                          Business Owner Email - {business.owner_detail.email}
                        </Typography>

                        <div className="mt-2">
                          <Button
                            variant="contained"
                            color="inherit"
                            onClick={() => openDeleteConfirmation(business)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <NoDataCard
                    title={t("business.noBusinessData")}
                    message={t("business.noBusinessData")}
                  />
                </Grid>
              )}
            </Grid>
          )}
          {business.length !== 0 && (
            <div className="pagination p-5 flex justify-end">
              <Pagination
                count={Math.ceil(filteredBusinesses.length / businessesPerPage)}
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
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this business?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirmation} color="primary">
              Cancel
            </Button>
            <Button color="info" onClick={handleDeleteBusiness} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default Business;
