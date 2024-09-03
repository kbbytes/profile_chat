import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';

import UserList from './Users/UserList';
import Bans from './Bans/Bans';
import LogList from './LogList/LogList';
import Actions from './Actions/Actions';
import Stats from './Stats/Stats';

import { getTickets } from '../../UserFetcher/UserFetcher';
import './Sidebar.css';

class Sidebar extends Component {
  _isMounted = false;
  constructor(props) {
    super(props)
    this.state = {
        page_active: 0
    }
    this.toggle = this.toggle.bind(this)
    this.myColor = this.myColor.bind(this)
  }
  toggle(n){
      if (this.state.page_active === n) {
        this.setState({page_active : this.state.page_active})
      } else {
        this.setState({page_active : n})
      }
    }
    
  myColor(s) {
  if (this.state.page_active === s) {
      return "blue";
  }
  return "";
  }

  componentDidMount() {
    this._isMounted = false;
    const token = localStorage.usertoken;
    if(!token)
      return <Redirect to="/" />
    else
    {
      getTickets();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  UNSAFE_componentWillUpdate() {
      if((window.location.pathname).indexOf('/admin/users') !== -1 && this.state.page_active !== 0) 
          this.toggle(0)
  }
  render() {
    return (
      <>
        <Route path="/admin/users" component={UserList} />
        <Route path="/admin/bans" component={Bans} />
        <Route path="/admin/logs" component={LogList}/>
        <Route path="/admin/actions" component={Actions}/>
        <Route path="/admin/stats" component={Stats}/>
        <nav className="sidebar-menus">
          <ul className="sidebar-nav">
            <li><Link to="/admin/users" style={{color: this.myColor(0)}} onClick={() => {this.toggle(0)}}>Users</Link></li>
            <li><Link to="/admin/bans" style={{color: this.myColor(1)}} onClick={() => {this.toggle(1)}}>Bans</Link></li>
            <li><Link to="/admin/logs" style={{color: this.myColor(2)}} onClick={() => {this.toggle(2)}}>Logs</Link></li>
            <li><Link to="/admin/actions/tickets" style={{color: this.myColor(3)}} onClick={() => {this.toggle(3)}}>Actions</Link></li>
            <li><Link to="/admin/stats" style={{color: this.myColor(4)}} onClick={() => {this.toggle(4)}}>Stats</Link></li>
          </ul>
        </nav>
      </>
    )
  }
};
export default Sidebar;
