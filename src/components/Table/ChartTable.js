import React, { Component} from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatAmount } from '../../util/util'
import {Row, Col, Container} from "react-bootstrap"

import PropTypes from 'prop-types';

class ChartTable extends Component {
    static propTypes = {
        data : PropTypes.object.isRequired
    }

    render(){
        const { data }= this.props;

        var CADSum = 0;
        if(JSON.stringify(data) !== '{}'){
            for(let i=0; i<data.user_balance.length; i++){
                CADSum += +(data.user_balance[i].balance_cad);
            }
        }

        const columns = [
            { accessor: 'investment_name',
              Footer: <span>{'Total in CAD'}</span>},
            { id: 'balance',
              accessor: (data)=> formatAmount((+data.balance).toFixed(2),true),
            },
            { id: 'balance_cad',
              accessor: (data) =>'$' + formatAmount((+data.balance_cad).toFixed(2),true),
              Footer: <span>{`$${formatAmount((CADSum).toFixed(2))}`}</span>}
        ]

        const columnsSmall = [
            { 
                // Cell: row => (
                // <span> {row.value} </span>
                // ),
              style: {textAlign:"left"},
              width: 110,
              Cell: row => (
                <Container><Row style={{height:"100%"}}><Col>
                    <div style={{whiteSpace:"normal", wordBreak:"normal"}}>
                        {row.value}
                     </div>
                </Col></Row></Container>
                
               // <span className="text-align-left"> {"asdasdasdasd " + row.value} </span>
            ),
              accessor: 'investment_name',
              Footer:  () => (
              <Container><Row style={{height:"100%"}}><Col>{'Total in CAD'}</Col> </Row> </Container>),
             
            },
            { id: 'balance',
              Cell: row => (
                    <Container fluid={true}>
                        <Row style={{height:"100%"}} style={{justifyContent:"flex-end"}}>
                            <Col><span>{row.value[0]}</span></Col>
                        </Row>
                        <Row style={{ justifyContent:"flex-end", fontSize:"smaller"}}> <Col>
                            <span style={{color:"gray"}} >{`$${row.value[1]}`}</span>
                        </Col></Row>
                    </Container>        
                ),
              style: {textAlign:"end"},
              accessor: (data) => [formatAmount(+data.balance), formatAmount((+data.balance_cad).toFixed(2),true) ],
              Footer: () => (
                <Container><Row style={{height:"100%"}}><Col>{`$${formatAmount((CADSum).toFixed(2))}`}</Col> </Row> </Container>)
              //width: 200,
            },
        ]

        if(JSON.stringify(data) === '{}')
            return <div className="Charttable-container" style={{height:"100%"}}></div> ;
        else  if(typeof(data.code) !== 'undefined')
            if( data.code === "Success" )
                return(
                    <div className="outer" style={{height:"100%"}}>
                    <div style={{height:"100%"}}>
                        <div className="Charttable-container d-none d-sm-block" style={{height:"100%"}}>
                            <ReactTable
                                className="-striped"
                                data={data.user_balance}
                                columns={columns}
                                pageSize={data.user_balance.length}
                                showPagination={false}
                                containerProps={{ style: { height: "100%", } }}
                            />
                        </div>
                        <div className="Charttable-container d-sm-none d-xs" style={{height:"100%"}}>
                            <ReactTable
                                className="-striped"
                                data={data.user_balance}
                                columns={columnsSmall}
                                pageSize={data.user_balance.length}
                                showPagination={false}
                                containerProps={{ style: { height: "100%", } }}
                            />
                        </div>
                    </div>
                    </div>
                )
    }
}
export default ChartTable;
