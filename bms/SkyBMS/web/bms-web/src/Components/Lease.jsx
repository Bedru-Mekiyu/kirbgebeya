import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import PaymentIcon from "@mui/icons-material/AddCard";
import DescriptionIcon from "@mui/icons-material/Description";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet-async";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { LEASE_DOCUMENT_URL } from "../Config";
import PaymentService from "../Services/payment.service";

import NoDataCard from "./NoDataCard";

import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Modal from "react-modal";
import BuildingUnitService from "../Services/buildingUnit.service";
import LeaseService from "../Services/lease.service";
import TenantService from "../Services/tenant.service";

const useStyles = makeStyles((theme) => ({
  leaseCard: {
    borderLeft: `5px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(2),
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: theme.spacing(1),
  },
  activeBorder: {
    borderLeft: `5px solid ${theme.palette.success.main}`,
  },
  expiredBorder: {
    borderLeft: `5px solid ${theme.palette.error.main}`,
  },
  defaultBorder: {
    borderLeft: `5px solid ${theme.palette.grey[500]}`,
  },
  buildingName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: theme.palette.info.main,
    marginBottom: theme.spacing(1),
  },
  infoLabel: {
    fontWeight: "bold",
    color: theme.palette.primary.dark,
  },
  infoValue: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  deleteButton: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
  },
}));

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
const maxWidth = 800;
const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};
const resizeObserverOptions = {};

const Lease = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [formData, setFormData] = useState({
    tenant_id: "",
    building_unit_id: "",
    lease_agreement_document: null,
    start_date: "",
    end_date: "",
    monthly_rent: "",
    status: "New",
  });

  const [modalPaymentOpen, setPaymentModalOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState();

  const [paymentFormData, setPaymentFormData] = useState({
    lease_id: "",
    number_of_months: "",
    rent_fee: "",
    penalty_fee: "",
    utility_fee: "",
    other_fee: "",
    remarks: "",
  });
  const [numPages, setNumPages] = useState();
  const [file, setFile] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [documentModalIsOpen, setDocumentModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [containerWidth, setContainerWidth] = useState();
  const [scale, setScale] = useState(1.0);

  const handleZoomIn = () => {
    setScale(scale * 1.1);
  };

  const handleZoomOut = () => {
    setScale(scale / 1.1);
  };

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const [buildingUnits, setBuildingUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [selectedLeaseId, setSelectedLeaseId] = useState();
  const [searchTenantName, setSearchTenantName] = useState("");
  const [searchUnitNumber, setSearchUnitNumber] = useState("");
  const [searchFloorNumber, setSearchFloorNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [leaseLoading, setLeaseLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentFrom, setPaymentFrom] = useState();
  const [paymentTo, setPaymentTo] = useState();
  const [dueDate, setDueDate] = useState();
  const [leasesPerPage, setLeasesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [buildingId, setBuildingId] = useState("");
  const [image, setImage] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaseToDelete, setLeaseToDelete] = useState(null);
  const [tenant, setTenant] = useState("");
  const [buildingUnit, setBuildingUnit] = useState("");

  const getBorderColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return classes.activeBorder;
      case "expired":
        return classes.expiredBorder;
      default:
        return classes.defaultBorder;
    }
  };

  const handleButtonClick = (leaseFile) => {
    setFile(leaseFile);
    setDocumentModalIsOpen(true);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const openEditModal = (lease) => {
    setEditModalIsOpen(true);

    setSelectedLeaseId(lease.id);
    setTenant(lease.tenant_id);
    setBuildingUnit(lease.building_unit.id);
    setStartDate(dayjs(lease.start_date));
    setEndDate(dayjs(lease.end_date));
    setMonthlyRent(lease.monthly_rent);
    formData.status = lease.status;
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTenant("");
    setBuildingUnit("");
    setStartDate(null);
    setEndDate(null);
    setMonthlyRent("");
    setFormData({
      tenant_id: "",
      building_unit_id: "",
      lease_agreement_document: null,
      start_date: "",
      end_date: "",
      monthly_rent: "",
      status: "New",
    });
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setTenant("");
    setBuildingUnit("");
    setStartDate(null);
    setEndDate(null);
    setMonthlyRent("");
    setFormData({
      tenant_id: "",
      building_unit_id: "",
      lease_agreement_document: null,
      start_date: "",
      end_date: "",
      monthly_rent: "",
      status: "New",
    });
  };
  const closeDocumentModal = () => {
    setDocumentModalIsOpen(false);
  };
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
    }
  };

  const handlePaymentAddButtonClick = (lease) => {
    setPaymentModalOpen(true);
    setSelectedLease(lease);
    if (lease) {
      let monthlyRent = 0;

      if (lease.building_unit.price_per_meter_sq !== 0) {
        monthlyRent =
          lease.building_unit.area_in_sqm *
          lease.building_unit.price_per_meter_sq;
      } else {
        monthlyRent = lease.building_unit.estimate_price;
      }

      setPaymentFormData({
        ...paymentFormData,
        rent_fee: monthlyRent.toString(),
      });
    }
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
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

  const fetchBuildingUnits = async () => {
    setLoading(true);
    try {
      const units =
        await BuildingUnitService.getAllBuildingUnitsWithoutFilter();
      const sortedResponse = units.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setBuildingUnits(sortedResponse);
      setLoading(false);
    } catch (error) {
      setSnackbarMessage(null);
      setError(error.message);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const tenants = await TenantService.getAllTenants();
      const sortedResponse = tenants.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setTenants(sortedResponse);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  const fetchLeases = async () => {
    setLeaseLoading(true);
    try {
      const leases = await LeaseService.getAllLeases();
      const sortedResponse = leases.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
      });
      setLeases(sortedResponse);
      setLeaseLoading(false);
    } catch (error) {
      console.error("Error fetching leases:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
      setLeaseLoading(false);
    }
  };

  const handleBuildingUnitChange = (event) => {
    const selectedUnitId = event.target.value;
    setBuildingUnit(selectedUnitId);
    const selectedUnit = buildingUnits.find(
      (unit) => unit.id === selectedUnitId
    );
    if (selectedUnit) {
      if (selectedUnit.price_per_meter_sq !== 0) {
        setMonthlyRent(
          selectedUnit.area_in_sqm * selectedUnit.price_per_meter_sq
        );
      } else {
        setMonthlyRent(selectedUnit.estimate_price);
      }
    }
  };

  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };

  const handleCreateLease = async () => {
    setLeaseLoading(true);
    try {
      formData.tenant_id = tenant;
      formData.building_unit_id = buildingUnit;
      formData.start_date = startDate;
      formData.end_date = endDate;
      formData.monthly_rent = monthlyRent;
      formData.lease_agreement_document = image;
      const newLease = await LeaseService.createLease(formData);
      if (newLease.status === 201) {
        setFormData({
          tenant_id: "",
          building_unit_id: "",
          lease_agreement_document: null,
          start_date: "",
          end_date: "",
          monthly_rent: "",
          status: "New",
        });
        setTenant("");
        setBuildingUnit("");
        setStartDate(null);
        setEndDate(null);
        setImage(null);
        setMonthlyRent("");
        setError(null);
        setSnackbarMessage(newLease.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLeaseLoading(false);
      }
      setModalIsOpen(false);
      fetchLeases();
    } catch (error) {
      setSnackbarMessage(null);
      console.error("Error creating building unit:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLeaseLoading(false);
    }
  };

  const handleUpdateLease = async () => {
    setLeaseLoading(true);
    try {
      formData.tenant_id = tenant;
      formData.building_unit_id = buildingUnit;
      formData.start_date = startDate;
      formData.end_date = endDate;
      formData.monthly_rent = monthlyRent;
      formData.lease_agreement_document = image;
      const newLease = await LeaseService.updateLease(
        selectedLeaseId,
        formData
      );
      if (newLease.status === 200) {
        setFormData({
          tenant_id: "",
          building_unit_id: "",
          lease_agreement_document: null,
          start_date: "",
          end_date: "",
          monthly_rent: "",
          status: "New",
        });
        setTenant("");
        setBuildingUnit("");
        setStartDate(null);
        setEndDate(null);
        setImage(null);
        setMonthlyRent("");
        setError(null);
        setSnackbarMessage(newLease.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLeaseLoading(false);
      }
      setEditModalIsOpen(false);
      fetchLeases();
    } catch (error) {
      setSnackbarMessage(null);
      console.error("Error updating lease:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLeaseLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      const requestBody = {
        lease_id: selectedLease.id,
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

      const response = await PaymentService.createPayment(requestBody);

      if (response.status === 201) {
        setPaymentFrom(null);
        setPaymentTo(null);
        setError(null);
        setSnackbarMessage(response.data.message);
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        setLeaseLoading(false);
        setPaymentModalOpen(false);
        fetchLeases();
      }
    } catch (error) {
      setSnackbarMessage(null);
      console.error("Error creating payment:", error);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLeaseLoading(false);
    }
  };
  const handleDeleteLease = async () => {
    setLeaseLoading(true);
    try {
      await LeaseService.deleteLease(
        leaseToDelete.id,
        leaseToDelete.building_unit.id
      );
      setTimeout(() => {
        setLeaseToDelete(null);
        setDeleteDialogOpen(false);
        // setSnackbarMessage("Lease deleted successfully.");
        const newState = { vertical: "bottom", horizontal: "center" };
        setState({ ...newState, open: true });
        fetchLeases();
        setLeaseLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error deleting lease:", error);
      setSnackbarMessage(null);
      setError(error.message);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setLeaseLoading(false);
    }
  };

  const openDeleteConfirmation = (lease) => {
    setLeaseToDelete(lease);
    setDeleteDialogOpen(true);
  };

  const filteredLeases = leases.filter(
    (lease) =>
      (searchTenantName.trim() === "" ||
        lease?.tenant?.name
          .toLowerCase()
          .includes(searchTenantName.toLowerCase())) &&
      (searchUnitNumber.trim() === "" ||
        lease.building_unit.unit_number
          .toLowerCase()
          .includes(searchUnitNumber.toLowerCase())) &&
      (searchFloorNumber.trim() === "" ||
        lease.building_unit.floor_no
          .toString()
          .includes(searchFloorNumber.trim()))
  );

  const indexOfLastLease = currentPage * leasesPerPage;
  const indexOfFirstLease = indexOfLastLease - leasesPerPage;
  const currentLeases = filteredLeases.slice(
    indexOfFirstLease,
    indexOfLastLease
  );
  const handleItemsPerPageChange = (event) => {
    setLeasesPerPage(event.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchLeases();
  }, []);
  useEffect(() => {
    fetchBuildingUnits();
    fetchTenants();
  }, []);

  return (
    <div className="text-center">
      <Helmet>
        <title>SkyBMS - {t("title.leases")}</title>
      </Helmet>

      <>
        <div className="flex justify-between items-center pb-7 pt-2 mt-4">
          <div className="flex flex-col gap-3">
            <Typography
              variant="h6"
              sx={{ color: "#949494", alignSelf: "start" }}
            >
              {t("lease.leaseInformation")}
            </Typography>
          </div>

          <button
            onClick={openModal}
            className="text-white font-bold py-2 px-4 rounded float-start"
            style={{ backgroundColor: "#3182CE" }}
          >
            <AddIcon sx={{ fontSize: 20, marginRight: 1 }} />{" "}
            {t("lease.createNewLease")}
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
        <div className="flex flex-wrap gap-3 items-center">
          <div className="mt-6">
            <div className="space-y-6 pb-4">
              <Grid container spacing={2} alignItems="center">
                {/* Building filter */}
                <Grid item xs={4}>
                  <TextField
                    placeholder={t("lease.searchByTenantName")}
                    variant="outlined"
                    value={searchTenantName}
                    onChange={(e) => setSearchTenantName(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    placeholder={t("lease.searchByUnitNumber")}
                    variant="outlined"
                    value={searchUnitNumber}
                    onChange={(e) => setSearchUnitNumber(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    placeholder={t("lease.searchByFloorNumber")}
                    variant="outlined"
                    value={searchFloorNumber}
                    onChange={(e) => setSearchFloorNumber(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </div>

          <Divider className="w-full mt-5" />
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
              {t("lease.createNewLease")}
            </Typography>
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("lease.tenant")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tenant}
                  onChange={handleTenantChange}
                  label={t("lease.tenant")}
                >
                  {tenants.map((tenant) => (
                    <MenuItem key={tenant.id} value={tenant.id}>
                      {tenant.business_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  {t("lease.buildingUnit")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={buildingUnit}
                  onChange={handleBuildingUnitChange}
                  label={t("lease.buildingUnit")}
                >
                  {buildingUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit?.building && unit?.building?.name.substring(0, 3)}{" "}
                      {unit?.floor_no} - {unit?.unit_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div>
                <div className="mt-4 mb-1">{t("lease.leaseStartDate")}</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    selected={startDate}
                    onChange={(startDate) => setStartDate(startDate)}
                    className="h-12 pl-2 w-full"
                  />
                </LocalizationProvider>
              </div>

              <div>
                <div className="mt-5 mb-1">{t("lease.leaseEndDate")}</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    selected={endDate}
                    onChange={(endDate) => setEndDate(endDate)}
                    className="h-12 pl-2 w-full"
                  />
                </LocalizationProvider>
              </div>

              <div className="mt-5">
                <label>{t("lease.agreementDocument")}</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <TextField
                label={t("lease.monthlyRent")}
                variant="outlined"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              <div className="flex justify-end space-x-6 mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={handleCreateLease}
                  disabled={loading}
                >
                  {loading ? t("lease.creating") : t("lease.create")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closeModal}
                >
                  {t("lease.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Lease Modal"
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
              {t("lease.editLease")}
            </Typography>
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("lease.tenant")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tenant}
                  onChange={handleTenantChange}
                  label={t("lease.tenant")}
                >
                  {tenants.map((tenant) => (
                    <MenuItem key={tenant.id} value={tenant.id}>
                      {tenant.business_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  {t("lease.buildingUnit")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={buildingUnit}
                  onChange={handleBuildingUnitChange}
                  label={t("lease.buildingUnit")}
                >
                  {buildingUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit?.building && unit?.building?.name.substring(0, 3)}{" "}
                      {unit?.floor_no} - {unit?.unit_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div>
                <div className="mt-4 mb-1">{t("lease.leaseStartDate")}</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                    className="h-12 pl-2 w-full"
                  />
                </LocalizationProvider>
              </div>

              <div>
                <div className="mt-5 mb-1">{t("lease.leaseEndDate")}</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                    className="h-12 pl-2 w-full"
                  />
                </LocalizationProvider>
              </div>

              <div className="mt-5">
                <label>{t("lease.agreementDocument")}</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <TextField
                label={t("lease.monthlyRent")}
                variant="outlined"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: "1",
                  step: "1",
                  pattern: "[0-9]*",
                }}
              />

              <div className="flex justify-end space-x-6 mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className="mr-2"
                  onClick={handleUpdateLease}
                  disabled={loading}
                >
                  {loading ? t("lease.updating") : t("lease.update")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closeEditModal}
                >
                  {t("lease.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

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
                label={t("lease.numberOfMonths")}
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
                    <div className="mt-4 mb-1">{t("lease.from")}</div>
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
                    <div className="mt-5 mb-1">{t("lease.to")}</div>
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
                label={t("lease.rentFee")}
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
                label={t("lease.penaltyFee")}
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
                label={t("lease.utilityFee")}
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
                label={t("lease.otherFees")}
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
                label={t("lease.remarks")}
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
                  onClick={() => handleSubmit()}
                >
                  {t("lease.submit")}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={closePaymentModal}
                >
                  {t("lease.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        <div className="mt-5 ">
          {leaseLoading ? (
            // <Typography variant="body1">{t("lease.loading")}</Typography>
            <Grid container>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="80%" height={150} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
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
              {currentLeases && currentLeases.length > 0 ? (
                currentLeases.map((lease, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      elevation={3}
                      className={`${classes.leaseCard} ${getBorderColor(
                        lease.status
                      )}`}
                    >
                      <CardContent>
                        <div>
                          <Typography
                            variant="h6"
                            className={classes.buildingName}
                          >
                            {t("lease.leaseOf")} {lease.building_unit.floor_no}
                            {"-"}
                            {lease.building_unit.unit_number}
                          </Typography>
                          <Typography variant="body2" className="building-info">
                            <span className={classes.infoLabel}>
                              {t("lease.buildingName")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease?.building?.name}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="building-info">
                            <span className={classes.infoLabel}>
                              {t("lease.floorNo")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease?.building_unit?.floor_no}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="building-info">
                            <span className={classes.infoLabel}>
                              {t("lease.unitNo")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease?.building_unit?.unit_number}
                            </span>
                          </Typography>
                          {lease?.building_unit?.price_per_meter_sq === 0 ? (
                            <>
                              <Typography
                                variant="body2"
                                className="building-info"
                              >
                                <span className={classes.infoLabel}>
                                  {t("lease.areaInSqm")}:
                                </span>{" "}
                                <span className={classes.infoValue}>
                                  {lease.building_unit.area_in_sqm}
                                </span>
                              </Typography>
                              <Typography
                                variant="body2"
                                className="building-info"
                              >
                                <span className={classes.infoLabel}>
                                  {t("lease.pricePerSqm")}:
                                </span>{" "}
                                <span className={classes.infoValue}>
                                  {lease?.building_unit?.price_per_meter_sq}
                                </span>
                              </Typography>
                            </>
                          ) : (
                            <Typography
                              variant="body2"
                              className="building-info"
                            >
                              <span className={classes.infoLabel}>
                                {t("lease.estimatePrice")}:
                              </span>{" "}
                              <span className={classes.infoValue}>
                                {lease?.building_unit?.estimate_price}
                              </span>
                            </Typography>
                          )}

                          <Typography variant="body2" className="building-info">
                            <span className={classes.infoLabel}>
                              {t("lease.monthlyRent")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease.monthly_rent}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="tenant-info">
                            <span className={classes.infoLabel}>
                              {t("lease.tenant")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease?.tenant?.name}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="tenant-info">
                            <span className={classes.infoLabel}>
                              {t("lease.tenantPhone")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {lease?.tenant?.business_phone_number}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="lease-period">
                            <span className={classes.infoLabel}>
                              {t("lease.leasePeriod")}:
                            </span>{" "}
                            <span className={classes.infoValue}>
                              {new Date(lease.start_date).toLocaleDateString()}{" "}
                              - {new Date(lease.end_date).toLocaleDateString()}
                            </span>
                          </Typography>
                          <Typography variant="body2" className="lease-status">
                            <span className={classes.infoLabel}>
                              {t("lease.status")}:
                            </span>{" "}
                            <span
                              className={`font-semibold status-${lease.status.toLowerCase()}`}
                            >
                              {lease.status}
                            </span>
                          </Typography>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                          <div>
                            <Tooltip
                              title={t("lease.clickToViewAgreementDocument")}
                              placement="top"
                            >
                              <IconButton
                                color="primary"
                                className={classes.iconButton}
                              >
                                <a
                                  href={`${LEASE_DOCUMENT_URL}/${lease.lease_agreement_document}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <DescriptionIcon />
                                </a>
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={t("lease.clickToAddPaymentInfo")}
                              placement="top"
                            >
                              <IconButton
                                color="primary"
                                className={classes.iconButton}
                                onClick={() =>
                                  handlePaymentAddButtonClick(lease)
                                }
                              >
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div>
                            <Button
                              variant="outlined"
                              onClick={() => openEditModal(lease)}
                            >
                              {t("buildingUnit.edit")}
                            </Button>
                            <Button
                              variant="outlined"
                              className={`${classes.deleteButton} `}
                              onClick={() => openDeleteConfirmation(lease)}
                              color="error"
                              style={{
                                marginLeft: "10px",
                              }}
                            >
                              {t("lease.delete")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <NoDataCard
                    title={t("lease.noLeaseData")}
                    message={t("lease.noLeaseData")}
                  />
                </Grid>
              )}
            </Grid>
          )}
          {leases.length !== 0 && (
            <div className="pagination p-5 flex gap-8 justify-end items-center">
              <Typography variant="body1" style={{ marginRight: "6px" }}>
                Rows per page:
              </Typography>

              <Select
                labelId="items-per-page-label"
                value={leasesPerPage}
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
                count={Math.ceil(filteredLeases.length / leasesPerPage)}
                page={currentPage}
                onChange={(event, page) => paginate(page)}
                variant="outlined"
                shape="rounded"
              />
            </div>
          )}
        </div>

        <Modal
          isOpen={documentModalIsOpen}
          onRequestClose={() => setDocumentModalIsOpen(false)}
          contentLabel="Document View Modal"
        >
          <div className="flex justify-end">
            <IconButton onClick={closeDocumentModal}>
              <HighlightOffIcon />
            </IconButton>
          </div>
          <div style={{ maxWidth: 450, maxHeight: "60vh", margin: "0 auto" }}>
            <IconButton onClick={handleZoomIn} disabled={scale >= 2.0}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOutIcon />
            </IconButton>
            <Document
              file={`${LEASE_DOCUMENT_URL}/${file}`}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {[...Array(numPages).keys()].map((page) => (
                <Page
                  key={`page_${page + 1}`}
                  pageNumber={page + 1}
                  width={400}
                  scale={scale}
                />
              ))}
            </Document>
          </div>
        </Modal>

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
          <DialogTitle>{t("lease.deleteLease")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("lease.deleteConfirmation")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              {t("lease.no")}
            </Button>
            <Button onClick={handleDeleteLease} color="info" disabled={loading}>
              {t("lease.yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default Lease;
