'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('solicituds', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE', // Opcional, para borrar en cascada
        onUpdate: 'CASCADE'  // Opcional, para actualizar en cascada
      },
      estatusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'estatussolicituds',
          key: 'id'
        },
        allowNull: false,
      },
      ap_paterno: {
        type: Sequelize.STRING
      },
      ap_materno: {
        type: Sequelize.STRING
      },
      nombres: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      celular: {
        type: Sequelize.STRING
      },
      curp: {
        type: Sequelize.STRING
      },
      cedula_profesional: {
        type: Sequelize.STRING
      },
      aviso_privacidad: {
        type: Sequelize.BOOLEAN
      }, 
      fecha_envio: {
        type: Sequelize.DATE
        
      },
      fecha_validacion: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('solicituds');
  }
};
