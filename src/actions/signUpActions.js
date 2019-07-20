import { SET_USER, SET_ERRORS, CLEAR_ERRORS } from "../actions/types";
import api from "../apis/axios_api";
export const signupUser = (newUserData, history) => dispatch => {
  api
    .post("/signup", newUserData)
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
