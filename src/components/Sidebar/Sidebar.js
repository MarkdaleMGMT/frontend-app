import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logoutSucceed } from "../../actions/signInActions";
import "./Sidebar.scss";
// import Sidebar, { SidebarStyles } from "react-sidebar";
import { NavLink } from "react-router-dom";

class LeftSidebar extends Component {
  onLogout = () => {
    this.props.actions.logoutSucceed();
  };
  render() {
    return (
      <div className="sidebar-container">
        <ul className="sidebar navbar-nav">
          <div className="navigation-type">
            <li className="nav-item">
              <i className="fa fa-home" />
              <span>
                <NavLink activeClassName="active" to="/dashboard">
                  Dashboard
                </NavLink>
              </span>
            </li>

            <li className="nav-item">
              <i className="fa fa-empire" />
              {/* <i class="fas fa-steering-wheel"></i> */}
              <span>
                <NavLink activeClassName="active" to="/affiliates">
                  Affiliates
                </NavLink>
              </span>
            </li>
            <li className="nav-item">
              <i className="fa fa-clock-o" />
              <span>Stats</span>
            </li>

            <li className="nav-item">
              <i className="fa fa-line-chart" />
              <span>Exchange</span>
            </li>
          </div>
          <div className="Currency-type">
            <li className="nav-item">
              <i className="fa fa-chevron-right" />
              <span>CLAM</span>
            </li>
            <li className="nav-item">
              <i className="fa fa-chevron-right" />
              <span>BTC</span>
            </li>
            <li className="nav-item">
              <i className="fa fa-chevron-right" />
              <span>CAD</span>
            </li>
            <li className="nav-item">
              <i className="fa fa-chevron-right" />
              <span>USD</span>
            </li>
            <li className="nav-item">
              <i className="fa fa-chevron-right" />
              <span>GOLD</span>
            </li>
          </div>
          <div className="other-containt">
            <li className="nav-item">
              <i className="fa fa-envelope-square" />
              <span>Contact</span>
            </li>
            <li className="nav-item">
              <i className="fa fa-sign-out" />
              <span>
                <NavLink
                  onClick={this.onLogout()}
                  activeClassName="active"
                  to="/signin"
                >
                  Logout
                </NavLink>
              </span>
            </li>
            <li className="nav-item">
              <span>Referral Code</span>
            </li>
          </div>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: state.UserStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ logoutSucceed }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSidebar);
