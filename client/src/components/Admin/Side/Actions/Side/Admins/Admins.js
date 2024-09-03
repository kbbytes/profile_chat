import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Redirect } from 'react-router-dom';
import { get_admins, remove_admin, add_admin } from '../../../../../UserFunctions/UserFunctions';
import Pagination from '../../../../../Pagination/Pagination';
import jwt_decode from 'jwt-decode';

import styled from 'styled-components';
import {
    useTable,
    useSortBy
  } from 'react-table';
import './Admins.css';

var Table_Fetcher = 0;
var Edit_Fetcher = 0;
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

var selectedADMIN = {};
var editADMIN_SELECT = {};
var PAGE_DATA = [];
var currentAdmins = [];
var addNewAdmin = false;
var finale_data = {};
class Admins extends Component {
    state = {
        columnToSort: "",
        sortDirection: "desc"
    };
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            admins_list : [],
            update_admins_list_done: false,
            allAdmins: [], currentAdmins: [], currentPage: null, totalPages: null,
            new_admin_rank: 'Admin',
            new_admin_id: 0,
            edit_admin_rank: 'Admin',
            edit_admin_id: 0,
            edit_admin_nickname: '',
            users_view_perm: 'false',
            bans_view_perm: 'false',
            logs_view_perm: 'false',
            tickets_view_perm: 'false',
            SPM_view_perm: 'false',
            admins_view_perm: 'false',
            rooms_view_perm: 'false',
            banners_view_perm: 'false',
            stats_view_perm: 'false',
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
        this.getUserDataByID = this.getUserDataByID.bind(this);
        this.closeAdminBox = this.closeAdminBox.bind(this);
        this.removeAdmin = this.removeAdmin.bind(this);
        this.addAdmin = this.addAdmin.bind(this);
        this.InsertAdmin = this.InsertAdmin.bind(this);
        this.UpdateAdmin = this.UpdateAdmin.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        
        const decoded = jwt_decode(token);

        this.setState({ 
            have_admins_view: decoded.have_admins_view
        })

        get_admins().then(res => {
            if(res) {
                for(var i = 0; i < res.data.admins.length; i++) {
                    const login_date_fixed = new Date(res.data.admins[i].last_login).toLocaleString();
                    const register_date_fixed = new Date(res.data.admins[i].created).toLocaleString();
                    var Rank_Name = '';
                    var Rank_Num = res.data.admins[i].rank;
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
                    this.state.admins_list.push({
                        id: res.data.admins[i].userid, 
                        first_name: res.data.admins[i].first_name,
                        last_name: res.data.admins[i].last_name,
                        nickname: res.data.admins[i].nickname,
                        email: res.data.admins[i].email,
                        rank: Rank_Name,
                        country: res.data.admins[i].country,
                        gender: res.data.admins[i].gender,
                        created: register_date_fixed,
                        last_login: login_date_fixed,
                        last_login_ip: res.data.admins[i].last_login_ip,
                        refferalid: res.data.admins[i].refferalid,
                        refferalby: res.data.admins[i].refferalby,
                        users_view_perm: !!res.data.admins[i].users_view,
                        bans_view_perm: !!res.data.admins[i].bans_view,
                        logs_view_perm: !!res.data.admins[i].logs_view,
                        tickets_view_perm: !!res.data.admins[i].tickets_view,
                        SPM_view_perm: !!res.data.admins[i].SPM_view,
                        admins_view_perm: !!res.data.admins[i].admins_view,
                        rooms_view_perm: !!res.data.admins[i].rooms_view,
                        banners_view_perm: !!res.data.admins[i].banners_view,
                        stats_view_perm: !!res.data.admins[i].stats_view
                    })

                    if(i + 1 >= res.data.admins.length) {
                        if(this._isMounted)
                        {
                            this.setState({ update_admins_list_done: true });
                            this.setState({ allAdmins: this.state.admins_list });
                        }
                    }
                }
            }
        });

        Table_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                const { allAdmins } = this.state;
                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
            
                const offset = (currentPage - 1) * pageLimit;
                currentAdmins = allAdmins.slice(offset, offset + pageLimit);
                this.setState({ currentPage, currentAdmins, totalPages });
            }
        }, 1000)
        Edit_Fetcher = setInterval(() => { 
            if(editADMIN_SELECT.nickname !== undefined && editADMIN_SELECT.nickname !== null && editADMIN_SELECT.nickname !== '' && editADMIN_SELECT.nickname !== ' ')
            {
                this.setState({ 
                    edit_admin_rank: editADMIN_SELECT.rank,
                    edit_admin_id: editADMIN_SELECT.id,
                    edit_admin_nickname: editADMIN_SELECT.nickname,
                    users_view_perm: editADMIN_SELECT.users_view_perm,
                    bans_view_perm: editADMIN_SELECT.bans_view_perm,
                    logs_view_perm: editADMIN_SELECT.logs_view_perm,
                    tickets_view_perm: editADMIN_SELECT.tickets_view_perm,
                    SPM_view_perm: editADMIN_SELECT.SPM_view_perm,
                    admins_view_perm: editADMIN_SELECT.admins_view_perm,
                    rooms_view_perm: editADMIN_SELECT.rooms_view_perm,
                    banners_view_perm: editADMIN_SELECT.banners_view_perm,
                    stats_view_perm: editADMIN_SELECT.stats_view_perm
                });
                editADMIN_SELECT = {};
            }
        }, 2000)   
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(Table_Fetcher);
        clearInterval(Edit_Fetcher);
    }

    onChange(e) {
        if (this._isMounted) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    closeAdminBox() {  
        selectedADMIN = {};
        addNewAdmin = false;
        const { allAdmins } = this.state;
        const { currentPage, totalPages, pageLimit } = PAGE_DATA;

        const offset = (currentPage - 1) * pageLimit;
        currentAdmins = allAdmins.slice(offset, offset + pageLimit);
        this.setState({ currentPage, currentAdmins, totalPages });
    }

    UpdateAdmin() {
        var fixed_users_view, fixed_bans_view, fixed_logs_view, fixed_tickets_view, fixed_SPM_view, 
            fixed_admins_view, fixed_rooms_view, fixed_banners_view, fixed_stats_view;
        var fixed_new_admin_rank = 0;

        if(this.state.users_view_perm === 'true')
            fixed_users_view = 1;
        else
            fixed_users_view = 0;

        if(this.state.bans_view_perm === 'true')
            fixed_bans_view = 1;
        else
            fixed_bans_view = 0;

        if(this.state.logs_view_perm === 'true')
            fixed_logs_view = 1;
        else
            fixed_logs_view = 0;

        if(this.state.tickets_view_perm === 'true')
            fixed_tickets_view = 1;
        else
            fixed_tickets_view = 0;
        
        if(this.state.SPM_view_perm === 'true')
            fixed_SPM_view = 1;
        else
            fixed_SPM_view = 0;

        if(this.state.admins_view_perm === 'true')
            fixed_admins_view = 1;
        else
            fixed_admins_view = 0;

        if(this.state.rooms_view_perm === 'true')
            fixed_rooms_view = 1;
        else
            fixed_rooms_view = 0;

        if(this.state.banners_view_perm === 'true')
            fixed_banners_view = 1;
        else
            fixed_banners_view = 0;

        if(this.state.stats_view_perm === 'true')
            fixed_stats_view = 1;
        else
            fixed_stats_view = 0;

        if(this.state.edit_admin_rank === 'Admin')
            fixed_new_admin_rank = 2;
        if(this.state.edit_admin_rank === 'Head Admin')
            fixed_new_admin_rank = 3;
        if(this.state.edit_admin_rank === 'Owner')
            fixed_new_admin_rank = 4;

        finale_data = {
            _id: this.state.edit_admin_id,
            _rank: fixed_new_admin_rank,
            _users_view: fixed_users_view,
            _bans_view: fixed_bans_view,
            _logs_view: fixed_logs_view,
            _tickets_view: fixed_tickets_view,
            _SPM_view: fixed_SPM_view,
            _admins_view: fixed_admins_view,
            _rooms_view: fixed_rooms_view,
            _banners_view: fixed_banners_view,
            _stats_view: fixed_stats_view,
            is_new: false
        }
        add_admin(finale_data).then(res => {
            if(res) {
                alert(res.data.Status);
                selectedADMIN = {};
                this.setState({admins_list: [], allAdmins: [], edit_admin_id: 0, edit_admin_rank: 'Admin', edit_admin_nickname: '' })
                this.closeAdminBox();
                get_admins().then(res => {
                    if(res) {
                        for(var i = 0; i < res.data.admins.length; i++) {
                            const login_date_fixed = new Date(res.data.admins[i].last_login).toLocaleString();
                            const register_date_fixed = new Date(res.data.admins[i].created).toLocaleString();
                            var Rank_Name = '';
                            var Rank_Num = res.data.admins[i].rank;
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
                            this.state.admins_list.push({
                                id: res.data.admins[i].userid, 
                                first_name: res.data.admins[i].first_name,
                                last_name: res.data.admins[i].last_name,
                                nickname: res.data.admins[i].nickname,
                                email: res.data.admins[i].email,
                                rank: Rank_Name,
                                country: res.data.admins[i].country,
                                gender: res.data.admins[i].gender,
                                created: register_date_fixed,
                                last_login: login_date_fixed,
                                last_login_ip: res.data.admins[i].last_login_ip,
                                refferalid: res.data.admins[i].refferalid,
                                refferalby: res.data.admins[i].refferalby,
                                users_view_perm: !!res.data.admins[i].users_view,
                                bans_view_perm: !!res.data.admins[i].bans_view,
                                logs_view_perm: !!res.data.admins[i].logs_view,
                                tickets_view_perm: !!res.data.admins[i].tickets_view,
                                SPM_view_perm: !!res.data.admins[i].SPM_view,
                                admins_view_perm: !!res.data.admins[i].admins_view,
                                rooms_view_perm: !!res.data.admins[i].rooms_view,
                                banners_view_perm: !!res.data.admins[i].banners_view,
                                stats_view_perm: !!res.data.admins[i].stats_view
                            })
            
                            if(i + 1 >= res.data.admins.length) {
                                if(this._isMounted)
                                {
                                    this.setState({ update_admins_list_done: true });
                                    this.setState({ allAdmins: this.state.admins_list });
                                }
                            }
                        }
                    }     
                });
            }
        })
    }

    InsertAdmin() {
        var fixed_users_view, fixed_bans_view, fixed_logs_view, fixed_tickets_view, fixed_SPM_view, 
            fixed_admins_view, fixed_rooms_view, fixed_banners_view, fixed_stats_view;
        var fixed_new_admin_rank = 0;

        if(this.state.users_view_perm === 'true')
            fixed_users_view = 1;
        else
            fixed_users_view = 0;

        if(this.state.bans_view_perm === 'true')
            fixed_bans_view = 1;
        else
            fixed_bans_view = 0;

        if(this.state.logs_view_perm === 'true')
            fixed_logs_view = 1;
        else
            fixed_logs_view = 0;

        if(this.state.tickets_view_perm === 'true')
            fixed_tickets_view = 1;
        else
            fixed_tickets_view = 0;
        
        if(this.state.SPM_view_perm === 'true')
            fixed_SPM_view = 1;
        else
            fixed_SPM_view = 0;

        if(this.state.admins_view_perm === 'true')
            fixed_admins_view = 1;
        else
            fixed_admins_view = 0;

        if(this.state.rooms_view_perm === 'true')
            fixed_rooms_view = 1;
        else
            fixed_rooms_view = 0;

        if(this.state.banners_view_perm === 'true')
            fixed_banners_view = 1;
        else
            fixed_banners_view = 0;

        if(this.state.stats_view_perm === 'true')
            fixed_stats_view = 1;
        else
            fixed_stats_view = 0;

        if(this.state.new_admin_rank === 'Admin')
            fixed_new_admin_rank = 2;
        if(this.state.new_admin_rank === 'Head Admin')
            fixed_new_admin_rank = 3;
        if(this.state.new_admin_rank === 'Owner')
            fixed_new_admin_rank = 4;

        var m_id = 0;
        if(selectedADMIN.id > 0)
            m_id = selectedADMIN.id;
        else
            m_id = this.state.new_admin_id;
        finale_data = {
            _id: m_id,
            _rank: fixed_new_admin_rank,
            _users_view: fixed_users_view,
            _bans_view: fixed_bans_view,
            _logs_view: fixed_logs_view,
            _tickets_view: fixed_tickets_view,
            _SPM_view: fixed_SPM_view,
            _admins_view: fixed_admins_view,
            _rooms_view: fixed_rooms_view,
            _banners_view: fixed_banners_view,
            _stats_view: fixed_stats_view,
            is_new: true
        }
        add_admin(finale_data).then(res => {
            if(res) {
                alert(res.data.Status);
                selectedADMIN = {};
                this.setState({admins_list: [], allAdmins: [] })
                this.closeAdminBox();
                get_admins().then(res => {
                    if(res) {
                        for(var i = 0; i < res.data.admins.length; i++) {
                            const login_date_fixed = new Date(res.data.admins[i].last_login).toLocaleString();
                            const register_date_fixed = new Date(res.data.admins[i].created).toLocaleString();
                            var Rank_Name = '';
                            var Rank_Num = res.data.admins[i].rank;
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
                            this.state.admins_list.push({
                                id: res.data.admins[i].userid, 
                                first_name: res.data.admins[i].first_name,
                                last_name: res.data.admins[i].last_name,
                                nickname: res.data.admins[i].nickname,
                                email: res.data.admins[i].email,
                                rank: Rank_Name,
                                country: res.data.admins[i].country,
                                gender: res.data.admins[i].gender,
                                created: register_date_fixed,
                                last_login: login_date_fixed,
                                last_login_ip: res.data.admins[i].last_login_ip,
                                refferalid: res.data.admins[i].refferalid,
                                refferalby: res.data.admins[i].refferalby,
                                users_view_perm: !!res.data.admins[i].users_view,
                                bans_view_perm: !!res.data.admins[i].bans_view,
                                logs_view_perm: !!res.data.admins[i].logs_view,
                                tickets_view_perm: !!res.data.admins[i].tickets_view,
                                SPM_view_perm: !!res.data.admins[i].SPM_view,
                                admins_view_perm: !!res.data.admins[i].admins_view,
                                rooms_view_perm: !!res.data.admins[i].rooms_view,
                                banners_view_perm: !!res.data.admins[i].banners_view,
                                stats_view_perm: !!res.data.admins[i].stats_view
                            })
            
                            if(i + 1 >= res.data.admins.length) {
                                if(this._isMounted)
                                {
                                    this.setState({ update_admins_list_done: true });
                                    this.setState({ allAdmins: this.state.admins_list });
                                }
                            }
                        }
                    }     
                });
            }
        })
    }

    addAdmin() {
        selectedADMIN = {};
        addNewAdmin = true;
    }

    removeAdmin() {
        remove_admin(selectedADMIN).then(res => {
            if(res) {
                alert(res.data.Status);
                this.setState({admins_list: [], allAdmins: [] })
                this.closeAdminBox();
                get_admins().then(res => {
                    if(res) {
                        for(var i = 0; i < res.data.admins.length; i++) {
                            const login_date_fixed = new Date(res.data.admins[i].last_login).toLocaleString();
                            const register_date_fixed = new Date(res.data.admins[i].created).toLocaleString();
                            var Rank_Name = '';
                            var Rank_Num = res.data.admins[i].rank;
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
                            this.state.admins_list.push({
                                id: res.data.admins[i].userid, 
                                first_name: res.data.admins[i].first_name,
                                last_name: res.data.admins[i].last_name,
                                nickname: res.data.admins[i].nickname,
                                email: res.data.admins[i].email,
                                rank: Rank_Name,
                                country: res.data.admins[i].country,
                                gender: res.data.admins[i].gender,
                                created: register_date_fixed,
                                last_login: login_date_fixed,
                                last_login_ip: res.data.admins[i].last_login_ip,
                                refferalid: res.data.admins[i].refferalid,
                                refferalby: res.data.admins[i].refferalby,
                                users_view_perm: !!res.data.admins[i].users_view,
                                bans_view_perm: !!res.data.admins[i].bans_view,
                                logs_view_perm: !!res.data.admins[i].logs_view,
                                tickets_view_perm: !!res.data.admins[i].tickets_view,
                                SPM_view_perm: !!res.data.admins[i].SPM_view,
                                admins_view_perm: !!res.data.admins[i].admins_view,
                                rooms_view_perm: !!res.data.admins[i].rooms_view,
                                banners_view_perm: !!res.data.admins[i].banners_view,
                                stats_view_perm: !!res.data.admins[i].stats_view
                            })
            
                            if(i + 1 >= res.data.admins.length) {
                                if(this._isMounted)
                                {
                                    this.setState({ update_admins_list_done: true });
                                    this.setState({ allAdmins: this.state.admins_list });
                                }
                            }
                        }
                    } 
                });
            }
        });
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
        const { allAdmins } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        const currentAdmins = allAdmins.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentAdmins, totalPages });
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
  
          if(!this.state.have_admins_view)
            return dont_have_perm;
        const show_add_new_admin_popup = (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>Add new admin</h2>
                    <button className="close" onClick={() => this.closeAdminBox()}>&times;</button>
                    <hr></hr>
                    <div className="content">
                        <div className="new-admin-settings">
                            <div className="form-group">
                                <label htmlFor="new_admin_id">User ID</label>
                                <input type="number" 
                                className="form-control"
                                name="new_admin_id"
                                placeholder="Enter User's ID from users list"
                                value={this.state.new_admin_id}
                                onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                            <label htmlFor="new_admin_rank">Rank</label>     
                                <select 
                                id="new_admin_rank"
                                name="new_admin_rank"
                                className="form-control"
                                value={this.state.new_admin_rank}
                                onChange={this.onChange}
                                >
                                <option value="Admin">Admin</option>
                                <option value="Head Admin">Head Admin</option>
                                <option value="Owner">Owner</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Users view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="users_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.users_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="users_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.users_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Bans view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="bans_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.bans_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="bans_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.bans_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Logs view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="logs_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.logs_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="logs_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.logs_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Tickets view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="tickets_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.tickets_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="tickets_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.tickets_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>SPM view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="SPM_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.SPM_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="SPM_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.SPM_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Admins view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="admins_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.admins_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="admins_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.admins_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Rooms view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="rooms_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.rooms_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="rooms_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.rooms_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Banners view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="banners_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.banners_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="banners_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.banners_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Stats view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="stats_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.stats_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="stats_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.stats_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                        </div>
                        <button className="btn-success" onClick={() => { this.InsertAdmin() } }>Add</button>
                    </div>
                </div>
            </div>
        );
        const show_admin_edit_poup = (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>Editing {this.state.edit_admin_nickname}'s</h2>
                    <button className="close" onClick={() => this.closeAdminBox()}>&times;</button>
                    <hr></hr>
                    <div className="content">
                    <div className="new-admin-settings">
                            <div className="form-group">
                            <label htmlFor="edit_admin_rank">Rank</label>     
                                <select 
                                id="edit_admin_rank"
                                name="edit_admin_rank"
                                className="form-control"
                                value={this.state.edit_admin_rank}
                                onChange={this.onChange}
                                >
                                <option value="Admin">Admin</option>
                                <option value="Head Admin">Head Admin</option>
                                <option value="Owner">Owner</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Users view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="users_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.users_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="users_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.users_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Bans view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="bans_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.bans_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="bans_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.bans_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Logs view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="logs_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.logs_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="logs_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.logs_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Tickets view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="tickets_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.tickets_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="tickets_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.tickets_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>SPM view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="SPM_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.SPM_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="SPM_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.SPM_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Admins view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="admins_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.admins_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="admins_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.admins_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Rooms view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="rooms_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.rooms_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="rooms_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.rooms_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Banners view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="banners_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.banners_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="banners_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.banners_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                            <div className="form-group">
                                <fieldset data-role="controlgroup">
                                    <legend>Stats view permission:</legend>
                                    <label htmlFor="true">Enable</label>
                                    <input 
                                        type="radio" 
                                        name="stats_view_perm" 
                                        id="true" 
                                        value='true' 
                                        checked={this.state.stats_view_perm === 'true'} 
                                        onChange={this.onChange}/>
                                        <label htmlFor="false">Disable</label>
                                        <input type="radio" 
                                        name="stats_view_perm" 
                                        id="false" 
                                        value='false' 
                                        checked={this.state.stats_view_perm === 'false'}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                        </div>
                        <button className="btn-danger" onClick={() => { this.removeAdmin() } }>Remove</button>
                        <button className="btn-success" onClick={() => { this.UpdateAdmin() } }>Update</button>
                    </div>
                </div>
            </div>
        );
        const empty_admins = (
            <div className="jumbotron">
                <div className="row">
                    <div className="admins-list">
                        <h3>Admin list</h3>
                        <div>
                            <h4>Admin list is empty</h4>
                        </div>
                        <div className="add-admin">
                            <button className="btn btn-success" onClick={() => this.addAdmin()}>Add Admin</button>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allAdmins, currentPage, totalPages } = this.state;
        const totalAdmins = allAdmins.length;
        if(allAdmins.length === 0)
            return empty_admins;
        
        const data = this.state.currentAdmins;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron jumbotron-admin">
              <MuiThemeProvider>
                <div className="admin-list">
                  <h3>Admin list</h3>
                    <h2 className={headerClass}>
                        <strong className="text-secondary">{totalAdmins}</strong> Admins
                    </h2>
  
                    { currentPage && (
                        <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                        </span>
                    ) }
  
                   
                    <Pagination totalRecords={allAdmins.length} pageLimit={14} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                    <div className="admin-content-section">
                        <Styles>               
                            <Table columns={columns} data={data}/>
                        </Styles>
                    </div>
                     { addNewAdmin > 0 ? show_add_new_admin_popup : null }
                    { selectedADMIN.id > 0 ? show_admin_edit_poup : null }
                </div>
              </MuiThemeProvider>
            </div>
        )
    }
}

export default Admins;

function ShowAdminEdit(admin) {
    selectedADMIN = {
        country: admin.country,
        created: admin.created,
        email: admin.email,
        first_name: admin.first_name,
        gender: admin.gender,
        id: admin.id,
        last_login: admin.last_login,
        last_login_ip: admin.last_login_ip,
        last_name: admin.last_name,
        nickname: admin.nickname,
        rank: admin.rank,
        refferalby: admin.refferalby,
        refferalid: admin.refferalid,
        SPM_view_perm: admin.SPM_view_perm.toLocaleString(),
        admins_view_perm: admin.admins_view_perm.toLocaleString(),
        banners_view_perm: admin.banners_view_perm.toLocaleString(),
        bans_view_perm: admin.bans_view_perm.toLocaleString(),
        logs_view_perm: admin.logs_view_perm.toLocaleString(),
        rooms_view_perm: admin.rooms_view_perm.toLocaleString(),
        stats_view_perm: admin.stats_view_perm.toLocaleString(),
        tickets_view_perm: admin.tickets_view_perm.toLocaleString(),
        users_view_perm: admin.users_view_perm.toLocaleString()
    }
    editADMIN_SELECT = selectedADMIN;
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
        <tbody {...getTableBodyProps()} className="admins-body">
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps()} onClick={() => ShowAdminEdit(cell.row.original)}>{cell.render('Cell')}</td>
                    })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </>
  )
}