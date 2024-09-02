const express = require('express');
const users = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser')
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const Ban = require('../models/Ban');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

users.use(cors());
process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
    const today = Date.now();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        nickname: req.body.nickname,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        last_login: today,
        register_ip: req.body.register_ip,
        last_login_ip: req.body.register_ip,
        rank: 1,
        birthday: req.body.birthday,
        refferalid: req.body.refferalid,
        refferalby: req.body.refferalby,
        of_shares: 0.0,
        birthdate: req.body.birthdate,
        created: today
    }
    
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData)
                .then(user => {
                    res.json({ status: user.email + ' registered' });
                })
                .catch(err => {
                    res.send('error: ' + err);
                });
            });
        }
        else {
            res.json({ error: "User already exists" });
        }
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

users.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {   
        if(user) {
            console.log("found");
            if(bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                const date_today = Date.now();
                const loginData = {
                    userid: user.id,
                    login_ip: req.body.last_login_ip,
                    login_date: date_today
                }
                Ban.findOne({
                    where: {
                        userid: loginData.userid
                    }
                })
                .then(banned => {
                    if(banned) {
                        const userData = {
                            token: token,
                            nickname: user.nickname,
                            email: user.email,
                            banned: 1,
                            reason: 'You are temporarily banned'
                        }
                        res.json(userData);
                    }
                    else
                    { 
                        setTimeout(() => {
                            User.update(
                                { 
                                    last_login: Date.now(),
                                    last_login_ip: req.body.last_login_ip
                                },
                                { where: { email: req.body.email }}
                            )
                            setTimeout(() => {
                                const userData = {
                                    token: token,
                                    nickname: user.nickname,
                                    email: user.email,
                                    banned: 0
                                }
                                LoginLog.create(loginData)
                                .then(user => {
                                    console.log('[Login Logger]: userid: [' + loginData.userid + '] with ip address: [' + loginData.login_ip + '] logggedin with email [' + req.body.email + '] on date: [' + loginData.login_date + ']');
                                    res.send(userData);
                                })
                                .catch(err => {
                                    console.log('error: ' +  err)
                                });
                            }, 500);
                           
                        }, 500);
                    }
                })
                .catch(err => {
                    console.log(err);
                })        
            }
            else {
                res.status(400).json({ error: 'Wrong email/password' });
            }
        }
        else {
            res.status(400).json({ error: 'User does not exist' });
        }
    })
    .catch(err => {
        res.status(400).json({ error: err });
    })
});

users.post('/editprofile', (req, res) => {
    const userdata = req.body;
    if(userdata.have_new_password)
    {
      User.update(
        { 
            first_name: userdata.first_name,
            last_name: userdata.last_name,
            nickname: userdata.nickname,
            password: userdata.password
        },
        { where: { id: userdata.id }}
      )
      .then(function() {
        res.status(200).json({status:"Profile update successfully"}); 
      })
      .catch(err => {
        res.send('error: '+ err);
      })
    }
    else
    {
      User.update(
        { 
            first_name: userdata.first_name,
            last_name: userdata.last_name,
            nickname: userdata.nickname
        },
        { where: { id: userdata.id }}
      )
      .then(function() {
        res.status(200).json({status:"Profile update successfully"}); 
      })
      .catch(err => {
        res.send('error: '+ err);
      })
    }
});


users.post('/getadmins', (req, res) => {
    User.findAll({
        raw: true,
        where: { 
            rank: { 
                [Op.gt]: 1
            }
        }
      })
      .then(users => {
        if(users) {
          objArr = [];
          for(var i = 0; i < users.length; i++) {
            objArr.push({
                userid: users[i].id, 
                first_name: users[i].first_name,
                last_name: users[i].last_name,
                nickname: users[i].nickname,
                email: users[i].email,
                rank: users[i].rank,
                country: users[i].country,
                gender: users[i].gender,
                created: users[i].created,
                last_login: users[i].last_login,
                last_login_ip: users[i].last_login_ip,
                refferalid: users[i].refferalid,
                refferalby: users[i].refferalby,
                users_view: users[i].have_users_view,
                bans_view: users[i].have_bans_view,
                logs_view: users[i].have_logs_view,
                tickets_view: users[i].have_tickets_view,
                SPM_view: users[i].have_SPM_view,
                admins_view: users[i].have_admins_view,
                rooms_view: users[i].have_rooms_view,
                banners_view: users[i].have_banners_view,
                stats_view: users[i].have_stats_view
            });
            if(i + 1 >= users.length)
            {
                res.json({ admins: objArr });
            }
          }
        }
      })
  .catch(err => {
      res.send('error: '+ err);
  });
});

users.post('/removeadmin', (req, res) => {
    User.findOne({
        where: { 
           id: req.body.id
        }
      })
      .then(user => {
        if(user) {
            User.update(
                { 
                    rank: 1,
                    have_users_view: 0,
                    have_bans_view: 0,
                    have_logs_view: 0,
                    have_tickets_view: 0,
                    have_SPM_view: 0,
                    have_admins_view: 0,
                    have_rooms_view: 0,
                    have_banners_view: 0,
                    have_stats_view: 0
                },
                { where: { id: req.body.id }}
            )
            res.json({Status: 'Admin removed successfully'});
        }
      })
  .catch(err => {
      res.send('error: '+ err);
  });
});

users.post('/addadmin', (req, res) => {
    var perms_list = {
        rank: req.body._rank,
        have_users_view: req.body._users_view,
        have_bans_view: req.body._bans_view,
        have_logs_view: req.body._logs_view,
        have_tickets_view: req.body._tickets_view,
        have_SPM_view: req.body._SPM_view,
        have_admins_view: req.body._admins_view,
        have_rooms_view: req.body._rooms_view,
        have_banners_view: req.body._banners_view,
        have_stats_view: req.body._stats_view,
        new_admin: req.body.is_new
    };
    User.findOne({
            where: { 
                id: req.body._id
            }
        })
        .then(user => {
        if(user) {
            User.update(
                perms_list,
                { where: { id: req.body._id }}
            )
            .then(() => {
                if(perms_list.new_admin)
                    res.json({ Status: 'Admin successfully added' });
                else
                    res.json({ Status: 'Admin successfully updated'});
            })
            .catch(err => {
                console.log('error2: ' + err);
            })
        }
    })
    .catch(err => {
        res.send('error3: ' + err);
    });
});

  
module.exports = users