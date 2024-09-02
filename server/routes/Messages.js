const express = require('express');
const messages = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser')
const Private_Message = require('../models/Private_Message');

messages.use(cors());
process.env.SECRET_KEY = 'secret';

messages.post('/fetchmessages', (req, res) => {
    const msgList = [];
    var unread_Messages = 0;
    Private_Message.findAll({
        where: {
            userid: req.body.userid
        },
        order: [
            ['write_date', 'DESC']
        ]
    })
    .then(messages => {
        if(messages) {
            for(var i = 0; i < messages.length; i++) {
                if(messages[i].seen === 0) {
                    unread_Messages++;
                }
                const write_date_fixed = new Date(messages[i].write_date).toLocaleString();
                msgList.push({
                    id: messages[i].id,
                    from: messages[i].sendby,
                    subject: messages[i].subject,
                    message: messages[i].message,
                    write_date: write_date_fixed,
                    seen: messages[i].seen
                    
                });
                if(i + 1 >= messages.length) {
                    res.json({messages: msgList, unreads: unread_Messages });
                }
            }    
        }
        else {
            res.send('error: there is no message to show');
        }
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

messages.post('/updatemsg', (req, res) => {
    Private_Message.findOne({
        where: {
            id: req.body.id
        }
    })
    .then(msg => {
        if(msg) {
            Private_Message.update(
                { 
                    seen: 1
                },
                { where: { id: req.body.id }}
              )
              .then(function() {
                res.status(200).json({status:"Message update successfully"}); 
              })
              .catch(err => {
                res.send('error: '+ err);
              })
        }
        else {
            res.send('error: msg not found');
        }
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

  
module.exports = messages