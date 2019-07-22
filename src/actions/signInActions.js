import {
  FETCH_TOKEN,
  LOGOUT,
  RESET,
  SET_AUTHENTICATED
} from "../actions/types";

export const fetchToken = payload => ({
  type: FETCH_TOKEN,
  payload
});

export const logoutUser = () => ({
  type: LOGOUT
});

export const clearStore = () => ({
  type: RESET
});

//action creator to authneticate user during the login page
export const authenticateUser = (formData, history) => ({
  type: "SET_AUTHENTICATED",
  payload: formData,
  history: history
});
