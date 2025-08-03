// backend/sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('generator', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql', // change to 'postgres' if using PostgreSQL
  logging: false,
});

module.exports = sequelize;
