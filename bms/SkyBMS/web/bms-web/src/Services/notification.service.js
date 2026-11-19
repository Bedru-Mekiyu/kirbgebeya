import axios from "axios";
import { BASE_URL } from "../Config"; // Adjust the import path as needed

// Create an Axios instance with the base URL
const apiService = axios.create({
  baseURL: BASE_URL,
});

const NotificationService = {
  // Fetch all notifications for the authenticated user
  getAllNotifications: async () => {
    try {
      const response = await apiService.get("/notifications");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch notifications"
      );
    }
  },

  // Fetch a specific notification by ID
  getNotificationById: async (id) => {
    try {
      const response = await apiService.get(`/notifications/${id}`);
      return response.data; // Assuming the response is directly the notification object
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch notification"
      );
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      const response = await apiService.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to mark notification as read"
      );
    }
  },
};

export default NotificationService;
