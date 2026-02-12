'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    const users = [
      { id: uuidv4(), name: 'JISP980721', email: 'nahum.jimenez@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DIRG940621', email: 'gis.diaz@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'RARC980223', email: 'cesar.rangel@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DEGC941209', email: 'cesar.desales@congresoedomex.gob.mx', password: hashedPassword },
    ];

    await queryInterface.bulkInsert(
      'users',
      users.map(user => ({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert(
      'rol_users',
      users.map(user => ({
        user_id: user.id,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    const datosUsers = [
      {
        user_id: users[0].id,
        nombre: 'pablo nahum',
        apaterno: 'Jimenez',
        amaterno: 'de los santos',
        direccion: 'Av. Reforma 123',
        dependencia: 'Congreso del Estado de México',
        departamento: 'Informática',
        cargo: 'Desarrollador Backend',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[1].id,
        nombre: 'gisel Alexia',
        apaterno: 'diaz',
        amaterno: 'romero',
        direccion: 'Calle Juárez 456',
        dependencia: 'Congreso del Estado de México',
        departamento: 'Contabilidad',
        cargo: 'Analista Contable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[2].id,
        nombre: 'cesar',
        apaterno: 'rangel',
        amaterno: 'rojas',
        direccion: 'Blvd. Toluca 789',
        dependencia: 'Congreso del Estado de México',
        departamento: 'Recursos Humanos',
        cargo: 'Jefe de Recursos Humanos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[3].id,
        nombre: 'cesar',
        apaterno: 'garcía',
        amaterno: 'desales',
        direccion: 'Av. Morelos 321',
        dependencia: 'Congreso del Estado de México',
        departamento: 'Jurídico',
        cargo: 'Abogada',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('datos_users', datosUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('datos_users', null, {});
    await queryInterface.bulkDelete('rol_users', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
