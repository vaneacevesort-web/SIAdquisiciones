'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [dependencias] = await queryInterface.sequelize.query(
      `SELECT id_dependencia, nombre FROM adq_dependencias`
    );

    const map = {};
    dependencias.forEach(d => {
      map[d.nombre] = d.id_dependencia;
    });

    await queryInterface.bulkInsert('adq_centros_costo', [
      {
        id_dependencia: map['Secretaría General de Gobierno'],
        nombre: 'Dirección General de Estudios y Proyectos Especiales',
        codigo: '20502003000000S',
        created_at: new Date(),
        updated_at: null
      },
      {
        id_dependencia: map['Secretaría General de Gobierno'],
        nombre: 'Dirección General de Sistemas y Tecnologías de la Información',
        codigo: '20502004000000S',
        created_at: new Date(),
        updated_at: null
      },
      {
        id_dependencia: map['Secretaría de Seguridad'],
        nombre: 'Órgano Interno de Control',
        codigo: '20600002000000S',
        created_at: new Date(),
        updated_at: null
      },
      {
        id_dependencia: map['Oficialía Mayor'],
        nombre: 'Dirección General de Recursos Materiales',
        codigo: '23400005000000L',
        created_at: new Date(),
        updated_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('adq_centros_costo', null, {});
  }
};