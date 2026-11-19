// actions.js
import {
  SET_IS_LOGGED_IN,
  SET_LOADING,
  SET_MESSAGE,
  SET_PASSWORD,
  SET_USER_NAME,
} from "./actionTypes";

export const setUserName = (userName) => ({
  type: SET_USER_NAME,
  payload: userName,
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

export const setIsLoggedIn = (isLoggedIn) => ({
  type: SET_IS_LOGGED_IN,
  payload: isLoggedIn,
});
