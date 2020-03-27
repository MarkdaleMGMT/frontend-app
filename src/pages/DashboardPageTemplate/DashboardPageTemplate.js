/**
 * Build a Higher-Order Component to wrap the dashboard page contents
 */
import React, { Component } from 'react';

export default function(Wrappedcomponent){
  return class extends Component{      
     
      render(){
            return( 
                <div>
                    <div> Sidebar </div>
                    <Wrappedcomponent { ...this.props}/>
                    <div> Footer </div>
                </div>
                )
      }
  }
}