import React, { Component } from 'react'
import { Container, Row, Col , Modal, InputGroup, FormControl, Button} from 'react-bootstrap';
import { getUserInvestmentDetails } from '../../service/axios-service'


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
            showDeposit: false
        };

        this.showAlert = this.showAlert.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.fetchInvestmentDetails = this.fetchInvestmentDetails.bind(this);
        this.onDeposit = this.onDeposit.bind(this);
        this.onWithdrawal = this.onWithdrawal.bind(this);
    }

    componentWillMount(){

        this.fetchInvestmentDetails()

    }

    fetchInvestmentDetails(){

        const username = localStorage.getItem("username")
        getUserInvestmentDetails({username})
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

    onDeposit(username, investment_id, is_crypto){

        this.setState({showDeposit: true, showWithdrawal: false})
    }

    onWithdrawal(account_id){

        this.setState({showDeposit: false, showWithdrawal: true})

    }
    



    render() {

        const { isAlertVisible, alertType, alertMessage, investmentDetails, showDeposit, showWithdrawal } = this.state;
        const username = localStorage.getItem("username")
        
        return (
            <div>

            <div className="navigation d-lg-none d-sm">
                    <ResponsiveSidebar  history={this.props.history} />
            </div>

            <div className="main-container">
                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>
                <div className="navigation d-none d-lg-block">
                    <LeftSidebar history={this.props.history} />
                </div>
                <Container fluid={true}  className="content-wrapper" id="content-div" >
                    <Container>
                    <div className="page-content" style={{minHeight:"100%"}}>

                           <PaymentsTable
                                data={investmentDetails}
                                onDeposit={this.onDeposit}
                                onWithdraw={this.onWithdrawal}
                           />

                        
                    </div>

                    </Container>
                <div>
                    <Row><Col lg={12} md={12} sm={12} className="footer-container"><Footer history={this.props.history} /></Col></Row>
                </div>
                </Container>
                

                <Modal show={showDeposit} onHide={()=> this.setState({ showDeposit: false})}>
                    <Modal.Header closeButton>
                    <Modal.Title>Deposit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Container>

                            <Row> Send an INTERAC transfer </Row>
                            <Row>

                            <InputGroup className="mb-3" size="sm">
                                <FormControl
                                disabled={true}
                                value="deposits@qoinify.com"
                                placeholder="Recipient's Email"
                                aria-label="Recipient's Email"
                                aria-describedby="basic-addon2"
                                
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary"><i className="fa fa-copy"></i></Button>
                                </InputGroup.Append>

                            </InputGroup>

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

                            <InputGroup className="mb-3" size="sm">
                                <FormControl
                                disabled={true}
                                value="ayesha"
                                placeholder="Recipient's username"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary"><i className="fa fa-copy"></i></Button>
                                </InputGroup.Append>

                            </InputGroup>

                            
                           
 
                            </Row>
                        </Container>
                        
                       

                        

                    </Modal.Body>
                </Modal>

                <Modal show={showWithdrawal} onHide={()=> this.setState({ showWithdrawal: false})}>
                    <Modal.Header closeButton>
                    <Modal.Title>Withdrawal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                </Modal>
                
            </div>
            </div>
        )
    }
}


