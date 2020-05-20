import React, { Component } from "react";

import {
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { AnnotationLabel } from "react-annotation";

import PropTypes from "prop-types";
import "./Dashboard.scss";
import Fullscreen from "react-full-screen";

import FetchDataMin from "../../HOC/FetchDataMin";
import {
  getOverviewTableData,
  getBalanceHistory,
  getPaddedBalanceHistory,
  getNewTransactionHistory
} from "../../service/axios-service";
import { user, balance, account } from "../../service/body-data";
import { INVESTMENT_USER } from "../../config/config";
// import { AnnotationLabel, EditableAnnotation, ConnectorElbow, ConnectorEndDot, Note } from 'react-annotation'

import {
  LeftSidebar,
  ResponsiveSidebar,
  TransferModal,
  DoughnutChart,
  LineChart,
  ChartTable,
  TransactionTable,
  Footer,
  CustomSnackbar,
  GlobalUpdateModal,
  DepositModal,
  WithdrawModal,
  WelcomeSlider
} from "./../../components";

export default class Dashboard extends Component {
  /**
   * This state is lifted up from TransactionTable for creating Http request body data which
   *  will be passed to HOC FetchDataMin as "interval" argument.
   */

  static propTypes = {
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      refresh_interval_sec: 60,
      linechart_time_days: 1825,
      isAlertVisible: false,
      alertType: "",
      alertMessage: "",
      showOrientation: false, // parseInt(localStorage.getItem("new_user")) == 1,
      isFull: false,
      dashbboardMounted: false
    };

    this.showAlert = this.showAlert.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.showWelcomePage = this.showWelcomePage.bind(this);
    this.hideWelcomePage = this.hideWelcomePage.bind(this);
  }
  componentDidMount() {
    this.setState({ dashbboardMounted: true });
  }
  showAlert(message, type) {
    this.setState({
      alertMessage: message,
      alertType: type,
      isAlertVisible: true
    });
  }

  dismissAlert() {
    this.setState({ isAlertVisible: false });
  }

  showWelcomePage() {
    this.setState({ showOrientation: true });
  }

  hideWelcomePage() {
    this.setState({ showOrientation: false });
  }

  goFull = () => {
    this.setState({ isFull: true });
  };

  render() {
    const {
      refresh_interval_sec,
      linechart_time_days,
      isAlertVisible,
      alertType,
      alertMessage,
      showOrientation,
      dashbboardMounted
    } = this.state;
    const ref_code = localStorage.getItem("ref_code");
    let username = localStorage.getItem("username");
    const level = localStorage.getItem("user_level");
    console.log("YOUR LEVEL IS: " + level);

    if (level == 0) username = INVESTMENT_USER;

    // if(showOrientation && level!=0)
    // return

    const ChartTableMin = FetchDataMin(ChartTable, getOverviewTableData, {
      key: "username",
      value: username
    });
    const DoughnutChartMin = FetchDataMin(DoughnutChart, getOverviewTableData, {
      key: "username",
      value: username
    });
    const LineChartMin = FetchDataMin(LineChart, getPaddedBalanceHistory, {
      username,
      time_period_days: linechart_time_days,
      chart: true
    });

    const TransactionTableMin = FetchDataMin(
      TransactionTable,
      getNewTransactionHistory,
      level == 0 ? {} : { username }
    );

    return (
      <div>
 
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({ isFull })}
        >
          {this.state.isFull && (
            <div style={{minHeight:"100vh"}}>
            <Container style={{minHeight:"100vh"}} fluid={true} className="fullScreen">
              <Row style={{ alignItems: "center" }}>
            
                <Col lg={6} md={6} sm={6} >
                  <ChartTableMin />
                </Col>
                <Col   style={{height: "40vh"}} className="" lg={6} md={6} sm={6}>
                  <DoughnutChartMin />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "5.416vh", paddingTop: "5.416vh", minHeight:"60vh"}}>
                <Col lg={12} md={12} sm={12}>
                  <LineChartMin interval={linechart_time_days} />
                </Col>
              </Row>
            </Container>

            </div>
          )}
        </Fullscreen>

        <CustomSnackbar
            open={isAlertVisible}
            variant={alertType}
            message={alertMessage}
            onClose={this.dismissAlert}
          ></CustomSnackbar>
          
          <Container>
            <div className="expandButton d-none d-lg-block">
              <Button
                style={{ border: "none" }}
                variant="outline-dark"
                className="fa fa-expand"
                onClick={this.goFull}
              ></Button>
            </div>

            <Row>
              <Col></Col>
            </Row>

              <Row style={{ alignItems: "center" }}>
                <Col lg={6} md={12} sm={12}>
                  <ChartTableMin />
                </Col>
                <Col className="" lg={6} md={12} sm={12}>
                  <DoughnutChartMin />
                </Col>
              </Row>
              <Row style={{ paddingTop: "5.416vw"}}>
                <Col lg={12} md={12} sm={12}>
                  <LineChartMin interval={linechart_time_days} />
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TransactionTableMin></TransactionTableMin>
                </Col>
              </Row>

              {level == 0 && (
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <WithdrawModal
                      showAlert={this.showAlert}
                      onSuccess={() => {}}
                    ></WithdrawModal>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <DepositModal
                      showAlert={this.showAlert}
                      onSuccess={() => {}}
                    ></DepositModal>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <TransferModal
                      showAlert={this.showAlert}
                      onSuccess={() => {}}
                    ></TransferModal>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <GlobalUpdateModal
                      showAlert={this.showAlert}
                      onSuccess={() => {}}
                    ></GlobalUpdateModal>
                  </Col>
                </Row>
              )}

              {level != 0 && (
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TransferModal
                      showAlert={this.showAlert}
                      onSuccess={() => {}}
                    ></TransferModal>
                  </Col>
                </Row>
              )}

            </Container>

        {showOrientation && level !== 0 && (
          <div className="page-overlay">
            <WelcomeSlider
              show={showOrientation}
              onHide={this.hideWelcomePage}
              history={this.props.history}
              close={this.hideWelcomePage}
              dashbboardMounted={dashbboardMounted}
            ></WelcomeSlider>
          </div>
        )}

      </div>
    );
  }
}
