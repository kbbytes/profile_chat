const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
var { DateTime } = require('luxon');
var multer = require("multer");

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');
const { addRoom, removeRoom, updateRoom } = require('./routes/Rooms.js');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Users = require('./routes/Users');
var Private_Messages = require('./routes/Private_Messages');
var Messages = require('./routes/Messages');
var Tickets = require('./routes/Tickets');
var Banners = require('./routes/Banners');
var Stats = require('./routes/Stats');

const User = require('./models/User');
const Ban = require('./models/Ban');
const LoginLog = require('./models/LoginLog');
const Stat = require('./models/Stat');
const Room = require('./models/Room');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('server is up and runnig');
});

app.use('/users', Users);
app.use('/admin/actions/spm', Private_Messages);
app.use('/admin/actions/tickets', Tickets);
app.use('/admin/actions/admins', Users);
app.use('/profile/messages', Messages);
app.use('/profile/visual', Users);
app.use('/', Banners);
app.use('/', Stats);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.id}.jpg`);
  }
});
const upload = multer({
  storage
});

const server = http.createServer(app);
const io = socketio(server);

app.use(function(req, res, next){
  req.setTimeout(0)
  next()
})

app.put("/avatar/upload", upload.single("photo"), async (req, res, next) => {
  try {
    const path = req.file && req.file.path;
    const filename = req.file.filename;
    const { id } = req.body;
    let params = {};
    if (path) {
      params = {
        id,
        avatar: filename
      };
    }
    const user = User.update(params, {
      where: {
        id
      }
    }).then( () => {
      User.findOne({ where: {
        id
      }}).then(user => {
        console.log(user);
        res.json({ avatar: user.avatar });
      }) 
    });
    
  } catch (ex) {
    res.status(400).send({ error: ex });
  }
});

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

function calcTime(city, offset) {
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var nd = new Date(utc + (3600000*offset));
 
  return nd.toLocaleTimeString('en-US', { hour12: false });
}

io.on('connect', (socket) => {
    socket.on('join', ({ name, room, user_id }, callback) => {
      if(name !== undefined || room !== undefined) {
        const { error, user } = addUser({ id: socket.id, name, room });
    
        if(error) return callback(error);
        if(user){
          socket.join(user.room);
          const today = new Date();
          if(getUsersInRoom(user.room).length === 1)
          {
            var new_room = {
              name: getUsersInRoom(user.room)[0].room,
              owner: getUsersInRoom(user.room)[0].name,
              owner_id: user_id,
              members: 1,
              create_date: today
            }
            addRoom(new_room);
          }
          if(getUsersInRoom(user.room).length > 1)
          {
            var update_room = {
              name: getUsersInRoom(user.room)[0].room,
              member: 1
            }
            updateRoom(update_room);
          }
        
          socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
          socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
      
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      
          callback();
        }
      }
    });

    var name_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var offset = new Date().getTimezoneOffset();
    var enter_time = calcTime(name_zone, offset/-60);

    socket.on('sendMessage', (data, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: data.message, send_time: enter_time, first_name: data.first_name,
         last_name: data.last_name, avatar: data.avatar, userid: data.userid });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const today = new Date();
      const user = removeUser(socket.id);
      if(user){
        if(getUsersInRoom(user.room) && !getUsersInRoom(user.room).length)
        {
          removeRoom(user.room);
        }
        if(getUsersInRoom(user.room).length > 0)
        {
          var update_room = {
              name: getUsersInRoom(user.room)[0].room,
              member: -1
            }
            updateRoom(update_room);
        }
        if(user) {
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
      } 
    })
});

app.use(router);
server.listen(PORT, () => console.log(`server has started on port ${PORT}`));

app.get('/getIP', getClientIP);

function getClientIP(req, res, next) {
    try {
        var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }

        return res.json({ IP: IPs.split(",")[0] });
    } catch (err) {
        return res.json({ message: 'got error' });
    }
}

app.post('/getrooms', (req, res) => {
  Room.findAll().then(rooms => {
    res.json({ Rooms: rooms });
  })
  .catch(err => console.log(err));
});

app.post('/fetcher', (req, res) => {
  User.findOne({
    where: {
      refferalid: req.body.data
    }
  })
  .then(user => {
    if(user) {
        res.send(`${user.first_name} ${user.last_name}`);
      }
  })
  .catch(err => {
      res.status(400).json({ error: err });
  })
})

app.post('/users', (req, res) => {
  User.findAll({
    raw: true,
    attributes: ['id', 'first_name', 'last_name', 'nickname', 'email', 'rank', 'country', 'gender', 'created', 'last_login', 'last_login_ip', 'refferalid', 'refferalby']
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
          refferalby: users[i].refferalby
        });
        if(i + 1 >= users.length)
        {
          res.json({ users: objArr });
        }
      }
    }
  })
  .catch(err => {
      res.send('error: '+ err);
  })
});

app.post('/logs', (req, res) => {
  LoginLog.findAll({
    raw: true,
    attributes: ['id', 'userid', 'login_ip', 'login_date']
  })
  .then(logs => {
    if(logs) {
      objArr = [];
      for(var i = 0; i < logs.length; i++) {
        objArr.push({
          id: logs[i].id,
          userid: logs[i].userid,
          login_ip: logs[i].login_ip,
          login_date: logs[i].login_date
        });
        if(i + 1 >= logs.length)
        {
          res.json({ logs: objArr });
        }
      }
    }
  })
  .catch(err => {
      res.send('error: '+ err);
  })
});

app.post('/checkban', (req, res) => {
  Ban.findOne({
    raw: true,
    attributes: ['id', 'userid', 'ban_date', 'expire_date'],
    where: {
      userid: req.body.id
    }
  })
  .then(ban => {
    if(ban) {
      res.json({ Status: 'You account has temporarily banned' });
    }
  })
  .catch(err => {
    console.log(err);
  })
});

app.post('/bans', (req, res) => {
  Ban.findAll({
    raw: true,
    attributes: ['id', 'userid', 'ban_date', 'expire_date']
  })
  .then(bans => {
    if(bans) {

      objArr = [];
      for(var i = 0; i < bans.length; i++) {
        objArr.push({
          id: bans[i].id,
          userid: bans[i].userid, 
          ban_date: bans[i].ban_date,
          expire_date: bans[i].expire_date
        });
        if(i + 1 >= bans.length)
        {
          res.json({ bans: objArr });
        }
      }
    }
  })
  .catch(err => {
      res.send('error: '+ err);
  })
});


app.post('/addban', (req, res) => {
  const today = new Date();
  const date = new Date();
  let expiredate = new Date(date.setTime( date.getTime() + req.body.days * 86400000 ));
  const banData = {
      userid: req.body.userid,
      ban_date: today,
      expire_date: expiredate
  }
  
  Ban.findOne({
      where: {
          userid: req.body.userid
      }
  })
  .then(ban => {
      if(!ban) {
          Ban.create(banData)
          .then(ban => {
              res.json({ status: ban.userid + ' has been banned for ' + req.body.days + ' day(s)' });
          })
          .catch(err => {
              res.json({ status: + 'Error: ' + err });
          });
      }
      else {
          res.json({ status: "Error: User already banned" });
      }
  })
  .catch(err => {
      res.send('error: '+ err);
  })
});

app.post('/removeban', (req, res) => {
  const unbanData = {
      userid: req.body.userid
  }
  Ban.findOne({
      where: {
          userid: req.body.userid
      }
  })
  .then(ban => {
      if(ban) {
          Ban.destroy({
            where: {
              userid: unbanData.userid
            }
          })
          .then(function (deletedRecord) {
            if(deletedRecord === 1){
              res.status(200).json({status:"Unban successfully"});          
            }
            else
            {
              res.status(404).json({status:"record not found"})
            }
        })
        .catch(function (error){
            res.status(500).json(error);
        });
      }
      else {
          res.json({ status: "Error: Banned user not found" });
      }
  })
  .catch(err => {
      res.send('error: '+ err);
  })
});

setInterval(() => {
  User.findAll({
    raw: true,
    attributes: ['id', 'first_name', 'last_name', 'nickname', 'email', 'rank', 'age', 'birthdate', 'country', 'gender', 'created', 'last_login', 'last_login_ip', 'refferalid', 'refferalby']
  })
  .then(users => {
    if(users) {
      for(var i = 0; i < users.length; i++) {
        if(users[i].birthdate !== null && users[i].birthdate !== ' ' && users[i].birthdate !== undefined && users[i].birthdate !== '') {
          var Age = getAge(users[i].birthdate)
          if(users[i].age !== Age)
          {
            User.update(
              { 
                  age: Age
              },
              { 
                where: { 
                  id: users[i].id
                }
              }
            );
            console.log(`${users[i].nickname}'s age updated to ${Age}`);
          }
        }
      }
    }
  })
  .catch(err => {
    console.log(err)
  })
}, 2000)

setInterval(() => {
  let d = DateTime.local();
  Stat.findOne({
    where: {
      name: 'yesterday_views'
    }
  })
  .then(stat => {
    if(d.c.day !== stat.modified_day)
    {
      if(d.c.hour === 00 || d.c.hour === 24) {
        Stat.findAll({ 
        })
        .then(stats => {
            var today_views = {};
            var yesterday_views = {};
            stats.map((stat, index) => {
              if(stat.name === 'today_views')
              {
                today_views = stat;
              }
              if(index + 1 === stats.length) {
                Stat.update(
                  {
                    count: today_views.count,
                    modified_day: d.c.day
                  },
                  {
                      where: {
                      name: 'yesterday_views'
                      }
                  }
                  )
                  .then(rese => {
                    Stat.update(
                      {
                        count: 0,
                        modified_day: d.c.day
                      },
                      {
                          where: {
                          name: 'today_views'
                          }
                      }
                      )
                      .then(rese => {
                      console.log("all views stat updated");
                      })
                      .catch(err => {
                      console.log(err);
                    })
                  })
                  .catch(err => {
                    console.log(err);
                })
              }
            })
        })
      }
    }
  })
  .catch(err => {
    console.log(err)
  })
}, 3000)

function getAge(dateString) 
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}