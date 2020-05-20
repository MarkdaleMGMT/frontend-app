import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { serverIP } from '../../../src/config'
import {   
    ResponsiveSidebar,
    LeftSidebar,
    Footer,
    CustomSnackbar,
    InfoCard,
    TransferModal,
    TransactionTable,
    SimpleChart } from './../../components';
import { getAccountDetails, getTransactionHistory, getAccountBalanceHistory, getNewTransactionHistory} from '../../service/axios-service';
import { formatAmount } from '../../util/util'
import { formaterAmount } from '../../util/util'
import { INVESTMENT_USER } from '../../config/config'
import './Investment.scss'
import Fullscreen from "react-full-screen";


//TODO: 
//1. Connect it to the user investments store -- currency, investment name, 
//2. Create an API to get the user investment details -- account balance, exchange rate
//3. API to get the investment balance history
//4. Modify Transfer modal if investment id is passed, dont show the dropdown , otherwise do show the dropdown 

export default class Investment extends Component {

    constructor(props){
        super(props);
        this.state ={
            //for notification
            accountExist: true,
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',

            //to display investment related info
            investment_id:'',
            investment_name:'',
            currency:'',
            account_id:'',
            account_details : {  exchange_rate: {mid:0, ask:0, bid:0}},
            account_tx_history:[],
            account_balance_history:{ balance_history:[]},

            linechart_time_days: 1825,
            isFull: false,

        };

        this.dismissAlert = this.dismissAlert.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.updateAccountInfo = this.updateAccountInfo.bind(this);
        this.updateTransactionHistory = this.updateTransactionHistory.bind(this);
        this.updateAccountBalanceHistory = this.updateAccountBalanceHistory.bind(this);
        
    }

    componentDidMount(){

        //TODO: set a timer for update
        this.updateInfoTimer = setInterval(() => this.updateAccountInfo(), 60*1000);
        this.updateAccountInfo();
    }

    componentDidUpdate(prevProps, prevState){

        // this.setState({ accountExist: true})
        if(prevProps.match.params.investment_id != this.props.match.params.investment_id)
            
            this.updateAccountInfo();
    }

    componentWillUnmount() {
        clearInterval(this.updateInfoTimer);
      }

    updateAccountInfo(){
        
        console.log("update balance")
        //fetch the account details
        
        const { investment_id } = this.props.match.params

        const level =  localStorage.getItem("user_level");
        const username = level == 0? INVESTMENT_USER :localStorage.getItem("username");
        

        getAccountDetails({username, investment_id})
        .then((res)=>{
            
            this.setState({ accountExist:true, account_details: res.data.account},

                ()=>{
                    this.updateTransactionHistory(res.data.account.account_id);
                    this.updateAccountBalanceHistory(this.state.linechart_time_days);
                }
                );
           
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            console.log(err)
            const { message , code} = err.response.data
            if(message == "Account does not exist")
            {
                this.setState({ accountExist: false })

            }else{

                this.showAlert(code,'error');
            }

        });



    }

    updateTransactionHistory(account_id){
        
        const level =  localStorage.getItem("user_level");
        let requestData = level == 0 ? { investment_id : this.props.match.params.investment_id} : { account_id}
        getNewTransactionHistory(requestData)
        .then((res)=>{
            
            this.setState({account_tx_history: res.data});
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            console.log(err)
            this.showAlert(err.response.data.code,'error');
        });

    }

    updateAccountBalanceHistory(time_period_days){

        
        if(time_period_days)
            this.setState({linechart_time_days: time_period_days},
            ()=>{   
                const { linechart_time_days } = this.state;
                const { account_id } = this.state.account_details;
                getAccountBalanceHistory({account_id, time_period_days:parseInt(linechart_time_days), chart:true})
                .then((res)=>{
                
                    this.setState({account_balance_history: res.data});
                })
                .catch((err)=>{
                    //triggers a state change which will refresh all components
                    console.log(err)
                    this.showAlert(err.response.data.code,'error');
                });
                
            });
    }


    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }


    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }

    goFull = () => {
        this.setState({ isFull: true });
      }

    render() {

        console.log(this.props.location)
        
        const username = localStorage.getItem("username")
        const { investment_id } = this.props.match.params
        const { investment_name, currency, index } = this.props.location.state;
        const { accountExist, isAlertVisible, alertType, alertMessage, account_details, account_tx_history, account_balance_history, linechart_time_days } = this.state;

        if(!accountExist){
          
            return <div style={{height:"inherit"}}>
                <div className="navigation d-lg-none d-sm">
                        <ResponsiveSidebar  history={this.props.history} />
                </div>
                <div className="main-container ">
                    
                    <Container  className="content-wrapper" id="content-div" style={{paddingTop:"70px"}}>
                        
                        <Row style={{marginBottom: "auto"}} className="justify-content-center">
                        <Col  lg={12} md={12} xs={12}>
                            <div>
                                You do not have a {investment_name} account. To create one please,<a href={serverIP+"/contact"}> contact us.</a>
                            </div>
                        </Col>                    
                        </Row>
               
                    </Container>
                    
                    
                </div>
                </div>
        }

        const exchange_rate_label = currency == 'USD'? 'CAD / '+currency : currency+" / CAD";
        const exchange_rate = currency == 'USD'?  parseFloat(1/account_details.exchange_rate.ask): account_details.exchange_rate.bid ;
        console.log("investment_id ",investment_id)

        let k = 0
        for (k ; k< account_balance_history.balance_history.length; k++){
            let record = account_balance_history.balance_history[k]
            //console.log(`${record["transaction_type"]} ${record["amount"]} ${record["account_balance"]}`)
            console.log(` ${JSON.stringify(record)}`)

        }
        return (
            <div>

            <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})}>
            { this.state.isFull &&
                <Container fluid={true} className="fullScreen">
              
                    <Row style={{justifyContent:"space-between", height: "fit-content"}}>
                        <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}} ><InfoCard label={investment_name+" Balance"} value={formatAmount(account_details.account_balance)}></InfoCard></Col>
                        <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}}><InfoCard label={exchange_rate_label} value={formatAmount(exchange_rate,true)}></InfoCard></Col>
                        <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}}><InfoCard label="CAD VALUE" value={"$"+formatAmount(account_details.account_balance_cad, true)}></InfoCard></Col>
                    </Row>

                    <Row>
                        <Col lg={12} md={12} sm={12} style={{ paddingBottom: "5.416vh", paddingTop: "5.416vh", minHeight:"85vh"}}>

                        <SimpleChart 
                            chartType="line" 
                            dataType="balance" 
                            data={account_balance_history} 
                            index={index}  
                            investmentName={investment_name} 
                            chartTitle={investment_name} 
                            refreshData={this.updateAccountBalanceHistory} 
                            interval={linechart_time_days}
                            show24Hours={false}
                            >
                        </SimpleChart>
                        </Col>
                    </Row>

                </Container>
                
                
            }
            </Fullscreen>


                <div className="expandButton d-none d-lg-block">
                    <Button style={{border:"none"}} variant="outline-dark" className="fa fa-expand" onClick={this.goFull}></Button>
                </div>

                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>

                    <Container>
                    
                    <div className="page-content">

                    <Row style={{justifyContent:"space-between", height: "fit-content"}}>
                    <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}} ><InfoCard label={investment_name+" Balance"} value={formatAmount(account_details.account_balance)}></InfoCard></Col>
                    <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}}><InfoCard label={exchange_rate_label} value={formaterAmount(exchange_rate,true)}></InfoCard></Col>
                    <Col lg={4} md={4} xs={12} className="auto-height" style={{paddingTop: "10px"}}><InfoCard label="CAD VALUE" value={"$"+formatAmount(account_details.account_balance_cad, true)}></InfoCard></Col>
                    </Row>

                    <Row>
                        <SimpleChart chartType="line" dataType="balance" data={account_balance_history} index={index}  investmentName={investment_name} chartTitle={investment_name} refreshData={this.updateAccountBalanceHistory} interval={linechart_time_days}></SimpleChart>
                    </Row>

                    <Row>
                        <TransactionTable data={account_tx_history} mask={false}></TransactionTable>
                    </Row>

                    <Row>
                        <TransferModal showAlert={this.showAlert} investment_id={investment_id} onSuccess={this.updateAccountInfo}></TransferModal>
                    </Row>
                    </div>
                    
                    </Container>                   
            
            </div>
        )
    }
}
