import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_AUTHENTICATED,
  RESET_PASSWORD
} from "../actions/types";

const initialState = {
  token: null,
  userId: null,
  authenticated: false,
  loading: false,
  errors: null,
  isUserLoggedIn: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        loading: false
      };
    case AUTH_FAIL:
      return { ...state, loading: false, error: action.error };

    case AUTH_LOGOUT:
      return { ...state, token: null, userId: null };

    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        isUserLoggedIn: true,
        ...action.payload
      };

    case RESET_PASSWORD:
      return {
        ...state,
        ...action.payload
      };

    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    default:
      return state;
  }
}
