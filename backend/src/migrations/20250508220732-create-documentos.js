'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      solicitudId: {
        type: Sequelize.UUID, // ✅ Debe ser INTEGER
        allowNull: false,
        references: {
          model: 'solicituds', // ✅ Nombre de la tabla relacionada
          key: 'id'
        },
        onUpdate: 'CASCADE', // Opcional, para actualizar la clave foránea en cascada
        onDelete: 'CASCADE'  // Opcional, para eliminar los documentos si la solicitud se elimina
      },
      path: {
        type: Sequelize.STRING
      },
      tipoDocumento: {
        type: Sequelize.STRING
      },
      estatus: {
        type: Sequelize.BOOLEAN
      },
      observaciones: {
        type: Sequelize.TEXT('long')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documentos');
  }
};