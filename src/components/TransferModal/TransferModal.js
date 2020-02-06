import React, { Component } from 'react';
import './TransferModal.scss';
import {Col, Row} from 'react-bootstrap'

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchUserInvestments , fetchAllInvestments } from '../../actions/investmentActions'
import { transferAmount } from '../../service/axios-service'



class TransferModal extends Component {

    static propTypes={
        all_investments: PropTypes.array.isRequired,
        investments: PropTypes.array.isRequired,
        fetchUserInvestments: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            amount:'',
            sender:'',
            recipient:'',
            investment_id:'',
            showInvestments: true
        };

        this.executeTransfer = this.executeTransfer.bind(this);
        this.generateInvestmentList = this.generateInvestmentList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }


    componentDidMount(){
        const username = localStorage.getItem("username");
        const level =  localStorage.getItem("user_level");


        //admin
        if (level == 0)
        {    
            this.props.fetchAllInvestments();
            
        
        }
        else
        {       this.props.fetchUserInvestments(username);
                this.setState({ sender: username})
        }

        if(this.props.investment_id){
            console.log("props has investment id")
            this.setState({ showInvestments: false, investment_id: this.props.investment_id });
        }
    }

    componentDidUpdate(prevProps, prevState){

        if(prevProps.investment_id != this.props.investment_id)
            this.setState({investment_id:this.props.investment_id});
    }



    executeTransfer(e){

        e.preventDefault();

        const username = localStorage.getItem("username");
        const { sender, recipient, investment_id, amount } = this.state;
        transferAmount({username, sender:sender, recipient, amount:parseFloat(amount), investment_id:parseInt(investment_id)})
        .then((res)=>{
            //triggers a state change which will refresh all components
            this.props.showAlert(res.data.message,'success');
            this.setState({amount:'',recipient:'', sender:''})
            this.props.onSuccess();
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            this.props.showAlert(err.response.data.message,'error');
        });

        
    }

    handleInputChange = (e) =>{
        console.log([e.target.name], e.target.value);
        this.setState({
          [e.target.name]: e.target.value
        });

        
      }

    generateInvestmentList(){

        const level =  localStorage.getItem("user_level");
        const investments = level == 0 ?  this.props.all_investments : this.props.investments ;
        const investmentsOptions = investments.map( investment =>{
            return <option key={investment.investment_id} value={investment.investment_id}>{investment.investment_name}</option>
        });

        return investmentsOptions;

    }
    
    render(){

        const {sender, recipient, investment_id, amount, showInvestments } = this.state;
        const investmentList = this.generateInvestmentList();
        const level =  localStorage.getItem("user_level");

        return (
            <div className="transfer-container">
                <div className="transfer-form-wrapper">
                    <div className="form">
                        <form onSubmit={this.executeTransfer}>
                        <Row className="justify-content-center">
                            <Col xs={8} md={8} lg={8}>
                            { level == 0 &&
                            <div className="form-group">    
                                <input type="text" className="form-control Trans-form-control" id="userName" name="sender" placeholder="From:Username" value={sender} required  onChange={this.handleInputChange}></input>
                            </div>
                            }

                            <div className="form-group">
                                <input type="text" className="form-control Trans-form-control" id="userName" name="recipient" placeholder="To:Username" value={recipient} required  onChange={this.handleInputChange}></input>
                            </div>

                            {   showInvestments && 
                                <div className="form-group">
                                    <select className="form-control Trans-form-control" name="investment_id" required  value={investment_id} onChange={this.handleInputChange}>
                                        <option value="" defaultValue>Investment</option>
                                        {investmentList}
                                    </select>
                                </div>
                            }
                            <div className="form-group">
                                <input type="number" className="form-control Trans-form-control" id="amount" name="amount" placeholder="Amount" value={amount} required  onChange={this.handleInputChange}></input>
                            </div>
                            </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs={6} md={6} lg={6}>
                                    <button type="submit" name="transfer" className="btn btn-info transfer-btn" >Transfer</button>
                                </Col>
                            </Row>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

//map state of the store to the props
const mapStateToProps = state => ({
    
    investments: state.investment.user_investments,
    all_investments: state.investment.all_investments
    
});

export default connect(mapStateToProps, { fetchUserInvestments, fetchAllInvestments })(TransferModal);