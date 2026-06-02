'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('adq_estudio_mercado');
    if (tableDesc.tipo_solicitud) {
      await queryInterface.removeColumn('adq_estudio_mercado', 'tipo_solicitud');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('adq_estudio_mercado', 'tipo_solicitud', {
      type: Sequelize.ENUM('BIEN', 'SERVICIO'),
      allowNull: true,
      after: 'valor_estudio_mercado',
    });
  },
};
