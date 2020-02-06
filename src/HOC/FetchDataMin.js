import React, { Component } from 'react';
import { FETCH_DATA_INTERVAL } from '../config/config'

export default function FetchDataMin(WrappedComponents, axios_services, data){
    /**
     * Accept "interval" argument and modify body data for LineChart Component
     */
    // if(interval){
    //     let username = data.username;
    //     data = { username, time_period_days:+interval };
    // }
    return class extends Component{
        
        
        getData = ()=>axios_services(this.state.requestData)
                        .then((res)=>{
                            console.log(res.data)
                            //set the response 
                            this.setState({responseData: res.data})
                        })
                        .catch((err)=>{
                            console.log(`No data available.`)
                        });

        setFetchDataInterval = ()=>setInterval(this.getData, FETCH_DATA_INTERVAL);

        constructor(props){
            super(props);
            this.state = { responseData: {}, requestData:data };
            this.refreshData = this.refreshData.bind(this);

        }
        
        componentDidMount(){
             this.getData();
             this.fetchDataTimer = this.setFetchDataInterval();
        }

        componentWillUnmount(){
            //destroy the timer
            clearInterval(this.fetchDataTimer)
        }

        refreshData(requestData){

            this.setState(
            {
                requestData 
            },
                this.getData         //callback: data is refreshed after requestData is updated
            );
            

        }
        
        render(){
            console.log("FetchDataMin rerender")
            return <WrappedComponents data = {this.state.responseData} requestData = {this.state.requestData} { ...this.props} refreshData={this.refreshData}/>
        }
    }
}