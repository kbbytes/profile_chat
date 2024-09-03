import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Redirect } from 'react-router-dom';
import { users } from '../../../UserFunctions/UserFunctions';
import Pagination from '../../../Pagination/Pagination';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';

import {
    useTable,
    useSortBy
  } from 'react-table';

const columns = [
    {
        Header: 'Name',
        columns: [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
            Header: 'First Name',
            accessor: 'first_name',
            },
            {
            Header: 'Last Name',
            accessor: 'last_name',
            },
        ],
    },
    {
        Header: 'Info',
        columns: [
            {
                Header: 'Nickname',
                accessor: 'nickname',
            },
            {
                Header: 'Email',
                accessor: 'email',
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
                Header: 'Rank',
                accessor: 'rank',
            },
            {
                Header: 'Last login',
                accessor: 'last_login',
            },
            {
                Header: 'Register Date',
                accessor: 'created',
            },
            {
              Header: 'Last Login IP',
              accessor: 'last_login_ip',
            },
            {
              Header: 'Refferal By',
              accessor: 'refferalby'
            }
        ],
    },
]


class UserList extends Component {
    state = {
        columnToSort: "",
        sortDirection: "desc"
    };
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
          users_list : [],
          update_users_list_done: false,
          allUsers: [], currentUsers: [], currentPage: null, totalPages: null,
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
    }
    componentDidMount() {
      this._isMounted = true;
      const token = localStorage.usertoken;
      if(!token)
        return <Redirect to="/" />

      const decoded = jwt_decode(token);

      this.setState({ 
        have_users_view: decoded.have_users_view
      })
      users().then(res => {
        if(decoded.rank >= 2)
        {
          if(res){
            for(var i = 0; i < res.data.users.length; i++) {
              const login_date_fixed = new Date(res.data.users[i].last_login).toLocaleString();
              const register_date_fixed = new Date(res.data.users[i].created).toLocaleString();
              var Rank_Name = '';
              var Rank_Num = res.data.users[i].rank;
              if(Rank_Num === 1)
                  Rank_Name = 'Member';
              else if(Rank_Num === 2)
                  Rank_Name = 'Admin';
              else if(Rank_Num === 3)
                  Rank_Name = 'Head Admin';
              else if(Rank_Num === 4)
                  Rank_Name = 'Owner';
              else
                  Rank_Name = 'Guest';
              this.state.users_list.push({
                  id: res.data.users[i].userid, 
                  first_name: res.data.users[i].first_name,
                  last_name: res.data.users[i].last_name,
                  nickname: res.data.users[i].nickname,
                  email: res.data.users[i].email,
                  rank: Rank_Name,
                  country: res.data.users[i].country,
                  gender: res.data.users[i].gender,
                  created: register_date_fixed,
                  last_login: login_date_fixed,
                  last_login_ip: res.data.users[i].last_login_ip,
                  refferalid: res.data.users[i].refferalid,
                  refferalby: res.data.users[i].refferalby
              })
  
              if(i + 1 >= res.data.users.length) {
                  if(this._isMounted)
                  {
                    this.setState({ update_users_list_done: true });
                    this.setState({ allUsers: this.state.users_list });
                    localStorage.setItem('users_list', JSON.stringify(this.state.allUsers));
                  }
              }
            }
          }
        }
      });
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    onPageChanged = data => {
        const { allUsers } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        const currentUsers = allUsers.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentUsers, totalPages });
    }

    render() {
        const empty_users = (
            <div className="jumbotron jumbotron-admin">
                <div className="row">
                    <div className="users-list">
                        <h3>Users list</h3>
                        <div>
                            <h4>Users list is empty</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const dont_have_perm = (
          <div className="jumbotron jumbotron-admin">
            <div className="row">
                <div className="low-perm">
                    <div>
                      <h2>You don't have premission</h2>
                    </div>
                </div>
            </div>
          </div>
        );

        if(!this.state.have_users_view)
          return dont_have_perm;
        const { allUsers, currentPage, totalPages } = this.state;
        const totalUsers = allUsers.length;
        if(allUsers.length === 0)
            return empty_users;
        
        
        const data = this.state.currentUsers;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
          <div className="jumbotron jumbotron-admin">
            <MuiThemeProvider>
              <div className="user-list">
                <h3>User list</h3>
                  <h2 className={headerClass}>
                      <strong className="text-secondary">{totalUsers}</strong> Users
                  </h2>

                  { currentPage && (
                      <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                      Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                      </span>
                  ) }

                 
                <Pagination totalRecords={allUsers.length} pageLimit={14} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                <div className="admin-content-section">
                  <Styles>               
                      <Table columns={columns} data={data}/>
                  </Styles>
                </div>
              </div>
            </MuiThemeProvider>
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

  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()} className="minimalistBlack">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' ▼'
                        : ' ▲'
                      : ''}
                  </span>
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

export default UserList;