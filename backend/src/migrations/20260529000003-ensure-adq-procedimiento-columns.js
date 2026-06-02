'use strict';
// Garantiza que adq_procedimiento_adquisitivo tenga TODAS las columnas que usa el
// modelo Sequelize y el controlador. Idempotente: salta columnas que ya existen.
// Corrige también la columna 'modalidad' que la migración 20260525 intentó
// agregar como STRING pero ya existía como ENUM en la tabla original.

module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('adq_procedimiento_adquisitivo');

    const add = async (col, def) => {
      if (!cols[col]) await queryInterface.addColumn('adq_procedimiento_adquisitivo', col, def);
    };

    // Cambia modalidad de ENUM a VARCHAR si aún es ENUM (para aceptar valores futuros)
    if (cols.modalidad && cols.modalidad.type && cols.modalidad.type.includes('ENUM')) {
      await queryInterface.changeColumn('adq_procedimiento_adquisitivo', 'modalidad', {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    } else {
      await add('modalidad', { type: Sequelize.STRING(100), allowNull: true });
    }

    // Fechas y datos del procedimiento
    await add('fecha_liberacion_mercado',    { type: Sequelize.DATEONLY, allowNull: true });
    await add('id_modalidad_procedimiento',  { type: Sequelize.SMALLINT.UNSIGNED, allowNull: true });
    await add('responsable',                 { type: Sequelize.STRING(150), allowNull: true });
    await add('no_procedimiento',            { type: Sequelize.STRING(60),  allowNull: true });
    await add('dictamen_procedencia',        { type: Sequelize.BOOLEAN,     allowNull: true });
    await add('dictamen_procedencia_path',   { type: Sequelize.STRING(500), allowNull: true });
    await add('convocatoria_invitacion',     { type: Sequelize.STRING(255), allowNull: true });
    await add('convocatoria_url',            { type: Sequelize.STRING(500), allowNull: true });
    await add('id_medio_publicacion',        { type: Sequelize.TINYINT.UNSIGNED, allowNull: true });
    await add('medio_publicacion',           { type: Sequelize.STRING(100), allowNull: true });
    await add('fecha_junta_aclaracion',      { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_junta_aclaracion',       { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_presentacion_apertura', { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_presentacion_apertura',  { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_sesion_comite_analisis',{ type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_sesion_comite_analisis', { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_contraoferta',          { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_contraoferta',           { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_dictaminacion_comite',  { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_dictaminacion_comite',   { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_sesion_subcomite',      { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_sesion_subcomite',       { type: Sequelize.TIME,        allowNull: true });
    await add('fecha_fallo',                 { type: Sequelize.DATEONLY,    allowNull: true });
    await add('hora_fallo',                  { type: Sequelize.TIME,        allowNull: true });

    // Adjudicación
    await add('monto_total_adjudicado_iva',         { type: Sequelize.DECIMAL(18, 2), allowNull: true });
    await add('proveedor_razon_social',              { type: Sequelize.STRING(255),    allowNull: true });
    await add('proveedor_rfc',                       { type: Sequelize.STRING(20),     allowNull: true });
    await add('no_contrato',                         { type: Sequelize.STRING(80),     allowNull: true });
    await add('vigencia_inicio',                     { type: Sequelize.DATEONLY,       allowNull: true });
    await add('vigencia_termino',                    { type: Sequelize.DATEONLY,       allowNull: true });
    await add('url_testimonio_testigo_social',       { type: Sequelize.STRING(500),    allowNull: true });
    await add('remanente_suficiencia_presupuestal',  { type: Sequelize.DECIMAL(18, 2), allowNull: true });
    await add('estatus_adjudicacion',                { type: Sequelize.STRING(60),     allowNull: true });
    await add('estatus_estudio_mercado_adj',         { type: Sequelize.STRING(30),     allowNull: true });
    await add('comentarios_adjudicacion',            { type: Sequelize.TEXT,           allowNull: true });
    await add('existe_reprogramacion',               { type: Sequelize.BOOLEAN,        allowNull: true });

    // created_by: asegurar que tenga default para no fallar en INSERT sin user_id
    if (cols.created_by && !cols.created_by.defaultValue) {
      await queryInterface.changeColumn('adq_procedimiento_adquisitivo', 'created_by', {
        type: Sequelize.CHAR(36),
        allowNull: true,
        defaultValue: '00000000-0000-0000-0000-000000000000',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Solo revierte columnas añadidas por esta migración (las del modelo completo)
    const toRemove = [
      'fecha_liberacion_mercado', 'id_modalidad_procedimiento', 'responsable',
      'no_procedimiento', 'dictamen_procedencia', 'dictamen_procedencia_path',
      'convocatoria_invitacion', 'convocatoria_url', 'id_medio_publicacion', 'medio_publicacion',
      'fecha_junta_aclaracion', 'hora_junta_aclaracion',
      'fecha_presentacion_apertura', 'hora_presentacion_apertura',
      'fecha_sesion_comite_analisis', 'hora_sesion_comite_analisis',
      'fecha_contraoferta', 'hora_contraoferta',
      'fecha_dictaminacion_comite', 'hora_dictaminacion_comite',
      'fecha_sesion_subcomite', 'hora_sesion_subcomite',
      'fecha_fallo', 'hora_fallo',
      'monto_total_adjudicado_iva', 'proveedor_razon_social', 'proveedor_rfc',
      'no_contrato', 'vigencia_inicio', 'vigencia_termino',
      'url_testimonio_testigo_social', 'remanente_suficiencia_presupuestal',
      'estatus_adjudicacion', 'estatus_estudio_mercado_adj', 'comentarios_adjudicacion',
      'existe_reprogramacion',
    ];
    const cols = await queryInterface.describeTable('adq_procedimiento_adquisitivo');
    for (const col of toRemove) {
      if (cols[col]) await queryInterface.removeColumn('adq_procedimiento_adquisitivo', col);
    }
  },
};
