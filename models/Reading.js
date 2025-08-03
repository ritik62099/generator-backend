const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Reading = sequelize.define('Reading', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  month: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  openingHour: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  openingMinute: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  closingHour: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  closingMinute: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usage: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false // 👉 Yeh line add karo
});

module.exports = Reading;
