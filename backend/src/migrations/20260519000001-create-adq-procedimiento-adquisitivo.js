'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adq_procedimiento_adquisitivo', {
      id_procedimiento: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      id_solicitud: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      modalidad: {
        type: Sequelize.ENUM(
          'LICITACION_PUBLICA_PRESENCIAL',
          'INVITACION_RESTRINGIDA_PRESENCIAL',
          'ADJUDICACION_DIRECTA_PRESENCIAL',
          'ACUERDO_MARCO',
          'LICITACION_PUBLICA_ELECTRONICA',
          'INVITACION_TRES_PERSONAS'
        ),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        defaultValue: '00000000-0000-0000-0000-000000000000',
      },
      updated_by: { type: Sequelize.CHAR(36), allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_procedimiento_adquisitivo');
  },
};
