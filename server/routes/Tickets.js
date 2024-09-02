const express = require('express');
const ticket = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser')
const Ticket = require('../models/Ticket');

ticket.use(cors());
process.env.SECRET_KEY = 'secret';

ticket.post('/sendticket', (req, res) => {
    const today = Date.now();
    const msgData = {
        owner: req.body.owner,
        subject: req.body.subject,
        message: req.body.message,
        create_date: today
    }
    Ticket.create(msgData)
    .then(ticket => {
        res.json({ status: 'Ticket received!' });
    })
    .catch(err => {
        res.send('error: ' + err);
    });
});

ticket.post('/fetchtickets', (req, res) => {
    const ticketLIST = [];
    Ticket.findAll({
        order: [
            ['create_date', 'DESC']
        ]
    })
    .then(ticket => {
        if(ticket) {
            for(var i = 0; i < ticket.length; i++) {
                const create_date_fixed = new Date(ticket[i].create_date).toLocaleString();
                ticketLIST.push({
                    id: ticket[i].id,
                    owner: ticket[i].owner,
                    subject: ticket[i].subject,
                    message: ticket[i].message,
                    create_date: create_date_fixed
                });
                if(i + 1 >= ticket.length) {
                    res.json({ tickets: ticketLIST });
                }
            }    
        }
        else {
            res.send('error: ticket not found');
        }
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

ticket.post('/removeticket', (req, res) => {
    Ticket.findOne({
        where: {
            id: req.body.id
        }
    })
    .then(ticket => {
        if(ticket) {
            Ticket.destroy({
                where: {
                  id: req.body.id
                }
              })
              .then(function (deletedRecord) {
                if(deletedRecord === 1){
                  res.status(200).json({status: "Ticket removed successfully"});          
                }
                else
                {
                  res.status(404).json({status: "ticket not found"})
                }
            })
            .catch(function (error){
                res.status(500).json(error);
            });
        }
        else {
            res.send('error: ticket not found');
        }
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});
  
module.exports = ticket