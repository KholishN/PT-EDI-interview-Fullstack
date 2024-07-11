const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const WorkHistory = sequelize.define('workHistory', {
  company: {
    type: DataTypes.STRING
  },
  position: {
    type: DataTypes.STRING
  },
  lastSalery: {
    type: DataTypes.INTEGER
  },
  year: {
    type: DataTypes.STRING
  },
  idUser: {
    type: DataTypes.INTEGER
  }
});

module.exports = WorkHistory;
