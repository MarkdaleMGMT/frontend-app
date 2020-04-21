import React, { Component } from 'react';
import Highcharts from 'highcharts';
import  HighchartsReact  from 'highcharts-react-official';
import { lineChartSingleSeries , formatUserHistoryData, formatRatesHistoryData, getMinimumY } from '../../service/extractData';

import { COLORS } from '../../config/config'
import './SimpleChart.scss';



export default class SimpleChart extends Component {

    constructor(props){
        
        super(props);
        this.state = {
            interval:this.props.interval.toString(),
            data: this.props.data,
            show24Hours:  this.props.show24Hours,
        }
        this.handleChange = this.handleChange.bind(this);
        this.extractChartData = this.extractChartData.bind(this);
        this.getChartOptions = this.getChartOptions.bind(this);

    }

    handleChange = (e)=>{

        console.log(e.target.value);
        let newInterval = e.target.value;
        this.setState({interval: newInterval},
        this.props.refreshData(newInterval));

        

    }

    extractChartData(data, interval, dataType){
        
        if(dataType == "users")
            return formatUserHistoryData('Users',data);
        else if (dataType == "balance")   
            return lineChartSingleSeries(this.props.investmentName, data, interval);
        else if (dataType == "rates")
            return formatRatesHistoryData(data, interval)
        
    }

    getChartOptions(chartData, chartType, dataType, interval, color_index){

        let tooltip = { enabled:true };
        let startDate = new Date().setHours(0,0,0,0) -(interval)*24*60*60*1000;
        let endDate = new Date().setHours(0,0,0,0);

        if(dataType == "users")
            tooltip = {...tooltip, valueSuffix:' users'}
        else if (dataType == "balance" || dataType == "rates")
            tooltip = {...tooltip, valueDecimals: 2, valuePrefix:''}
       

        return {
                colors: color_index ?  [COLORS[color_index]] : COLORS,
                chart: {
                    type: chartType,
                    spacingBottom: 15,        
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,
                    margin: null,
                    width: null,
                    height: null,
                    style: { 'font-family': 'Lato', 'font-size': '0.6771vw'}
                },
                credits: { enabled: false},
                title: { text: null },
                series: chartData,
                tooltip: tooltip,
                xAxis: {
                    tickmarkPlacement:"on",
                    showFirstLabel:true,
                    showLastLabel:true,
                    // labels :{step:interval-1},
                    type: 'datetime',
                    gridLineWidth: 1,
                   
                },
                yAxis: [{

                    // floor:minimumY,
                    allowDecimals: (dataType != "users"),
                    lineWidth: 1,
                    title: {
                        text: null
                    }
                }, {
                    allowDecimals: (dataType !== "users"),
                    lineWidth: 1,
                    opposite: true,
                    title: {
                        text: null
                    }
                }],
                plotOptions: {
    
                    series:{pointStart: startDate},
    
                }
            };
        
            
    }



    render() {

        const { chartTitle, chartType, dataType, startDate, index, data} = this.props;
        const { interval, show24Hours } = this.state;

        const chartData = this.extractChartData(data, interval, dataType);
        const chartOptions = this.getChartOptions(chartData, chartType, dataType, interval, index%COLORS.length );


        return (
            <div className="simple-chart-container"  style={{height:"100%"}}>
            <div className="simple-chart-wrapper"  style={{height:"100%"}}>
                <div className="simple-chart-controls">
                    <div style={{display: 'inline-flex'}}>
                      <div onClick={this.handleClickLineChart} className="chart-title">{chartTitle}</div>
                     
                    </div>
                  <div>
                        <select name="interval" className="chart-dropdown" value={ this.state.interval } onChange={ this.handleChange }>
                            {show24Hours && <option value='1'>Last 24 Hours</option>}

                                    <option value='30'>Last 30 Days</option>
                                    <option value='60'>Last 60 Days</option>
                                    <option value='90'>Last 90 Days</option>
                                    <option value='180'>Last 180 Days</option>
                                    <option value='365'>Last 1 year</option>
                                    <option value='1825'>Last 5 years</option>
                                    <option value='3650'>Last 10 years</option>
                                    <option value='7300'>Last 20 years</option>
                                    <option value= '-1'>From Start</option>

                        </select>
                    </div>
                </div>
                <div style={{height:"100%"}}>
                <HighchartsReact
                        highcharts = { Highcharts }
                        options = { chartOptions }
                        containerProps={{ style: { height: "100%" } }}

                        
                    />
                </div>
            </div>
        </div>
        )
    }
}
