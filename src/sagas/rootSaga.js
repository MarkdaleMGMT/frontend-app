import { all, fork } from "redux-saga/effects";
import * as signInSagas from "./signInSaga";
import * as signUpSagas from "./signUpSaga";
import * as forgotPasswordSagas from "./forgotPasswordSaga";

// import watchers from other files
export default function* rootSaga() {
  yield all(
    [
      ...Object.values(signInSagas),
      ...Object.values(signUpSagas),
      ...Object.values(forgotPasswordSagas)
    ].map(fork)
  );
}
