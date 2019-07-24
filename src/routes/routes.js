//to handle dashboard and affiliate routes dynamically

import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Affiliate from "../pages/Affiliate/Affiliate";
import LeftSideBar from "../components/Sidebar/Sidebar";

const Routes = () => (
  <div>
    <div>
      <LeftSideBar />

      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/affiliates" component={Affiliate} />
    </div>
  </div>
);

export default Routes;
