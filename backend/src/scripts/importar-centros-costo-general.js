const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adquisiciones'
  });

  try {
    console.log('Conectado a MySQL');

    const mapaDependencias = {
      '205': 'Secretaría General de Gobierno',
      '206': 'Secretaría de Seguridad',
      '207': 'Secretaría de Finanzas',
      '208': 'Secretaría de Salud',
      '209': 'Secretaría del Trabajo',
      '215': 'Secretaría de Desarrollo Económico',
      '220': 'Secretaría de Movilidad',
      '225': 'Secretaría del Campo',
      '226': 'Secretaría de Cultura y Turismo',
      '227': 'Secretaría de las Mujeres',
      '228': 'Secretaría de Educación, Ciencia, Tecnología e Innovación',
      '229': 'Secretaría de Bienestar',
      '230': 'Secretaría de Desarrollo Urbano e Infraestructura',
      '231': 'Secretaría de Medio Ambiente y Desarrollo Sustentable',
      '232': 'Secretaría del Agua',
      '233': 'Consejería Jurídica',
      '234': 'Oficialía Mayor'
    };

    const [dependencias] = await connection.execute(`
      SELECT id_dependencia, nombre
      FROM adq_dependencias
    `);

    const dependenciaPorNombre = {};
    for (const dep of dependencias) {
      dependenciaPorNombre[String(dep.nombre).trim()] = dep.id_dependencia;
    }

    const [catalogo] = await connection.execute(`
      SELECT codigo, nombre
      FROM adq_cat_centros_costo
      ORDER BY codigo
    `);

    console.log('Registros en catálogo =>', catalogo.length);

    let insertados = 0;
    let omitidos = 0;
    let sinMapa = 0;

    for (const row of catalogo) {
      const codigo = String(row.codigo || '').trim();
      const nombre = String(row.nombre || '').trim();

      if (!codigo || !nombre) {
        omitidos++;
        continue;
      }

      let nombreDependencia = '';

      // Reglas especiales para claves 218...
      if (
        codigo.startsWith('2180000001') ||
        codigo.startsWith('2180000002') ||
        codigo.startsWith('2180000900') ||
        codigo.startsWith('218A')
      ) {
        nombreDependencia = 'Agencia Digital del Estado de México';
      } else if (
        codigo.startsWith('2180000400') ||
        codigo.startsWith('2180000500') ||
        codigo.startsWith('2180000700') ||
        codigo.startsWith('2180000800') ||
        codigo.startsWith('2180001A') ||
        codigo.startsWith('21802A') ||
        codigo.startsWith('21803A') ||
        codigo.startsWith('218B020')
      ) {
        nombreDependencia = 'Secretaría de Contraloría';
      } else {
        const prefijo = codigo.substring(0, 3);
        nombreDependencia = mapaDependencias[prefijo] || '';
      }

      nombreDependencia = String(nombreDependencia).trim();

      if (!nombreDependencia) {
        sinMapa++;
        continue;
      }

      const idDependencia = dependenciaPorNombre[nombreDependencia];

      if (!idDependencia) {
        console.log(`Dependencia no encontrada en BD: ${nombreDependencia}`);
        sinMapa++;
        continue;
      }

      const [existente] = await connection.execute(
        `
        SELECT id_centro_costo
        FROM adq_centros_costo
        WHERE codigo = ?
        LIMIT 1
        `,
        [codigo]
      );

      if (existente.length > 0) {
        omitidos++;
        continue;
      }

      await connection.execute(
        `
        INSERT INTO adq_centros_costo (
          id_dependencia,
          nombre,
          codigo,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)
        `,
        [idDependencia, nombre, codigo]
      );

      insertados++;
    }

    console.log('Insertados =>', insertados);
    console.log('Omitidos =>', omitidos);
    console.log('Sin mapa =>', sinMapa);
  } catch (error) {
    console.error('Error al importar centros de costo generales:', error);
  } finally {
    await connection.end();
  }
}

main();