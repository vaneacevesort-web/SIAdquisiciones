'use strict';
// La tabla ya existe (creada por 20260304002034) con id_proc, id_modalidad_procedimiento, etc.
// Esta migración agrega sólo los campos que faltan para el formulario actual.

module.exports = {
  async up(queryInterface, Sequelize) {
    // Texto de la modalidad (el catálogo FK está vacío, guardamos texto directo)
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'modalidad', {
      type: Sequelize.STRING(80),
      allowNull: true,
      after: 'id_modalidad_procedimiento',
    });
    // Responsable del procedimiento
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'responsable', {
      type: Sequelize.STRING(150),
      allowNull: true,
      after: 'modalidad',
    });
    // Número de procedimiento
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'no_procedimiento', {
      type: Sequelize.STRING(60),
      allowNull: true,
      after: 'responsable',
    });
    // Medio de publicación (texto libre; el catálogo FK está vacío)
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'medio_publicacion', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'no_procedimiento',
    });
    // Sesión del Subcomité Revisor
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'fecha_sesion_subcomite', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('adq_procedimiento_adquisitivo', 'hora_sesion_subcomite', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    const cols = [
      'modalidad', 'responsable', 'no_procedimiento', 'medio_publicacion',
      'fecha_sesion_subcomite', 'hora_sesion_subcomite',
    ];
    for (const col of cols) {
      await queryInterface.removeColumn('adq_procedimiento_adquisitivo', col);
    }
  },
};
