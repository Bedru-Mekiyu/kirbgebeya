// auth.service.js

import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {
  async login(user_name, password) {
    return apiService
      .post(`${BASE_URL}/login`, {
        user_name,
        password,
      })
      .then((response) => {
        return response;
      });
  }
  async register(userData) {
    return apiService.post("/users", userData).then((response) => {
      console.log(response);
      return response;
    });
  }

  isLoggedIn() {
    return localStorage.getItem("user") !== null;
  }

  isUserLoggedIn() {
    return localStorage.getItem("regularuser") !== null;
  }

  logout() {
    localStorage.removeItem("user");
  }
  regularUserLogout() {
    localStorage.removeItem("regularuser");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
