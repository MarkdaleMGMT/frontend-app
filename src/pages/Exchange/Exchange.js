import React, { Component } from 'react'
import { Container, Row, Col, Button} from 'react-bootstrap';
import Fullscreen from "react-full-screen";
import {   
    ResponsiveSidebar,
    LeftSidebar,
    Footer,
    CustomSnackbar,
    ExchangeTable,
    ExchangeForm,
    SimpleChart } from './../../components';

import { getExchangeRates, getRatesInCAD, getRatesHistory, getNewRatesHistory } from '../../service/axios-service'
import './Exchange.scss'
import { stat } from 'fs';



//TODO:
//1, Set a timer to update the exchange rates ---done 
//2. Pass exchange rates as props to components ---done
//3. Add a snackbar  

export default class Exchange extends Component {

    constructor(props){
        super(props);
        this.state = {
            exchange_rates:[],
            rates_in_cad:[],
            rates_history:[],
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',
            time_period_chart:30,
            isFull: false,

        };

        this.fetchFxQuotedRates = this.fetchFxQuotedRates.bind(this);
        this.fetchRatesInCAD = this.fetchRatesInCAD.bind(this);
        this.updateRateHistory = this.updateRateHistory.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    componentDidMount(){
        //this.updateInfoTimer = setInterval(() => this.updateInfo(), 60*1000);
        this.updateInfo();
        //this.setState({rates_history: getNewRatesHistory})
    }

    componentWillUnmount(){

        clearInterval(this.updateInfoTimer);
    }

    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }

    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }

    updateInfo(){
        this.fetchFxQuotedRates();
        this.fetchRatesInCAD();
        this.updateRateHistory();
    }

    updateRateHistory(newInterval){
        console.log(newInterval)
        let time_period_days = this.state.time_period_chart;

        if(newInterval){
            this.setState({ time_period_chart:parseInt(newInterval) });
            time_period_days = parseInt(newInterval);
        }

        getNewRatesHistory({ time_period_days: time_period_days })
        .then((res)=>{
            console.log("rates_history ", res.data.rates_history );
            this.setState({rates_history: res.data.rates_history});
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
        });

    }


    fetchRatesInCAD(){
        getRatesInCAD()
        .then((res)=>{
            console.log(res.data.rates);
            this.setState({rates_in_cad: res.data.rates});
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
        });
    }


    fetchFxQuotedRates(){

        getExchangeRates()
        .then((res)=>{
            this.setState({exchange_rates: res.data.rates});
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
        });
    }

    goFull = () => {
        this.setState({ isFull: true });
      }


    render() {

        const { exchange_rates, rates_in_cad, rates_history, isAlertVisible, alertType, alertMessage, time_period_chart } = this.state;

        return (
            <div>

            <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})}>
                    { this.state.isFull &&
                        <Container fluid={true} className="fullScreen">
                         <Row>
                            <Col lg={12} md={12} sm={12}>
                                <ExchangeTable data={rates_in_cad}></ExchangeTable>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12}>
                                <SimpleChart chartTitle={"Currency"} data={rates_history} dataType="rates" chartType="line"  refreshData={this.updateRateHistory} interval={time_period_chart}></SimpleChart>
                            </Col>
                        </Row>
                        </Container>
                    }
                    </Fullscreen>

            <div className="navigation d-lg-none d-sm">
                    <ResponsiveSidebar  history={this.props.history} />
            </div>

            <div className="dashboard-container">
                <div className="expandButton d-none d-lg-block">
                    <Button style={{border:"none"}} variant="outline-dark" className="fa fa-expand" onClick={this.goFull}></Button>
                </div>

                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>
                <div className="navigation d-none d-lg-block">
                    <LeftSidebar history={this.props.history} />
                </div>
                <Container fluid={true}  className="content-wrapper" id="content-div">
                    <Container>
                    <div className="page-content">
                        <Row >
                            <ExchangeForm exchange_rates={exchange_rates} showAlert={this.showAlert} ></ExchangeForm>
                        </Row>

                        <Row>
                            <ExchangeTable data={rates_in_cad}></ExchangeTable>
                        </Row>
                        <Row style={{paddingBottom:"30px"}}>
                            <SimpleChart chartTitle={"Currency"} data={rates_history} dataType="rates" chartType="line"  refreshData={this.updateRateHistory} interval={time_period_chart}></SimpleChart>
                        </Row>
                           

                        
                    </div>

                    </Container>
            
                    <Row><Col lg={12} md={12} sm={12} className="footer-container"><Footer history={this.props.history} /></Col></Row>

                </Container>
                
                
            </div>
            </div>
        )
    }
}
