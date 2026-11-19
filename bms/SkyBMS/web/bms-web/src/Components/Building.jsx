import AddIcon from "@mui/icons-material/Add";
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
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { IMAGE_URL } from "../Config";
import BuildingService from "../Services/building.service";
import NoDataCard from "./NoDataCard";

const createBuilding = (name, address, image) => {
  console.log("Creating building with:", name, address, image);
};

const Building = () => {
  const { t } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState();
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { vertical, horizontal, open } = state;
  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const filteredBuilding = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastBuilding = currentPage * itemsPerPage;
  const indexOfFirstBuilding = indexOfLastBuilding - itemsPerPage;
  const currentBuildings = filteredBuilding.slice(
    indexOfFirstBuilding,
    indexOfLastBuilding
  );
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      const maxSize = 2048 * 1024; // 2048 KB converted to bytes
      if (
        allowedTypes.includes(selectedFile.type) &&
        selectedFile.size <= maxSize
      ) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(selectedFile);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert("Invalid file type or exceeds maximum size (2MB).");
      }
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const asset = (path) => {
    return `/${path}`;
  };

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const buildings = await BuildingService.getAllBuildings();
      const sortedResponse = buildings.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setBuildings(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setSuccessMessage(null);
      setError(error.message);
      setLoading(false);
    }
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleCreateBuilding = async () => {
    try {
      setLoading(true);
      const newBuilding = await BuildingService.createBuilding({
        name,
        address,
        image,
      });
      if (newBuilding.status === 201) {
        setLoading(false);
        setError(null);
        setSuccessMessage(t("building.buildingCreatedSuccessfully"));
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      closeModal();
      fetchBuildings();
    } catch (error) {
      setLoading(false);
      console.error("Error creating building:", error);
      setSuccessMessage(null);
      setError(error);

      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleUpdateBuilding = async () => {
    try {
      setLoading(true);
      const newBuilding = await BuildingService.updateBuilding(
        selectedBuildingId,
        {
          name,
          address,
          image,
        }
      );
      if (newBuilding.status === 200) {
        setLoading(false);
        setError(null);
        setSuccessMessage(t("building.buildingUpdatedSuccessfully"));
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      closeEditModal();
      fetchBuildings();
    } catch (error) {
      setLoading(false);
      console.error("Error creating building:", error);
      setSuccessMessage(null);
      setError(error);

      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleDeleteBuilding = async () => {
    setLoading(true);
    try {
      await BuildingService.deleteBuilding(buildingToDelete.id);
      setTimeout(() => {
        setConfirmDeleteOpen(false);
        setSuccessMessage("Building deleted successfully.");
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        fetchBuildings();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error deleting building:", error);
      setSuccessMessage(null);
      setError(error);
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
    setName("");
    setAddress("");
    setImage("");
  };

  const openEditModal = (building) => {
    setEditModalIsOpen(true);
    setName(building.name);
    setAddress(building.address);
    setSelectedBuildingId(building.id);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setName("");
    setAddress("");
    setImage("");
  };

  const openDeleteConfirmation = (building) => {
    setBuildingToDelete(building);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setBuildingToDelete(null);
  };

  return (
    <div className="text-center bg-slate-50">
      <Helmet>
        <title>SkyBMS - {t("title.buildings")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pb-7 pt-2 mt-4">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("building.listOfBuilding")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className="flex items-center text-white font-bold py-2 px-4 rounded  ml-4 hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-600"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 15, marginRight: 1 }} />{" "}
            {t("building.createNewBuilding")}
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
              label={t("building.search")}
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
          contentLabel="Create Building Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center"
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
              <IconButton onClick={closeModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h4 " gutterBottom>
              {t("building.createNewBuilding")}
            </Typography>
            <div>
              <TextField
                label={t("building.name")}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t("building.address")}
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t("building.image")}
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={() => handleCreateBuilding()}
                  disabled={loading}
                >
                  {loading ? t("building.creating") : t("building.create")}
                </Button>
              </div>
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
              <IconButton onClick={closeEditModal}>
                <HighlightOffIcon />
              </IconButton>
            </div>
            <Typography variant="h4 " gutterBottom>
              {t("building.editBuilding")}
            </Typography>
            <div>
              <TextField
                label={t("building.name")}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t("building.address")}
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {t("building.image")}
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={() => handleUpdateBuilding()}
                  disabled={loading}
                >
                  {loading ? t("building.updating") : t("building.update")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <div className="mt-8">
          {loading ? (
            // <Typography variant="body1">{t("building.loading")}</Typography>
            <Grid container>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" height={200} width="80%" />
                <div style={{ marginTop: "8px", display: "flex" }}>
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
            <React.Fragment>
              <Grid container spacing={2}>
                {currentBuildings && currentBuildings.length > 0 ? (
                  currentBuildings.map((building, index) => (
                    <Grid item key={index} xs={12} sm={8} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{building.name}</Typography>
                          <Typography variant="body2">
                            {building.address}
                          </Typography>
                          <div className="h-48 overflow-hidden">
                            {/* Adjust height as needed */}
                            <img
                              src={`${IMAGE_URL}/images/buildings/${building.image}`}
                              alt={building.name}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="mt-2 justify-end">
                            <Button
                              variant="outlined"
                              onClick={() => openEditModal(building)}
                            >
                              {t("building.edit")}
                            </Button>
                            <Button
                              onClick={() => openDeleteConfirmation(building)}
                              style={{
                                marginLeft: "10px",
                              }}
                              color="error"
                              variant="outlined"
                            >
                              {t("building.delete")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <NoDataCard
                      title={t("building.noBuildingData")}
                      message={t("building.noBuildingData")}
                    />
                  </Grid>
                )}
              </Grid>
              <div className="pagination p-5 flex justify-end">
                <Pagination
                  className="mt-4"
                  count={Math.ceil(buildings.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  variant="outlined"
                  shape="rounded"
                />
              </div>
            </React.Fragment>
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
            {t("building.deleteBuilding")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("building.deleteConfirmation")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirmation} color="primary">
              {t("building.no")}
            </Button>
            <Button
              onClick={handleDeleteBuilding}
              color="primary"
              disabled={loading}
            >
              {t("building.yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default Building;
