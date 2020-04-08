import React, { Component} from 'react';
import './Table.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { formatAmount } from '../../util/util'
import {Row, Col, Container} from "react-bootstrap"

import PropTypes from 'prop-types';
// import { ReactTableDefaults } from "react-table";
// var columnSettings = {
//   ...ReactTableDefaults.column,
//   minWidth: 20
// };

class PaymentsTable extends Component {
    static propTypes = {
        data : PropTypes.object.isRequired
    }

    

    render(){
        const { data, onDeposit, onWithdrawal, currency, isCrypto}= this.props;
        const username = localStorage.getItem("username")

    
        const columns = [
            { 
                Header: 'Investment' ,
                accessor: 'investment_name',
                id:'investment'
            
            },
            { 
                Header:'Balance',
                accessor: (data)=> formatAmount(+data.balance),
                id:'balance'
            },
            { 
                Header:'Deposit/ Withdraw',
                Cell: row => (
                    <div>
                        <button className="btn btn-info payments-btn light-grey" onClick={() => onDeposit(row.investment_id, username, row.original.isCrypto, row.original.currency)}>Deposit</button>
                        <button className="btn btn-info payments-btn" onClick={() => onWithdrawal(row.investment_id, username, row.original.isCrypto, row.original.currency)}>Withdraw</button>
                    </div>
                )

            }            
        ]

    
        return(
            
            <div>
            <div className="reacttable-container1" style={{height:"100%"}}>
                <div className="transaction-container" style={{height:"100%"}}>
                    <div className="table-title">{ "Investments"}</div>
            
                    <ReactTable
                        noDataText={'No investments found'}
                        className="-striped"
                        data={data}
                        columns={columns}
                        showPagination={false}
                        resizable={true}
                        minRows={0}
                        // column={columnSettings}
                    />
                </div>
            </div>
            </div>
            
         )
    }
}
export default PaymentsTable;
