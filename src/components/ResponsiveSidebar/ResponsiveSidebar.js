import React, { Component } from 'react';
import { UncontrolledCollapse } from 'reactstrap';
import { Row, Col, Navbar,  Button } from 'react-bootstrap';

import PropTypes from 'prop-types';
import './ResponsiveSidebar.scss';

//import Sidebar, {SidebarStyles} from 'react-sidebar';

import {    LeftSidebar } from './../../components'

class ResponsiveSidebar extends Component {
    static propTypes={
        ref_code: PropTypes.string.isRequired,
        
    };

    constructor(props){
      super(props);

      this.state = {
          open: false
      }
      this.toggle = this.toggle.bind(this)
    }



    componentDidMount(){
        window.addEventListener('resize', ()=>{
            this.setState({open: false})
            document.body.style.overflow = "visible";
        });

        const height = document.getElementById('nav-bar').clientHeight;
        this.setState({ height });

    }

   
  toggle(){
    this.setState({open: !this.state.open});
    if(this.state.open){
        document.body.style.overflow = "visible";
    } else if(!this.state.open) {
        document.body.style.overflow = "hidden";

    }
  }

  render(){

    // console.log("mapping  ", this.getCurrencyInvestmentMapping());

    const username = localStorage.getItem("username");

    return (
        <div>
            <Navbar id="nav-bar" bg="dark" variant="dark" sticky="top" style={{top: 0, position: "fixed", width: "100%"}}>
                <Button variant="dark" onClick={()=>{this.toggle()}}>
                    {!this.state.open &&
                         <i className="fa fa-bars"></i>
                    }
                    {this.state.open &&
                        <i className="fa fa-chevron-up"></i>

                    }
                   
                </Button>
                <Navbar.Text style={{paddingLeft:"10px"}}>
                     Signed in as: <a href="/">{username}</a>
              </Navbar.Text>
                  
            </Navbar>
            
            { this.state.open &&
            <div id="overlay">
                <div id="overlay-content" style={{paddingTop: this.state.height}}>
                     <LeftSidebar  history={this.props.history} toggle={this.toggle}/>
                </div>
            </div>
            }
           
        </div>
        
    );
  }
}

export default (ResponsiveSidebar);
