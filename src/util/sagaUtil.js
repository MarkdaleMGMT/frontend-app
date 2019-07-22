import { call, fork, take } from "redux-saga/effects";

/**custom built redux saga function to prevent duplication of api requests by redux saga effects */
export function* takeOneAndBlock(pattern, worker, ...args) {
  const task = yield fork(function*() {
    while (true) {
      const action = yield take(pattern);
      yield call(worker, ...args, action);
    }
  });
  return task;
}
