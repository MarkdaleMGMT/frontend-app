import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Affiliate from "../pages/Affiliate/Affiliate";
import LeftSideBar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";

const Routes = () => (
  <div>
    <div className="container">
      <LeftSideBar />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/affiliates" component={Affiliate} />
      <Footer />
    </div>
  </div>
);

export default Routes;
