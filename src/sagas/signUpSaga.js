import { call, put, fork, take } from "redux-saga/effects";

import { signupUser } from "../actions/signUpActions";
import { SET_USER, SET_ERRORS, CLEAR_ERRORS } from "../actions/types";
// import axios from "axios";
import qs from "qs";
import api from "../apis/axios_api";

/** function that returns an axios call */
function signUpApi(signUpData) {
  console.log("formvalues", signUpData);
  return api.post("/signup", qs.stringify(signUpData));
}

/** saga worker that is responsible for the side effects */
function* signUpEffectSaga(action) {
  try {
    // data is obtained after axios call is resolved
    let history = action.history;
    let { data } = yield call(signUpApi, action.payload);

    // dispatch signupUser action to change redux state
    yield put(signupUser(data, history));

    //dispatch clear_errors action creator to remove any previous set errors
    yield put({ type: CLEAR_ERRORS });

    // redirect to dashboard route after successful signup

    history.push("/dashboard");
  } catch (e) {
    // catch error on a bad axios call and dispatch set_errors action creator
    yield put({ type: SET_ERRORS, payload: e.response.data });
    console.log("errors", e);
  }
}

/**
 * saga watcher that is triggered when dispatching action of type
 * 'SET_USER'
 */
export function* signUpWatcherSaga() {
  yield takeOneAndBlock(SET_USER, signUpEffectSaga);
}

/**custom built redux saga function to prevent duplication of api requests */
function* takeOneAndBlock(pattern, worker, ...args) {
  const task = yield fork(function*() {
    while (true) {
      const action = yield take(pattern);
      yield call(worker, ...args, action);
    }
  });
  return task;
}
