const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.TEXT
    },
    last_name: {
      type: Sequelize.TEXT
    },
    nickname: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.TEXT
    },
    country: {
      type: Sequelize.TEXT
    },
    rank: {
      type: Sequelize.INTEGER
    },
    avatar: {
      type: Sequelize.TEXT
    },
    age: {
      type: Sequelize.INTEGER
    },
    birthdate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    last_login: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    register_ip: {
      type: Sequelize.TEXT
    },
    last_login_ip: {
      type: Sequelize.TEXT
    },
    refferalid: {
      type: Sequelize.TEXT
    },
    refferalby: {
      type: Sequelize.TEXT
    },
    of_shares: {
      type: Sequelize.FLOAT
    },
    created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    have_users_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_bans_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_logs_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_tickets_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_SPM_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_admins_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_rooms_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_banners_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    have_stats_view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    timestamps: false
  }
)
