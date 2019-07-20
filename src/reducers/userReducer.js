import {
  TOKEN,
  LOGOUT,
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS
} from "../actions/types";

const initialState = {
  authenticated: false,
  loading: false,
  errors: null
};

export default function userReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case TOKEN:
      newState = Object.assign({}, state, { authenticated: true });
      return newState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOGOUT:
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return state;
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
