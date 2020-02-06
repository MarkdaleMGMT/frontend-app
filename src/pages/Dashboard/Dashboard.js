import React, { Component } from 'react';

import { Container, Row, Col, Navbar, NavbarBrand, Button, Collapse, NavDropdown } from 'react-bootstrap';
import { AnnotationLabel } from 'react-annotation';

import PropTypes from 'prop-types';
import './Dashboard.scss';
import Fullscreen from "react-full-screen";

import FetchDataMin from '../../HOC/FetchDataMin'
import {    getOverviewTableData,
            getBalanceHistory,
            getTransactionHistory,
            getNewBalanceHistory,
            getNewTransactionHistory } from '../../service/axios-service'
import { user, balance, account} from '../../service/body-data'
import { INVESTMENT_USER } from '../../config/config'
// import { AnnotationLabel, EditableAnnotation, ConnectorElbow, ConnectorEndDot, Note } from 'react-annotation'

import {    LeftSidebar,
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
            WelcomeSlider } from './../../components';

export default class Dashboard extends Component{
    /**
     * This state is lifted up from TransactionTable for creating Http request body data which
     *  will be passed to HOC FetchDataMin as "interval" argument.
     */

    static propTypes={
        location: PropTypes.object.isRequired
    };
    

    constructor(props){
        super(props);
        this.state = {
            refresh_interval_sec: 60,
            linechart_time_days: 180,
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',
            showOrientation: parseInt(localStorage.getItem("new_user")) == 1,
            isFull: false
        };

       this.showAlert = this.showAlert.bind(this);
       this.dismissAlert = this.dismissAlert.bind(this);
       this.showWelcomePage = this.showWelcomePage.bind(this);
       this.hideWelcomePage = this.hideWelcomePage.bind(this);
    }

    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }

    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }



    showWelcomePage(){
        this.setState({ showOrientation: true});
    }

    hideWelcomePage(){
        this.setState({ showOrientation: false});

       
        
    }



    goFull = () => {
        this.setState({ isFull: true });
      }



    // handleChange = (e)=>{
    //     this.setState({interval: e.target.value});
    // }



    render(){
        const { refresh_interval_sec, linechart_time_days, isAlertVisible, alertType, alertMessage, showOrientation} = this.state;
        const ref_code = localStorage.getItem("ref_code");
        let username = localStorage.getItem("username");
        const level =  localStorage.getItem("user_level");
        console.log("YOUR LEVEL IS: " + level)
        
        if(level == 0)
            username = INVESTMENT_USER

        // if(showOrientation && level!=0)
        // return 

        const ChartTableMin = FetchDataMin(ChartTable, getOverviewTableData, {"key":"username", "value":username});
        const DoughnutChartMin = FetchDataMin(DoughnutChart, getOverviewTableData, {"key":"username", "value":username});
        const LineChartMin = FetchDataMin(LineChart, getBalanceHistory, {username , time_period_days:linechart_time_days, chart:true });

        const TransactionTableMin = FetchDataMin(TransactionTable, getNewTransactionHistory, level == 0 ? {} : {username});


        

        return (
            <div >
            {
             (showOrientation && level!=0) && 
             (<div className="page-overlay">
            
                <WelcomeSlider
                show={showOrientation}
                onHide={this.hideWelcomePage} 
                history={this.props.history} close={this.hideWelcomePage}></WelcomeSlider>
            
            </div>)
        
        }


            <div className="navigation d-lg-none d-sm">
                    <ResponsiveSidebar  history={this.props.history} />
            </div>

            
            <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})}>
            { this.state.isFull &&
                <Container fluid={true} className="fullScreen">
                <Row ><Col lg={12} md={12} sm={12}><LineChartMin interval={linechart_time_days} /></Col></Row>                   
                    <Row style={{ alignItems: "center"}} >
                        <Col lg={6} md={12} sm={12} ><ChartTableMin/></Col>
                        <Col className="" lg={6} md={12} sm={12} ><DoughnutChartMin/></Col>
                    </Row>
                </Container>
                
                
            }
            </Fullscreen>
            
            
            <div className="dashboard-container">


                <div className="expandButton d-none d-lg-block">
                    <Button style={{border:"none"}} variant="outline-dark" className="fa fa-expand" onClick={this.goFull}></Button>
                </div>


                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>
                    
                <div className="navigation d-none d-lg-block sidebarDesktop" >
                    <LeftSidebar  history={this.props.history} />
                </div>

                <Container fluid={true} className="content-wrapper " id="content-div">
                    <Container class="row form-group">
                    
                    <Row >
                        <Col> 
                        
                        </Col>
                        
                    </Row>

                    <Row style={{ alignItems: "center"}} >
                        <Col lg={6} md={12} sm={12} ><ChartTableMin/></Col>
                        <Col className="" lg={6} md={12} sm={12} ><DoughnutChartMin/></Col>
                    </Row>
                    <Row style={{paddingTop: "5.416vw"}} ><Col lg={12} md={12} sm={12}><LineChartMin interval={linechart_time_days} /></Col></Row>
                    <Row ><Col lg={12} md={12} sm={12}><TransactionTableMin></TransactionTableMin></Col></Row>
                   
                   { level == 0 &&
                    <Row >
                        <Col lg={6} md={6} sm={6}><WithdrawModal  showAlert={this.showAlert} onSuccess={()=>{}}></WithdrawModal></Col>
                        <Col lg={6} md={6} sm={6}><DepositModal  showAlert={this.showAlert} onSuccess={()=>{}}></DepositModal></Col>
                        <Col lg={6} md={6} sm={6}><TransferModal  showAlert={this.showAlert} onSuccess={()=>{}}></TransferModal></Col>
                        <Col lg={6} md={6} sm={6}><GlobalUpdateModal  showAlert={this.showAlert} onSuccess={()=>{}}></GlobalUpdateModal></Col>
                    </Row>                  
                    }

                   { level != 0 &&
                   <Row >
                         <Col lg={12} md={12} sm={12}><TransferModal  showAlert={this.showAlert} onSuccess={()=>{}}></TransferModal></Col>

                   </Row>
                   }
                   
 
            
                    </Container>
                   
                    <Row><Col lg={12} md={12} sm={12} className="footer-container"><Footer history={this.props.history} /></Col></Row>

                </Container>
                
                
            </div>    

            
            </div>    
        );
    }
}

