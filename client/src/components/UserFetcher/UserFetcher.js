import React from 'react';
import { Redirect } from 'react-router-dom';

import { fetch_messages, fetch_tickets, remove_ticket, edit_banner } from '../UserFunctions/UserFunctions';

export var _MSG_LIST = [];
export var _UNREAD_MSG_COUNT = 0;
export var _TICKET_LIST = [];
export const getMessages = (m_uid) => {
    const token = localStorage.usertoken;
    if(!token)
        return <Redirect to="/" />
    else
    {
        fetch_messages(m_uid).then(res => {
            if(res) {
                _UNREAD_MSG_COUNT = res.data.unreads;
                _MSG_LIST.length = 0;
                res.data.messages.map(message => {
                    return _MSG_LIST.push(message);
                })
            }
        });
    }
}

export const getTickets = () => {
    const token = localStorage.usertoken;
    if(!token)
        return <Redirect to="/" />
    else
    {
        fetch_tickets().then(res => {
            if(res) {
                _TICKET_LIST = res.data.tickets;
            }
        });
    }
}

export const removeTicket = (ticket_id) => {
    remove_ticket(ticket_id).then(res => {
        if(res) {
            alert(res.data.status);
        }
    });
}

export const editBanner = (editBanner) => {
    edit_banner(editBanner).then(res => {
        if(res) {
            alert(res.data.status);
        }
    });
}
