import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import ProfileSide from './ProfileSide/ProfileSide';
import jwt_decode from 'jwt-decode';
import { getMessages } from '../UserFetcher/UserFetcher';
import './Profile.css';

class Profile extends Component {
    
    componentDidMount() {
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        else
        {
            const decoded = jwt_decode(token);
            getMessages(decoded.id);
        }
    }

    render() {
        if(window.location.pathname === '/profile')
            return (<Redirect to="/profile/visual" />)
        return (
        <>
        <div className="bg-profile">
            <ProfileSide></ProfileSide>
            <Redirect to="/profile/visual" />
        </div>
        </>
        )
    }
}

export default Profile;