/* eslint-disable no-unused-vars */
import { put, call } from "redux-saga/effects";
/**import custom built redux saga function {takeOneAndBlock}
 * to prevent duplication of api requests by redux saga effects */
import { takeOneAndBlock } from "../util/sagaUtil";
import {
  FETCH_TOKEN,
  TOKEN,
  TOKEN_FAILED,
  SET_USER_ID,
  SET_AUTHENTICATED,
  CLEAR_ERRORS,
  SET_ERRORS
} from "../actions/types";
import { authenticateUser } from "../actions/signInActions";
//import qs library from es6 to stringify form data
import qs from "qs";
// import configured axios from "axios_api file";
import api from "../apis/axios_api";

// function getToken(data) {
//   //TODO: Add logic to get jwt token using username and password
//   return { token: "fakeToken", userId: "fakeUserId" };
// }

// function* setToken(action) {
//   try {
//     // const response = yield call(getToken, action);
//     localStorage.setItem("userId", "fakeUserId");
//     localStorage.setItem("token", "fakeToken");
//     // yield put({ type: SET_USER_ID, response.userId });
//     // yield put({ type: TOKEN, response.token });
//   } catch (error) {
//     console.error(error);
//     yield put({ type: TOKEN_FAILED, error });
//   }
// }

// export function* getTokenSaga() {
//   yield takeLatest(FETCH_TOKEN, setToken);
// }

/** function that returns an axios call */
function loginApi(loginData) {
  //axios doesn't stringify form data by default.
  //Hence, qs library is used to stringify upcoming redux-form data.
  return api.post("/login", qs.stringify(loginData));
}

/** saga worker that is responsible for the side effects */
function* loginEffectSaga(action) {
  try {
    // data that is obtained after axios call
    let history = action.history;
    let { data } = yield call(loginApi, action.payload);

    // dispatch authenticate user action to change redux state
    yield put(authenticateUser(data, history));

    //dispatch clear_errors action creator to remove any previous set errors
    yield put({ type: CLEAR_ERRORS });

    // redirect to dashboard route after successful Login

    history.push("/dashboard");
  } catch (e) {
    // catch error on a bad axios call and dispatch set_errors action creator
    yield put({ type: SET_ERRORS, payload: e.response.data });
    console.log("errors", e.response);
  }
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'SET_AUTHENTICATED'
 */
export function* loginWatcherSaga() {
  yield takeOneAndBlock(SET_AUTHENTICATED, loginEffectSaga);
}
