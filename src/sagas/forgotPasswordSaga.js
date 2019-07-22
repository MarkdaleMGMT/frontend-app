/* eslint-disable no-unused-vars */
import { put, call } from "redux-saga/effects";
import { RESET_PASSWORD, CLEAR_ERRORS, SET_ERRORS } from "../actions/types";
/**import custom built redux saga function {takeOneAndBlock}
 * to prevent duplication of api requests by redux saga effects */
import { takeOneAndBlock } from "../util/sagaUtil";
import { resetPassword } from "../actions/signInActions";
//import qs library from es6 to stringify form data
import qs from "qs";
// import configured axios from "axios_api file";
import api from "../apis/axios_api";

/** function that returns an axios call */
function resetPasswordApi(resetPasswordData) {
  //axios doesn't stringify form data by default.
  //Hence, qs library is used to stringify upcoming redux-form data.
  return api.post("/reset_password", qs.stringify(resetPasswordData));
}

/** saga worker that is responsible for the side effects */
function* resetPasswordEffectSaga(action) {
  try {
    // data that is obtained after axios call
    let history = action.history;
    let { data } = yield call(resetPasswordApi, action.payload);

    // dispatch authenticate reset password action to change redux state
    yield put(resetPassword(data, history));

    //dispatch clear_errors action creator to remove any previous set errors
    yield put({ type: CLEAR_ERRORS });

    // redirect to signIn route after successful password reset

    history.push("/signin");
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
export function* resetPasswordWatcherSaga() {
  yield takeOneAndBlock(RESET_PASSWORD, resetPasswordEffectSaga);
}
