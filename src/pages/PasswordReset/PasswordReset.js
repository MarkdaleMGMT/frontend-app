import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Redirect  } from 'react-router-dom';
import queryString from 'query-string';

import { updatePassword } from '../../service/axios-service'


export default class PasswordReset extends Component {

    constructor(props){
        super(props)
        const values = queryString.parse(props.location.search)

        this.state = {
            isSuccess:false,
            token : values.token ? values.token : '',
            password: '',
            confirmPassword: '',
            className: 'needs-validation',
            err_msg: { err: false, msg: ''}, // Held the failure state & messag returned from server.
            confirmation_msg:{show:false, msg:''} //Confirmation Message
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange = (e) =>{
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e)=>{

        e.preventDefault();

        const { password, confirmPassword } = this.state;
        // perform all neccassary validations
        if (password !== confirmPassword) {
           
            this.setState({ err_msg: { err: true, msg: 'Passwords do not match'} })

        } else {

            // make password reset API call
            const { password , token } = this.state;
            updatePassword({ token, pass:password })
            .then((res)=>{

                this.setState({ isSuccess: true , confirmation_msg:{show:true, msg:res.data.code}});
            })
            .catch((err)=>{

                this.setState({ err_msg: { err: true, msg: err.response.data.msg+":"+err.response.data.err} })
                
            });
        }
      }

  

    render() {
        
        const { isSuccess, token, password , confirmPassword,  className, err_msg , confirmation_msg} = this.state;

        //If no token is provided redirect in URL, redirect to Sign In Page
        if(token == '')
        {    
            return <Redirect to='/login' />
        }

        //if update password is successful redirect to Sign In page with confirmation message
        else if(isSuccess){

           return <Redirect to="login"
                to= {{
                  pathname: '/login',
                  state: { confirmation_msg }
                }}
            />
        }
        else{

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
                          <input name="password" type="password" className="form-control signup-form-control" id="password" placeholder="Password" required value={password} onChange={this.handleInputChange} ></input>
                      </div>
    
                      <div className="form-group">
                          <input name="confirmPassword" type="password" className="form-control signup-form-control" id="confirmPassword" placeholder="Confirm Password" required value={confirmPassword} onChange={this.handleInputChange} ></input>
                          <div className="invalid-feedback text-left ml-1">
                            Please make sure both passwords match.
                          </div>
                          
                      </div>
    
                      <Row className="justify-content-center">
                        <Col xs={6} md={8} lg={6}>
                          <button type="submit" name="signUp" className=" btn btn-info signup-btn">Update Password</button>
                        </Col>
                      </Row>
                    </form>
                </Col>
              </Row>     
            </Container>
            )

        }

        
    }
}
