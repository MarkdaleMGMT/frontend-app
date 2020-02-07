import React, { Component } from 'react'
import {
    LeftSidebar,
    Footer,
    CustomSnackbar,
    InfoCard,
    ResponsiveSidebar
} from './../../components';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Contact.scss'
// import Axios from 'axios';
// import { FRONTEND_API } from "../../config/config";
import { postContact } from '../../service/axios-service'



export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: '',
            isAlertVisible : false,
            alertType:'',
            alertMessage:'',
        }
        this.showAlert = this.showAlert.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    onHandleChange(event) {
        this.setState({
            name: event.target.value.name,
            email: event.target.value.email,
            message: event.target.value.message
        })
      //  console.log(event.target.value);
      //  console.log("on handle change")
    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log(event.target);
        console.log("MEMES")
        postContact({name: this.state.name, email: this.state.email, body: this.state.message})
        .then( (res)=> {console.log(res); console.log("MEMES")})
        .catch((err) => {console.log(err.response.data.code+": "+err.response.data.message)})
        // Axios({
        //     method: "POST",
        //     url: FRONTEND_API + "/contact",
        //     data: this.state
        // }).then((response) => {
        //     if (response.data.status === "success") {
        //         alert("email sent!!!");
        //         this.resetForm();
        //     } else if (response.data.status === "fail") {
        //         alert("email not sent");
        //     }
        // })
    }

    resetForm() {
        this.setState({
            name: '',
            email: '',
            message: ''
        })
    }

    showAlert(message, type){
        this.setState({ alertMessage:message, alertType:type, isAlertVisible:true });
    }

    dismissAlert(){
        this.setState({ isAlertVisible: false });
    }

    render() {
        let {isAlertVisible, alertType, alertMessage} = this.state

        return (
            <div style={{ height: "inherit" }}>
                <div className="navigation d-lg-none d-sm">
                    <ResponsiveSidebar history={this.props.history} />
                </div>
                <div className="main-container ">
                    <div className="navigation d-none d-lg-block">
                        <LeftSidebar history={this.props.history} />
                    </div>
                    <Container className="content-wrapper" id="content-div" style={{ paddingTop: "70px" }}>
                    {/* <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar> */}

                        <Row style={{ marginBottom: "auto" }} className="justify-content-center">
                            <Col lg={12} md={12} xs={12}>
                                <div>
                                    <Container>
                                        <div>
                                            <h2>Contact Us</h2>
                                        </div>
                                        <div className="contact">
                                            <Container>
                                                <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control contact-form-control" placeholder="Name" value={this.state.name} onChange={this.onHandleChange.bind(this)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="email" className="form-control contact-form-control" placeholder="Email" value={this.state.email} onChange={this.onHandleChange.bind(this)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea className="form-control contact-form-control" rows="5" placeholder="Message" value={this.state.message} onChange={this.onHandleChange.bind(this)} />
                                                    </div>
                                                    <button type="submit" className="btn btn-info" className="submitBtn">Submit</button>
                                                </form>
                                            </Container>
                                        </div>
                                    </Container>
                                </div>
                            </Col>
                        </Row>

                        <Row><Col lg={12} md={12} sm={12} className="footer-container"><Footer history={this.props.history} /></Col></Row>

                    </Container>


                </div>
            </div>

        )
    }
}
