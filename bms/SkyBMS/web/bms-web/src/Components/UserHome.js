import SnackbarContent from "@material-ui/core/SnackbarContent";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/AccountCircle";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import AuthService from "../Services/auth.service";
import LeaseService from "../Services/lease.service";
import ListOfBanksService from "../Services/listOfBanks.service";
import MaintenanceRequestService from "../Services/maintenanceRequest.service";
import NotificationService from "../Services/notification.service";
import PaymentService from "../Services/payment.service";
import ProfileService from "../Services/profile.service";
import Profile from "./Profile";

const Navbar = ({
  handleNotificationClick,
  handleLogout,
  handleLanguageChange,
  i18n,
  userInfo,
  logoutLoading,
  unreadCount,
}) => {
  const [language, setLanguage] = useState(i18n.language);
  const { t } = useTranslation();
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userInfo.user?.full_name,
    user_name: userInfo.user?.user_name,
    email: userInfo.user?.email,
    phone_number: userInfo.user?.phone_number?.startsWith("+251")
      ? userInfo.user?.phone_number?.slice(4)
      : userInfo.user?.phone_number,
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [errors, setErrors] = useState({ phone_number: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const vertical = "top";
  const horizontal = "center";

  const openEditProfileModal = () => setEditModalIsOpen(true);
  const closeEditProfileModal = () => {
    setEditModalIsOpen(false);
    setFormData({
      full_name: userInfo.user?.full_name,
      user_name: userInfo.user?.user_name,
      email: userInfo.user?.email,
      phone_number: userInfo.user?.phone_number,
      current_password: null,
      new_password: null,
      confirm_password: null,
    });
    setErrors({ phone_number: "" });
  };

  const handleProfileClick = () => {
    openEditProfileModal();
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(number);
  };
  const validatePassword = (new_password) => {
    const phoneRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return phoneRegex.test(new_password);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "phone_number") {
      if (!validatePhoneNumber(value)) {
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

    if (name === "new_password" || name === "confirm_password") {
      const password = formData.new_password;
      const confirmPassword = formData.confirm_password;

      if (name === "new_password") {
        if (confirmPassword === null && confirmPassword !== value) {
          setErrors({
            ...errors,
            confirm_password: t("user.passwordsDoNotMatch"),
          });
        } else {
          setErrors({
            ...errors,
            confirm_password: "",
          });
        }
      }

      if (name === "confirm_password") {
        if (value !== password) {
          setErrors({
            ...errors,
            confirm_password: t("user.passwordsDoNotMatch"),
          });
        } else {
          setErrors({
            ...errors,
            confirm_password: "",
          });
        }
      }
      if (name === "new_password") {
        if (!validatePassword(value)) {
          setErrors({
            ...errors,
            new_password: t("user.passwordRequirements"),
          });
        } else {
          setErrors({
            ...errors,
            new_password: "",
          });
        }
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setCreateLoading(true);

    try {
      if (Object.values(errors).some((error) => error !== "")) {
        setEditModalIsOpen(true);
        setCreateLoading(false);
      } else {
        const response = await ProfileService.updateProfile(
          userInfo.user?.id,
          formData
        );

        if (response.status === 200) {
          setFormData({
            full_name: userInfo.user?.full_name,
            user_name: userInfo.user?.user_name,
            email: userInfo.user?.email,
            phone_number: userInfo.user?.phone_number,
            current_password: null,
            new_password: null,
            confirm_password: null,
          });
          setSnackbarOpen(true);

          setTimeout(() => {
            setEditModalIsOpen(false);
            setSnackbarOpen(false);
          }, 2000);
          setCreateLoading(false);
        } else {
          console.error("Unexpected response status:", response.status);
          setError(response);
          setEditModalIsOpen(true);
          setCreateLoading(false);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
      setEditModalIsOpen(true);
      setCreateLoading(false);
    }
  };

  const handleChangeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    handleLanguageChange(selectedLanguage);
  };

  return (
    <nav
      className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 p-4 w-full min-w-fit"
      style={{ backgroundColor: "rgba(100, 78, 55, 0.9)" }}
    >
      <Helmet>
        <title>SkyBMS - {t("title.tenantIndex")}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-semibold text-lg">
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, minWidth: "200px" }}
          >
            SkyBMS
          </Typography>
        </div>
        <div className="ml-4">
          <div className="text-white text-sm">
            {t("tenantUsers.welcome")}, {userInfo.user.full_name}
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <select
              value={language}
              onChange={handleChangeLanguage}
              className="bg-white border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700"
            >
              <option value="en">En</option>
              <option value="አማ">አማ</option>
              <option value="or">orm</option>
            </select>
          </div>
          <IconButton
            className="text-white  bg-transparent border border-white rounded mr-4"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon style={{ color: "#fff" }} />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleProfileClick}
            className="text-white  bg-transparent border border-white rounded mr-4"
          >
            <PersonIcon style={{ color: "#fff" }} />
          </IconButton>

          {logoutLoading ? (
            <ClipLoader
              color="#fff"
              loading={logoutLoading}
              data-testid="loader"
              size={30}
            />
          ) : (
            <Button
              style={{ color: "#fff" }}
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              {t("navbar.logout")}
            </Button>
          )}
        </div>
        <Profile
          isOpen={editModalIsOpen}
          onRequestClose={closeEditProfileModal}
          formData={formData}
          errors={errors}
          createLoading={createLoading}
          error={error}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          t={t}
          setError={setError}
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
        />
      </div>
    </nav>
  );
};

const Notifications = ({ notifications, onClose }) => {
  const { t } = useTranslation();

  const renderNotificationMessage = (notification) => {
    let messageKey;
    let messageData;

    switch (notification.type) {
      case "Maintenance Request Created":
        try {
          const parsedData = JSON.parse(notification.data);
          messageData =
            parsedData?.notification_message ||
            "Default maintenance request message";
          messageKey = "notification.maintenanceRequestCreated";
        } catch (e) {
          console.error("Error parsing notification data:", e);
          messageData = "Error in maintenance request data";
          messageKey = "notification.error";
        }
        break;

      case "Tenant Payment Created":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentCreated";
        break;

      case "Tenant Payment Attached":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentAttached";
        break;

      case "Tenant Payment Approved":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentApproved";
        break;

      case "Tenant Payment Rejected":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentRejected";
        break;

      case "Work Order Created":
        messageData = notification.data;
        messageKey = "notification.workOrderCreated";
        break;

      case "Lease Expired":
        messageData = notification.data;
        messageKey = "notification.tenantLeaseExpired";
        break;
      case "Lease Expiration Warning (2 Days)":
        messageData = notification.data;
        messageKey = "notification.tenantLeaseExpiredAfterTwoDays";
        break;
      case "Lease Expiration Warning (1 Week)":
        messageData = notification.data;
        messageKey = "notification.tenantLeaseExpiredAfterOneWeek";
        break;

      case "Lease Expiration Warning (1 Month)":
        messageData = notification.data;
        messageKey = "notification.tenantLeaseExpiredAfterOneMonth";
        break;

      case "Payment Due Today":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentDueToday";
        break;

      case "Payment Due Soon (2 Days)":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentDueTwoDays";
        break;

      case "Payment Due Soon (1 Week)":
        messageData = notification.data;
        messageKey = "notification.tenantPaymentDueOneWeek";
        break;

      default:
        messageData = "Unknown notification type";
        messageKey = "notification.unknown";
    }

    return t(messageKey, { unitNumber: messageData });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {t("notification.notification")}
        </h2>
        <ul className="divide-y divide-gray-300">
          {notifications.length !== 0 ? (
            notifications.map((notification, index) => (
              <li key={index} className="py-2">
                {renderNotificationMessage(notification)}
              </li>
            ))
          ) : (
            <li className="py-2">{t("notification.noNotification")}</li>
          )}
        </ul>
        <div className="mt-4 text-right">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            {t("notification.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

const LeaseStatus = ({
  status,
  startDate,
  endDate,
  buildingName,
  floor,
  unit,
}) => {
  const { t } = useTranslation();

  const getStatusBadge = () => {
    let colorClass = "";
    let text = "";

    switch (status.toLowerCase()) {
      case "new":
        colorClass = "bg-gray-500";
        text = t("tenantUsers.new");
        break;
      case "active":
        colorClass = "bg-green-500";
        text = t("tenantUsers.active");
        break;
      case "pending":
        colorClass = "bg-yellow-500";
        text = t("tenantUsers.pending");
        break;
      case "expired":
        colorClass = "bg-red-500";
        text = t("tenantUsers.expired");
        break;
      default:
        colorClass = "bg-gray-500";
        text = t("tenantUsers.unknown");
        break;
    }

    return { colorClass, text };
  };

  const { colorClass, text } = getStatusBadge();
  const buildingInfo =
    buildingName && floor && unit
      ? `${buildingName}, ${floor} - ${unit}`
      : "Building Information Unavailable";

  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div className={`px-4 py-2 ${colorClass} flex justify-between`}>
        <h2 className="text-lg font-semibold text-white">{buildingInfo}</h2>

        <h2 className="text-lg font-semibold text-white">{text}</h2>
      </div>
      <div className="px-4 py-2">
        <p className="text-gray-800 text-sm">
          <span className="font-semibold">{t("tenantUsers.leaseStatus")}:</span>{" "}
          {text}
        </p>
        {startDate && (
          <p className="text-gray-600 text-xs mt-1">
            <span className="font-semibold">{t("tenantUsers.startDate")}:</span>{" "}
            {startDate}
          </p>
        )}
        {endDate && (
          <p className="text-gray-600 text-xs mt-1">
            <span className="font-semibold">{t("tenantUsers.endDate")}:</span>{" "}
            {endDate}
          </p>
        )}
        <p className="text-gray-600 text-xs mt-1">
          {t("tenantUsers.currently")} {text.toLowerCase()}.
        </p>
        {status.toLowerCase() === "pending" && (
          <p className="text-yellow-600 text-xs mt-1">
            {t("tenantUsers.waitForApproval")}
          </p>
        )}
        {status.toLowerCase() === "expired" && (
          <p className="text-red-600 text-xs mt-1">
            {t("tenantUsers.contactYourLandlord")}
          </p>
        )}
      </div>
    </div>
  );
};

const PaymentStatus = ({
  payments,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarType,
  fetchLeases,
  setState,
  setError,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [slip, setSlip] = useState(null);
  const openModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInvoiceNumber("");
    setSelectedBank(null);
    setSlip(null);
  };

  const handlePayButtonClick = (payment) => {
    openModal(payment);
  };

  const handleInvoiceNumberChange = (event) => {
    setInvoiceNumber(event.target.value);
  };

  const handleBankSelect = (event) => {
    setSelectedBank(event.target.value);
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlip(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const getStatusBadge = (status) => {
    let colorClass = "";
    let text = "";

    switch (status.toLowerCase()) {
      case "paid":
        colorClass = "bg-green-500";
        text = t("tenantUsers.paid");
        break;
      case "pending":
        colorClass = "bg-yellow-500";
        text = t("tenantUsers.pending");
        break;
      case "late":
        colorClass = "bg-red-500";
        text = t("tenantUsers.late");
        break;
      case "canceled":
        colorClass = "bg-gray-500";
        text = t("tenantUsers.canceled");
        break;
      case "awaiting approval":
        colorClass = "bg-blue-500";
        text = t("tenantUsers.awaitingApproval");
        break;
      default:
        colorClass = "bg-gray-500";
        text = t("tenantUsers.unknown");
        break;
    }

    return { colorClass, text };
  };
  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div className={`px-4 py-2 bg-blue-500`}>
        <h2 className="text-lg font-semibold text-white">
          {t("tenantUsers.paymentStatus")}
        </h2>
      </div>
      <div className="px-4 py-2 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {payments
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((payment, index) => (
            <div key={index} className="mb-4">
              <div
                className={`px-4 py-2 flex items-center justify-between ${
                  getStatusBadge(payment.status).colorClass
                }`}
              >
                {payment.end_month ? (
                  <h3 className="text-md font-semibold text-white">
                    {" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                    }).format(new Date(payment.start_month))}{" "}
                    {" - "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                    }).format(new Date(payment.end_month))}
                  </h3>
                ) : (
                  <h3 className="text-md font-semibold text-white">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "long",
                    }).format(new Date(payment.start_month))}
                  </h3>
                )}
                <h3 className="text-md font-semibold text-white">
                  {getStatusBadge(payment.status).text}
                </h3>

                {(payment.status.toLowerCase() === "pending" ||
                  payment.status.toLowerCase() === "canceled") && (
                  <Tooltip title={t("tenantUsers.pay")}>
                    <IconButton
                      aria-label="pay"
                      onClick={() => handlePayButtonClick(payment)}
                    >
                      <AccountBalanceWalletIcon className="text-white" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              {/* Pay Icon */}

              <div>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.rentFee")}:
                  </span>{" "}
                  {payment.rent_fee}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.utilityFee")}:
                  </span>{" "}
                  {payment.utility_fee}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.otherFee")}:
                  </span>{" "}
                  {payment.other_fee}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.penaltyFee")}:
                  </span>{" "}
                  {payment.penalty_fee}
                </p>

                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.totalFee")}:
                  </span>{" "}
                  {parseFloat(payment.rent_fee ?? 0) +
                    parseFloat(payment.utility_fee ?? 0) +
                    parseFloat(payment.other_fee ?? 0) +
                    parseFloat(payment.penalty_fee ?? 0)}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.from")}:
                  </span>{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(payment.start_month))}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold"> {t("tenantUsers.to")}:</span>{" "}
                  {payment.end_month !== null &&
                    new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(payment.end_month))}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  <span className="font-semibold">
                    {" "}
                    {t("tenantUsers.dueDate")}:
                  </span>{" "}
                  {new Date(payment.due_date).toLocaleDateString()}
                </p>
              </div>

              {payment.status.toLowerCase() === "pending" && (
                <p className="text-yellow-600 text-xs mt-1">
                  {t("tenantUsers.paymentIsPending")}
                </p>
              )}
              {payment.status.toLowerCase() === "late" && (
                <p className="text-red-600 text-xs mt-1">
                  {t("tenantUsers.paymentIsLate")}
                </p>
              )}
              {payment.status.toLowerCase() === "paid" && (
                <p className="text-green-600 text-xs mt-1">
                  {t("tenantUsers.paymentSuccessfullyReceived")}
                </p>
              )}
              {payment.status.toLowerCase() === "awaiting approval" && (
                <p className="text-blue-600 text-xs mt-1">
                  {t("tenantUsers.paymentAwaitingApproval")}
                </p>
              )}
              {payment.status.toLowerCase() === "canceled" && (
                <p className="text-gray-600 text-xs mt-1">
                  {t("tenantUsers.paymentCanceled")}
                </p>
              )}
              <hr className="my-1" />
            </div>
          ))}
      </div>
      {/* Modal for entering invoice number */}
      {showModal && selectedPayment && (
        <PaymentModal
          isOpen={showModal}
          onClose={closeModal}
          payment={selectedPayment}
          invoiceNumber={invoiceNumber}
          slip={slip}
          handleFileUpload={handleFileUpload}
          onInvoiceNumberChange={handleInvoiceNumberChange}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          fetchLeases={fetchLeases}
          selectedBank={selectedBank}
          handleBankSelect={handleBankSelect}
          setState={setState}
          setError={setError}
          setInvoiceNumber={setInvoiceNumber}
          setSelectedBank={setSelectedBank}
          setSlip={setSlip}
        />
      )}
    </div>
  );
};

const MaintenanceStatus = ({
  requests,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarType,
  fetchLeases,
  setState,
  setError,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [slip, setSlip] = useState(null);
  const openModal = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInvoiceNumber("");
    setSelectedBank(null);
    setSlip(null);
  };

  const handlePayButtonClick = (payment) => {
    openModal(payment);
  };

  const handleInvoiceNumberChange = (event) => {
    setInvoiceNumber(event.target.value);
  };

  const handleBankSelect = (event) => {
    setSelectedBank(event.target.value);
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlip(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const getStatusBadge = (status) => {
    let colorClass = "";
    let text = "";

    switch (status.toLowerCase()) {
      case "processing":
        colorClass = "bg-green-500";
        text = t("tenantUsers.processing");
        break;
      case "pending":
        colorClass = "bg-yellow-500";
        text = t("tenantUsers.pending");
        break;

      case "canceled":
        colorClass = "bg-gray-500";
        text = t("tenantUsers.canceled");
        break;

      default:
        colorClass = "bg-gray-500";
        text = t("tenantUsers.unknown");
        break;
    }

    return { colorClass, text };
  };
  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden m-4">
      <div
        className={`px-4 py-2 `}
        style={{ background: "linear-gradient(to right, #4880EC, #019CAD)" }}
      >
        <h2 className="text-base font-semibold text-white">
          {t("tenantUsers.maintenanceStatus")}
        </h2>
      </div>
      <div className="px-4 py-2 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {requests.map((request, index) => (
          <div key={index} className="mb-4">
            <div
              className={`px-4 py-2 flex items-center justify-between ${
                getStatusBadge(request.status).colorClass
              }`}
            >
              <h3 className="text-md font-semibold text-white">
                {request.id.substring(0, 5)}
              </h3>

              <h3 className="text-md font-semibold text-white">
                {getStatusBadge(request.status).text}
              </h3>
            </div>

            <div>
              <p className="text-gray-600 text-xs mt-1">
                <span className="font-semibold">
                  {t("tenantUsers.requestDate")}:
                </span>{" "}
                {request.date}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                <span className="font-semibold">
                  {t("tenantUsers.description")}:
                </span>{" "}
                {request.description}
              </p>

              {request.work_orders && request.work_orders.length > 0 && (
                <div>
                  {request.work_orders.map((work_order, index) => (
                    <div key={index} className="mt-2">
                      <p className="text-gray-600 text-xs mt-1">
                        <span className="font-semibold">
                          {t("tenantUsers.workOrderDescription")}:
                        </span>{" "}
                        {work_order.work_description}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        <span className="font-semibold">
                          {t("tenantUsers.scheduledDate")}:
                        </span>{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(work_order.scheduled_date))}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        <span className="font-semibold">
                          {t("tenantUsers.completionDate")}:
                        </span>{" "}
                        {work_order.completion_date !== null &&
                          new Intl.DateTimeFormat("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(work_order.completion_date))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-1" />
          </div>
        ))}
      </div>
      {/* Modal for entering invoice number */}
      {showModal && selectedPayment && (
        <PaymentModal
          isOpen={showModal}
          onClose={closeModal}
          payment={selectedPayment}
          invoiceNumber={invoiceNumber}
          slip={slip}
          handleFileUpload={handleFileUpload}
          onInvoiceNumberChange={handleInvoiceNumberChange}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          fetchLeases={fetchLeases}
          selectedBank={selectedBank}
          handleBankSelect={handleBankSelect}
          setState={setState}
          setError={setError}
          setInvoiceNumber={setInvoiceNumber}
          setSelectedBank={setSelectedBank}
          setSlip={setSlip}
        />
      )}
    </div>
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
  payment,
  invoiceNumber,
  slip,
  handleFileUpload,
  onInvoiceNumberChange,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarType,
  fetchLeases,
  selectedBank,
  handleBankSelect,
  setState,
  setError,
  setInvoiceNumber,
  setSelectedBank,
  setSlip,
}) => {
  const { t } = useTranslation();
  const [banks, setBanks] = useState([]);
  const handleConfirm = async () => {
    try {
      const requestBody = {
        invoice_number: invoiceNumber,
        slip: slip,
        bank_name: selectedBank,
      };
      const response = await PaymentService.updatePayment(
        payment.id,
        requestBody
      );

      if (response.status === 200) {
        setSnackbarMessage(t("tenantUsers.paymentAdded"));
        setSnackbarType("success");
        setSnackbarOpen(true);
        onClose();
        fetchLeases();
        setInvoiceNumber("");
        setSelectedBank(null);
        setSlip(null);
      }
    } catch (error) {
      console.log(error.message);
      setSnackbarMessage(t("tenantUsers.failedToUpdatePayment"));
      setSnackbarType("error");
      setSnackbarOpen(true);
      setInvoiceNumber("");
      setSelectedBank(null);
      setSlip(null);
    }
  };

  const fetchBanks = async () => {
    try {
      const banks = await ListOfBanksService.getAllBanks();
      const sortedResponse = banks.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
      });

      setTimeout(() => {
        setBanks(sortedResponse);
      }, 100);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ minWidth: 300 }}>
      <DialogTitle sx={{ backgroundColor: "#2196f3", color: "white" }}>
        {t("tenantUsers.invoiceInfo")}
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          id="invoice-number"
          label={t("tenantUsers.invoiceNumber")}
          type="text"
          required
          fullWidth
          sx={{ marginBottom: 2 }}
          value={invoiceNumber}
          onChange={onInvoiceNumberChange}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="dropdown-label">
            {t("tenantUsers.selectBank")}
          </InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown-select"
            value={selectedBank}
            label={t("tenantUsers.selectBank")}
            onChange={handleBankSelect}
          >
            {banks.map((bank) => (
              <MenuItem key={bank.id} value={bank.name}>
                {bank.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <IconButton
            color="primary"
            onClick={() =>
              document.getElementById("invoice-slip-upload").click()
            }
            sx={{ marginRight: 1 }}
          >
            <AttachFileIcon />
          </IconButton>
          <div style={{ flex: 1 }}>
            {slip ? (
              <div>{slip.name}</div>
            ) : (
              <div>{t("tenantUsers.noFileChosen")}</div>
            )}
          </div>
          <input
            accept=".pdf,.jpg,.png"
            style={{ display: "none" }}
            id="invoice-slip-upload"
            type="file"
            required
            onChange={handleFileUpload}
          />
        </div>

        <div style={{ marginTop: 15, textAlign: "left" }}>
          <Button
            onClick={handleConfirm}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {t("tenantUsers.confirmPayment")}
          </Button>
          <Button onClick={onClose} color="primary">
            {t("tenantUsers.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BuildingDetails = ({ lease }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden m-4 pb-6 mb-10">
      <div className="px-4 py-2 bg-blue-500">
        <h2 className="text-lg font-semibold text-white">
          {t("tenantUsers.unitDetails")}
        </h2>
      </div>
      <div className="px-4 py-2">
        <p className="text-gray-800 text-sm">
          <span className="font-semibold">{t("tenantUsers.address")}:</span>{" "}
          {lease.building_unit.building.address}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          <span className="font-semibold">{t("tenantUsers.floorNo")}:</span>{" "}
          {lease.building_unit.floor_no}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          <span className="font-semibold">{t("tenantUsers.unitNo")}:</span>{" "}
          {lease.building_unit.unit_number}
        </p>
        {lease.building_unit.price_per_meter_sq !== 0 ? (
          <p className="text-gray-600 text-xs mt-1">
            <span className="font-semibold">
              {t("tenantUsers.pricePerMeterSq")} :{" "}
            </span>{" "}
            {lease.building_unit.price_per_meter_sq}
          </p>
        ) : (
          <p className="text-gray-600 text-xs mt-1">
            <span className="font-semibold">
              {t("tenantUsers.monthlyRent")} :{" "}
            </span>

            {lease.monthly_rent}
          </p>
        )}
        {lease.building_unit.price_per_meter_sq !== 0 && (
          <>
            <p className="text-gray-600 text-xs mt-1">
              <span className="font-semibold">
                {t("tenantUsers.areaInSqm")} :
              </span>{" "}
              {lease.building_unit.area_in_sqm}
            </p>
            <p className="text-gray-600 text-xs mt-1">
              <span className="font-semibold">
                {t("tenantUsers.monthlyRent")} :
              </span>{" "}
              {lease.monthly_rent}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Maintenance request component
const MaintenanceRequest = ({ onSubmit, unit }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(description, unit);
    setDescription("");
  };

  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg overflow-hidden m-4 mb-10">
      <div className="px-4 py-2 bg-blue-500">
        <h2 className="text-lg font-semibold text-white">
          {t("tenantUsers.maintenanceRequest")}
        </h2>
      </div>
      <div className="px-4 py-2">
        <form onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder={t("tenantUsers.maintenanceRequestDescription")}
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            {t("tenantUsers.submitRequest")}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App component
const UserHome = () => {
  const { t, i18n } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [leases, setLeases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("regularuser")) || [];
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [value, setValue] = useState(0);

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };
  const navigate = useNavigate();

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const leases = await LeaseService.getLeaseByUserId(userInfo.user.id);

      for (const lease of leases) {
        try {
          const payments = await PaymentService.getPaymentsByLeaseId(lease.id);
          lease.payments = payments;
        } catch (paymentError) {
          console.error(
            `Error fetching payments for lease ${lease.id}:`,
            paymentError
          );
          // Set payments to null or handle the error as needed
          lease.payments = null;
        }
      }

      const sortedResponse = leases.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }
        return 0;
      });

      setLeases(sortedResponse);
      fetchRequests();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leases:", error);
      const newState = { vertical: "bottom", horizontal: "center" };
      setState({ ...newState, open: true });
      setSnackbarMessage(null);
      setError(error);
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response =
        await MaintenanceRequestService.getMaintenanceRequestByUserId(
          userInfo.user.id
        );
      const requests = response.data;

      const sortedRequests = requests.sort((a, b) => {
        if (new Date(a.created_at) > new Date(b.created_at)) {
          return -1;
        }
        return 1;
      });

      setRequests(sortedRequests);
      setLoading(false);
    } catch (fetchError) {
      console.error("Error fetching maintenance requests:", fetchError);
      // setSnackbarMessage("Failed to fetch maintenance requests");
      // setSnackbarOpen(true);
      setError(fetchError);
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("regularuser", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  const handleLogout = () => {
    setLogoutLoading(true);
    try {
      AuthService.regularUserLogout();
      setTimeout(() => {
        navigate("/login");
        setLogoutLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setLogoutLoading(false);
    }
  };

  const handleLanguageChange = (selectedLanguage) => {};

  const handleMaintenanceRequest = async (description, unit) => {
    try {
      const requestData = {
        building_unit_id: unit,
        description: description,
        status: "pending",
      };
      const response = await MaintenanceRequestService.createMaintenanceRequest(
        requestData
      );
      if (response.status === 201) {
        setSnackbarMessage(t("tenantUsers.requestSubmittedSuccessfully"));
        setSnackbarType("success");
        setSnackbarOpen(true);

        fetchLeases();
      }
      setNotifications([
        ...notifications,
        `Maintenance request: ${description}`,
      ]);
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      setNotifications([
        ...notifications,
        `Failed to submit maintenance request: ${description}`,
      ]);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = AuthService.isUserLoggedIn();
      if (!loggedIn) {
        navigate("/login");
      }
    };
    checkLoggedIn();
    fetchLeases();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
      cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.subscribe("notification-channel");

    const fetchNotifications = async () => {
      try {
        const notificationList = await NotificationService.getNotificationById(
          userInfo.user?.id
        );
        setNotifications(notificationList);

        const unreadNotifications = notificationList.filter(
          (notification) => notification.read === "0"
        );
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();

    const handleNotificationEvent = (data) => {
      try {
        if (parseInt(data.notification.notifiable) === userInfo.user?.id) {
          setNotifications((prevNotifications) => {
            const notificationExists = prevNotifications.some(
              (notification) => notification.id === data.notification.id
            );

            const updatedNotifications = notificationExists
              ? prevNotifications
              : [...prevNotifications, data.notification];

            const unreadNotifications = updatedNotifications.filter(
              (notification) => notification.read === 0
            );
            setUnreadCount(unreadNotifications.length);

            return updatedNotifications;
          });
        }
      } catch (error) {
        console.log("Error handling notification event:", error.message);
      }
    };

    channel.bind("notification-event", handleNotificationEvent);

    return () => {
      pusher.unsubscribe("notification-channel");
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
    markAllNotificationsAsSeen();
  };

  const markAllNotificationsAsSeen = async () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      seen: true,
    }));
    try {
      await NotificationService.markNotificationAsRead(userInfo.user?.id);
      setNotifications(updatedNotifications);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Navbar
        handleNotificationClick={handleNotificationClick}
        handleLogout={handleLogout}
        handleLanguageChange={handleLanguageChange}
        i18n={i18n}
        userInfo={userInfo}
        logoutLoading={logoutLoading}
        unreadCount={unreadCount}
      />
      {showNotifications && (
        <Notifications
          notifications={notifications}
          onClose={handleCloseNotifications}
        />
      )}
      <div className="max-w-7xl mx-auto p-4">
        {loading && <p>{t("tenantUsers.loadingLeases")}</p>}

        {error && <p> {error.message}</p>}
        <div className="flex flex-wrap">
          {leases.map((lease) => {
            const leaseRequests = requests.filter(
              (request) => request.building_unit === lease.building_unit.id
            );
            return (
              <div
                key={lease.id}
                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4"
              >
                <LeaseStatus
                  status={lease.status}
                  buildingName={lease.building_unit.building.name}
                  floor={lease.building_unit.floor_no}
                  unit={lease.building_unit.unit_number}
                  startDate={new Date(lease.start_date).toLocaleDateString()}
                  endDate={new Date(lease.end_date).toLocaleDateString()}
                />
                <PaymentStatus
                  payments={lease.payments || []}
                  setSnackbarOpen={setSnackbarOpen}
                  setSnackbarMessage={setSnackbarMessage}
                  setSnackbarType={setSnackbarType}
                  fetchLeases={fetchLeases}
                  setState={setState}
                  setError={setError}
                />
                {leaseRequests.length > 0 && (
                  <MaintenanceStatus
                    requests={leaseRequests}
                    setSnackbarOpen={setSnackbarOpen}
                    setSnackbarMessage={setSnackbarMessage}
                    setSnackbarType={setSnackbarType}
                    fetchLeases={fetchLeases}
                    setState={setState}
                    setError={setError}
                  />
                )}

                <BuildingDetails lease={lease} />

                <MaintenanceRequest
                  onSubmit={handleMaintenanceRequest}
                  unit={lease.building_unit.id}
                />
              </div>
            );
          })}
        </div>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            className="bg-gray-200 py-4 z-0 "
          >
            <footer>
              <Container maxWidth="lg">
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                >
                  &copy; {new Date().getFullYear()} Jabulani Mehal Merkato PLC.
                  All rights reserved. Powered by{" "}
                  <a
                    href="https://skylinkict.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    skylinkict
                  </a>
                  .
                </Typography>
              </Container>
            </footer>
          </BottomNavigation>
        </Paper>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          style={{
            backgroundColor: snackbarType === "success" ? "#5cb85c" : "#f44336",
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  );
};

export default UserHome;
