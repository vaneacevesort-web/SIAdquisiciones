'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adq_solicitudes', {
      id_solicitud: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      // Tu folio interno (llave única visible)
      folio: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },

      fecha_ingreso: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      // ESTATAL / FEDERAL / FIDEICOMISO / CONCURRENTE
      id_origen_recurso: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },

      // Dependencia y centro de costo
      id_dependencia: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      id_centro_costo: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },

      // Clasificador presupuestal
      id_capitulo: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      id_partida: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },

      // Giro/Subgiro
      id_giro: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      id_subgiro: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },

      // Tipo de solicitud
      tipo_solicitud: {
        type: Sequelize.ENUM('BIEN', 'SERVICIO'),
        allowNull: false
      },

      // Auditoría básica (tu users.id es CHAR(36) / UUID)
      created_by: {
        type: Sequelize.CHAR(36),
        allowNull: false
      },
      updated_by: {
        type: Sequelize.CHAR(36),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Índices útiles
    await queryInterface.addIndex('adq_solicitudes', ['fecha_ingreso'], { name: 'idx_adq_sol_fecha' });
    await queryInterface.addIndex('adq_solicitudes', ['id_dependencia', 'id_centro_costo'], { name: 'idx_adq_sol_dep_cc' });

    // FKs a catálogos
    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_origen_recurso'],
      type: 'foreign key',
      name: 'fk_adq_sol_origen',
      references: { table: 'adq_cat_origen_recurso', field: 'id_origen_recurso' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_dependencia'],
      type: 'foreign key',
      name: 'fk_adq_sol_dep',
      references: { table: 'adq_cat_dependencias', field: 'id_dependencia' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_centro_costo'],
      type: 'foreign key',
      name: 'fk_adq_sol_cc',
      references: { table: 'adq_cat_centros_costo', field: 'id_centro_costo' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_capitulo'],
      type: 'foreign key',
      name: 'fk_adq_sol_cap',
      references: { table: 'adq_cat_capitulos', field: 'id_capitulo' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_partida'],
      type: 'foreign key',
      name: 'fk_adq_sol_part',
      references: { table: 'adq_cat_partidas', field: 'id_partida' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_giro'],
      type: 'foreign key',
      name: 'fk_adq_sol_giro',
      references: { table: 'adq_cat_giros', field: 'id_giro' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['id_subgiro'],
      type: 'foreign key',
      name: 'fk_adq_sol_subgiro',
      references: { table: 'adq_cat_subgiros', field: 'id_subgiro' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // FKs a users (UUID char36)
    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_adq_sol_created_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_solicitudes', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_adq_sol_updated_by',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_solicitudes');

    // Por si MySQL deja el enum colgando en algunos setups (no siempre aplica, pero no estorba)
    // MySQL normalmente elimina el enum al eliminar la tabla.
  }
};
