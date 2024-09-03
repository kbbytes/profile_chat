import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Pagination from '../../../Pagination/Pagination';
import jwt_decode from 'jwt-decode';
import styled from 'styled-components';
import {
    useTable,
    useSortBy
  } from 'react-table';

import { _MSG_LIST, getMessages } from '../../../UserFetcher/UserFetcher';
import { update_message_seen } from '../../../UserFunctions/UserFunctions';

import './Messages.css';

var Messages_Fetcher = 0;
var Table_Fetcher = 0;
var currentMsg = [];
var PAGE_DATA = [];
var selectedMSG = {};
const columns = [
    {
        Header: 'Messages',
        columns: [
            {
                Header: 'From',
                accessor: 'from',
            },
            {
                Header: 'Subject',
                accessor: 'subject',
            },
            {
                Header: 'Recieve Date',
                accessor: 'write_date',
            }
        ],
    },
]

class Messages extends Component {
    state = {
        columnToSort: "",
        sortDirection: "desc"
    };
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            showMsgBox: false,
            allMsg: [], currentPage: null, totalPages: null
        }
        this.getUserDataByID = this.getUserDataByID.bind(this);
        this.closeMsgBox = this.closeMsgBox.bind(this);
    }

    closeMsgBox() {  
        if(selectedMSG.seen === 0) {
            update_message_seen(selectedMSG.id).then(res => {
            });
        }
        this.setState({allMSG: _MSG_LIST})
        selectedMSG = {};
        const { allMsg } = this.state;
        const { currentPage, totalPages, pageLimit } = PAGE_DATA;
    
        const offset = (currentPage - 1) * pageLimit;
        currentMsg = allMsg.slice(offset, offset + pageLimit);
        this.setState({ currentPage, totalPages });
    }

    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        else
        {
            const decoded = jwt_decode(token);
            getMessages(decoded.id);
            this.setState({allMsg: _MSG_LIST})
        }
        Messages_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                const decoded = jwt_decode(token);
                getMessages(decoded.id);
                this.setState({allMsg: _MSG_LIST})
                const { allMsg } = this.state;
                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
            
                const offset = (currentPage - 1) * pageLimit;
                currentMsg = allMsg.slice(offset, offset + pageLimit);
                this.setState({ currentPage, totalPages });
            }
        }, 6000)

        Table_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                this.setState({allMsg: _MSG_LIST})
                const { allMsg } = this.state;
                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
            
                const offset = (currentPage - 1) * pageLimit;
                currentMsg = allMsg.slice(offset, offset + pageLimit);
                this.setState({ currentPage, totalPages });
            }
        }, 1000)
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(Messages_Fetcher);
        clearInterval(Table_Fetcher);
    }
    
    getUserDataByID(array, value) {
        var msgs = array;
        var result = '';
        result = msgs.map(msg => {
            if(msg.id === parseInt(value))
                return msg;
            return null;
        })
        return result.filter(x => !!x);
    }

    onPageChanged = data => {
        PAGE_DATA = data;
        const { allMsg } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        currentMsg = allMsg.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, totalPages });
    }

    render() {
        const show_message_popup = (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>message from {selectedMSG.from},</h2>
                    <button className="close" onClick={() => this.closeMsgBox()}>&times;</button>
                    <hr></hr>
                    <div className="content">
                        <h2>{selectedMSG.subject}</h2>
                        <p>{selectedMSG.message}</p>
                    </div>
                </div>
            </div>
        );
        const empty_msg = (
            <div className="jumbotron">
                <div className="mx-auto">
                    <div className="messages-list">
                        <h3>Messages</h3>
                        <div>
                            <h4>Messages list is empty</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allMsg, currentPage, totalPages } = this.state;
        const totalMsg = allMsg.length;

        if(allMsg.length === 0)
            return empty_msg;
        
        
        const data = currentMsg;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron">
                <div className="mx-auto">
                <MuiThemeProvider>
                        <h3>Messages list</h3>
                            <div className="row d-flex flex-row py-3">
                                <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                    <div className="d-flex flex-row align-items-center">

                                    <h2 className={headerClass}>
                                        <strong className="text-secondary">{totalMsg}</strong> Messages
                                    </h2>

                                    { currentPage && (
                                        <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                        </span>
                                    ) }

                                    </div>
                                    <div className="d-flex flex-row py-4 align-items-center">     
                                    <Pagination totalRecords={allMsg.length} pageLimit={12} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                    </div>
                                </div>
                                <Styles>
                                    <Table columns={columns} data={data}/>
                                </Styles>
                            </div>
                        { selectedMSG.id > 0 ? show_message_popup : null }
                </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default Messages;

function ShowMessage(msg_id) {
    const instance = new Messages();
    var msg = instance.getUserDataByID(_MSG_LIST, msg_id)[0];
    
    selectedMSG = {
        id: msg.id,
        from: msg.from,
        subject: msg.subject,
        message: msg.message,
        seen: msg.seen
    }
}

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
        columns,
        data,
        },
        useSortBy
    )

    return (
        <table {...getTableProps()} className="minimalistBlack">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="messages-body">
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} className={!cell.row.original.seen ? "bold-msg" : 'normal-msg'} onClick={() => ShowMessage(cell.row.original.id)}>{cell.render('Cell')}</td>
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
    );
}