const express = require('express');
const rooms = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var { DateTime } = require('luxon');
const Sequelize = require('sequelize');

const bodyParser = require('body-parser')
const Room = require('../models/Room');

rooms.use(cors());
process.env.SECRET_KEY = 'secret';
const addRoom = (roomData) => {
    Room.create(roomData).then(room => {
        console.log(`room '${room.name}' Created by ${room.owner}(${room.owner_id}) successfully`);
    })
    .catch(err => console.log(err));
}

const removeRoom = (roomData) => {
    Room.destroy({
        where: {
          name: roomData
        }
      }).then(room => {
          console.log(`empty room '${room.name}' has been removed`);
    })
    .catch(err => console.log(err));
}

const updateRoom = (roomData) => {
    Room.update({
        members: Sequelize.literal(`members + ${roomData.member}`)
    },
    {
        where: {
            name: roomData.name
        }
    }).then(room => {
    })
    .catch(err => console.log(err));
}

module.exports = { addRoom, removeRoom, updateRoom };