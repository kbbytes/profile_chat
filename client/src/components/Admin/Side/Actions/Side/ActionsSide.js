import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';

import Tickets from './Tickets/Tickets';
import SPM from './SPM/SPM';
import Admins from './Admins/Admins';
import Rooms from './Rooms/Rooms';
import Banners from './Banners/Banners';

import './ActionsSide.css';

class ActionsSide extends Component {
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
        return "red";
    }
    return "";
    }
    
    UNSAFE_componentWillUpdate() {
        if((window.location.pathname).indexOf('/admin/actions/tickets') !== -1 && this.state.page_active !== 0) 
            this.toggle(0)
    }

    componentDidMount() {
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
    }

    render() {
        return (
        <>
            <div className="actionsside-menus">
                <ul className="actionsside-nav">
                    <li><Link to="/admin/actions/tickets" style={{color: this.myColor(0)}} onClick={() => {this.toggle(0)}}>Tickets</Link></li>
                    <li><Link to="/admin/actions/spm" style={{color: this.myColor(1)}} onClick={() => {this.toggle(1)}}>SPM</Link></li>
                    <li><Link to="/admin/actions/admins" style={{color: this.myColor(2)}} onClick={() => {this.toggle(2)}}>Admins</Link></li>
                    <li><Link to="/admin/actions/rooms" style={{color: this.myColor(3)}} onClick={() => {this.toggle(3)}}>Rooms</Link></li>
                    <li><Link to="/admin/actions/banners" style={{color: this.myColor(4)}} onClick={() => {this.toggle(4)}}>Banners</Link></li>
                </ul>
            </div>
            <Route path="/admin/actions/tickets" component={Tickets} />
            <Route path="/admin/actions/spm" component={SPM} />
            <Route path="/admin/actions/admins" component={Admins}/>
            <Route path="/admin/actions/rooms" component={Rooms}/>
            <Route path="/admin/actions/banners" component={Banners}/>
            
        </>
        )
    }
};
export default ActionsSide;
