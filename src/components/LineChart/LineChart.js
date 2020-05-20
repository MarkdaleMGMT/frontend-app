import React, { Component } from 'react';
import Highcharts from 'highcharts';
import  HighchartsReact  from 'highcharts-react-official';
import PropTypes from 'prop-types';

import './LineChart.scss';
import { lineChart } from '../../service/extractData'
import { COLORS } from '../../config/config'
import {Row, Col, Container} from 'react-bootstrap'

export default class LineChart extends Component {

    // static propTypes = {
    //     data : PropTypes.object.isRequired
    // }

    constructor(props){
        super(props);
        this.state = {
            showLineChart: true,
            interval:this.props.interval.toString(),
            data: this.props.data
        };

    }

    handleChange = (e)=>{

        console.log(e.target.value);
        let newInterval = e.target.value;
        this.setState({interval:newInterval},
        ()=>{
            let requestData = {...this.props.requestData,time_period_days:newInterval};
            this.props.refreshData(requestData);
            //rerender


        });



        // this.props.refreshData(e);
    }

    // componentWillReceiveProps()

    handleClickLineChart = ()=>{
        this.setState({ showLineChart: true});
    }

    handleClickMountainChart = ()=>{
        this.setState({ showLineChart: false});
    }

    render(){
        
        const { data } = this.props;
        const { showLineChart , interval } = this.state;
        const chartData = lineChart(data, interval);

        let startDate = new Date().setHours(0,0,0,0) -(interval)*24*60*60*1000;
        let endDate = new Date().setHours(0,0,0,0)

        // let startDate = chartData[0].data[0].x;
        // let endDate = chartData[0].data[interval -1].x;


        // console.log("chartData ",chartData[0].data[0])
        //console.log("DATA: " + JSON.stringify(chartData))

        const lineOptions={
            colors: COLORS,
            chart: {
                type: 'line',
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,
                margin: null,
                width: null,
                height:  null,
                style: { 'font-family': 'Lato', 'font-size': '0.6771vw'}
            },
            credits: { enabled: false},
            title: { text: null },
            series: chartData.chartDataLine,
            tooltip: {
                enabled: true,
                valueDecimals: 2,
                valuePrefix: '$'
            },
            xAxis: {
                tickmarkPlacement:"on",
                showFirstLabel:true,
                showLastLabel:true,
                type: 'datetime',
                gridLineWidth: 1,

            },
            yAxis: [{
                lineWidth: 1,
                title: {
                    text: null
                }
            }, {
                lineWidth: 1,
                opposite: true,
                title: {
                    text: null
                }
            }],
            plotOptions: {

                series:{
                    turboThreshold: 30000,
                    pointStart: startDate,
                    marker: {
                        enabled: false,
                
                },
            }

            }
        }

        const mountainOptions={
            
            chart: {
                type: 'area',
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
            series: chartData.chartDataMountain,
            tooltip: {
                enabled: true,
                valueDecimals: 2,
                valuePrefix: '$'
            },
            xAxis: {
                tickmarkPlacement:"on",
                showFirstLabel:true,
                showLastLabel:true,
                // labels :{step:interval-1},
                type: 'datetime',
                gridLineWidth: 1,
                // max: endDate,
                // min: startDate,
                // startOnTick: false,
                // endOnTick: false,
                // dateTimeLabelFormats: {
                //     day: '%d-%m-%y'
                // }
            },
            yAxis: [{
                lineWidth: 1,
                title: {
                    text: null
                }
            }, {
                lineWidth: 1,
                opposite: true,
                title: {
                    text: null
                }
            },
            ],
            plotOptions: {
                area:{
                    stacking: 'normal',
                },
                series:{
                    turboThreshold: 30000,
                    pointStart: startDate,
                    connectNulls: true,
                },

            }
        }

        let showOne = <HighchartsReact
                        highcharts = { Highcharts }
                        options = { lineOptions }
                        containerProps={{ style: { height: "100%" } }}

                        
                    />;
        if(!showLineChart)
        showOne = <HighchartsReact
                    highcharts = { Highcharts }
                    options = { mountainOptions }
                    containerProps={{ style: { height: "100%" } }}

                />;

        return (
            <div className="line-chart-container" style={{height:"100%"}}>
                <div className="line-chart-wrapper" style={{height:"100%"}}>
                    <Container style={{paddingLeft:"50px"}}>
                        <Row style={{alignItems:"center", paddingBottom:"4.0vh", justifyContent:"space-between", fontSize:"1.6vh"}}>
                            <Col xs={12} md={8} lg={6} className=" py-3 py-md-0"> <Row>
                                <Col xs={6} md={6} > <div onClick={this.handleClickLineChart} className={ showLineChart? "chart-link-active" : "chart-link"}>Line Chart View</div></Col>
                                <Col  xs={6} md={6}><div onClick={this.handleClickMountainChart} className={ !showLineChart? "chart-link-active" : "chart-link"} >Mountain Chart View</div></Col>
                            </Row></Col>
                            <Col xs={12} md={4}>
                                <Row style={{justifyContent:"flex-end"}}>
                                    <Col xs={6} md={12}>
                                    <select style={{float:"right"}} name="interval" className="chart-dropdown" value={ this.state.interval } onChange={ this.handleChange }>

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
                                    </Col>
                                </Row>
                            </Col> 
                        </Row>
                    </Container>
                    <div style={{height:"100%"}}>
                        { showOne}
                    </div>
                </div>

            </div>
        );
    }
}
