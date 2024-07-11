const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Training = sequelize.define('training', {
  trainingName: {
    type: DataTypes.STRING
  },
  certification: {
    type: DataTypes.STRING
  },
  year: {
    type: DataTypes.STRING
  },
  idUser: {
    type: DataTypes.INTEGER
  }
});

module.exports = Training;
