import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Sidebar from './Side/Sidebar';

import './Admin.css';

class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users_list : [],
            update_users_list_done: false
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
    }

    render() {
        return (
        <>
            <Sidebar></Sidebar>
            <Redirect to="/admin/users" />
        </>
        )
    }
}

export default Admin;