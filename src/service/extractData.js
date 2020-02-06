// import { chart } from "highcharts";
// import { declareTypeAlias } from "@babel/types";
import { formatAmount } from '../util/util'


/**
 * Extract data from server responds for charts or tables
 */

export const doughnutChart = (data)=>{
    let chartData = [];
        if(JSON.stringify(data) !== '{}'){
            for(let i=0; i<data.user_balance.length; i++){
                chartData.push({
                    name: data.user_balance[i].investment_name,
                    y: data.user_balance[i].balance_cad/* _cad */
                });
            }
        }
    return chartData;
}

/** Convert the date format coming from the server */
const convertDateInLineChart = (dateStr)=>{
    // console.log("dateStr", dateStr)
    const date = dateStr.slice(0,2);
    const month = dateStr.slice(3,5);
    const year = dateStr.slice(6);
    return year+"/"+month+"/"+date;
}

const formatDate = (dateObj) =>{
    let year = dateObj.getFullYear()
    let month = dateObj.getMonth()
    let date = dateObj.getDate()

    return year+"/"+month+"/"+date;
}

/** Use for sorting */
const compare = (property)=>{
    return (obj1,obj2)=>{
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;
    }
}

export const lineChart = (data, interval)=>{

 //   console.log("linechart ",data)
    let chartDataLine = [];
    let chartDataMountain = []
    const startMilliseconds = new Date().setHours(0,0,0,0) - interval*24*60*60*1000;
    if (!data) return [];
    // console.log("startMilliseconds: ", (Date.now()));
    
        if(JSON.stringify(data) !== '{}'){
            let balanceHistory = data.balance_history;

            for(let i=0; i<balanceHistory.length; i++){
                let obj = {
                               
                    name: balanceHistory[i].investment_name,
                    data: []
                 };

                let accountHistory = balanceHistory[i].account_history
               // console.log("lastMillisecond: ",Date.parse(convertDateInLineChart(balanceHistory[i].account_history[0].date)));

               let tempMap = {}
               for(let j=0; j<accountHistory.length; j++){
                    
                    let dateMilliseconds = Date.parse(convertDateInLineChart(accountHistory[j].date));
                    // if(dateMilliseconds >= startMilliseconds){
                    //obj.data.push( {x:Date.parse(convertDateInLineChart(accountHistory[j].date)), y:accountHistory[j].account_balance_cad } )
                   
                   let date = new Date(accountHistory[j].date)
                    obj.data.push( {x: date.getTime() , y:accountHistory[j].account_balance_cad } )
                    tempMap[formatDate(date)] = {x: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(), y:accountHistory[j].account_balance_cad } 
                    // }
                }

               // console.log(balanceHistory[i].investment_name)
              //  console.log(tempMap)
                obj.data.sort(compare('x'));
                chartDataLine.push(obj);
                chartDataMountain.push({
                    name: balanceHistory[i].investment_name,
                    data: Object.values(tempMap)
                })
            }


        }
        //console.log("Line-chart-data: ", chartData)
        //console.log(chartDataMountain)
    return {"chartDataLine": chartDataLine, "chartDataMountain": chartDataMountain};
}

export const lineChartSingleSeries = (investment_name, data, interval)=>{

   // console.log("linechart ",data)
    let chartData = [];
    const startMilliseconds = new Date().setHours(0,0,0,0) - interval*24*60*60*1000;
    if (!data) return [];
    // console.log("startMilliseconds: ", (Date.now()));
    
        if(JSON.stringify(data) !== '{}'){
            let balanceHistory = data.balance_history
            console.log(data)
            
                let obj = {
                    
                   
                    name: investment_name,
                    data: []
                 };
                
               
                for(let j=0; j<balanceHistory.length; j++){
                    
                    let dateMilliseconds = Date.parse(convertDateInLineChart(balanceHistory[j].date));
                    // if(dateMilliseconds >= startMilliseconds){
                    //obj.data.push( {x:Date.parse(convertDateInLineChart(balanceHistory[j].date)), y:balanceHistory[j].account_balance/* _cad */} )
                    obj.data.push( {x:new Date(balanceHistory[j].date).getTime() , y:parseFloat(balanceHistory[j].account_balance)/* _cad */} )

                    // }
                }
                obj.data.sort(compare('x'));
                chartData.push(obj);
        
        }
        //console.log("Line-chart-data: ", chartData)
    return chartData;
}


export const formatUserHistoryData = (series_name, user_data) =>{

    console.log("formatUserHistoryData", series_name, user_data)

    let chartData = { name:series_name, data:[]};
    if (user_data.length == 0) return chartData;

    let user_stats = user_data.map(stat => {
    
       
       return {
                x:Date.parse(convertDateInLineChart(stat.date)),
                y:stat.count
        }; 
    });

    chartData['data'] = user_stats;
    console.log("chartData ", chartData);
    return [chartData];
}

export const formatRatesHistoryData = (data) => {

    console.log("NEW FORMATTED ",data);
    
    let currency_rate_histories = data;
    let chartData = [];

    chartData = currency_rate_histories.map( rate_history => {

        let obj = { name: rate_history.currency , data: []}
        obj['data'] = rate_history.rates.map( rate => {
            return {x: Date.parse(convertDateInLineChart(rate.date)) , y:parseFloat(rate.rate)};
        });

        return obj;
    });

    //console.log("formatRatesHistoryData chartData",chartData);

    return chartData;
}

export const transactionTable = (data, search)=>{
    console.log('trrr')
    console.log(data)
    if(JSON.stringify(data) !== '{}'){
        const serverData = data.transaction_history;
        // let tableData = [];
        // if(search !== ''){
        //     tableData = serverData.filter((one)=>{

        //         let amount = one.amount.toString().replace(/[^0-9.]+/g,'')
        //         let amount_cad = one.amount_cad.toString().replace(/[^0-9.]+/g,'')
        //         let search_amount = search.replace(/[^0-9.]+/g,'')
        //         // let amount_balance = amount_cad
        //         return (
        //             (new Date(one.time).toLocaleDateString().indexOf(search)) !== -1 ||
        //             (one.description.toLowerCase().indexOf(search.toLowerCase())) !== -1 ||
        //             (one.investment_name.toLowerCase().indexOf(search.toLowerCase())) !== -1 ||
        //             (amount.indexOf(search_amount) !== -1 )||
        //             (amount_cad.toLowerCase().indexOf(search_amount) !== -1 )
                

        //             // one.amount === +search ||
        //             // one.account_balance === +search
        //         )
        //     });
        //     return tableData;
        // }
        return serverData
    }
    return [];
}

export const getMinimumY = (chartData) => {

    console.log("chartData ". chartData)


    let y_values = [];
    chartData.forEach((series) =>{
        series.data.forEach( (data) => {

            console.log("data ",data)
            if(data.y!=0)
                y_values.push(data.y)
        });
    });



    console.log("y_values", Math.min(y_values));
    return Math.min.apply(null, y_values);
}
