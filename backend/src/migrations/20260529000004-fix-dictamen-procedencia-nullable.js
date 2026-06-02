'use strict';
// Corrige dictamen_procedencia en adq_procedimiento_adquisitivo para que
// acepte NULL. Solo es obligatorio cuando la modalidad es Adjudicación Directa
// Presencial; en los demás casos puede quedar sin valor.

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('adq_procedimiento_adquisitivo', 'dictamen_procedencia', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('adq_procedimiento_adquisitivo', 'dictamen_procedencia', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
