import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import ActionsSide from './Side/ActionsSide';

import './Actions.css';

class Actions extends Component {
    componentDidMount() {
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
    }

    render() {
        return (
        <>
            <ActionsSide></ActionsSide>
            <Redirect to="/admin/actions/tickets" />
        </>
        )
    }
}

export default Actions;