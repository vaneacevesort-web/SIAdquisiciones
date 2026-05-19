'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adq_afectacion_fuentes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      id_afectacion: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      id_fuente_financiamiento: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addConstraint('adq_afectacion_fuentes', {
      fields: ['id_afectacion', 'id_fuente_financiamiento'],
      type: 'unique',
      name: 'uk_afectacion_fuente',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_afectacion_fuentes');
  },
};
