import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { get_views } from '../../../UserFunctions/UserFunctions';
import jwt_decode from 'jwt-decode';

import './Stats.css';
var stats_data_today = {};
var stats_data_yesterday = {};
var stats_data_total = {};
class Stats extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            stats_data: [],
            stats_data_today: {},
            stats_data_yesterday: {},
            stats_data_total: {},
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
            have_stats_view: decoded.have_stats_view
        })
        
        get_views().then(res => {
            if(this._isMounted)
            {
                this.setState({ stats_data: res.data })
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
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
  
        if(!this.state.have_stats_view)
            return dont_have_perm;

        this.state.stats_data.map(stats => {
            if(stats.name === 'today_views')
                return stats_data_today = stats;
            if(stats.name === 'yesterday_views')
                return stats_data_yesterday = stats;
            if(stats.name === 'total_views')
                return stats_data_total = stats;
            return null;
            
        })
        return (
            <div className="jumbotron stat-style">
                <div className="row">
                    <div className="charts-list">
                        <h3>Stats</h3>
                    </div>
                    <div className="mb-5">
                        <div className="row d-flex flex-row py-3">
                            <div className="w-100 px-4 py-2 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                <div className="d-flex flex-row align-items-center">
                                    <section className="counts">
                                        <ul>
                                            <li>
                                                <div className="today-counts">
                                                    <p>Today Visits</p><span>{ stats_data_today.count }</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="yesterday-counts">
                                                    <p>Yesterday Visits</p><span>{ stats_data_yesterday.count }</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="total-counts">
                                                    <p>Total Visits</p><span>{ stats_data_total.count }</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stats;