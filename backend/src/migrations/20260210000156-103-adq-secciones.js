'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // =========================
    // 1) ESTUDIO DE MERCADO
    // =========================
    await queryInterface.createTable('adq_estudio_mercado', {
      id_estudio: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      // 1 a 1 con solicitud
      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, unique: true },

      valor_estudio_mercado: { type: Sequelize.DECIMAL(18, 2), allowNull: true },

      estatus_estudio: {
        type: Sequelize.ENUM('CONCLUIDO', 'EN_PROCESO', 'RECHAZADO'),
        allowNull: false
      },

      plurianual: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

      created_by: { type: Sequelize.CHAR(36), allowNull: false },
      updated_by: { type: Sequelize.CHAR(36), allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: true }
    });

    await queryInterface.addConstraint('adq_estudio_mercado', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_em_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_estudio_mercado', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_adq_em_created_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_estudio_mercado', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_adq_em_updated_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // =========================
    // 1.1) DETALLE PLURIANUAL (2026-2029)
    // =========================
    await queryInterface.createTable('adq_estudio_mercado_plurianual_det', {
      id_det: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      id_estudio: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false },
      anio: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      monto: { type: Sequelize.DECIMAL(18, 2), allowNull: false }
    });

    await queryInterface.addConstraint('adq_estudio_mercado_plurianual_det', {
      fields: ['id_estudio'],
      type: 'foreign key',
      name: 'fk_adq_emdet_em',
      references: { table: 'adq_estudio_mercado', field: 'id_estudio' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_estudio_mercado_plurianual_det', {
      fields: ['id_estudio', 'anio'],
      type: 'unique',
      name: 'uk_adq_em_anio'
    });

    // =========================
    // 2) AFECTACIÓN PRESUPUESTAL
    // =========================
    await queryInterface.createTable('adq_afectacion_presupuestal', {
      id_afectacion: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      // 1 a 1 con solicitud
      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, unique: true },

      nombre_testigo_social: { type: Sequelize.STRING(255), allowNull: true },

      // PAD / GC / MIXTO
      tipo_gasto: { type: Sequelize.ENUM('PAD', 'GC', 'MIXTO'), allowNull: false },

      id_fuente_financiamiento: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },

      // Puedes seguir guardando path aquí (rápido) y luego también en adq_adjuntos (pro)
      oficio_suficiencia_path: { type: Sequelize.STRING(500), allowNull: true },

      importe_suficiencia: { type: Sequelize.DECIMAL(18, 2), allowNull: true },

      created_by: { type: Sequelize.CHAR(36), allowNull: false },
      updated_by: { type: Sequelize.CHAR(36), allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: true }
    });

    await queryInterface.addConstraint('adq_afectacion_presupuestal', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_ap_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_afectacion_presupuestal', {
      fields: ['id_fuente_financiamiento'],
      type: 'foreign key',
      name: 'fk_adq_ap_fuente',
      references: { table: 'adq_cat_fuente_financiamiento', field: 'id_fuente_financiamiento' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('adq_afectacion_presupuestal', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_adq_ap_created_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_afectacion_presupuestal', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_adq_ap_updated_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // =========================
    // 3) BIENES Y SERVICIOS
    // =========================
    await queryInterface.createTable('adq_bienes_servicios', {
      id_bs: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },

      // 1 a 1 con solicitud
      id_solicitud: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, unique: true },

      clave_verificacion: { type: Sequelize.STRING(120), allowNull: true },
      descripcion_clave_verificacion: { type: Sequelize.STRING(500), allowNull: true },

      unidad_medida: { type: Sequelize.STRING(80), allowNull: true },

      dictamen: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      dictamen_path: { type: Sequelize.STRING(500), allowNull: true },

      contrato_abierto: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      consolidado: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

      created_by: { type: Sequelize.CHAR(36), allowNull: false },
      updated_by: { type: Sequelize.CHAR(36), allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: true }
    });

    await queryInterface.addConstraint('adq_bienes_servicios', {
      fields: ['id_solicitud'],
      type: 'foreign key',
      name: 'fk_adq_bs_sol',
      references: { table: 'adq_solicitudes', field: 'id_solicitud' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('adq_bienes_servicios', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_adq_bs_created_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_bienes_servicios', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_adq_bs_updated_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_bienes_servicios');
    await queryInterface.dropTable('adq_afectacion_presupuestal');
    await queryInterface.dropTable('adq_estudio_mercado_plurianual_det');
    await queryInterface.dropTable('adq_estudio_mercado');
  }
};
