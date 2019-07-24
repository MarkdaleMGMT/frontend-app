import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, ForgotPassword, Dashboard } from "./pages";
import Affiliate from "./pages/Affiliate/Affiliate";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dashboard/affiliates" component={Affiliate} />
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
