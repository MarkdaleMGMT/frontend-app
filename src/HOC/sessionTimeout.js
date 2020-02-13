/**
 * Build a Higher-Order Component to wrap the pages/components which need session timeout.
 */
import React, { Component } from 'react';
import { Redirect  } from 'react-router-dom';
import { SESSION_SIGNOUT_TIME, EVENTS, ALERT_SIGNOUT_MSG } from "../config/config"


export default function(Wrappedcomponent){
  return class extends Component{      
      setPageTimeout = ()=>{
          this.signoutTimeoutID = setTimeout(()=>{
              alert(`${ALERT_SIGNOUT_MSG}`);
              window.location.assign('/');    // Here, just return to signin page. There is not              
          }, SESSION_SIGNOUT_TIME);           // authentication, so dashboard page can still be visited.
      }
      
      resetTimeout = ()=>{
          if(typeof(this.signoutTimeoutID) !== 'undefined'){
            clearTimeout(this.signoutTimeoutID);
          }
          this.setPageTimeout();
      }

      componentDidMount(){
          for(let i in EVENTS){
              window.addEventListener(EVENTS[i], this.resetTimeout)
          }
          this.setPageTimeout();
      }

      render(){
          if( localStorage['username'] && localStorage['username'] != '')
            return <Wrappedcomponent { ...this.props}/>
          else
            return <Redirect to="/login"></Redirect>
      }
  }
}