import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { reset, logout } from '../../actions/userActions'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Footer.scss';

class Footer extends Component {

    static propTypes={
        ref_code: PropTypes.string.isRequired,
        reset: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        // this.logout = this.logout.bind(this);
    }

    
    // logout(){

    //     this.props.reset();
    //     this.props.history.push('/signin');
    // }



    render(){
        return (
                <div className="footer-control">
                    <Row className="footer-filter">
                        <Col><Link to="/dashboard" className="nav-link-top">Dashboard</Link></Col>
            
                        <Col ><Link to="/stats" className="nav-link-top">Stats</Link></Col>
                        
                        <Col ><Link to="/contact" className="nav-link-top">Contact</Link></Col>
                        <Col className="d-none d-md-block"><Link to="/sigin" onClick={this.props.logout} className="nav-link-top">Logout</Link></Col>
                        
                    </Row>
                </div>
            
        );
    }
}


//map state of the store to the props
const mapStateToProps = state => ({
    ref_code: state.user.ref_code
});

export default connect(mapStateToProps, { reset , logout })(Footer);



