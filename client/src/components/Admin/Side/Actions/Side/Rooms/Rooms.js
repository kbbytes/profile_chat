import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { get_rooms } from '../../../../../UserFunctions/UserFunctions';
import Pagination from '../../../../../Pagination/Pagination';
import jwt_decode from 'jwt-decode';

var Table_Fetcher = 0;
var PAGE_DATA = [];
var currentRooms = [];
class Rooms extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            rooms_list: [],
            update_rooms_list_done: false,
            allRooms: [], currentRooms: [], currentPage: null, totalPages: null,
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
            have_rooms_view: decoded.have_rooms_view
        })

        get_rooms().then(res => {
            for(var i = 0; i < res.data.Rooms.length; i++) {
                const date_fixed = new Date(res.data.Rooms[i].create_date).toLocaleString();
                this.state.rooms_list.push({
                    id: res.data.Rooms[i].id, 
                    name: res.data.Rooms[i].name,
                    owner: res.data.Rooms[i].owner,
                    owner_id: res.data.Rooms[i].owner_id,
                    members: res.data.Rooms[i].members,
                    create_date: date_fixed
                })

                if(i + 1 >= res.data.Rooms.length) {
                    if(this._isMounted) {
                        this.setState({ update_rooms_list_done: true });
                        this.setState({ allRooms: this.state.rooms_list });
                    }
                }
            }
        });
        Table_Fetcher = setInterval(() => {
            if(!token)
                return <Redirect to="/" />
            else
            {
                this.setState({allRooms: [], rooms_list: []})
                get_rooms().then(res => {
                    for(var i = 0; i < res.data.Rooms.length; i++) {
                        const date_fixed = new Date(res.data.Rooms[i].create_date).toLocaleString();
                        this.state.rooms_list.push({
                            id: res.data.Rooms[i].id, 
                            name: res.data.Rooms[i].name,
                            owner: res.data.Rooms[i].owner,
                            owner_id: res.data.Rooms[i].owner_id,
                            members: res.data.Rooms[i].members,
                            create_date: date_fixed
                        })
        
                        if(i + 1 >= res.data.Rooms.length) {
                            if(this._isMounted) {
                                this.setState({ update_rooms_list_done: true });
                                this.setState({ allRooms: this.state.rooms_list });
                                const { allRooms } = this.state;
                                const { currentPage, totalPages, pageLimit } = PAGE_DATA;
                            
                                const offset = (currentPage - 1) * pageLimit;
                                currentRooms = allRooms.slice(offset, offset + pageLimit);
                                this.setState({ currentPage, currentRooms, totalPages });
                            }
                        }
                    }
                });
            }
        }, 10000)
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(Table_Fetcher);
    }

    onPageChanged = data => {
        PAGE_DATA = data;
        const { allRooms } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
    
        const offset = (currentPage - 1) * pageLimit;
        currentRooms = allRooms.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentRooms, totalPages });
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
  
        if(!this.state.have_rooms_view)
            return dont_have_perm;
        const empty_rooms = (
            <div className="jumbotron">
                <div className="row">
                    <div className="rooms-list">
                        <h3>Rooms List</h3>
                        <div>
                            <h4>Rooms is empty</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        const { allRooms, currentPage, totalPages } = this.state;
        const totalRooms = allRooms.length;
        if(allRooms.length === 0)
            return empty_rooms;

        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();
        return (
            <div className="jumbotron">
                <div className="row">
                    <div className="room-list">
                        <h3>Rooms</h3>
                        <div className="mb-5">
                            <div className="row d-flex flex-row py-3">

                                <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                    <div className="d-flex flex-row align-items-center">

                                    <h2 className={headerClass}>
                                        <strong className="text-secondary">{totalRooms}</strong> Rooms
                                    </h2>

                                    { currentPage && (
                                        <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                                        </span>
                                    ) }

                                    </div>

                                    <div className="d-flex flex-row py-4 align-items-center">     
                                    <Pagination totalRecords={allRooms.length} pageLimit={18} pageNeighbours={0} onPageChanged={this.onPageChanged} />
                                    </div>
                                </div>
                                <table className="minimalistBlack">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>Owner ID</th>
                                            <th>Members</th>
                                            <th>Create Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { currentRooms.map(room =>    
                                            <tr key={'ROOM_' + room + '_' + room.id}> 
                                                <td>{ room.id }</td>
                                                <td>{ room.name }</td>
                                                <td>{ room.owner }</td>
                                                <td>{ room.owner_id }</td>
                                                <td>{ room.members }</td>
                                                <td>{ room.create_date }</td>
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

export default Rooms;