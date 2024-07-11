const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Skill = sequelize.define('skill', {
  skill: {
    type: DataTypes.STRING
  },
  idUser: {
    type: DataTypes.INTEGER
  }
});

module.exports = Skill;
