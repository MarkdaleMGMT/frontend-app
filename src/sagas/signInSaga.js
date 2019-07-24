/* eslint-disable no-unused-vars */

import { put, call, takeEvery, delay } from "redux-saga/effects";

import {
  AUTHENTICATE_USER,
  CLEAR_ERRORS,
  SET_ERRORS,
  AUTH_INITIATE_LOGOUT,
  AUTH_CHECK_TIMEOUT
} from "../actions/types";
import * as actions from "../actions/signInActions";
//import qs library from es6 to stringify form data
import qs from "qs";
// import configured axios from "axios_api file";
import api from "../apis/axios_api";

/** function that returns data for token and session management */
function getToken() {
  //TODO: Add logic to get jwt token using username and password
  const expiresIn = 60 * 60 * 1000; // to set expiry time as 1 hour in milli seconds
  const expirationDate = new Date(new Date().getTime() + expiresIn);
  return {
    token: "fakeToken",
    userId: "fakeUserId",
    expirationDate,
    expiresIn
  };
}

/** function that returns an axios call */
function loginApi(loginData) {
  //axios doesn't stringify form data by default.
  //Hence, qs library is used to stringify upcoming redux-form data.

  //to check if it's a valid form data
  if (Object.keys(loginData).length === 2) {
    return api.post("/login", qs.stringify(loginData));
  }
}

/** saga worker that is responsible for the side effects */
function* loginEffectSaga(action) {
  try {
    let history = action.history;
    // data that is obtained after a  axios call
    const apiResponse = yield call(loginApi, action.payload);

    if (apiResponse) {
      let { data } = apiResponse;

      // dispatch authenticate user action to change redux state
      yield put(actions.authenticateUser(data, history));

      if (data) {
        //to set and dispatch session and token management action creators
        const tokenResponse = getToken();
        yield localStorage.setItem("token", tokenResponse.token);
        yield localStorage.setItem(
          "expirationDate",
          tokenResponse.expirationDate
        );
        yield localStorage.setItem("userId", tokenResponse.userId);

        yield put(
          actions.authSuccess(tokenResponse.token, tokenResponse.userId)
        );
        yield put(actions.checkAuthTimeout(tokenResponse.expiresIn));

        //dispatch clear_errors action creator to remove any previous set errors
        yield put({ type: CLEAR_ERRORS });

        // redirect to dashboard route after successful Login
        history.push("/affiliates");
      }
    }
  } catch (e) {
    // catch error on a bad axios call and dispatch set_errors action creator
    yield put({ type: SET_ERRORS, payload: e.response.data });
    console.log("errors", e.response);
  }
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'AUTH_CHECK_TIMEOUT' and inturn it fires off AUTH_INITIATE_LOGOUT action creator
 */
function* checkAuthTimeout(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'AUTH_INITIATE_LOGOUT'
 */
function* logout(action) {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("expirationDate");
  yield localStorage.removeItem("userId");
  yield put(actions.logoutSucceed());
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'AUTHENTICATE_USER'
 */
export function* loginWatcherSaga() {
  yield takeEvery(AUTHENTICATE_USER, loginEffectSaga);
}

export function* logoutWatcherSaga() {
  yield takeEvery(AUTH_INITIATE_LOGOUT, logout);
}

export function* checkAuthWatcherSaga() {
  yield takeEvery(AUTH_CHECK_TIMEOUT, checkAuthTimeout);
}
