'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Importa el generador de UUID

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(), // Genera automáticamente el UUID con uuidv4()
      name: 'SAGM990220',
      email: 'vane.aceves@oficialia.gob.mx',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'vane.aceves@oficialia.gob.mx'
    });
  }
};