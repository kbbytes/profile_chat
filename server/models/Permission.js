const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'permission',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: Sequelize.INTEGER
    },
    perm_name: {
      type: Sequelize.TEXT
    },
    perm_status: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
)
