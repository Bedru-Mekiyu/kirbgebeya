import PersonIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Badge,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { format } from "date-fns";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import AuthService from "../Services/auth.service";
import NotificationService from "../Services/notification.service";
import ProfileService from "../Services/profile.service";
import Profile from "./Profile";
const Navbar = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || [];
  });
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userInfo.user?.full_name,
    user_name: userInfo.user?.user_name,
    email: userInfo.user?.email,
    phone_number: userInfo.user?.phone_number?.startsWith("+251")
      ? userInfo.user?.phone_number?.slice(4)
      : userInfo.user?.phone_number,
    current_password: null,
    new_password: null,
    confirm_password: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({ phone_number: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const vertical = "top";
  const horizontal = "center";

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "MMM d, yyyy h:mm a");
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  const handleLanguageMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const languageOptions = [
    { code: "en", label: "English" },
    { code: "አማ", label: "አማርኛ" },
    // { code: "or", label: "afaan oromo" },
  ];

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    changeLanguage(language);
    handleLanguageMenuClose();
  };
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setLogoutLoading(true);

    try {
      setTimeout(() => {
        AuthService.logout();
        navigate("/login");
        setLogoutLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setLogoutLoading(false);
    }
  };
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
              (notification) => notification.read === "0"
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

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
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

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileMenuClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

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

      default:
        messageData = "Unknown notification type";
        messageKey = "notification.unknown";
    }

    return t(messageKey, { unitNumber: messageData });
  };

  return (
    <div position="fixed" className="bg-slate-50">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <WidgetsIcon style={{ color: "#4d7fb5" }} />
        </IconButton>
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          spacing={1.5}
        >
          <Grid item>
            <IconButton onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
            >
              {notifications.length !== 0 ? (
                notifications.map((notification) => (
                  <MenuItem key={notification.id}>
                    <div>
                      {notification.type === "Tenant Payment Attached" ? (
                        <a href={`/home/payment`}>
                          <div>{renderNotificationMessage(notification)}</div>
                          <div style={{ fontSize: "0.75rem", color: "gray" }}>
                            {notification.created_at
                              ? formatTimestamp(notification.created_at)
                              : "Unknown time"}
                          </div>
                        </a>
                      ) : (
                        <a href={`/home/maintenance/request`}>
                          <div>{renderNotificationMessage(notification)}</div>
                          <div style={{ fontSize: "0.75rem", color: "gray" }}>
                            {notification.created_at
                              ? formatTimestamp(notification.created_at)
                              : "Unknown time"}
                          </div>
                        </a>
                      )}
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem>{t("notification.noNotification")}</MenuItem>
              )}
            </Menu>
          </Grid>
          <Grid item>
            <Button
              startIcon={<LanguageIcon />}
              onClick={handleLanguageMenuClick}
            >
              {selectedLanguage}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageMenuClose}
            >
              {languageOptions.map((option) => (
                <MenuItem
                  key={option.code}
                  onClick={() => handleLanguageSelect(option.code)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Grid>

          <Grid item>
            <IconButton onClick={handleProfileClick}>
              <PersonIcon style={{ color: "#4d7fb5" }} />
            </IconButton>
          </Grid>

          <Grid item>
            {logoutLoading ? (
              <ClipLoader
                color="#4d7fb5"
                loading={logoutLoading}
                data-testid="loader"
                size={30}
              />
            ) : (
              <Button
                // style={{ color: "#fff" }}
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
              >
                {t("navbar.logout")}
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>

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
  );
};

export default Navbar;
