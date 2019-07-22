/* eslint-disable no-unused-vars */

import { delay } from "redux-saga";

import { put, call, takeEvery, takeLatest } from "redux-saga/effects";
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
import * as actions from "../actions/signInActions";
//import qs library from es6 to stringify form data
import qs from "qs";
// import configured axios from "axios_api file";
import api from "../apis/axios_api";

function getToken() {
  //TODO: Add logic to get jwt token using username and password
  const expiresIn = 60 * 60 * 1000; // in milli seconds
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
  return api.post("/login", qs.stringify(loginData));
}

/** saga worker that is responsible for the side effects */
function* loginEffectSaga(action) {
  try {
    // data that is obtained after axios call
    let history = action.history;
    let { data } = yield call(loginApi, action.payload);

    const tokenResponse = getToken();
    yield localStorage.setItem("token", tokenResponse.token);
    yield localStorage.setItem("expirationDate", tokenResponse.expirationDate);
    yield localStorage.setItem("userId", tokenResponse.userId);

    yield put(actions.authSuccess(tokenResponse.token, tokenResponse.userId));
    yield put(actions.checkAuthTimeout(tokenResponse.expiresIn));

    // dispatch authenticate user action to change redux state
    yield put(actions.authenticateUser(data, history));

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

function* checkAuthTimeout(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

function* logout(action) {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("expirationDate");
  yield localStorage.removeItem("userId");
  yield put(actions.logoutSucceed());
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'SET_AUTHENTICATED'
 */
export function* loginWatcherSaga() {
  yield takeOneAndBlock(SET_AUTHENTICATED, loginEffectSaga);
}
