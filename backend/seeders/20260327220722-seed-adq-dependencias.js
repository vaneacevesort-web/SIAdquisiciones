'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('adq_dependencias', [
      { nombre: 'Secretaría General de Gobierno', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Seguridad', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Finanzas', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Salud', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría del Trabajo', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Educación, Ciencia, Tecnología e Innovación', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Bienestar', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Desarrollo Económico', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Contraloría', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Movilidad', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secrettaría de Medio Ambiente y Desarrollo Sustentable', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Desarollo Urbano e Infraestructura', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría del Campo', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de Cultura y Turismo', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría de las Mujeres', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Secretaría del Agua', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Consejería Jurídica', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Oficialía Mayor', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Agencia Digital del Estado de México', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null },
      { nombre: 'Organismos OPDS', tipo: 'DEPENDENCIA', created_at: new Date(), updated_at: null }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('adq_dependencias', null, {});
  }
};