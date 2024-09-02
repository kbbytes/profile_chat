const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'ban',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userid: {
        type: Sequelize.INTEGER
    },
    ban_date: {
        type: Sequelize.DATE
    },
    expire_date: {
        type: Sequelize.DATE
    }
  },
  {
    timestamps: false
  }
)
