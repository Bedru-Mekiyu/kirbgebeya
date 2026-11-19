import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

// import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import NoDataCard from "./NoDataCard";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IMAGE_URL } from "../Config";

import { Tooltip } from "@material-ui/core";
import Modal from "react-modal";
import BuildingService from "../Services/building.service";
import BuildingUnitService from "../Services/buildingUnit.service";

const BuildingUnit = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    building_id: "",
    floor_no: "",
    unit_number: "",
    width: "",
    length: "",
    area_in_sqm: "",
    room_type: "",
    price_per_meter_sq: "",
    estimate_price: "",
    status: "",
    image: null,
  });
  const [buildingId, setBuildingId] = useState("");
  const [selectedBuildingUnitId, setSelectedBuildingUnitId] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [areaInSqm, setAreaInSqm] = useState("");
  const [areaInSqmUpdate, setAreaInSqmUpdate] = useState("");
  const [pricePerMeterSq, setPricePerMeterSq] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [showEstimatedPrice, setShowEstimatedPrice] = useState(false);
  const [status, setStatus] = useState("Available");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildingLoading, setBuildingLoading] = useState(true);
  const [roomTypeLoading, setRoomTypeLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [perPage, setPerPage] = useState(500);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [address, setAddress] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const [buildingUnits, setBuildingUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const indexOfLastBuildingUnit = currentPage * itemsPerPage;
  const indexOfFirstBuildingUnit = indexOfLastBuildingUnit - itemsPerPage;
  const currentBuildingUnits = buildingUnits.slice(
    indexOfFirstBuildingUnit,
    indexOfLastBuildingUnit
  );

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      building_id: "",
      floor_no: "",
      unit_number: "",
      width: "",
      length: "",
      price_per_meter_sq: "",
      estimate_price: "",
      status: "",
      image: null,
    });
    setRoomTypeId("");
    setBuildingId("");
    setFloorNo("");
    setUnitNumber("");
    setImage(null);
    setWidth("");
    setLength("");
    setPricePerMeterSq("");
    setEstimatedPrice("");
    setShowEstimatedPrice(false);
    setStatus("Available");
    setAreaInSqmUpdate("");
  };

  const openEditModal = (unit) => {
    setEditModalIsOpen(true);
    setSelectedBuildingUnitId(unit.id);
    setRoomTypeId(unit.room_type);
    setBuildingId(unit.building_id);
    setFloorNo(unit.floor_no);
    setUnitNumber(unit.unit_number);
    setWidth(unit.width);
    setLength(unit.length);
    setAreaInSqmUpdate(unit.area_in_sqm);
    setPricePerMeterSq(unit.price_per_meter_sq);
    setEstimatedPrice(unit.estimate_price);
    unit.estimate_price === 0
      ? setShowEstimatedPrice(false)
      : setShowEstimatedPrice(true);
    setStatus(unit.status);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setFormData({
      building_id: "",
      floor_no: "",
      unit_number: "",
      width: "",
      length: "",
      price_per_meter_sq: "",
      estimate_price: "",
      status: "",
      image: null,
    });
    setRoomTypeId("");
    setBuildingId("");
    setFloorNo("");
    setUnitNumber("");
    setImage(null);
    setWidth("");
    setLength("");
    setPricePerMeterSq("");
    setEstimatedPrice("");
    setShowEstimatedPrice(false);
    setStatus("Available");
    setAreaInSqmUpdate("");
  };
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Validate file type and size
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

  const fetchBuildingUnits = async () => {
    setLoading(true);
    try {
      const units = await BuildingUnitService.getAllBuildingUnits(
        `building_id=${selectedBuilding}&floor_no=${selectedFloor}&perPage=${perPage}`
      );
      console.log(units);
      const sortedResponse = units.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      setBuildingUnits(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching building units:", error);
      setSnackbarMessage(null);
      setError(error.message);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      setBuildingLoading(true);
      const buildings = await BuildingService.getAllBuildings();
      const sortedResponse = buildings.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      setTimeout(() => {
        setBuildings(sortedResponse);
        setBuildingLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      setRoomTypeLoading(true);
      const roomTypes = await BuildingUnitService.getAllRoomTypes();
      const sortedResponse = roomTypes.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });

      setTimeout(() => {
        setRoomTypes(sortedResponse);
        setRoomTypeLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching room types:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const handleBuildingSelect = (event) => {
    setSelectedBuilding(event.target.value);
    setSelectedFloor(""); // Reset floor selection
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor === "All" ? "" : floor);
  };

  const filteredBuildingUnits = currentBuildingUnits.filter((unit) => {
    if (
      selectedBuilding &&
      selectedBuilding !== "" &&
      unit.building_id !== selectedBuilding
    ) {
      return false;
    }
    if (
      selectedFloor !== "" &&
      selectedFloor !== "All" &&
      unit.floor_no !== selectedFloor
    ) {
      return false;
    }

    return true;
  });

  const handleCreateBuildingUnit = async () => {
    try {
      setLoading(true);
      formData.building_id = buildingId;
      formData.floor_no = floorNo;
      formData.unit_number = unitNumber;
      formData.room_type = roomTypeId;
      formData.width = parseFloat(width);
      formData.length = parseFloat(length);
      formData.area_in_sqm = parseFloat(areaInSqm);
      formData.price_per_meter_sq = parseFloat(pricePerMeterSq);
      formData.estimate_price = parseFloat(estimatedPrice);
      if (estimatedPrice) {
        formData.width = 0;
        formData.length = 0;
        formData.price_per_meter_sq = 0;
        formData.estimate_price = parseFloat(estimatedPrice);
      } else {
        formData.estimate_price = 0;
      }
      formData.status = status;
      formData.image = image;
      const newUnit = await BuildingUnitService.createBuildingUnit(formData);
      if (newUnit.status === 201) {
        setLoading(false);
        setFormData({
          building_id: "",
          floor_no: "",
          unit_number: "",
          width: "",
          length: "",
          price_per_meter_sq: "",
          estimate_price: "",
          status: "",
          image: null,
        });
        setBuildingId("");
        setFloorNo("");
        setUnitNumber("");
        setImage(null);
        setWidth("");
        setLength("");
        setPricePerMeterSq("");
        setEstimatedPrice("");
        setShowEstimatedPrice(false);
        setStatus("Available");
        setError(null);
        setSnackbarMessage(newUnit.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      setModalIsOpen(false);
      fetchBuildingUnits();
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(null);
      console.error("Error creating building unit:", error);
      setError(error.response.data.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleUpdateBuildingUnit = async () => {
    try {
      setLoading(true);
      formData.building_id = buildingId;
      formData.floor_no = floorNo;
      formData.unit_number = unitNumber;
      formData.room_type = roomTypeId;
      width ? (formData.width = parseFloat(width)) : (formData.width = null);
      length
        ? (formData.length = parseFloat(length))
        : (formData.length = null);
      areaInSqm || areaInSqmUpdate
        ? (formData.area_in_sqm = parseFloat(
            width || length ? areaInSqm : areaInSqmUpdate
          ))
        : (formData.area_in_sqm = null);
      formData.price_per_meter_sq = parseFloat(pricePerMeterSq);
      formData.estimate_price = parseFloat(estimatedPrice);
      if (estimatedPrice) {
        formData.width = 0;
        formData.length = 0;
        formData.price_per_meter_sq = 0;
        formData.estimate_price = parseFloat(estimatedPrice);
      } else {
        formData.estimate_price = 0;
      }
      formData.status = status;
      formData.image = image;
      console.log(formData);
      const newUnit = await BuildingUnitService.updateBuildingUnit(
        selectedBuildingUnitId,
        formData
      );
      if (newUnit.status === 200) {
        setLoading(false);
        setFormData({
          building_id: "",
          floor_no: "",
          unit_number: "",
          width: "",
          length: "",
          price_per_meter_sq: "",
          estimate_price: "",
          status: "",
          image: null,
        });
        setBuildingId("");
        setFloorNo("");
        setUnitNumber("");
        setImage(null);
        setWidth("");
        setLength("");
        setPricePerMeterSq("");
        setEstimatedPrice("");
        setShowEstimatedPrice(false);
        setStatus("Available");
        setError(null);
        setSnackbarMessage(newUnit.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
      }
      setEditModalIsOpen(false);
      fetchBuildingUnits();
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(null);
      console.error("Error creating building unit:", error);
      setError(error.response.data.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
    }
  };

  const handleChange = (event) => {
    setBuildingId(event.target.value);
  };

  const handleRoomTypeChange = (event) => {
    setRoomTypeId(event.target.value);
  };

  const handleDeleteBuildingUnit = async () => {
    setLoading(true);
    try {
      await BuildingUnitService.deleteBuildingUnit(unitToDelete.id);
      setTimeout(() => {
        setUnitToDelete(null);
        setError(null);
        setDeleteDialogOpen(false);
        setSnackbarMessage("Building unit deleted successfully.");
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        fetchBuildingUnits();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(
        "Error deleting building unit:",
        error.response.data.message
      );
      setSnackbarMessage(null);
      setError(error.response.data.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (unit) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (unit) => {
    // Implement edit logic here, for example, navigate to an edit page
    console.log(`Editing unit: ${unit.unit_number}`);
  };

  const calculateArea = () => {
    if (width && length) {
      const area = parseFloat(width) * parseFloat(length);
      if (!isNaN(area)) {
        setAreaInSqm(area.toFixed(2));
      } else {
        setAreaInSqm("");
      }
    } else {
      setAreaInSqm("");
    }
  };

  const handleWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const handleLengthChange = (e) => {
    setLength(e.target.value);
  };

  const handleAreaChange = (e) => {
    setAreaInSqm(e.target.value);
  };

  const handleEstimatePriceChange = (e) => {
    const checked = e.target.checked;
    setShowEstimatedPrice(checked);
    if (checked) {
      setWidth("");
      setLength("");
      setAreaInSqm("");
      setPricePerMeterSq("");
      setEstimatedPrice("");
    }
  };

  useEffect(() => {
    fetchBuildingUnits();
    fetchBuildings();
  }, [selectedBuilding, selectedFloor, perPage]);

  useEffect(() => {
    fetchRoomTypes();
  }, [modalIsOpen, editModalIsOpen]);
  useEffect(() => {
    calculateArea();
  }, [width, length]);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.buildingUnits")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pb-7 pt-2 mt-4">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("buildingUnit.listOfBuildingUnit")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className=" text-white font-bold py-2 px-4 rounded float-start"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("buildingUnit.createNewBuildingUnit")}
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
        <div className="mt-6">
          <Grid container spacing={2} alignItems="center" className="pb-7">
            <Grid item xs={8} sm={8} lg={3}>
              <FormControl fullWidth className="z-0">
                <InputLabel id="demo-simple-select-label">
                  {t("buildingUnit.building")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedBuilding}
                  onChange={handleBuildingSelect}
                  label="Building"
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name} {" - "}
                      {building.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Floor filter */}
            <Grid item xs={7}>
              <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                style={{ paddingBottom: "10px" }}
              >
                {/* Option for All Floors */}
                <Grid item>
                  <IconButton
                    onClick={() => handleFloorSelect("All")}
                    color={selectedFloor === "" ? "primary" : "default"}
                    style={{ fontSize: "16px" }}
                  >
                    {t("buildingUnit.allFloor")}
                  </IconButton>
                </Grid>
                {/* Other floors */}
                {Array.from(
                  new Set(buildingUnits.map((unit) => unit.floor_no))
                ).map((floor) => (
                  <Grid item key={floor}>
                    <IconButton
                      style={{ fontSize: "16px" }}
                      onClick={() => handleFloorSelect(floor)}
                      color={selectedFloor === floor ? "primary" : "default"}
                    >
                      {floor}
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Divider className="w-full py-2" />
          </Grid>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Building Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center z-50"
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
            <Typography variant="h6" gutterBottom className="py-3">
              {t("buildingUnit.createNewBuildingUnit")}
            </Typography>
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("buildingUnit.building")} *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={buildingId}
                  onChange={handleChange}
                  label="Building *"
                  required
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name} {" - "}
                      {building.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mt-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t("buildingUnit.roomType")} *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={roomTypeId}
                    onChange={handleRoomTypeChange}
                    label="Room Type *"
                    required
                  >
                    {roomTypes.map((roomType) => (
                      <MenuItem key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label={t("buildingUnit.floor")}
                variant="outlined"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t("buildingUnit.unitNumber")}
                variant="outlined"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <div className="mt-2">
                <label className="pb-2">{t("buildingUnit.unitImage")} </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border rounded w-full py-3 my-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
              </div>

              {showEstimatedPrice ? (
                <TextField
                  label={t("buildingUnit.estimatePrice")}
                  variant="outlined"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              ) : (
                <>
                  <TextField
                    label={t("buildingUnit.width")}
                    variant="outlined"
                    value={width}
                    onChange={handleWidthChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={t("buildingUnit.length")}
                    variant="outlined"
                    value={length}
                    onChange={handleLengthChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={t("buildingUnit.areaInSqm")}
                    variant="outlined"
                    value={areaInSqm}
                    onChange={handleAreaChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label={t("buildingUnit.pricePerMeterSq")}
                    variant="outlined"
                    value={pricePerMeterSq}
                    onChange={(e) => setPricePerMeterSq(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showEstimatedPrice}
                    onChange={handleEstimatePriceChange}
                    name="Estimate"
                  />
                }
                label={t("buildingUnit.estimate")}
              />

              <div className="flex justify-end space-x-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={() => handleCreateBuildingUnit()}
                  disabled={loading}
                >
                  {loading
                    ? t("buildingUnit.creating")
                    : t("buildingUnit.create")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closeModal}
                >
                  {t("buildingUnit.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Create Building Modal"
          className="Modal absolute w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center z-50"
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
            <Typography variant="h6" gutterBottom className="py-3">
              {t("buildingUnit.editBuildingUnit")}
            </Typography>
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("buildingUnit.building")} *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={buildingId}
                  onChange={handleChange}
                  label="Building *"
                  required
                >
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                      {" - "}
                      {building.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mt-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t("buildingUnit.roomType")} *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={roomTypeId}
                    onChange={handleRoomTypeChange}
                    label="Room Type *"
                    required
                  >
                    {roomTypes.map((roomType) => (
                      <MenuItem key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label={t("buildingUnit.floor")}
                variant="outlined"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t("buildingUnit.unitNumber")}
                variant="outlined"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <div className="mt-2">
                <label className="pb-2">{t("buildingUnit.unitImage")} </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border rounded w-full py-3 my-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
              </div>

              {showEstimatedPrice ? (
                <TextField
                  label={t("buildingUnit.estimatePrice")}
                  variant="outlined"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              ) : (
                <>
                  <TextField
                    label={t("buildingUnit.width")}
                    variant="outlined"
                    value={width}
                    onChange={handleWidthChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={t("buildingUnit.length")}
                    variant="outlined"
                    value={length}
                    onChange={handleLengthChange}
                    fullWidth
                    margin="normal"
                  />
                  {width || length ? (
                    <TextField
                      label={t("buildingUnit.areaInSqm")}
                      variant="outlined"
                      value={areaInSqm}
                      onChange={handleAreaChange}
                      fullWidth
                      margin="normal"
                      required
                    />
                  ) : (
                    <TextField
                      label={t("buildingUnit.areaInSqm")}
                      variant="outlined"
                      value={areaInSqmUpdate}
                      onChange={handleAreaChange}
                      fullWidth
                      margin="normal"
                      required
                    />
                  )}

                  <TextField
                    label={t("buildingUnit.pricePerMeterSq")}
                    variant="outlined"
                    value={pricePerMeterSq}
                    onChange={(e) => setPricePerMeterSq(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showEstimatedPrice}
                    onChange={handleEstimatePriceChange}
                    name="Estimate"
                  />
                }
                label={t("buildingUnit.estimate")}
              />

              <div className="flex justify-end space-x-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={() => handleUpdateBuildingUnit()}
                  disabled={loading}
                >
                  {loading
                    ? t("buildingUnit.updating")
                    : t("buildingUnit.update")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closeEditModal}
                >
                  {t("buildingUnit.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {loading ? (
          // <Typography variant="body1">{t("buildingUnit.loading")}</Typography>

          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
              <Skeleton variant="rectangular" height={200} width="80%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="80%" height={30} />
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
          <React.Fragment>
            <Grid container spacing={2}>
              {currentBuildingUnits && currentBuildingUnits.length > 0 ? (
                filteredBuildingUnits.map((unit, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={2.8}>
                    <Card>
                      <CardMedia
                        component="img"
                        alt="Unit Image"
                        height="100"
                        width="100"
                        image={`${IMAGE_URL}/images/buildingunits/${unit.image}`}
                        style={{ minWidth: "100px" }}
                      />

                      <CardContent>
                        <Typography
                          variant="h6"
                          style={{ marginBottom: "10px" }}
                        >
                          {t("buildingUnit.floor")} {unit.floor_no} -{" "}
                          {t("buildingUnit.unitNumber")} {unit.unit_number}
                        </Typography>

                        {unit.price_per_meter_sq !== 0 ? (
                          <>
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="font-semibold">
                                {t("buildingUnit.areaInSqm")}:
                              </span>{" "}
                              {unit.area_in_sqm}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="font-semibold">
                                {t("buildingUnit.pricePerMeterSq")}:
                              </span>{" "}
                              {unit.price_per_meter_sq}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-600 text-sm mt-1">
                            <span className="font-semibold">
                              {t("buildingUnit.estimatePrice")}:
                            </span>{" "}
                            {unit.estimate_price}
                          </p>
                        )}

                        <p className="text-gray-600 text-sm mt-1">
                          <span className="font-semibold">
                            {t("buildingUnit.status")}:
                          </span>{" "}
                          {unit.status}{" "}
                          {unit.status === "Available" && (
                            <Tooltip
                              title={t("buildingUnit.thisUnitIsAvailable")}
                            >
                              <EventAvailableIcon
                                sx={{
                                  color: "#2cb116",
                                  fontSize: "30px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Tooltip>
                          )}
                          {unit.status === "Occupied" && (
                            <Tooltip
                              title={t("buildingUnit.thisUnitIsOccupied")}
                            >
                              <EventBusyIcon
                                sx={{
                                  color: "#FFD580",
                                  fontSize: "30px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Tooltip>
                          )}
                        </p>

                        <div style={{ marginTop: "10px" }}>
                          <Button
                            variant="outlined"
                            onClick={() => openEditModal(unit)}
                          >
                            {t("buildingUnit.edit")}
                          </Button>
                          <Button
                            onClick={() => openDeleteConfirmation(unit)}
                            variant="outlined"
                            color="error"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            {t("buildingUnit.delete")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <NoDataCard
                    title={t("buildingUnit.noBuildingUnitData")}
                    message={t("buildingUnit.noBuildingUnitData")}
                  />
                </Grid>
              )}
            </Grid>
            {buildingUnits.length !== 0 && (
              <div className="pagination p-5 flex gap-8 justify-end items-center">
                <Typography variant="body1" style={{ marginRight: "6px" }}>
                  Rows per page:
                </Typography>

                <Select
                  labelId="items-per-page-label"
                  value={itemsPerPage}
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
                  count={Math.ceil(buildingUnits.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  variant="outlined"
                  shape="rounded"
                />
              </div>
            )}
          </React.Fragment>
        )}

        {snackbarMessage && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2000}
            key={vertical + horizontal}
          >
            <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success">
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        )}

        {error && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2000}
            key={vertical + horizontal}
          >
            <MuiAlert onClose={() => setSnackbarOpen(false)} severity="error">
              {error}
            </MuiAlert>
          </Snackbar>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>{t("buildingUnit.deleteUnit")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("buildingUnit.deleteConfirmation")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              {t("buildingUnit.no")}
            </Button>
            <Button
              onClick={handleDeleteBuildingUnit}
              color="primary"
              disabled={loading}
            >
              {t("buildingUnit.yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default BuildingUnit;
