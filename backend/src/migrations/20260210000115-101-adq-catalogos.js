'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Origen del recurso
    await queryInterface.createTable('adq_cat_origen_recurso', {
      id_origen_recurso: { type: Sequelize.TINYINT.UNSIGNED, allowNull: false, primaryKey: true },
      nombre: { type: Sequelize.STRING(30), allowNull: false, unique: true }
    });

    // Dependencias
    await queryInterface.createTable('adq_cat_dependencias', {
      id_dependencia: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(255), allowNull: false, unique: true }
    });

    // Centros de costo (por dependencia)
    await queryInterface.createTable('adq_cat_centros_costo', {
      id_centro_costo: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      id_dependencia: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      centro_costo: { type: Sequelize.STRING(50), allowNull: false },
      descripcion: { type: Sequelize.STRING(255), allowNull: true }
    });

    await queryInterface.addConstraint('adq_cat_centros_costo', {
      fields: ['id_dependencia'],
      type: 'foreign key',
      name: 'fk_adq_cc_dep',
      references: { table: 'adq_cat_dependencias', field: 'id_dependencia' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_cat_centros_costo', {
      fields: ['id_dependencia', 'centro_costo'],
      type: 'unique',
      name: 'uk_adq_dep_cc'
    });

    // Capítulos
    await queryInterface.createTable('adq_cat_capitulos', {
      id_capitulo: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      clave: { type: Sequelize.STRING(10), allowNull: false, unique: true },
      descripcion: { type: Sequelize.STRING(255), allowNull: false }
    });

    // Partidas
    await queryInterface.createTable('adq_cat_partidas', {
      id_partida: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      id_capitulo: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      clave: { type: Sequelize.STRING(20), allowNull: false },
      descripcion: { type: Sequelize.STRING(255), allowNull: false }
    });

    await queryInterface.addConstraint('adq_cat_partidas', {
      fields: ['id_capitulo'],
      type: 'foreign key',
      name: 'fk_adq_part_cap',
      references: { table: 'adq_cat_capitulos', field: 'id_capitulo' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_cat_partidas', {
      fields: ['id_capitulo', 'clave'],
      type: 'unique',
      name: 'uk_adq_cap_part'
    });

    // Giro
    await queryInterface.createTable('adq_cat_giros', {
      id_giro: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(255), allowNull: false, unique: true }
    });

    // Subgiro
    await queryInterface.createTable('adq_cat_subgiros', {
      id_subgiro: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      id_giro: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      nombre: { type: Sequelize.STRING(255), allowNull: false }
    });

    await queryInterface.addConstraint('adq_cat_subgiros', {
      fields: ['id_giro'],
      type: 'foreign key',
      name: 'fk_adq_sub_giro',
      references: { table: 'adq_cat_giros', field: 'id_giro' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('adq_cat_subgiros', {
      fields: ['id_giro', 'nombre'],
      type: 'unique',
      name: 'uk_adq_giro_sub'
    });

    // Fuente financiamiento
    await queryInterface.createTable('adq_cat_fuente_financiamiento', {
      id_fuente_financiamiento: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(255), allowNull: false, unique: true }
    });

    // Modalidad procedimiento
    await queryInterface.createTable('adq_cat_modalidad_procedimiento', {
      id_modalidad_procedimiento: { type: Sequelize.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(120), allowNull: false, unique: true }
    });

    // Medio publicación
    await queryInterface.createTable('adq_cat_medio_publicacion', {
      id_medio_publicacion: { type: Sequelize.TINYINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(80), allowNull: false, unique: true }
    });

    // Estatus seguimiento
    await queryInterface.createTable('adq_cat_estatus_seguimiento', {
      id_estatus: { type: Sequelize.TINYINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(80), allowNull: false, unique: true }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('adq_cat_estatus_seguimiento');
    await queryInterface.dropTable('adq_cat_medio_publicacion');
    await queryInterface.dropTable('adq_cat_modalidad_procedimiento');
    await queryInterface.dropTable('adq_cat_fuente_financiamiento');
    await queryInterface.dropTable('adq_cat_subgiros');
    await queryInterface.dropTable('adq_cat_giros');
    await queryInterface.dropTable('adq_cat_partidas');
    await queryInterface.dropTable('adq_cat_capitulos');
    await queryInterface.dropTable('adq_cat_centros_costo');
    await queryInterface.dropTable('adq_cat_dependencias');
    await queryInterface.dropTable('adq_cat_origen_recurso');
  }
};
