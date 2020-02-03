import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchUserInvestments, fetchAllInvestments } from '../../actions/investmentActions'
import { exchangeInvestment } from '../../service/axios-service'

import './ExchangeForm.scss'

//TODO: 
//1. Connect to user investments and all investments reducer
//2. Configure the form to take name of the fields from the API
//3. Integrate the API
//4. Style the form 
//5. Make the form responsive 


class ExchangeForm extends Component {

    static propTypes={
        investments: PropTypes.array.isRequired,
        user_investments: PropTypes.array.isRequired,
        fetchUserInvestments: PropTypes.func.isRequired,
        fetchAllInvestments: PropTypes.func.isRequired
    };



    constructor(props){

        super(props);
        this.state = {
            source_investment:'',
            target_investment:'',
            source_currency:'',
            target_currency:'',
            amount:'',
            target_amount:'',
            exchange_rate:{mid:1}

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.generateInvestmentList = this.generateInvestmentList.bind(this);
        this.findCurrency = this.findCurrency.bind(this);
        this.executeExchange = this.executeExchange.bind(this);
        this.updateExchangeRate = this.updateExchangeRate.bind(this);
        this.reverse = this.reverse.bind(this);
    }

    componentDidMount(){

        const username = localStorage.getItem("username");
        this.props.fetchUserInvestments(username);
        this.props.fetchAllInvestments();
       
    }

    componentDidUpdate(prevProps, prevState){

        if(prevProps.exchange_rates != this.props.exchange_rates)
            this.updateExchangeRate();
    }

    executeExchange(e){

        e.preventDefault();

        let username = localStorage.getItem("username");
        const { source_investment, target_investment, amount} = this.state;

        exchangeInvestment({ username,  source_investment: parseInt(source_investment), target_investment:parseInt(target_investment), amount:parseFloat(amount)})
        .then((res)=>{
            //triggers a state change which will refresh all components
            this.props.showAlert(res.data.code,'success');
            this.setState({amount:'',target_amount:''})
            // this.props.onSuccess();
        })
        .catch((err)=>{
            //triggers a state change which will refresh all components
            this.props.showAlert(err.response.data.code+": "+err.response.data.message,'error');
        });

    }

    findCurrency(investments, investment_id){

        let matchingInvestment =  investments.filter(investment => {
            // console.log(" investment.investment_id ", investment.investment_id);
            // console.log(" investment_id ", investment_id);
            // console.log(investment.investment_id == parseInt(investment_id));

            return investment.investment_id == parseInt(investment_id);

        });

        console.log("matchingInvestment", matchingInvestment)
        if (matchingInvestment.length > 0){
            return matchingInvestment[0].currency;
        } else {
            return -1;
        }
        

    }
    
    updateExchangeRate() {
        const { source_currency, target_currency } = this.state;

        console.log("this.props.exchange_rates", this.props.exchange_rates);
        console.log("src: " + source_currency)
        console.log("srcnull: " + !source_currency)
        //There are cases when source_currency is null at the first time
        if (!source_currency) {
           console.log(this.props.user_investments)
          // source_currency = this.props.user_investments[0].currency
        }
        console.log("target " + target_currency)
        //console.log(source_currency, target_currency);

        let exchange_rate = { bid:null, ask:null, mid:null};

        if(source_currency == target_currency )
            exchange_rate= {bid:1, ask:1, mid:1}
        else{   

            exchange_rate = this.props.exchange_rates[source_currency+"_"+target_currency];
            console.log("exchange rate: ", exchange_rate)

            //find the reverse direction rate
            if(!exchange_rate){

                exchange_rate = this.props.exchange_rates[target_currency+"_"+source_currency];
                console.log("t: ",target_currency+"_"+source_currency)
                console.log("t: exchange rate ",this.props.exchange_rates[target_currency+"_"+source_currency])

                if(exchange_rate)
                {
                    let new_exchange_rate = { bid:1/exchange_rate.ask, ask:1/exchange_rate.bid, mid:1/exchange_rate.mid};
                    console.log("new_exchange_rate: ", new_exchange_rate)
                    exchange_rate = new_exchange_rate;
                }
            }
        }         
            
        this.setState({ exchange_rate}, ()=>{
            const { amount, exchange_rate} = this.state;

                if(amount != ''){
                    this.setState({target_amount: parseFloat((amount * exchange_rate.bid).toFixed(8)) });
                }
                    
        });

    }

    handleInputChange(e){
     
       // this.updateExchangeRate();
        const { exchange_rate } = this.state;
        
        this.setState({
          [e.target.name]: e.target.value
        });

        if(e.target.name == "amount"){
            //calculate the target amount 
            // this.setState({target_amount: (e.target.value * exchange_rate.mid) })
            console.log("e.target.value ",e.target.value);
            console.log(exchange_rate)
            console.log("exchange_rate.bid ",exchange_rate.bid);
            
            console.log("target_amount: ", e.target.value * exchange_rate.bid);
            let val = e.target.value * exchange_rate.bid
            this.setState({target_amount: isNaN(val) ? 
                "Not a Number":
                parseFloat((e.target.value * exchange_rate.bid).toFixed(8)) })
        }

        else if(e.target.name == "target_amount"){

            //calculate the source amount 
            // this.setState({amount: (e.target.value * 1/exchange_rate.mid) })
            let val = (e.target.value * 1/exchange_rate.ask)
            this.setState({amount: isNaN(val)?
                "Not a Number":
                parseFloat((e.target.value * 1/exchange_rate.ask).toFixed(8)) })
        }

        else{
        //source currency or target currency is changed

            let investment_id = e.target.value;
            //source or target investments change check if the values are the same, if not then get a new rate 
            if(e.target.name == "source_investment"){
               
                // console.log([e.target.name], e.target.getAttribute("currency"));
                
                let currency = this.findCurrency(this.props.user_investments, investment_id);
                console.log("currency", currency);

                if (currency == this.state.target_currency) { // start switch

                    this.setState(
                        {
                            source_currency: currency, 
                            source_investment: investment_id,
                            target_currency: this.state.source_currency,
                            target_investment: this.state.source_investment
                        }, 
                        this.updateExchangeRate);

                } else {
                    this.setState({source_currency: currency , source_investment: investment_id}, this.updateExchangeRate);

                }

            }
            else{
                let currency = this.findCurrency(this.props.investments, investment_id);
                console.log("currency", currency);
                if (currency == this.state.source_currency){

                    //If the user does not have the investment, prevent them from switching currencies
                    if (this.findCurrency(this.props.user_investments, this.state.target_investment) == -1){
  
                        this.setState(
                            {
                                target_currency:this.state.target_currency, 
                                target_investment:this.state.target_investment,
                                source_currency: this.state.source_currency,
                                source_investment: this.state.source_investment
                            
                            }, 
                            this.updateExchangeRate);

                        this.props.showAlert("You don't have that currency",'error');
                        //return   
                    }
                        this.setState(
                            {
                                target_currency:currency, 
                                target_investment:investment_id,
                                source_currency: this.state.target_currency,
                                source_investment: this.state.target_investment
                            
                            }, 
                            this.updateExchangeRate);
    
                } else {
                    this.setState({target_currency:currency, target_investment:investment_id}, this.updateExchangeRate);

                }
         
            }

        }
           
    }

    generateInvestmentList(investments, hidden_investment_id, type){
        console.log(type)
        console.log(investments)
        const investmentsOptions = investments.map( (investment, idx) =>{

            //set the default source currency
            if(idx==0 ){
                if(type=="source" && this.state.source_currency=='' && this.state.source_investment==''){
                    console.log("TERE")
                    this.setState({source_currency: investment.currency, source_investment:investment.investment_id}, ()=> {this.updateExchangeRate()});

                }
            
            }

            //set the default target currency
            if(idx == 1){
                if(type=="target" && this.state.target_currency=='' && this.state.target_investment=='')
                this.setState({target_currency:investment.currency, target_investment:investment.investment_id});

                
            }

            return <option  currency={investment.currency}  key={investment.investment_id} value={investment.investment_id}>{investment.investment_name + " ("+ investment.currency+")"}</option>
            
        });

        return investmentsOptions;

    }

    reverse(){
        let { source_investment, target_investment, source_currency, target_currency, amount, target_amount } = this.state;
        
        if (this.findCurrency(this.props.user_investments, this.state.target_investment) == -1){
            this.props.showAlert(`You don't have the [${this.state.target_currency}] investment account in your portfolio`,'error');
        } else {
            this.setState(
                {
                    source_investment: target_investment, 
                    target_investment: source_investment, 
                    source_currency: target_currency, 
                    target_currency: source_currency, 
                    amount: '',
                    target_amount: ''
                }, () => {this.updateExchangeRate()})
        }
        
    }

    render() {

        const { source_investment, target_investment, source_currency, target_currency, amount, target_amount } = this.state;
        const userInvestmentList = this.generateInvestmentList(this.props.user_investments, target_investment, "source");
        const allInvestmentList = this.generateInvestmentList(this.props.investments, source_investment, "target");

        if(this.props.user_investments == 0){
            return (
                <div >
                </div>
            )
        }

        return (
            <div className="form-container">
                <div className="form-wrapper justify-content-center">
                    <div className="form justify-content-center">
                        <form  onSubmit={this.executeExchange}>

                        {/* Button For Yael */}
                        <Button variant="outline-dark" onClick={()=>{this.reverse()}}>
                            <i className="fa fa-exchange"></i>
                        </Button>
       
                        <Row className="justify-content-center">
                        <Col xs={6} md={2} lg={3} className="form-group no-padding">
                            <select className="form-control Trans-form-control" name="source_investment" required  value={source_investment}  onChange={this.handleInputChange}>
                                {/* <option value="" defaultValue>Investment</option> */}
                                {userInvestmentList}
                            </select>
                            
                        </Col>
                        <Col xs={6} md={2} lg={2} className="form-group no-padding">
                            <input type="text" className="form-control Trans-form-control" id="amount" name="amount" placeholder="Amount" value={amount} required  onChange={this.handleInputChange}></input>
                        </Col>
                        <Col xs={12} md={2} lg={2} className="form-group">
                            <button style={{width: "auto"}} type="submit" name="exchange" className="btn btn-info transfer-btn" >Exchange</button>
                        </Col>
                        <Col xs={6} md={2} lg={3} className="form-group no-padding">
                            <select className="form-control Trans-form-control" name="target_investment" required  value={target_investment}  onChange={this.handleInputChange}>
                                {/* <option value="" defaultValue>Investment</option> */}
                                {allInvestmentList}
                            </select>
                            
                        </Col>
                        <Col xs={6} md={2} lg={2} className="form-group no-padding">
                            <input type="text" className="form-control Trans-form-control" id="target_amount" name="target_amount" placeholder="Amount" value={target_amount} required  onChange={this.handleInputChange}></input>
                        </Col>
                        </Row>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

//map state of the store to the props
const mapStateToProps = state => ({
    
    investments: state.investment.all_investments,
    user_investments: state.investment.user_investments
    
});

export default connect(mapStateToProps, { fetchUserInvestments, fetchAllInvestments })(ExchangeForm);