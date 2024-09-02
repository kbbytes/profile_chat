const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'room',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT
    },
    owner: {
        type: Sequelize.TEXT
    },
    owner_id: {
        type: Sequelize.INTEGER
    },
    members: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
