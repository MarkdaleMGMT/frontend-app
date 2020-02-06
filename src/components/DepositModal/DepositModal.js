import React, { Component } from 'react';
import './DepositModal.scss';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchUserInvestments } from '../../actions/investmentActions'
import { deposit } from '../../service/axios-service'
import {Col, Row} from 'react-bootstrap'


class TransferModal extends Component {

    static propTypes={
        investments: PropTypes.array.isRequired,
        fetchUserInvestments: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            amount:'',
            deposit_to:'',
            investment_id:'',
            showInvestments: true
        };

        this.executeTransfer = this.executeTransfer.bind(this);
        this.generateInvestmentList = this.generateInvestmentList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }


    componentDidMount(){
        const username = localStorage.getItem("username");
        this.props.fetchUserInvestments(username);

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
        const { deposit_to, investment_id, amount } = this.state;
        deposit({username, deposit_to:deposit_to, amount:parseFloat(amount), investment_id:parseInt(investment_id)})
        .then((res)=>{
            //triggers a state change which will refresh all components
            this.props.showAlert(res.data.code,'success');
            this.setState({amount:'',deposit_to:''})
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

        const { investments } = this.props;
        const investmentsOptions = investments.map( investment =>{
            return <option key={investment.investment_id} value={investment.investment_id}>{investment.investment_name}</option>
        });

        return investmentsOptions;

    }
    
    render(){

        const { deposit_to, investment_id, amount, showInvestments } = this.state;
        const investmentList = this.generateInvestmentList();
        return (
            <div className="transfer-container">
                <div className="transfer-form-wrapper">
                    <div className="form">
                        <form onSubmit={this.executeTransfer}>
                        <Row className="justify-content-center">
                            <Col  xs={8} md={8} lg={8}>
                                {   showInvestments && 
                                    <div className="form-group">
                                        <select className="form-control Trans-form-control" name="investment_id" required  value={investment_id} onChange={this.handleInputChange}>
                                            <option value="" defaultValue>Investment</option>
                                            {investmentList}
                                        </select>
                                    </div>
                                }

                                <div className="form-group">
                                    <input type="text" className="form-control Trans-form-control" id="userName" name="deposit_to" placeholder="Username" value={deposit_to} required  onChange={this.handleInputChange}></input>
                                </div>

                                <div className="form-group">
                                    <input type="number" className="form-control Trans-form-control" id="amount" name="amount" placeholder="Amount" value={amount} required  onChange={this.handleInputChange}></input>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col xs={6} md={6} lg={3}>
                                <div>
                                    <button type="submit" name="transfer" className="btn btn-info transfer-btn" >Deposit</button>
                                </div>
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
    
    investments: state.investment.all_investments
    
});

export default connect(mapStateToProps, { fetchUserInvestments })(TransferModal);