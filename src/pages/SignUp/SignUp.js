import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Redirect } from "react-router-dom";

import { Container, Row, Col } from 'react-bootstrap';
import queryString from 'query-string'



import './SignUp.scss';
import { FRONTEND_API, USERNAME_CHECK, PASSWORD_CHECK, EMAIL_CHECK } from "../../config/config";

class SignUp extends Component {
  state = {
    code: '',
    password: '',
    confirmPassword: '',
    username: '',
    email: '',
    className: 'needs-validation',  // When validation fails, add a boostrap class to display prompts.
    isSuccess: false,               // Held the successful state returned from server.
    err_msg: { err: false, msg: ''}, // Held the failure state & messag returned from server.
    confirmation_msg:{show:false, msg:''} //Confirmation Message

  }

  // constructor(){
  //
  //   super(props);
  //
  //
  //   this.onDismiss = this.onDismiss.bind(this);
  // }

  componentDidMount(){

    //set referral code if part of URL
    const values = queryString.parse(this.props.location.search)
    if (values.ref_code)
      this.setState({ code: values.ref_code })
  }

  handleInputChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }



  handleSubmit = (e)=>{

    const { password, confirmPassword } = this.state;
    // perform all neccassary validations
    if (password !== confirmPassword) {
      this.setState({
        err_msg: {err: true, msg:`Passwords dont match.`},
        className: 'needs-validation'

      });
      e.preventDefault();
    } else {
        // make API call
        
    }
    
    if(!e.target.checkValidity()){  // Add a Bootstrap class to show prompts if checkValidity is false.
      this.setState({ className: 'needs-validation was-validated'});
    }else{
      const { code, username, password, confirmPassword, email} = this.state;
      axios.post(FRONTEND_API + "signup", {code, username, password, confirmPassword, email})
      .then((res)=>{
          if(res.data.code === 'Signup successful, please check your inbox to confirm your e-mail address - might go to "junk/spam" folder')
            this.setState({ isSuccess: true , confirmation_msg:{show:true, msg:res.data.code}});


      })
      .catch((err)=>{
        this.setState({
          // Here, I used the message returned from server for user. Or customize a message for user.
          err_msg: {err: true, msg:`${err.response.data.code}: ${err.response.data.message}.`},
          className: 'needs-validation'
        });
      })
    }
    e.preventDefault();
  }



  render(){
    const { code, username, password, confirmPassword, email, className, isSuccess, err_msg, confirmation_msg} = this.state;
    if(!isSuccess)
        return (
          <Container fluid={true} className="formbox" >
            <Row className="formbox">
              <Col xs={12} md={8} lg={4} >
                { err_msg.err &&
                    <div className="alert alert-danger alert-text" role="alert">
                    {err_msg.msg}
                    </div>
                }
                <form className={ className } noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <input name="username" type="text" className="form-control signup-form-control" id="userName" placeholder="Username" required autoFocus value={username} onChange={this.handleInputChange} pattern={USERNAME_CHECK}></input>
                      <div className="invalid-feedback text-left ml-1">
                        Make sure it's more than 3 and less than 17 characters which can be uppercases, lowercases, numbers, or underscore.
                      </div>
                  </div>
                  <div className="form-group">
                      <input name="password" type="password" className="form-control signup-form-control" id="password" placeholder="Password" required value={password} onChange={this.handleInputChange} ></input>
                      <div className="invalid-feedback text-left ml-1">
                        Make sure it's at least 6 characters including a number, a lowercase, a uppercase and a special character.
                      </div>
                  </div>
                  <div className="form-group">
                      <input name="confirmPassword" type="password" className="form-control signup-form-control" id="confirmPassword" placeholder="Password Confimation" required value={confirmPassword} onChange={this.handleInputChange} ></input>
                      <div className="invalid-feedback text-left ml-1">
                        Make sure it's at least 6 characters including a number, a lowercase, a uppercase and a special character.
                      </div>
                  </div>
                  <div className="form-group">
                      <input name="email" type="email" className="form-control signup-form-control" id="email" placeholder="Email" required value={email} onChange={this.handleInputChange} pattern={EMAIL_CHECK}></input>
                      <div className="invalid-feedback text-left ml-1">
                        Incorrect email format.
                      </div>
                  </div>
                  <div className="form-group">
                      <input name="code" type="text" className="form-control signup-form-control" id="referralCode" placeholder="Referral code" required value={code} onChange={this.handleInputChange}></input>
                      <div className="invalid-feedback text-left ml-1">
                        Input the referral code which you get from an affiliate.
                      </div></div>
                  <Row className="justify-content-center">
                    <Col xs={6} md={8} lg={4}>
                      <button type="submit" name="signUp" className=" btn btn-info signup-btn">Sign Up</button>
                    </Col>
                  </Row>
                </form>
                <div className="signup-options-container">
                    <NavLink to="/login" className="signup-link" >Login</NavLink>
                    <NavLink to="/forgot" className="forgot-password-link">Forgot</NavLink>
                </div>
            </Col>
          </Row>     
        </Container>
        )
    else
        return <Redirect to="login"
                to= {{
                  pathname: '/login',
                  state: { confirmation_msg }
                }}
        
        />
  }
}

export default SignUp;
