'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adq_procedimiento_adquisitivo', {
      id_proc: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      // 1 a 1 con solicitud
      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, unique: true },

      fecha_liberacion_mercado: { type: Sequelize.DATEONLY, allowNull: true },

      id_modalidad_procedimiento: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: true },

      // Si aplica dictamen de procedencia
      dictamen_procedencia: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      dictamen_procedencia_path: { type: Sequelize.STRING(500), allowNull: true },

      // Convocatoria o invitación + URL
      convocatoria_invitacion: { type: Sequelize.STRING(255), allowNull: true },
      convocatoria_url: { type: Sequelize.STRING(500), allowNull: true },

      id_medio_publicacion: { type: Sequelize.TINYINT.UNSIGNED, allowNull: true },

      // Fechas/horas
      fecha_junta_aclaracion: { type: Sequelize.DATEONLY, allowNull: true },
      hora_junta_aclaracion: { type: Sequelize.TIME, allowNull: true },

      fecha_presentacion_apertura: { type: Sequelize.DATEONLY, allowNull: true },
      hora_presentacion_apertura: { type: Sequelize.TIME, allowNull: true },

      fecha_sesion_comite_analisis: { type: Sequelize.DATEONLY, allowNull: true },
      hora_sesion_comite_analisis: { type: Sequelize.TIME, allowNull: true },

      fecha_contraoferta: { type: Sequelize.DATEONLY, allowNull: true },
      hora_contraoferta: { type: Sequelize.TIME, allowNull: true },

      fecha_dictaminacion_comite: { type: Sequelize.DATEONLY, allowNull: true },
      hora_dictaminacion_comite: { type: Sequelize.TIME, allowNull: true },

      fecha_fallo: { type: Sequelize.DATEONLY, allowNull: true },
      hora_fallo: { type: Sequelize.TIME, allowNull: true },

      // Resultado
      monto_total_adjudicado_iva: { type: Sequelize.DECIMAL(18, 2), allowNull: true },

      proveedor_razon_social: { type: Sequelize.STRING(255), allowNull: true },
      proveedor_rfc: { type: Sequelize.STRING(20), allowNull: true },

      no_contrato: { type: Sequelize.STRING(80), allowNull: true },
      vigencia_inicio: { type: Sequelize.DATEONLY, allowNull: true },
      vigencia_termino: { type: Sequelize.DATEONLY, allowNull: true },

      // Auditoría básica
      created_by: { type: Sequelize.CHAR(36), allowNull: false, collate: 'utf8mb4_bin' },
      updated_by: { type: Sequelize.CHAR(36), allowNull: true, collate: 'utf8mb4_bin' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: true }
    });

    // FK a solicitud
    await queryInterface.addConstraint('adq_procedimiento_adquisitivo', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_proc_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // FK modalidad/medio publicación
    await queryInterface.addConstraint('adq_procedimiento_adquisitivo', {
      fields: ['id_modalidad_procedimiento'],
      type: 'foreign key',
      name: 'fk_adq_proc_modalidad',
      references: { table: 'adq_cat_modalidad_procedimiento', field: 'id_modalidad_procedimiento' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('adq_procedimiento_adquisitivo', {
      fields: ['id_medio_publicacion'],
      type: 'foreign key',
      name: 'fk_adq_proc_medio',
      references: { table: 'adq_cat_medio_publicacion', field: 'id_medio_publicacion' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // FK users
    await queryInterface.addConstraint('adq_procedimiento_adquisitivo', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_adq_proc_created_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_procedimiento_adquisitivo', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_adq_proc_updated_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Índices útiles
    await queryInterface.addIndex('adq_procedimiento_adquisitivo', ['fecha_fallo'], { name: 'idx_adq_proc_fallo' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_procedimiento_adquisitivo');
  }
};
