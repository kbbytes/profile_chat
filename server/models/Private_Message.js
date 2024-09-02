const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'private_message',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userid: {
        type: Sequelize.INTEGER
    },
    sendby: {
        type: Sequelize.TEXT
    },
    receiver: {
        type: Sequelize.TEXT
    },
    subject: {
        type: Sequelize.TEXT
    },
    message: {
        type: Sequelize.TEXT
    },
    write_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    seen: {
        type: Sequelize.TINYINT
    }
  },
  {
    timestamps: false
  }
)
