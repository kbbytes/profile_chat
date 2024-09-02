const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'banner',
  {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: Sequelize.INTEGER
    },
    alt: {
        type: Sequelize.TEXT
    },   
    src: {
        type: Sequelize.TEXT
    },
    href: {
        type: Sequelize.TEXT
    },
  },
  {
    timestamps: false
  }
)
