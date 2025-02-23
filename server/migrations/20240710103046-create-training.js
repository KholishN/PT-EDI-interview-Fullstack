'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trainingName: {
        type: Sequelize.STRING
      },
      certification: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.STRING
      },
      idUser: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainings');
  }
};