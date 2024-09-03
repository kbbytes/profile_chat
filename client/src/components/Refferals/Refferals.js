import React, { Component } from 'react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import jwt_decode from 'jwt-decode';
import { users } from '../UserFunctions/UserFunctions';
import Pagination from '../Pagination/Pagination';
import styled from 'styled-components'
import {
    useTable,
    useSortBy
  } from 'react-table'

import './Refferals.css';

const columns = [
    {
        Header: 'Refferals',
        columns: [
            {
                Header: 'Nickname',
                accessor: 'nickname',
            },
            {
                Header: 'Gender',
                accessor: 'gender',
            },
            {
                Header: 'Country',
                accessor: 'country',
            },
            {
                Header: 'Refferal ID',
                accessor: 'refferalid'
            }
        ]
    }
]

class Refferals extends Component {
    state = {
        columnToSort: "",
        sortDirection: "desc"
    };
    constructor() {
        super()
        this.state = {
            users_list : [],
            update_users_list_done: false,
            allUsers: [], currentUsers: [],
            refferals_list : [],
            update_refferals_list_done: false,
            allRefferals: [], currentRefferals: [], currentPage: null, totalPages: null,
            refferalsOfRefferal: [], allrefferalsOfRefferal: []
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken;
        if(token)
        {
            const decoded = jwt_decode(token);
            const date_fixed_created = new Date(decoded.created).toLocaleString();
            const date_fixed_last_login = new Date(decoded.last_login).toLocaleString();
            this.setState({ 
                id: decoded.id,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                nickname: decoded.nickname,
                email: decoded.email,
                country: decoded.country,
                created: date_fixed_created,
                last_login: date_fixed_last_login,
                rank: decoded.rank,
                refferalid: decoded.refferalid,
                refferalby: decoded.refferalby,
                of_shares: decoded.of_shares,
                gender: decoded.gender
            });

            users().then(res => {
                for(var i = 0; i < res.data.users.length; i++) {
                    
                    this.state.users_list.push({
                        nickname: res.data.users[i].nickname,
                        country: res.data.users[i].country,
                        gender: res.data.users[i].gender,
                        refferalid: res.data.users[i].refferalid,
                        refferalby: res.data.users[i].refferalby
                    })
    
                    if(i + 1 >= res.data.users.length) {
                        this.setState({ update_users_list_done: true });
                        this.setState({ allUsers: this.state.users_list });
                        
                        for(var f = 0; f < this.state.users_list.length; f++) {
                            if(this.state.users_list[f].refferalby === decoded.refferalid)
                            {
                                this.state.refferals_list.push({
                                    nickname: this.state.users_list[f].nickname,
                                    country: this.state.users_list[f].country,
                                    gender: this.state.users_list[f].gender,
                                    refferalid: this.state.users_list[f].refferalid,
                                    refferalby: this.state.users_list[f].refferalby
                                })
                            }
                            if(f + 1 >= this.state.users_list.length) {
                                this.setState({ update_refferals_list_done: true });
                                this.setState({ allRefferals: this.state.refferals_list });
                                
                            }
                        }
                    }
                }
            });
        }
    }

    onPageChanged = data => {
        const { allRefferals } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        const currentRefferals = allRefferals.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentRefferals, totalPages });
    }

    render() {
        const empty_refferals = (
            <div className="container">
                <div className="row">
                    <div className="refferals-list">
                        <h3>Refferals</h3>
                        <div>
                            <h4>There is no invited friend with your refferal link</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allRefferals, currentPage, totalPages } = this.state;
        const totalRefferals = allRefferals.length;
        if(allRefferals.length === 0)
            return empty_refferals;
        
        
        const data = this.state.currentRefferals;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="container">
                <div className="row">
                    <MuiThemeProvider>
                        <div className="user-list">
                            <h3>REFFERALS</h3>
                            <div className="container mb-5">
                                <div className="row d-flex flex-row py-3">
                                    <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                        <div className="d-flex flex-row align-items-center">

                                        <h2 className={headerClass}>
                                            <strong className="text-secondary">{totalRefferals}</strong> Refferals
                                        </h2>

                                        { currentPage && (
                                            <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                            Number <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                            </span>
                                        ) }

                                        </div>
                                        <div className="d-flex flex-row py-4 align-items-center">     
                                        <Pagination totalRecords={allRefferals.length} pageLimit={1} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                        </div>
                                    </div>
                                    <Styles>
                                        <Table columns={columns} data={data}/>
                                    </Styles>
                                </div>
                            </div>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        )
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

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()} className="minimalistBlack">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (    
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </>
  )
}

export default Refferals;