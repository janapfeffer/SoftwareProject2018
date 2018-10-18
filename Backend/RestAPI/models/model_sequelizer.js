'use strict';
const Sequelize = require('sequelize');
const db        = {};
const CONFIG = require('../config/config');

//Basic database config settings for Sequelize
const sequelizedConnection = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  port: CONFIG.db_port,
  operatorsAliases: false
});

module.exports.sequelizedConnection = sequelizedConnection;
