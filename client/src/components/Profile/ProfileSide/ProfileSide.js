import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import { getMessages, _UNREAD_MSG_COUNT } from '../../UserFetcher/UserFetcher';

import VisualProfile from './VisualProfile/VisualProfile';
import Messages from './Messages/Messages';
import Tickets from './Tickets/Tickets';

import './ProfileSide.css';
let unread_messages = _UNREAD_MSG_COUNT;
let get_unreads = 0;
class ProfileSide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_active: 0,
            unreads_msg: 0
        }
        this.toggle = this.toggle.bind(this);
        this.myColor = this.myColor.bind(this);
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

    UNSAFE_componentWillMount() {
        if((window.location.pathname).indexOf('/profile/messages') !== -1 && this.state.page_active !== 0) 
            this.toggle(0)
    }

    componentDidMount() {
        unread_messages = _UNREAD_MSG_COUNT;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        else
        {
            const decoded = jwt_decode(token);
        
            get_unreads = setInterval(() => {
                getMessages(decoded.id);
                unread_messages = _UNREAD_MSG_COUNT;
                this.setState({unreads_msg: unread_messages});
            }, 3000)
        }
    }

    componentWillUnmount() {
        clearInterval(get_unreads);
    }
    
    render() {
        const have_unread_message = (
            <span className="unreads"><p>{this.state.unreads_msg}</p></span>
        );

        const dont_have_unread_message = (
            <span className="not-unreads"><p>{this.state.unreads_msg}</p></span>
        );
        
        return (
        <>
            <div className="actionsside-menus">
                <ul className="actionsside-nav">
                    <li><Link to="/profile/visual" style={{color: this.myColor(0)}} onClick={() => {this.toggle(0)}}>Profile</Link></li>
                    <li><Link to="/profile/messages" style={{color: this.myColor(1)}} onClick={() => {this.toggle(1)}}>Messages{this.state.unreads_msg ? have_unread_message : dont_have_unread_message}</Link></li>
                    <li><Link to="/profile/tickets" style={{color: this.myColor(2)}} onClick={() => {this.toggle(2)}}>Tickets</Link></li>
                    
                </ul>
            </div>
            <Route path="/profile/visual" component={VisualProfile} />
            <Route path="/profile/messages" component={Messages} />
            <Route path="/profile/tickets" component={Tickets} />
        </>
        )
    }
};
export default ProfileSide;
