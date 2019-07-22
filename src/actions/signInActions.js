import {
  FETCH_TOKEN,
  LOGOUT,
  RESET,
  SET_AUTHENTICATED,
  RESET_PASSWORD,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_INITIATE_LOGOUT,
  AUTH_CHECK_TIMEOUT
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
  type: SET_AUTHENTICATED,
  payload: formData,
  history: history
});

//action creator to reset password
export const resetPassword = (formData, history) => ({
  type: RESET_PASSWORD,
  payload: formData,
  history: history
});

export const authSuccess = (token, userId) => {
  return {
    type: AUTH_SUCCESS,
    token: token,
    userId: userId
  };
};

export const authFail = error => {
  return {
    type: AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  return {
    type: AUTH_INITIATE_LOGOUT
  };
};

export const logoutSucceed = () => {
  return {
    type: AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return {
    type: AUTH_CHECK_TIMEOUT,
    expirationTime: expirationTime
  };
};
