const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'ticket',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: Sequelize.TEXT
    },
    message: {
        type: Sequelize.TEXT
    },
    owner: {
        type: Sequelize.TEXT
    },
    create_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
)
