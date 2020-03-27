import React, { Component } from 'react'
import { Container, Row, Col , Modal, InputGroup, FormControl, Button} from 'react-bootstrap';

// [1] Import API axios requestion from axios-service file
import { getUserInvestmentDetails, hashUserName, getReceiver, withdrawal_email} from '../../service/axios-service'

import {   
    ResponsiveSidebar,
    LeftSidebar,
    Footer,
    CustomSnackbar,
    PaymentsTable,
     } from './../../components';
import { minHeight } from '@material-ui/system';
import './Payments.scss'



export default class Payments extends Component {

   
    constructor(props){
        super(props);
        this.state = {
           
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',
            investmentDetails:[],
            showWithdrawal: false,
            showDeposit: false,
            showMessage: false,
            receiverEmail: "admin@qoinify.com",

            account_number: "",
            account_holder_name: "",
            bank:"",
            branch_number:"",
            withdraw_amount:""
        };

        this.showAlert = this.showAlert.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.fetchInvestmentDetails = this.fetchInvestmentDetails.bind(this);
        this.onDeposit = this.onDeposit.bind(this);
        this.onWithdrawal = this.onWithdrawal.bind(this);
        this.isCrypto = this.isCrypto.bind(this);
        
        this.fetchReceiver = this.fetchReceiver.bind(this);
    }

    componentDidMount(){
        this.fetchHashUserName()
        this.fetchReceiver()
    }

    componentWillMount(){

        this.fetchInvestmentDetails()

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

    // [2] : Make a function to call imported API from step 1
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

    fetchInvestmentDetails(){

        const username = localStorage.getItem("username")
        const investment_id = localStorage.getItem("investment_id")
        getUserInvestmentDetails({username, investment_id})
        .then((res)=>{

            
            this.setState({investmentDetails: res.data.investment_details});
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            // this.showAlert(err.response.data.code,'error');
        });
    }

    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }

    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }

    isCrypto(is_crypto){
        if (is_crypto == true) {
            alert('Send email ');
        }
        
        
    }

    

    onDeposit(username, investment_id, is_crypto, currency){
        console.log(is_crypto);
       
        
        if (is_crypto == true || currency == "USD") {
            this.setState({showMessage: true, showDeposit: false, showWithdrawal: false});
        }
        else{this.setState({showDeposit: true, showMessage:false, showWithdrawal: false})}
        
    }

    onWithdrawal(username, investment_id, is_crypto, currency){
        console.log(is_crypto);
        console.log(currency);
        
        if (is_crypto == true || currency == "USD") {
            this.setState({showMessage: true, showDeposit: false, showWithdrawal: false});
        }
        else{this.setState({showDeposit: false, showMessage:false, showWithdrawal: true})}
    }

   
    handleInputChange = (e) =>{
        this.setState({
          [e.target.name]: e.target.value
        })
        console.log(`${e.target.name}: ${e.target.value}`)
    
      }
    
    
    handleSubmit = (e) => {
        e.preventDefault();

        const {account_number, withdraw_amount, account_holder_name, branch_number, bank} = this.state
        let username = localStorage.getItem("username");

        //console.log(account_number, withdraw_amount, account_holder_name, branch_number, bank)
        withdrawal_email({account_number, withdraw_amount, account_holder_name, branch_number, bank, username})
        .then(
            (res) => {
                console.log(res)
                if (res.status == 200){
                    this.setState({
                        showWithdrawal: false,
                        isAlertVisible: true,
                        alertType: "success",
                        alertMessage: res.data.code})
                }
            }
        ).catch((err) => { 
            console.log(err)
            this.setState({
                isAlertVisible: true,
                alertType: "error",
                alertMessage: err.response.data.code}
            )
        })
        e.preventDefault();
      }



    render() {
        // Get hash of username from state
        const { isAlertVisible, alertType, alertMessage, investmentDetails, showDeposit, showMessage, showWithdrawal ,hashUserName, receiverEmail} = this.state;


        const username = localStorage.getItem("username")
        
        return (
            <div>

                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>
                
   
                <Container fluid={true} class="row form-group">
                <PaymentsTable data={investmentDetails} onDeposit={this.onDeposit} onWithdrawal={this.onWithdrawal} isCrypto={this.isCrypto}/>

                </Container>

                        
       
                <Modal show={showMessage} onHide={()=> this.setState({ showMessage: false})}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body  >
                        
                        <Container>

                            <Row> We're sorry, payments are not enabled for this currency </Row>
                            
                            
                        </Container>

                    </Modal.Body>
                </Modal>
                

                <Modal show={showDeposit} onHide={()=> this.setState({ showDeposit: false})}>
                    <Modal.Header closeButton>
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

                            <Row className="row1">Deposit may take up to 24 hours,&nbsp;<a href={"http://165.227.42.25/contact"}> contact us for any questions</a></Row>
                           
 
                            </Row>
                        </Container>
                        
                    </Modal.Body>
                </Modal>

                <Modal show={showWithdrawal} onHide={()=> this.setState({ showWithdrawal: false})}>
                    <Modal.Header closeButton>
                    <Modal.Title>Withdrawal</Modal.Title>
                    </Modal.Header>
                    <form  onSubmit={this.handleSubmit}>
                        <FormControl className="form-control Trans-form-control"
                                name="withdraw_amount"
                                onChange={this.handleInputChange} 
                                placeholder="Amount to withdraw:"
                                aria-label="Amount to withdraw:"
                                aria-describedby="basic-addon2"
                        
                        />
                        <br />
                        <div className="form-group" placeholder="Branch Number:">
                        <select className="form-control Trans-form-control" name="bank" required  onChange={this.handleInputChange}>
                            <option value="" defaultValue>Bank</option>
                            <option value="CIBC">CIBC</option>
                            <option value="RBC">RBC</option>
                            <option value="TD">TD</option>
                            <option value="BMO">BMO</option>
                            <option value="BNS">BNS</option>
                        </select>
                    </div>
                        <br />
                        <FormControl className="form-control Trans-form-control"
                                name="branch_number"
                                onChange={this.handleInputChange} 
                                placeholder="Branch Number:"
                                aria-label="Branch Number:"
                                aria-describedby="basic-addon2"
                        
                        />
                    
                        <br />
                        <FormControl className="form-control Trans-form-control"
                                name="account_number"
                                onChange={this.handleInputChange} 
                                placeholder="Account Number:"
                                aria-label="Account Number:"
                                aria-describedby="basic-addon2"
                        
                        />
                    
                        <br />
                        <FormControl className="form-control Trans-form-control"
                                name="account_holder_name"
                                onChange={this.handleInputChange} 
                                placeholder="Name of Account Holder:"
                                aria-label="Name of Account Holder:"
                                aria-describedby="basic-addon2"
                        
                        />
                        <br />
                        <input className="submit1" type="submit" value="Submit"  />
                        </form>       
                </Modal>               
            </div>
        )
    }
}


