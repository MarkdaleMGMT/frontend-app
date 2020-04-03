import React, { Component } from 'react'
import { Container, Row, Col , InputGroup, FormControl, Button} from 'react-bootstrap';
import { InputWithCopy } from '../../components'
import { inviteUser } from '../../service/axios-service'
import { serverIP } from '../../../src/config'

import {   
    LeftSidebar,
    Footer,
    CustomSnackbar,
    InfoCard,
    ResponsiveSidebar } from './../../components';
import './Affiliates.scss'

class Affiliates extends Component {

    // static propTypes={
    //     ref_code: PropTypes.string.isRequired
       
    // };

    constructor(props){
        super(props);
        this.state ={
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',
            email:''
        };

        this.dismissAlert = this.dismissAlert.bind(this);
        this.sendAffiliateInvite = this.sendAffiliateInvite.bind(this);
    }

    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }


    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }


    handleInputChange = (e) =>{
        console.log([e.target.name], e.target.value);
        this.setState({
          [e.target.name]: e.target.value
        });

        
    }

    sendAffiliateInvite(e){
        e.preventDefault();

        const username = localStorage.getItem("username");
        const { email } = this.state;

        inviteUser({username, email})
        .then((res)=>{
            //triggers a state change which will refresh all components
            this.showAlert(res.data.code,'success');
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            this.showAlert(err.response.data.code,'error');
        });


    }



    render() {
        // console.log("props ",);
        
        const { isAlertVisible, alertType, alertMessage, email } = this.state;
        const ref_code = localStorage.getItem("ref_code");

        return (

            <div>
                <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>

                <Container fluid={true} class="row form-group">                    
                    <Row  className="justify-content-center">
                    <Col  lg={12} md={12} xs={12}>
                        <Row style={{marginTop: "10vw"}} className="justify-content-center">
                            <Col  lg={4} md={4} xs={10}><InfoCard label="Referral Code" value={ref_code}></InfoCard></Col>
                        </Row>

                        <Row  className="justify-content-center" style={{marginTop:"5vw"}}>
                            <Col xs={10} md={6} lg={6}>

                                <InputWithCopy label="Referral Link" isDisabled={false} text={serverIP+"/signup?ref_code="+ref_code} onCopy={()=>this.showAlert("Copied to Clipboard!", "success")}></InputWithCopy>
                            </Col>
                        </Row>
                        <form className="invite-form" onSubmit={this.sendAffiliateInvite}>
                            <Row className="justify-content-center"><Col xs={10} md={6} lg={6}>
                            <div className="form-group">
                                <input type="email" className="form-control invite-form-control" id="email" name="email" placeholder="Email" value={email} required  onChange={this.handleInputChange}></input>
                            </div>
                            </Col></Row>
                            
                            <Row className="justify-content-center"><Col xs={10} md={3} lg={3}>
                                <button type="submit" name="invite" className="btn btn-info invite-btn" >Invite</button>
                            </Col></Row>
                        </form>
                    </Col>                    
                    </Row>
            
                </Container>
                
            </div>
        )
    }
}

// const mapStateToProps = state => ({
    
//     ref_code: state.user.ref_code
    
// });

// export default connect(mapStateToProps, null)(Affiliates);
export default Affiliates;
