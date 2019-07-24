import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, ForgotPassword } from "./pages";

import Routes from "./routes/routes";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route component={Routes} />

        <Route
          render={props => (
            <Redirect
              to={{ pathname: "/signin", state: { from: props.location } }}
            />
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
