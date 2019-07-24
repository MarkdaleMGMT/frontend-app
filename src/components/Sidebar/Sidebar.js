import React, { Component } from "react";
import "./Sidebar.scss";
// import Sidebar, { SidebarStyles } from "react-sidebar";
import { NavLink } from "react-router-dom";

class LeftSidebar extends Component {
  render() {
    return (
      <div className="sidebar-container">
        <ul className="sidebar navbar-nav">
          <div className="navigation-type">
            <li className="nav-item onHover">
              <i className="fa fa-home" />
              <span>
                <NavLink activeClassName="active" to="/dashboard">
                  Dashboard
                </NavLink>
              </span>
            </li>

            <li className="nav-item onHover">
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
              <span>Logout</span>
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

// class LeftSidebar extends Component {
//     render() {
//         const sidebar = <div>Item 1</div>
//         const sidebarStyle = {
//             root: {
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 overflow: "hidden"
//             },
//             sidebar: {
//                 zIndex: 2,
//                 position: "absolute",
//                 top: 0,
//                 bottom: 0,
//                 transition: "transform .3s ease-out",
//                 WebkitTransition: "-webkit-transform .3s ease-out",
//                 willChange: "transform",
//                 overflowY: "auto",
//                 width: '250px'
//             },
//             content: {
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 overflowY: "auto",
//                 WebkitOverflowScrolling: "touch",
//                 transition: "left .3s ease-out, right .3s ease-out"
//             },
//             overlay: {
//                 zIndex: 1,
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 opacity: 0,
//                 visibility: "hidden",
//                 transition: "opacity .3s ease-out, visibility .3s ease-out",
//                 backgroundColor: "rgba(0,0,0,.3)"
//             },
//             dragHandle: {
//                 zIndex: 1,
//                 position: "fixed",
//                 top: 0,
//                 bottom: 0
//             }
//         };
//         return <Sidebar
//             defaultSidebarWidth = {
//                 160
//             }
//             docked = {
//                 true
//             }
//             open = {
//                 true
//             }
//             sidebar = {
//                 sidebar
//             }
//             styles = {
//                 sidebarStyle
//             }
//             onSetOpen = {
//                 (open: boolean) => {}
//             }
//             rootId = "test-root-id"
//             sidebarId = "test-sidebar-id"
//             contentId = "content-div"
//             overlayId = "test-overlay-id" >
//         </Sidebar>
//     }
// }

export default LeftSidebar;
