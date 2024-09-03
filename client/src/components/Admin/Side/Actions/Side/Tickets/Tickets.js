import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Redirect } from 'react-router-dom';
import Pagination from '../../../../../Pagination/Pagination';
import { _TICKET_LIST, getTickets, removeTicket } from '../../../../../UserFetcher/UserFetcher';
import jwt_decode from 'jwt-decode';
import styled from 'styled-components';
import {
    useTable,
    useSortBy
  } from 'react-table';

import './Tickets.css';

var selectedTICKET = {};
var PAGE_DATA = [];
var Table_Fetcher = 0;
var Tickets_Fetcher = 0;
var currentTickets = [];
const columns = [
    {
        Header: 'Tickets',
        columns: [
            {
                Header: 'From',
                accessor: 'owner',
            },
            {
                Header: 'Subject',
                accessor: 'subject',
            },
            {
                Header: 'Ticket Date',
                accessor: 'create_date',
            }
        ],
    },
]

class Tickets extends Component {
    state = {
        columnToSort: "",
        sortDirection: "desc"
    };
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            showTicketBox: false,
            allTickets: [], currentTickets: [], currentPage: null, totalPages: null,
            have_users_view: 0,
            have_bans_view: 0,
            have_logs_view: 0,
            have_tickets_view: 0,
            have_SPM_view: 0,
            have_admins_view: 0,
            have_rooms_view: 0,
            have_banners_view: 0,
            have_stats_view: 0
        }
        this.getUserDataByID = this.getUserDataByID.bind(this);
        this.closeTicketBox = this.closeTicketBox.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />

        const decoded = jwt_decode(token);

        this.setState({ 
            have_tickets_view: decoded.have_tickets_view
        })
        getTickets();

        this.setState({ allTickets: _TICKET_LIST });

        Tickets_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                getTickets();
                this.setState({allTickets: _TICKET_LIST})
                const { allTickets } = this.state;
                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
            
                const offset = (currentPage - 1) * pageLimit;
                currentTickets = allTickets.slice(offset, offset + pageLimit);
                this.setState({ currentPage, currentTickets, totalPages });
            }
        }, 3000)

        Table_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                this.setState({allTickets: _TICKET_LIST})
                const { allTickets } = this.state;
                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
            
                const offset = (currentPage - 1) * pageLimit;
                currentTickets = allTickets.slice(offset, offset + pageLimit);
                this.setState({ currentPage, currentTickets, totalPages });
            }
        }, 1000)
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(Table_Fetcher);
        clearInterval(Tickets_Fetcher);
    }

    closeTicketBox() {  
        this.setState({ showTicketBox: false, allTickets: _TICKET_LIST })
        selectedTICKET = {};
        const { allTickets } = this.state;
        const { currentPage, totalPages, pageLimit } = PAGE_DATA;

        const offset = (currentPage - 1) * pageLimit;
        currentTickets = allTickets.slice(offset, offset + pageLimit);
        this.setState({ currentPage, currentTickets, totalPages });
    }

    removeTicket() {
        removeTicket(selectedTICKET);
        this.closeTicketBox();
        getTickets();
        this.setState({ allTickets: _TICKET_LIST });
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
        const { allTickets } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        currentTickets = allTickets.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentTickets, totalPages });
    }

    render() {
        const dont_have_perm = (
            <div className="jumbotron">
              <div className="row">
                  <div className="low-perm">
                      <div>
                        <h2>You don't have premission</h2>
                      </div>
                  </div>
              </div>
            </div>
          );
  
          if(!this.state.have_tickets_view)
            return dont_have_perm;
        const show_ticket_popup = (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>ticket from {selectedTICKET.owner},</h2>
                    <button className="close" onClick={() => this.closeTicketBox()}>&times;</button>
                    <hr></hr>
                    <div className="content">
                        <h2>{selectedTICKET.subject}</h2>
                        <p>{selectedTICKET.message}</p>
                        <button className="btn-danger" onClick={() => { this.removeTicket() } }>Remove</button>
                    </div>
                </div>
                
            </div>
        );
        const empty_tickets = (
            <div className="jumbotron">
                <div className="row">
                    <div className="tickets-list">
                        <h3>Ticket list</h3>
                        <div>
                            <h4>Ticket list is empty</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allTickets, currentPage, totalPages } = this.state;
        const totalTickets = allTickets.length;
        if(allTickets.length === 0)
            return empty_tickets;
        
        
        const data = currentTickets;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron">
                <div className="row">
                    <MuiThemeProvider>
                        <div className="user-list">
                            <h3>Ticket list</h3>
                            <div className="mb-5">
                                <div className="row d-flex flex-row py-3">
                                    <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                        <div className="d-flex flex-row align-items-center">

                                        <h2 className={headerClass}>
                                            <strong className="text-secondary">{totalTickets}</strong> Tickets
                                        </h2>

                                        { currentPage && (
                                            <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                            Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                            </span>
                                        ) }

                                        </div>
                                        <div className="d-flex flex-row py-4 align-items-center">     
                                        <Pagination totalRecords={allTickets.length} pageLimit={14} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                        </div>
                                    </div>
                                    <Styles>
                                        <Table columns={columns} data={data}/>
                                    </Styles>
                                </div>
                            </div>
                            { selectedTICKET.id > 0 ? show_ticket_popup : null }
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default Tickets;

function ShowTicket(ticket_id) {
    const instance = new Tickets();
    var ticket = instance.getUserDataByID(_TICKET_LIST, ticket_id)[0];
    selectedTICKET = {
        id: ticket.id,
        owner: ticket.owner,
        subject: ticket.subject,
        message: ticket.message
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
          <tbody {...getTableBodyProps()} className="tickets-body">
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} onClick={() => ShowTicket(cell.row.original.id)}>{cell.render('Cell')}</td>
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
    );
}