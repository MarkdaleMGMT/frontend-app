import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { default as UserStore } from "./userReducer";

const appReducer = combineReducers({
  UserStore,
  form: formReducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
