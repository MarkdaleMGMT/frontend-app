import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Redirect } from "react-router-dom";

import './SignIn.scss';
import { login, reset } from '../../actions/userActions';

import { Container, Row, Col } from 'react-bootstrap';
import queryString from 'query-string'


class SignIn extends Component {


  constructor(props){
    super(props);



    this.state = {
      authenticated: false,
      username: '',
      password: '',
      className: 'needs-validation',  // When validation fails, add a boostrap class to display prompts.
      message: { show: false, msg: '', type:''}, // Held the failure state & messag returned from server.

    }

    //when redirected to sign in reset all the auth params
    this.props.reset();

  }



  componentDidMount(){


    const values = queryString.parse(this.props.location.search)
    console.log(values.confirm)
    if (values.confirm){
       this.setState({  message: { show: true , msg: 'Email verified' , type:'success'} })
    }
    //confirmation message from sign up
    else if (this.props.location.state && this.props.location.state.confirmation_msg){

      // console.log("got the confirmation message");

      let { confirmation_msg } = this.props.location.state;
      this.setState({
        message: { show: confirmation_msg.show , msg: confirmation_msg.msg , type:'success'}
      });

      //clearing the state once sign up notif is shown
      this.props.history.replace();

    }
    

    //check if user is authenticated
    this.setState({
      authenticated: localStorage.getItem('username')!==null && localStorage.getItem('username')!=''
      //, message: { show: this.props.user.error!='', msg:this.props.user.error, type:'error'}
    });




  }

  componentWillReceiveProps(nextProps){

    //check if user is authenticated
    this.setState({
      authenticated: localStorage.getItem('username')!==null && localStorage.getItem('username')!=''
      // , message: { show: this.props.user.error!='', msg:this.props.user.error, type:'error'}
    });

    if(nextProps != this.props){

      console.log("nextProps ", nextProps);
      console.log("this.props ", this.props);
      if(nextProps.user.error!=''){
        console.log("changing")
        this.setState({message: { show: true, msg: nextProps.user.error, type:'error'}})
      }
        
        
    }


  }

  handleInputChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e)=>{

    //reset the error message
    

    if(!e.target.checkValidity()){  // Add a Bootstrap class to show prompts if checkValidity is false.
      this.setState({ className: 'needs-validation was-validated'});
    }else{
      const { username, password } = this.state;
      this.props.login(username, password);
     
      // axios.post(FRONTEND_API+'login', { username, password })
      // .then((res1)=>{
      //   if(res1.data.code === "Login successful")
      //   return axios.get(FRONTEND_API+`user_data/${username}`);
      // })
      // .then((res2)=>{
      //   if(res2.data.code === "success")
      //   {
      //
      //     this.setState({
      //       isAuthenticated: true,
      //       ref_code: res2.data.ref_code});
      //      localStorage.setItem('username', username);
      //   }
      //
      //
      //
      // })
      // .catch((err)=>{
      //   let msg = "";
      //   if(err.response.data.code)
      //     msg = `${err.response.data.code}: ${err.response.data.error}.`;
      //   else msg = `${err.response.data.msg}: ${err.response.data.err}.`;
      //     this.setState({
      //       message: {show: true, msg, type:'error'},
      //       className: 'needs-validation'
      //     })
      // });
    }
    e.preventDefault();
  }


  render(){
    const { authenticated, username, password, className, message } = this.state;




    const alertClass = (message.type == "error")? "alert alert-danger alert-text" : (message.type == "success") ? "alert alert-success alert text" : "";


    if(!authenticated)
      return (
        <Container fluid={true} className="formbox" >
          <Row className="formbox">
            <Col xs={12} md={8} lg={4} >
              { message.show &&
                  <div className={alertClass} role="alert">
                    {message.msg}
                  </div>
              }
              <form className={className} noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <input name="username" type="text" className="form-control signin-form-control" id="userName" placeholder="Username" required autoFocus value={username} onChange={this.handleInputChange}></input>
                      <div className="invalid-feedback text-left ml-1">
                        Username cannot be empty.
                      </div>
                  </div>
                  <div className="form-group">
                      <input name="password" type="password" className="form-control signin-form-control" id="password" placeholder="Password" required value={password} onChange={this.handleInputChange}></input>
                      <div className="invalid-feedback text-left ml-1">
                        Password cannot be empty.
                      </div>
                  </div>
                  <div>
                    <Row className="justify-content-center">
                      <Col xs={6} md={8} lg={4}>
                        {/* Login Button is now Sign In */}
                          <button type="submit" name="signIn" className="btn btn-info signin-btn">Sign In</button>
                      </Col>
                    </Row>
                  </div>
              </form>
              <Row className="signup-options-container">
                  <Col xs={6} md={6} lg={6} ><NavLink to="/signup" className="signup-link">Sign Up</NavLink></Col>
                  <Col xs={6} md={6} lg={6} ><NavLink to="/forgotpassword" className="forgot-password-link">Forgot</NavLink></Col>
              </Row>
            </Col>
          </Row>     
        </Container>
      );
    else
      return <Redirect to="/dashboard" /> // The "state" passes data to dashboard.
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}



export default connect(
    mapStateToProps,
    { login, reset }
)(SignIn)
