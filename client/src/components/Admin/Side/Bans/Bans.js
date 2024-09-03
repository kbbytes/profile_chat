import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { bans, addban, removeban } from '../../../UserFunctions/UserFunctions';
import jwt_decode from 'jwt-decode';
import Pagination from '../../../Pagination/Pagination';

import './Bans.css';
class BansList extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            userid: 0,
            days: 0,
            bans_list : [],
            update_bans_list_done: false,
            allBans: [], currentBans: [], currentPage: null, totalPages: null,
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
        this.onSubmit_ban = this.onSubmit_ban.bind(this);
        this.onSubmit_unban = this.onSubmit_unban.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        
        const decoded = jwt_decode(token);

        this.setState({ 
            have_bans_view: decoded.have_bans_view
        })
        bans().then(res => {
            if(res)
            {
                for(var i = 0; i < res.data.bans.length; i++) {
                    const ban_date_fixed = new Date(res.data.bans[i].ban_date).toLocaleString();
                    const expire_date_fixed = new Date(res.data.bans[i].expire_date).toLocaleString();
                    this.state.bans_list.push({
                        id: res.data.bans[i].id, 
                        userid: res.data.bans[i].userid,
                        ban_date: ban_date_fixed,
                        expire_date: expire_date_fixed
                    })

                    if(i + 1 >= res.data.bans.length) {
                        if (this._isMounted) {
                            this.setState({ update_bans_list_done: true });
                            this.setState({ allBans: this.state.bans_list });
                        }
                    }
                }
            }
        });
    }

    onPageChanged = data => {
        const { allBans } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        const currentBans = allBans.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentBans, totalPages });
    }

    onChange(e) {
        if (this._isMounted) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    onSubmit_unban(e) {
        e.preventDefault();

        const unban = {
            userid: this.state.userid
        }
        removeban(unban).then(res => {
            this.props.history.push(`/admin/bans`);
            if (this._isMounted) {
                this.setState({ bans_list : [] })
                bans().then(res => {
                    for(var i = 0; i < res.data.bans.length; i++) {
                        const ban_date_fixed = new Date(res.data.bans[i].ban_date).toLocaleString();
                        const expire_date_fixed = new Date(res.data.bans[i].expire_date).toLocaleString();  
                        this.state.bans_list.push({
                            id: res.data.bans[i].id, 
                            userid: res.data.bans[i].userid,
                            ban_date: ban_date_fixed,
                            expire_date: expire_date_fixed
                        })
        
                        if(i + 1 >= res.data.bans.length) {
                            if (this._isMounted) {
                                this.setState({ update_bans_list_done: true })
                            }
                        }
                    }
                });
            }
        });
    }

    onSubmit_ban(e) {
        e.preventDefault();

        const ban = {
            userid: this.state.userid,
            days: this.state.days
        }
        addban(ban).then(res => {
            this.props.history.push(`/admin/bans`);
            if (this._isMounted) {
                this.setState({ bans_list : [] })
                bans().then(res => {
                    for(var i = 0; i < res.data.bans.length; i++) {
                        const ban_date_fixed = new Date(res.data.bans[i].ban_date).toLocaleString();
                        const expire_date_fixed = new Date(res.data.bans[i].expire_date).toLocaleString();  
                        this.state.bans_list.push({
                            id: res.data.bans[i].id, 
                            userid: res.data.bans[i].userid,
                            ban_date: ban_date_fixed,
                            expire_date: expire_date_fixed
                        })
        
                        if(i + 1 >= res.data.bans.length) {
                            if (this._isMounted) {
                                this.setState({ update_bans_list_done: true })
                            }
                        }
                    }
                });
            }
        });
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
  
        if(!this.state.have_bans_view)
            return dont_have_perm;
        const empty_bans = (
            <div className="jumbotron">
                <div className="row">
                    <div className="bans-list">
                        <h3>Bans list</h3>
                        <div>
                            <h4>Ban list is empty</h4>
                        </div>
                    </div>
                    <section className="action-forms">
                        <div className="new-ban">
                            <form noValidate onSubmit={this.onSubmit_ban}>
                                <h1 className="h3 mb-3 font-weight-normal">New Ban</h1>
                                <div className="form-group">
                                    <label htmlFor="userid">User ID</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="userid"
                                    placeholder="Enter User's ID from users list"
                                    value={this.state.userid}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="days">Days</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="days"
                                    placeholder="Enter days to user get ban"
                                    value={this.state.days}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <button 
                                type="submit" disabled={ (!this.state.userid 
                                    || !this.state.days) }
                                className="btn btn-lg btn-primary btn-block">
                                    Ban
                                </button>
                            </form>
                        </div>
                        <div className="delete-ban">
                            <form noValidate onSubmit={this.onSubmit_unban}>
                                <h1 className="h3 mb-3 font-weight-normal">Unban user</h1>
                                <div className="form-group">
                                    <label htmlFor="userid">User ID</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="userid"
                                    placeholder="Enter User's ID from users list"
                                    value={this.state.userid}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <button 
                                type="submit" disabled={ (!this.state.userid) }
                                className="btn btn-lg btn-primary btn-block">
                                    Unban
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        );
        const { allBans, currentBans, currentPage, totalPages } = this.state;
        const totalBans = allBans.length;
        if(totalBans <= 0)
            return empty_bans;

        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron mt-20">
                <div className="row mb-0-admin">
                    <div className="bans-list">
                        <h3>Bans list</h3>
                        <div className="mb-5">
                            <div className="row d-flex flex-row py-3 mb-0-admin">

                                <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                    <div className="d-flex flex-row align-items-center">

                                    <h2 className={headerClass}>
                                        <strong className="text-secondary">{totalBans}</strong> Bans
                                    </h2>

                                    { currentPage && (
                                        <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                        </span>
                                    ) }

                                    </div>

                                    <div className="d-flex flex-row py-4 align-items-center">     
                                    <Pagination totalRecords={allBans.length} pageLimit={18} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                    </div>
                                </div>
                                <table className="minimalistBlack">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User ID</th>
                                            <th>Ban Date</th>
                                            <th>Expire Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { currentBans.map(ban => 
                                        
                                        <tr key={'BAN_' + ban + '_' + ban.id}>
                                            
                                            <td>{ ban.id }</td>
                                            <td>{ ban.userid }</td>
                                            <td>{ ban.ban_date }</td>
                                            <td>{ ban.expire_date }</td>
                                        </tr>
                                    ) }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <section className="action-forms">
                        <div className="new-ban">
                            <form noValidate onSubmit={this.onSubmit_ban}>
                                <h1 className="h3 mb-3 font-weight-normal">New Ban</h1>
                                <div className="form-group">
                                    <label htmlFor="userid">User ID</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="userid"
                                    placeholder="Enter User's ID from users list"
                                    value={this.state.userid}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="days">Days</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="days"
                                    placeholder="Enter days to user get ban"
                                    value={this.state.days}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <button 
                                type="submit" disabled={ (!this.state.userid 
                                    || !this.state.days) }
                                className="btn btn-lg btn-primary btn-block">
                                    Ban
                                </button>
                            </form>
                        </div>
                        <div className="delete-ban">
                            <form noValidate onSubmit={this.onSubmit_unban}>
                                <h1 className="h3 mb-3 font-weight-normal">Unban user</h1>
                                <div className="form-group">
                                    <label htmlFor="userid">User ID</label>
                                    <input type="number" 
                                    className="form-control"
                                    name="userid"
                                    placeholder="Enter User's ID from users list"
                                    value={this.state.userid}
                                    onChange={this.onChange}
                                    />
                                </div>
                                <button 
                                type="submit" disabled={ (!this.state.userid) }
                                className="btn btn-lg btn-primary btn-block">
                                    Unban
                                </button>
                            </form>
                        </div>
                    </section>
                </div>

            </div>
        )
    }
}

export default BansList;