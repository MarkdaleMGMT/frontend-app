import React, { Component } from 'react'
import { Container, Row, Col, Button, Modal, InputGroup, FormControl,} from 'react-bootstrap';
import { serverIP } from '../../../src/config'
import { getUserInvestmentDetails, hashUserName, getReceiver, withdrawal_email} from '../../service/axios-service'
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
            showDeposit: false,
            showMessage: false,
            receiverEmail: "admin@qoinify.com",

            //to display investment related info
            investment_id:'',
            investment_name:'',
            currency:'',
            account_id:'',
            account_details : {  exchange_rate: {mid:0, ask:0, bid:0}},
            account_tx_history:[],
            account_balance_history:{ balance_history:[]},

            linechart_time_days: 180,
            isFull: false,
            show: false

        };

        this.dismissAlert = this.dismissAlert.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.updateAccountInfo = this.updateAccountInfo.bind(this);
        this.updateTransactionHistory = this.updateTransactionHistory.bind(this);
        this.updateAccountBalanceHistory = this.updateAccountBalanceHistory.bind(this);
        this.onDeposit = this.onDeposit.bind(this);
        this.fetchReceiver = this.fetchReceiver.bind(this);
        
    }
   
      showModal = e => {
        this.setState({
          show: true
        });
      };

    componentDidMount(){

        //TODO: set a timer for update
        this.updateInfoTimer = setInterval(() => this.updateAccountInfo(), 60*1000);
        this.updateAccountInfo();
        this.fetchHashUserName()
        this.fetchReceiver()
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
            // console.log(err)
            const { message , code} = err.response.data
            if(message == "Account does not exist")
            {
                this.setState({ accountExist: false })

            }else{

                this.showAlert(code,'error');
            }

        });



    }

    fetchReceiver(){
        getReceiver()
        .then((res)=>{
            console.log(res)
            this.setState({receiverEmail: res.data.email});

        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
        });
    }

    fetchHashUserName(){
        const username = localStorage.getItem("username")
        hashUserName({username})
        .then((res)=>{

            // [3] : From the res data, assign hash to local state value
            console.log(res)
            this.setState({hashUserName: res.data.hash});

        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
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

    onDeposit(username, investment_id, is_crypto, currency){
        console.log(is_crypto);
       
        
        if (is_crypto == true || currency == "USD") {
            this.setState({showMessage: true, showDeposit: false, showWithdrawal: false});
        }
        else{this.setState({showDeposit: true, showMessage:false, showWithdrawal: false})}
        
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
        const { accountExist,showDeposit,receiverEmail,onDeposit,showMessage, isAlertVisible, alertType, alertMessage, account_details, account_tx_history, hashUserName,account_balance_history, linechart_time_days } = this.state;
        const columns = [
            { 
                Header:'Balance',
                accessor: (data)=> formatAmount(+data.balance),
                id:'balance'
            },
            
            { 

                Header:'Deposit/ Withdraw',
                Cell: row => (
                    <div>
                        <button className="btn btn" onClick={() => onDeposit(row.investment_id, username, row.original.isCrypto, row.original.currency)}>Deposit</button>
                      
                    </div>
                )

            }            
        ]
        
        
        if(!accountExist){
          
            return <div style={{height:"inherit"}}>
                <div className="navigation d-lg-none d-sm">
                        <ResponsiveSidebar  history={this.props.history} />
                </div>
                <div className="main-container ">
                    
                    <Container  className="content-wrapper" id="content-div" style={{paddingTop:"70px"}}>
                        
                        <Row style={{marginBottom: "auto"}} className="justify-content-center">
                        <Col  lg={12} md={12} xs={12}>
                            <div style={{textAlign: 'left'}}>
                            You do not have a {investment_name} balance. To create one, you must  <button className="invest-button" onClick={e => {
                                this.showModal();
                            }}
                            > Make a Deposit </button> by navigating to the <a href={serverIP+"/payments"}> Payments page </a> where you will see a list of currencies with "deposit" and "withdraw" buttons. Choose the Canadian dollars <button className="invest-button" onClick={e => {
                                this.showModal();
                            }}
                            > Deposit </button> button, and then follow the instructions on the screen to send an etransfer. 
                            <br/>
                            <br/>

Once you have Canadian dollars in your {serverIP} account, use the  <a href={serverIP+"/exchange"}> Exchange Page</a> to trade your Canadian dollars for any other investment such as bitcoins.

<br/><br/>
Please  <a href={serverIP+"/contact"}>Contact Us</a> if you have further questions.

<br/><br/><a href="https://riskingtime.com/qoinify-how-to/">Click  here for more step by step instructions about how to use {serverIP}. </a> 
   
<p columns={columns} onDeposit={this.onDeposit}/> 




<Modal show={this.state.show} onHide={()=> this.setState({ showModal: false})}>
<Modal.Header closeButton onClick={()=> this.setState({ show: false})}>

<Modal.Title>Deposit</Modal.Title>
</Modal.Header>

<Modal.Body>
    
    <Container>

        <Row> Send an INTERAC transfer </Row>
        
        <Row> Send to this email: </Row>
        <Row>

        <InputGroup className="mb-3" size="sm">

            <FormControl
            disabled={true}
            value= {receiverEmail}
            placeholder="Recipient's Email"
            aria-label="Recipient's Email"
            aria-describedby="basic-addon2"
            
            />
            <InputGroup.Append>
                <Button variant="outline-secondary"><i className="fa fa-copy"></i></Button>
            </InputGroup.Append>

        </InputGroup>
               <Row className="row1"> Use your username as the security question: </Row>
        <InputGroup className="mb-3" size="sm">
            <FormControl
            disabled={true}
            value={username}
            placeholder="Security Question"
            aria-label="Security Question"
            aria-describedby="basic-addon2"
            
            />
            <InputGroup.Append>
                <Button variant="outline-secondary"><i className="fa fa-copy"></i></Button>
            </InputGroup.Append>

        </InputGroup>

        <Row className="row1"> Use this code as the password: </Row>


        <InputGroup className="mb-3" size="sm">
            <FormControl
            disabled={true}
            //[5] : Set value as hash of user name
            value={hashUserName}
            placeholder="Recipient's username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            
            />
            <InputGroup.Append>
                <Button variant="outline-secondary"><i className="fa fa-copy"></i></Button>
            </InputGroup.Append>

        </InputGroup>

        <Row className="row1">Deposit may take up to 24 hours,&nbsp;<a href={serverIP+"/contact"}> contact us for any questions</a></Row>
       

        </Row>
    </Container>
    
</Modal.Body>
</Modal>
                                                            
                        
                            </div>
                        </Col>                    
                        </Row>
                        <table
                        onDeposit={this.onDeposit}
                        />
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
