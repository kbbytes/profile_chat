const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'stat',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    count: {
        type: Sequelize.INTEGER
    },
    modified_day: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
)
