    import React, { Component } from 'react'
    import { Carousel, Col, Row, Modal, Button, Card } from 'react-bootstrap';
    import './WelcomeSlider.scss'
    import "bootstrap/dist/css/bootstrap.css";
    import {  updateUserInfo  } from '../../service/axios-service'
    import { AnnotationLabel, SubjectCircle, ConnectorElbow, ConnectorEndDot, Note } from 'react-annotation';

    const annotationConfigurations = [
        { x: 159, y:10, title:"Portfolio Overview", details:"Provides an overview off all your investments"},
        { x: 159, y:55, title:"Invite Friends", details:"Earn gains by becoming an affiliate"},
        { x: 159, y:100, title:"Deposit/ Withdraw Investments", details:"Add value/ diversify your portfolio"},
        { x: 159, y:190, title:"Trade between investments", details:"Buy/sell currencies at competitive rates"},
        { x: 159, y:490, title:"Investment Overview", details:"Provides details on particular investment"}

    ]

    export default class WelcomeSlider extends Component {

        

        constructor(props){
            super(props)
            this.onClose = this.onClose.bind(this)
            this.navigateToPayments = this.navigateToPayments.bind(this)
            this.state = {
                activeIndex:0
            }

            this.updateIndex = this.updateIndex.bind(this);
            this.renderAnnotation = this.renderAnnotation.bind(this)
        }

        componentDidMount(){
            // this.updateIndexTimer = setInterval(() => this.updateIndex(), 5*1000);
        }

        componentWillUnmount(){
            // clearInterval(this.updateIndexTimer);
        }



        updateIndex(){
            this.setState({activeIndex: (this.state.activeIndex + 1)%annotationConfigurations.length});
        }

        navigateToPayments(){

            const new_user = parseInt(localStorage.getItem("new_user"));
            const username = localStorage.getItem("username");
            console.log("new_user ", new_user)

            if(new_user){
                updateUserInfo({ username, new_user:0})
                .then((res)=>{
                    localStorage.setItem("new_user",0);
                    this.props.history.push("/payments");
                })
                .catch((err)=>{
                    //triggers a state change which will refresh all components
                    // this.showAlert(err.response.data.code,'error');
                });
            }

        }

        renderAnnotation(idx){

            console.log("annotationConfigurations", annotationConfigurations)
            console.log("ann idx", idx)
            const { x, y, title, details } = annotationConfigurations[idx? idx:0];
            return  (
                <AnnotationLabel
                    x={x}
                    y={y}
                    dy={80}
                    dx={100}
                    color={"#f8006e"}
                    className="show-bg"
                    editMode={false}
                    note={{"title":title,
                    "label":details,
                    "align":"middle",
                    "orientation":"topBottom",
                    "bgPadding":20,
                    "padding":15,
                    "titleColor":"#f8006e",
                    "lineType":"vertical"}}
                    connector={{"type":"elbow","end":"dot"}} 
                    subject={{"width":-50,"height":100}}/>



        );
        }

        onClose(){
            this.props.close();
            const new_user = parseInt(localStorage.getItem("new_user"));
            const username = localStorage.getItem("username");
            console.log("new_user ", new_user)

            if(new_user){
                updateUserInfo({ username, new_user:0})
                .then((res)=>{
                    localStorage.setItem("new_user",0);
                    
                })
                .catch((err)=>{
                    //triggers a state change which will refresh all components
                    // this.showAlert(err.response.data.code,'error');
                });
            }
        }
        render() {

            const props = this.props;
            const {activeIndex} = this.state;
            console.log("activeIndex",  activeIndex)
            const annotations = this.renderAnnotation();
            return ( 
                
            <div className="welcome-container">
                <svg height="100%" width="100%">
                    {this.renderAnnotation(activeIndex)}
                </svg>

                <Card style={{ width: '18rem', position:"absolute",top:0, right:0 }}>
                    <Card.Body>
                        <Card.Title>Welcome to Qoinify!</Card.Title>
                        <Card.Text>
                            Annotations on the left will walk you through the features available on our platform
                        </Card.Text>
                        <Card.Link href="#" onClick={this.updateIndex} style={{color:"#f8006e"}}>Next</Card.Link>
                        <Card.Link href="#" onClick={this.onClose} style={{color:"#f8006e"}}>Close Tutorial</Card.Link>
                        
                    </Card.Body>
                </Card>
            
            {/* <Modal
                {...props}
                size="md"
                dialogClassName="align-right"
                backdrop={false} */}
                
                >

                {/* <Modal.Body className="navy"> */}
              
                    {/* <Carousel slide={false} activeIndex={ activeIndex } onSelect={this.updateIndex} >

                        <Carousel.Item  className="navy" >

                            <div
                                className="welcome-slider-item "
                                alt="First slide"
                            ></div>

                            <Carousel.Caption bsPrefix="custom-carousel-caption">
                            <h3>Welcome to Qoinify!</h3>
                            <p>One-stop shop to manage your build your blockchain investment portfolio </p>
                            <div className="dismiss-prompt" onClick={this.onClose}>Skip Intro</div>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div
                            className="welcome-slider-item navy"
                            alt="Second slide"
                            >
                            </div>
                            <Carousel.Caption bsPrefix="custom-carousel-caption">
                            <h3>Deposit</h3>
                            <p>Start off by making a deposit by navigating to the Payments Page</p>
                            <div className="dismiss-prompt" onClick={this.onClose} >Skip Intro</div>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div
                            className="welcome-slider-item navy"
                            alt="Second slide"
                            >
                            </div>
                            <Carousel.Caption bsPrefix="custom-carousel-caption">
                            <h3>Trade Investments</h3>
                            <p>You can also trade between different investments from the Exchange Page</p>
                            <div className="dismiss-prompt" onClick={this.onClose} >Skip Intro</div>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div
                            className="welcome-slider-item navy"
                            alt="Second slide"
                            >
                            </div>
                            <Carousel.Caption bsPrefix="custom-carousel-caption">
                            <h3>Analytics</h3>
                            <p>To get insight on the performance of your portfolio, navigate to the Dashboard or the individual Investments</p>
                            <div className="dismiss-prompt" onClick={this.onClose}>Skip Intro</div>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                        <div
                            className="welcome-slider-item navy"
                            alt="Third slide"
                            >

                            </div>
                            <Carousel.Caption bsPrefix="custom-carousel-caption">
                            <p>Get started on building your portfolio now</p>
                            <Row className="justify-content-center">
                                <Col xs={9} md={9} lg={6}>
                                    <a name="deposit" className="btn btn-info deposit-btn"  onClick={this.navigateToPayments}>Make a Deposit!</a>
                                </Col>
                            </Row>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel> */}
                  
                {/* </Modal.Body> */}


                {/* </Modal> */}
                </div>

          
                

            )
        }
    }


    
           