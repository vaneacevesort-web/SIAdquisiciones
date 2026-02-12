'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('estatussolicituds', [
      { valor: 'Registrado', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'Pendiente', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'Aceptado', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'Rechazado', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('estatussolicituds', null, {});
  }
};
