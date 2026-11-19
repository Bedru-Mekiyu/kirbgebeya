// reducers.js
import { combineReducers } from "redux";
import {
  SET_IS_LOGGED_IN,
  SET_LOADING,
  SET_MESSAGE,
  SET_PASSWORD,
  SET_USER_NAME, // Update import to use SET_USER_NAME instead of SET_PHONE_NUMBER
} from "./actionTypes";

const initialState = {
  userName: "", // Update state property name from 'phoneNumber' to 'userName'
  password: "",
  loading: false,
  message: "",
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME: // Update action type to SET_USER_NAME
      return { ...state, userName: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_MESSAGE:
      return { ...state, message: action.payload };
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
