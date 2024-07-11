const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Education = sequelize.define('education', {
  degree: {
    type: DataTypes.STRING
  },
  institution: {
    type: DataTypes.STRING
  },
  major: {
    type: DataTypes.STRING
  },
  year: {
    type: DataTypes.STRING
  },
  gpa: {
    type: DataTypes.INTEGER
  },
  idUser: {
    type: DataTypes.INTEGER
  }
});

module.exports = Education;
