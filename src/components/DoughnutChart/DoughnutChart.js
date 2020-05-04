import React, { Component } from 'react';
/* import { Doughnut } from 'react-chartjs-2'; */
import Highcharts from 'highcharts';
import  HighchartsReact  from 'highcharts-react-official';
import PropTypes from 'prop-types';

import './DoughnutChart.scss';
import { doughnutChart } from '../../service/extractData'
import { formatAmount } from '../../util/util'
import { COLORS } from '../../config/config'

export default class DoughnutChart extends Component {
    static propTypes = {
        data : PropTypes.object.isRequired
    }

    constructor(props){
        super(props);

    }

    componentDidMount(){
    }

    render(){
        const { data } = this.props;

        //console.log("DATA:" + JSON.stringify(data))
        const chartData = doughnutChart(data)
        //console.log("DATA:" + JSON.stringify(chartData))
        const options={
            colors: COLORS,
            chart: {
                events: { redraw:true},
                type: 'pie',
                margin: null,
                width: null,
                height: null,
                style: { 'font-family': 'Lato', 'font-size': '0.6771vw'},
                backgroundColor: "transparent"
            },
            credits: { enabled: false},
            title: {
                text: "<b>Total</b><br/><b>Investments</b>",
                verticalAlign: 'middle',
                style: { "font-size": "0.8rem"},
                y: 0
            },
            series: [ {turboThreshold: 30000,showInLegend: false, size: "70%", innerSize: '50%', data: chartData, name:""} ],
            tooltip: {
                enabled: true,
                valueDecimals: 2,
                valuePrefix: '$'
            },
            plotOptions:{
                pie:{
                    dataLabels:{
                        enabled: true,
                        formatter:function(){
                            return '<b style="color:'+ this.color+'">'+ this.point.name +'</b><br><b style="color:'+ this.color+'">$'+ formatAmount((this.point.y).toFixed(2),true)+' CAD</b>';
                        },
                        crop: "false",
                    },
                    
                }
            },
            responsive: {
                rules:[
                    {
                        condition: {
                            maxWidth: 360
                        },
                        chartOptions:{
                            plotOptions:{
                                pie:{
                                    dataLabels:{
                                        enabled: false,
                                    }
                                }
                            },
                            series: [ {turboThreshold: 30000, showInLegend:true , size: "100%", innerSize: '50%'} ],
                            legend: {
                                enabled: true,
                                //layout: 'horizontal',
                                align: 'center',
                                //alignColumn:false,
                                verticalAlign: 'bottom',
                                //labelFormatter: (obs) => {return obs} 
                            },
                            title: {
                                text: "<b>Total</b><br/><b>Investments</b>",
                                verticalAlign: 'middle',
                                style: { "font-size": "0.8rem"},
                                y: -50
                            },
                        }
                        
                     }
                ]
            }
        }
        return (
            <div style={{height:"100%"}}> 
                    <HighchartsReact
                        highcharts = { Highcharts }
                        options = { options }
                        containerProps={{ style: { height: "100%", } }}

                    />
            </div>
        );
    }


    getData(){
        return {
            datasets: [{
                data: [10, 20, 30],
                backgroundColor: Object.values(this.getLabelsAndColors())
            }],
            labels: Object.keys(this.getLabelsAndColors())
        };
    }

    getOptions(){
        return {
            responsive: true,
            maintainAspectRatio: true
        }
    }

    getLegend(){
        return {
            position: 'bottom'
        };
    }

    getLabelsAndColors() {
        return {
            'Red': '#FF6384',
            'Blue': '#36A2EB',
            'Yellow': '#FFCE56'
        }
    }
}
