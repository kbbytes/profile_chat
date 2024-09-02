const express = require('express');
const private_messages = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser')
const Private_Message = require('../models/Private_Message');
const User = require('../models/User');

private_messages.use(cors());
process.env.SECRET_KEY = 'secret';

private_messages.post('/sendmsg', (req, res) => {
    const today = Date.now();
    const msgData = {
        userid: req.body.userid,
        sendby: req.body.sendby,
        receiver: req.body.receiver,
        subject: req.body.subject,
        message: req.body.message,
        write_date: today,
        seen: false
    }
    
    Private_Message.findOne({
        where: {
            userid: req.body.userid
        }
    })
    .then(msg => {
        Private_Message.create(msgData)
        .then(user => {
            res.json({ status: 'Msg received!' });
        })
        .catch(err => {
            res.send('error: ' + err);
        });
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

private_messages.post('/stapm', (req, res) => {
    var data = req.body;
    var filter_users = {};
    if(data.sta_age !== 'All') {
        filter_users = {age: data.sta_age}
    }

    if(data.sta_gender !== 'All') {
        filter_users = {age: filter_users.age, gender: data.sta_gender}
    }
    if(data.sta_country !== 'All') {
        filter_users = {age: filter_users.age, gender: filter_users.gender, country: data.sta_country}
    }
    filter_users = JSON.parse(JSON.stringify(filter_users));
    
    User.findAll({
        where: filter_users
    })
    .then(users => {
        users.map(user => {
            const today = Date.now();
            const msg = {
                userid: user.id,
                sendby: req.body.sendby,
                receiver: user.nickname,
                subject: req.body.sta_subject,
                message: req.body.sta_message,
                write_date: today,
                seen: false
            }
            Private_Message.create(msg)
            .then(respond => {
            })
            .catch(err => {
                console.log(err)
            })
        })
        res.send({ Status: 'Message sended!'});
    })
});

  
module.exports = private_messages