'use strict';
// Ajusta adq_estudio_mercado:
// 1. Relaja NOT NULL de columnas heredadas.
// 2. Agrega columnas del formulario de Estudio de Mercado.
// Idempotente: salta columnas que ya existen y changeColumn usa try/catch.

module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('adq_estudio_mercado');

    // ── 1. Relaja NOT NULL (solo si la columna aún existe como NOT NULL) ───
    const nullable = async (col, type) => {
      if (cols[col]) {
        await queryInterface.changeColumn('adq_estudio_mercado', col, { type, allowNull: true });
      }
    };

    await nullable('id_dependencia',  Sequelize.INTEGER.UNSIGNED);
    await nullable('id_centro_costo', Sequelize.INTEGER.UNSIGNED);
    await nullable('id_capitulo',     Sequelize.INTEGER.UNSIGNED);
    await nullable('id_partida',      Sequelize.INTEGER.UNSIGNED);
    await nullable('id_giro',         Sequelize.INTEGER.UNSIGNED);
    await nullable('id_subgiro',      Sequelize.INTEGER.UNSIGNED);
    await nullable('plurianual',      Sequelize.BOOLEAN);

    // estatus_estudio: cambia de ENUM a VARCHAR para aceptar el valor 'PROCESO'
    if (cols.estatus_estudio) {
      await queryInterface.changeColumn('adq_estudio_mercado', 'estatus_estudio', {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }

    // created_by: permite null con default
    if (cols.created_by) {
      await queryInterface.changeColumn('adq_estudio_mercado', 'created_by', {
        type: Sequelize.CHAR(36),
        allowNull: true,
        defaultValue: '00000000-0000-0000-0000-000000000000',
      });
    }

    // ── 2. Agrega columnas nuevas (solo las que no existen aún) ───────────
    const add = async (col, def) => {
      if (!cols[col]) await queryInterface.addColumn('adq_estudio_mercado', col, def);
    };

    await add('tipo_solicitud', {
      type: Sequelize.ENUM('BIEN', 'SERVICIO'),
      allowNull: true,
      after: 'valor_estudio_mercado',
    });
    await add('tipo_contratacion', {
      type: Sequelize.ENUM('IRP', 'LPNP', 'CP'),
      allowNull: true,
      after: 'tipo_solicitud',
    });
    await add('descripcion_bien_servicio', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'tipo_contratacion',
    });
    await add('monto_sabys', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: 'descripcion_bien_servicio',
    });
    await add('contratacion_plurianual', {
      type: Sequelize.ENUM('SI', 'NO'),
      allowNull: true,
      after: 'monto_sabys',
    });
    await add('monto_2026', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: 'contratacion_plurianual',
    });
    await add('monto_2027', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: 'monto_2026',
    });
    await add('monto_2028', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: 'monto_2027',
    });
    await add('monto_2029', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: 'monto_2028',
    });
  },

  async down(queryInterface, Sequelize) {
    const cols = await queryInterface.describeTable('adq_estudio_mercado');

    const remove = async (col) => {
      if (cols[col]) await queryInterface.removeColumn('adq_estudio_mercado', col);
    };

    await remove('tipo_solicitud');
    await remove('tipo_contratacion');
    await remove('descripcion_bien_servicio');
    await remove('monto_sabys');
    await remove('contratacion_plurianual');
    await remove('monto_2026');
    await remove('monto_2027');
    await remove('monto_2028');
    await remove('monto_2029');

    // Restaura NOT NULL del schema original
    const restore = async (col, type) => {
      if (cols[col]) await queryInterface.changeColumn('adq_estudio_mercado', col, { type, allowNull: false });
    };

    await restore('id_dependencia',  Sequelize.INTEGER.UNSIGNED);
    await restore('id_centro_costo', Sequelize.INTEGER.UNSIGNED);
    await restore('id_capitulo',     Sequelize.INTEGER.UNSIGNED);
    await restore('id_partida',      Sequelize.INTEGER.UNSIGNED);
    await restore('id_giro',         Sequelize.INTEGER.UNSIGNED);
    await restore('id_subgiro',      Sequelize.INTEGER.UNSIGNED);
    await restore('plurianual',      Sequelize.BOOLEAN);

    if (cols.estatus_estudio) {
      await queryInterface.changeColumn('adq_estudio_mercado', 'estatus_estudio', {
        type: Sequelize.ENUM('CONCLUIDO', 'EN_PROCESO', 'RECHAZADO'),
        allowNull: false,
      });
    }
    if (cols.created_by) {
      await queryInterface.changeColumn('adq_estudio_mercado', 'created_by', {
        type: Sequelize.CHAR(36),
        allowNull: false,
      });
    }
  },
};
