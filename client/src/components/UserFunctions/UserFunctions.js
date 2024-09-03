import axios from 'axios';

export const register = newUser => {
    return axios
    .post('users/register', {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        nickname: newUser.nickname,
        gender: newUser.gender,
        email: newUser.email,
        password: newUser.password,
        country: newUser.country,
        register_ip: newUser.register_ip,
        rank: newUser.rank,
        birthdate: newUser.birthdate,
        refferalid: newUser.refferalid,
        refferalby: newUser.refferalby,
        of_shares: newUser.of_shares
    })
    .then(res => {
        return res;
    })
}

export const login = user => {
    return axios
    .post('users/login', { 
        email: user.email,
        password: user.password,
        last_login_ip: user.last_login_ip
    })
    .then(res => {
        if(res.data.banned <= 0)
        {
            localStorage.setItem('usertoken', res.data.token);
            localStorage.setItem('usernickname', res.data.nickname);
            localStorage.setItem('useremail', res.data.email);
            return res.data;
        }
        else {
            localStorage.clear();
            return res.data;
        }
    })
    .catch(err => {
        console.log(err);
    });
}

export const users = () => {
    return axios
    .post('/users')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err);
    });
}

export const logs = () => {
    return axios
    .post('/logs')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err);
    });
}

export const bans = () => {
    return axios
    .post('/bans')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err);
    });
}

export const addban = newBan => {
    return axios
    .post('/addban', {
        userid: newBan.userid,
        days: newBan.days
    })
    .then(res => {
        alert(res.data.status);
    })
    .catch(err => {
        console.log(err);
    });
}

export const removeban = Banned => {
    return axios
    .post('/removeban', {
        userid: Banned.userid
    })
    .then(res => {
        alert(res.data.status);
    })
    .catch(err => {
        console.log(err);
    });
}

export const editprofile = newData => {
    var data = {
        id: newData.id,
        first_name: newData.first_name,
        last_name: newData.last_name,
        nickname: newData.nickname,
        password: newData.password,
        have_new_password: newData.have_new_password
    }
    return axios
    .post('visual/editprofile', data)
    .then(res => {
        if((res.data.status).indexOf('profile update successfully') === -1) {
            localStorage.clear();
            document.location.href="/";
        }
    })
    .catch(err => {
        console.log(err)
    })
}

export const spm_send_pv_message = newMsg => {
    var msg = {
        userid: newMsg.userid,
        sendby: newMsg.sendby,
        receiver: newMsg.receiver,
        subject: newMsg.subject,
        message: newMsg.message,
        seen: newMsg.seen
    }
    return axios
    .post('spm/sendmsg', msg)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const sta_send_pv_message = newMsg => {
    var msg = newMsg
    return axios
    .post('spm/stapm', msg)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const send_ticket = newTicket => {
    var msg = {
        owner: newTicket.owner,
        subject: newTicket.subject,
        message: newTicket.message,
    }
    return axios
    .post('tickets/sendticket', msg)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const fetch_tickets = () => {
    return axios
    .post('/admin/actions/tickets/fetchtickets')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const remove_ticket = removeTicket => {
    var ticket = {
        id: removeTicket.id
    }
    return axios
    .post('tickets/removeticket', ticket)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const fetch_messages = m_ID => {
    var msg = {
        userid: m_ID
    }
    return axios
    .post('messages/fetchmessages', msg)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const update_message_seen = msg_id => {
    var msg = {
        id: msg_id
    }
    return axios
    .post('messages/updatemsg', msg)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const get_banners = () => {
    return axios
    .post('/banners')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const edit_banner = (banner) => {
    return axios
    .post('/editbanner', banner)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const inc_views = () => {
    return axios
    .post('/view')
    .then(res => {
    })
    .catch(err => {
        console.log(err)
    })
}

export const get_views = () => {
    return axios
    .post('/getview')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const add_admin = newAdmin => {
    return axios
    .post('/users/addadmin', newAdmin)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const remove_admin = admin => {
    return axios
    .post('/users/removeadmin', admin)
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const edit_admin = () => {
    return axios
    .post('/users/editadmin')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const get_admins = () => {
    console.log('test')
    return axios
    .post('/users/getadmins')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err);
    })
}

export const check_ban = ID => {
    const detail = {
        id: ID
    }
    return axios
    .post('/checkban', detail)
    .then(res => {
        return res;
    })
    .catch(err => {
    })
}

export const get_rooms = () => {
    return axios
    .post('/getrooms')
    .then(res => {
        return res;
    })
    .catch(err => {
        console.log(err)
    })
}

export const edit_avatar = data => {
    return axios({
        method: "put",
        url: `/avatar/upload`,
        data,
        config: { headers: { "Content-Type": "multipart/form-data" } }
    }).then(res => {
        return res;
    });
}