import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { logs } from '../../../UserFunctions/UserFunctions';
import Pagination from '../../../Pagination/Pagination';
import jwt_decode from 'jwt-decode';

class LogList extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            logs_list: [],
            update_logs_list_done: false,
            allLogs: [], currentLogs: [], currentPage: null, totalPages: null,
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

        this.onChange= this.onChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        
        const decoded = jwt_decode(token);

        this.setState({ 
            have_logs_view: decoded.have_logs_view
        })

        logs().then(res => {
            for(var i = 0; i < res.data.logs.length; i++) {
                const date_fixed = new Date(res.data.logs[i].login_date).toLocaleString();
                this.state.logs_list.push({
                    id: res.data.logs[i].id, 
                    userid: res.data.logs[i].userid,
                    login_ip: res.data.logs[i].login_ip,
                    login_date: date_fixed
                })

                if(i + 1 >= res.data.logs.length) {
                    if(this._isMounted) {
                        this.setState({ update_logs_list_done: true });
                        this.setState({ allLogs: this.state.logs_list });
                    }
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onPageChanged = data => {
        const { allLogs } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        const currentLogs = allLogs.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentLogs, totalPages });
    }

    onChange(e) {
        if (this._isMounted) {
            this.setState({ [e.target.name]: e.target.value });
        }
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
  
        if(!this.state.have_logs_view)
            return dont_have_perm;
        const empty_logs = (
            <div className="jumbotron">
                <div className="row">
                    <div className="logs-list">
                        <h3>Logs List</h3>
                        <div>
                            <h4>Logs is empty</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allLogs, currentLogs, currentPage, totalPages } = this.state;
        const totalLogs = allLogs.length;
        if(allLogs.length === 0)
            return empty_logs;

        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron mt-20">
                <div className="row mb-0-admin">
                    <div className="log-list">
                        <h3>Logs</h3>
                        <div className="mb-5">
                            <div className="row d-flex flex-row py-3 mb-0-admin">

                                <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                    <div className="d-flex flex-row align-items-center">

                                    <h2 className={headerClass}>
                                        <strong className="text-secondary">{totalLogs}</strong> Login Logs
                                    </h2>

                                    { currentPage && (
                                        <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                        </span>
                                    ) }

                                    </div>

                                    <div className="d-flex flex-row py-4 align-items-center">     
                                    <Pagination totalRecords={allLogs.length} pageLimit={18} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                    </div>
                                </div>
                                <table className="minimalistBlack">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User ID</th>
                                            <th>Login IP</th>
                                            <th>Login Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { currentLogs.map(log =>    
                                            <tr key={'LOG_' + log + '_' + log.id}> 
                                                <td>{ log.id }</td>
                                                <td>{ log.userid }</td>
                                                <td>{ log.login_ip }</td>
                                                <td>{ log.login_date }</td>
                                            </tr>
                                        ) }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LogList;