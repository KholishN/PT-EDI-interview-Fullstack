const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Profile = sequelize.define('profile', {
  position: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  noKTP: {
    type: DataTypes.INTEGER
  },
  placeOfBirth: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  gender: {
    type: DataTypes.STRING
  },
  religion: {
    type: DataTypes.STRING
  },
  bloodType: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  ktpAddress: {
    type: DataTypes.STRING
  },
  currentAddress: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.INTEGER
  },
  emergencyContact: {
    type: DataTypes.STRING
  },
  willingness: {
    type: DataTypes.STRING
  },
  expectedSalery: {
    type: DataTypes.INTEGER
  },
  idUser: {
    type: DataTypes.INTEGER
  }
});

module.exports = Profile;
