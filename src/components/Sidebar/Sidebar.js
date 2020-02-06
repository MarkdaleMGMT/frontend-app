import React, { Component } from 'react';
import { UncontrolledCollapse, Collapse } from 'reactstrap';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import { fetchAllInvestments } from '../../actions/investmentActions'
import { reset, logout } from '../../actions/userActions'
//import Sidebar, {SidebarStyles} from 'react-sidebar';

class LeftSidebar extends Component {
    static propTypes={
        ref_code: PropTypes.string.isRequired,
        fetchAllInvestments: PropTypes.func.isRequired,
        investments: PropTypes.array.isRequired,
        logout: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired
    };

    constructor(props){
      super(props);
    //   this.logout = this.logout.bind(this);
    //this.toggle = this.toggle.bind(this);
    }


    componentWillMount(){
        
        this.props.fetchAllInvestments();
        

    }

    getCurrencyInvestmentMapping(){

        console.log("getCurrencyInvestmentMapping: ",this.props);
        let { investments } = this.props;
        let currencySet = new Set();

        investments.forEach(investment => {

            currencySet.add(investment.currency)
        });

        //sort the set
        currencySet = Array.from(currencySet).sort();

        let currencyInvestmentMapping = [];
        currencySet.forEach( currency => {

            let currencyInvestments = investments.filter( investment =>{
                return investment['currency']==currency;
            });

            currencyInvestmentMapping.push({
                currency: currency,
                investments: currencyInvestments

            });

        });

        return currencyInvestmentMapping
    }

    renderInvestmentsMenu(){

        // rearrange the investments
        const currencyInvestmentMapping = this.getCurrencyInvestmentMapping();



        const investmentsMenu = currencyInvestmentMapping.map( mapping =>{

            const { currency, investments } = mapping;

            
            return <div key={currency}>

                    {/* Hide on screens smaller than lg */}
                    <div className="d-none d-lg-block">
                        <a href="" className="nav-link-top">
                            <li  className="nav-item" id={currency} >
                                <i className="fa fa-chevron-right"></i>
                                <span href="">{mapping.currency}</span>
                            </li>
                        </a>
                    </div>
                    
                    {/* Hide on screens bigger or equal lg */}
                    <div className="d-md-none"> 
                        <a className="nav-link-top">
                            <li  className="nav-item">
                                <div id={currency} className="investment" style={{width:"fit-content"}}>
                                    <i  className="fa fa-chevron-right"></i>
                                    <span>{mapping.currency}</span>
                                </div>
                                
                            </li>
                        </a>
                    </div> 
                                        
                     <UncontrolledCollapse toggler={"#"+currency}>
                        {  investments.map((i, idx) => {

                            console.log("idx", idx);
                            return  (
                            <li className="nav-item" key={i.investment_id} >

                            {/* Only Clickable Links on Smaller Screens */}
                            <div style={{width:"fit-content"}} className="d-md-none" >
                            <Link to={{
                                    pathname: "/investment/"+i.investment_id,
                                    state:{
                                        
                                        investment_name: i.investment_name,
                                        currency:currency,
                                        index:idx
                                    }
                                    }} 
                                className="nav-link"
                                onClick={() => {this.props.toggle()}} 
                                >{i.investment_name}</Link>
                            </div>

                            {/* Entire block is clickable */}
                            <div className="d-none d-lg-block" >
                            <Link to={{
                                    pathname: "/investment/"+i.investment_id,
                                    state:{
                                        
                                        investment_name: i.investment_name,
                                        currency:currency,
                                        index:idx
                                    }
                                    }} 
                                className="nav-link"
s                                >{i.investment_name}</Link>
                            </div>
                           
                            </li>)

                            })
                        }
                     </UncontrolledCollapse>
                     </div>




        });

        return investmentsMenu;

    }

  logout(){

    this.props.reset();
    this.props.history.push('/signin');
  }




  render(){

    // console.log("mapping  ", this.getCurrencyInvestmentMapping());
    const InvestmentsMenu  = this.renderInvestmentsMenu();
    const ref_code = localStorage.getItem("ref_code");
    const level = localStorage.getItem("user_level")
    console.log("YOUR LEVEL IS " + level)

    return (
        <div className="sidebar-container">
        <ul className="sidebar navbar-nav scroll" >
                <div className="navigation-type">

                <li className="nav-item">
                    <i className="fa fa-home"></i>
                    <Link to="/dashboard" className="nav-link-top">Dashboard</Link>

                </li>
                
                <li className="nav-item">
                    <i className="fa fa-empire"></i>
                    {/* <i class="fas fa-steering-wheel"></i> */}
                    <Link to="/affiliate" className="nav-link-top">Affiliate</Link>
                </li>

                <li className="nav-item">
                    <i className="fa fa-exchange"></i>
                    <Link to="/payments" className="nav-link-top">Payments</Link>
                </li>
                <li className="nav-item">
                    <i className="fa fa-clock-o"></i>
                    <Link to="/stats" className="nav-link-top">Stats</Link>
                </li>

                <li className="nav-item">
                <i className="fa fa-line-chart"></i>
                    <Link to="/exchange" className="nav-link-top">Exchange</Link>
                </li>
                </div>
                <div className="Currency-type">
                    {InvestmentsMenu}
                </div>
                <div className="other-containt">
                <li className="nav-item">
                    <i className="fa fa-envelope-square"></i>
                    <Link to="/contact" className="nav-link-top">Contact</Link>
                </li>

                {level != null &&
                <div>
                <li className="nav-item">
                    <i className="fa fa-sign-out"></i>
                    <a href="/" className="nav-link-top">Logout</a>
                </li>
                <li className="nav-item">
                    <span>Referral Code: {ref_code}</span>
                </li>
                </div>
                }

                </div>
            </ul>
    </div>
    );
  }
}

//map state of the store to the props
const mapStateToProps = state => ({
    
    investments: state.investment.all_investments,
    ref_code: state.user.ref_code
    // user: state.user.user_details
});

export default connect(mapStateToProps, { fetchAllInvestments, reset, logout })(LeftSidebar);
