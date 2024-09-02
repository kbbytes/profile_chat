const express = require('express');
const stats = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var { DateTime } = require('luxon');

const bodyParser = require('body-parser')
const Stat = require('../models/Stat');

stats.use(cors());
process.env.SECRET_KEY = 'secret';

stats.post('/view', (req, res) => {
    let d = DateTime.local();
    var today_views = {
        name: 'today_views',
        count: 1
    };

    var total_views = {
        name: 'total_views',
        count: 1
    }

    Stat.findOne({ 
        where: {
            name: 'today_views'
        }
    })
    .then(stat => {
        if(stat) {
            Stat.update(
            { 
                count: stat.count + 1
            },
            { 
                where: { 
                name: 'today_views'
                }
            }
            )
            .then(rese => {
            res.send({ Status: "view's stat updated" });
            })
            .catch(err => {
            console.log(err);
            })
            Stat.findOne({ 
                where: {
                    name: 'total_views'
                }
            })
            .then(stat_all => {
                Stat.update(
                    { 
                        count: stat_all.count + 1,
                        modified_day: d.c.day
                    },
                    { 
                        where: { 
                        name: 'total_views'
                        }
                    }
                    )
                    .then(rese => {
                    })
                    .catch(err => {
                    console.log(err);
                })
            })
        }
        else
        {
            Stat.create(today_views)
            .then(rese => {
                res.send({ Status: "view's stat created" });
                })
            .catch(err => {
                console.log(err);
            })
            Stat.findOne({ 
                where: {
                    name: 'total_views'
                }
            })
            .then(stat => {
                if(stat.count <= 0)
                {
                    Stat.create(total_views)
                    .then(rese => {
                        res.send({ Status: "view's stat created" });
                        })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
        }
    })
});

stats.post('/getview', (req, res) => {
    Stat.findAll({
    })
    .then(stats => {
        if(stats) {
            res.send(stats);
        }
    })
});

module.exports = stats