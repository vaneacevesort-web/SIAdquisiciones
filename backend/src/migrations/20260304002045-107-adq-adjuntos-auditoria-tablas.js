'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // =========================
    // ADJUNTOS
    // =========================
    await queryInterface.createTable('adq_adjuntos', {
      id_adjunto: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false },

      // En qué sección cae el archivo
      seccion: {
        type: Sequelize.ENUM('ESTUDIO_MERCADO', 'AFECTACION_PRESUPUESTAL', 'BIENES_SERVICIOS', 'PROCEDIMIENTO', 'SEGUIMIENTO', 'OTRO'),
        allowNull: false,
        defaultValue: 'OTRO'
      },

      // Tipo específico de archivo
      tipo_adjunto: {
        type: Sequelize.ENUM('OFICIO_SUFICIENCIA', 'DICTAMEN', 'DICTAMEN_PROCEDENCIA', 'CONVOCATORIA', 'INVITACION', 'OTRO'),
        allowNull: false,
        defaultValue: 'OTRO'
      },

      filename: { type: Sequelize.STRING(255), allowNull: false },
      mime: { type: Sequelize.STRING(100), allowNull: true },

      // Ruta donde lo guardas en tu server o storage
      ruta: { type: Sequelize.STRING(600), allowNull: false },

      // Si quieres evitar duplicados por integridad
      hash_sha256: { type: Sequelize.CHAR(64), allowNull: true },

      uploaded_by: { type: Sequelize.CHAR(36), allowNull: false },
      uploaded_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addConstraint('adq_adjuntos', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_adj_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_adjuntos', {
      fields: ['uploaded_by'],
      type: 'foreign key',
      name: 'fk_adq_adj_user',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addIndex('adq_adjuntos', ['id_solicitud'], { name: 'idx_adq_adj_sol' });
    await queryInterface.addIndex('adq_adjuntos', ['tipo_adjunto'], { name: 'idx_adq_adj_tipo' });


    // =========================
    // AUDITORÍA
    // =========================
    await queryInterface.createTable('adq_audit_log', {
      id_audit: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false },

      seccion: {
        type: Sequelize.ENUM('SOLICITUD', 'ESTUDIO_MERCADO', 'AFECTACION_PRESUPUESTAL', 'BIENES_SERVICIOS', 'PROCEDIMIENTO', 'SEGUIMIENTO', 'ADJUNTO'),
        allowNull: false
      },

      campo: { type: Sequelize.STRING(80), allowNull: false },

      valor_anterior: { type: Sequelize.TEXT, allowNull: true },
      valor_nuevo: { type: Sequelize.TEXT, allowNull: true },

      id_usuario: { type: Sequelize.CHAR(36), allowNull: false },
      fecha_evento: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addConstraint('adq_audit_log', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_audit_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_audit_log', {
      fields: ['id_usuario'],
      type: 'foreign key',
      name: 'fk_adq_audit_user',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addIndex('adq_audit_log', ['id_solicitud', 'fecha_evento'], { name: 'idx_adq_audit_sol_fecha' });
    await queryInterface.addIndex('adq_audit_log', ['id_usuario', 'fecha_evento'], { name: 'idx_adq_audit_user_fecha' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_audit_log');
    await queryInterface.dropTable('adq_adjuntos');
  }
};