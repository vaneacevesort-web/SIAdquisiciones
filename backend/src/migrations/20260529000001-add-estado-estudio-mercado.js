'use strict';
// Agrega estado_estudio_mercado a adq_solicitudes (semáforo).
// Idempotente: salta si la columna ya existe (por ejecución previa del .sql).

module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('adq_solicitudes');
    if (!cols.estado_estudio_mercado) {
      await queryInterface.addColumn('adq_solicitudes', 'estado_estudio_mercado', {
        type: Sequelize.ENUM('CONCLUIDO', 'PROCESO', 'RECHAZADO'),
        allowNull: true,
        defaultValue: null,
        after: 'estatus_id',
      });
    }
  },

  async down(queryInterface) {
    const cols = await queryInterface.describeTable('adq_solicitudes');
    if (cols.estado_estudio_mercado) {
      await queryInterface.removeColumn('adq_solicitudes', 'estado_estudio_mercado');
    }
  },
};
