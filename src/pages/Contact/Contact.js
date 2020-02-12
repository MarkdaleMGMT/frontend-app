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
            subject: '',
            isAlertVisible: false,
            alertType: '',
            alertMessage: '',
        }
        this.showAlert = this.showAlert.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onHandleInputChange = this.onHandleInputChange.bind(this)
        this.resetForm = this.resetForm.bind(this)
    }

    onHandleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showAlert(message, type) {
        this.setState({ alertMessage: message, alertType: type, isAlertVisible: true });
    }

    dismissAlert() {
        this.setState({ isAlertVisible: false });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.message)
        postContact(
            {
                "email": this.state.email,
                "name": this.state.name,
                "subject": this.state.subject,
                "message": this.state.message
            })
            .then((res) => {
                this.showAlert(res.data.code, 'success');
                this.resetForm()
            }
            )
            .catch((err) => {
                this.showAlert(err.response.data.code + ": " + err.response.data.message, 'error');

            })
    }

    resetForm() {
        this.setState({
            name: '',
            email: '',
            message: '',
            subject: ''
        })
    }

    showAlert(message, type) {
        this.setState({ alertMessage: message, alertType: type, isAlertVisible: true });
    }

    dismissAlert() {
        this.setState({ isAlertVisible: false });
    }

    render() {
        let { isAlertVisible, alertType, alertMessage } = this.state

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
                        <CustomSnackbar open={isAlertVisible} variant={alertType} message={alertMessage} onClose={this.dismissAlert}></CustomSnackbar>

                        <Row style={{ marginBottom: "auto" }} className="justify-content-center">
                            <Col lg={12} md={12} xs={12}>
                                <div>
                                    <Container>
                                        <div>
                                            <h2>Contact Us</h2>
                                        </div>
                                        <div className="contact">
                                            <Container>
                                                <form id="contact-form" onSubmit={this.handleSubmit}>
                                                    <div className="form-group">
                                                        <input name="name" type="text" className="form-control contact-form-control" placeholder="Name" value={this.state.name} onChange={this.onHandleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <input name="email" type="email" className="form-control contact-form-control" placeholder="Email" value={this.state.email} onChange={this.onHandleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <input name="subject" type="text" className="form-control contact-form-control" placeholder="Subject" value={this.state.subject} onChange={this.onHandleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea name="message" className="form-control contact-form-control" rows="5" placeholder="Message" value={this.state.message} onChange={this.onHandleInputChange} />
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
