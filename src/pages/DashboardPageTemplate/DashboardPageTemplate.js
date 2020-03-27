/**
 * Build a Higher-Order Component to wrap the dashboard page contents
 */
import React, { Component } from 'react';
import {Container, Row, Col,} from "react-bootstrap";
import {LeftSidebar, ResponsiveSidebar, Footer} from "./../../components";
import "./DashboardPageTemplate.scss";


export default function(WrappedComponent){
  return class extends Component{      
     
      render(){
            return( 
                <div>
                    <div className="navigation d-lg-none d-sm">
                        <ResponsiveSidebar history={this.props.history} />
                    </div>
                    
                    <div className="dashboard-container">
                        <div className="navigation d-none d-lg-block sidebarDesktop">
                            <LeftSidebar history={this.props.history} />
                        </div>

                        {/* <div><WrappedComponent {...this.props}/></div>

                        <div className="footer-container">
                            <Footer  history={this.props.history} />
                        </div> */}
                        

                        <Container fluid={true} className="content-wrapper " id="content-div">
                            <div><WrappedComponent {...this.props}/></div>

                            <Row className="footer-container">
                                <Col lg={12} md={12} sm={12} className="footer-container">
                                    <Footer history={this.props.history} />
                                </Col>
                            </Row>
                        </Container>
                    </div>                    
                </div>
                )
      }
  }
}