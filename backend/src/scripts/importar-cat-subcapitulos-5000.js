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

    const [capitulos] = await connection.execute(`
      SELECT id_capitulo, codigo
      FROM adq_cat_capitulos
    `);

    const mapaCapitulos = {};
    for (const row of capitulos) {
      mapaCapitulos[row.codigo] = row.id_capitulo;
    }

    const subcapitulos = [
      ['5000', '5100', 'Mobiliario y Equipo de Administración'],
      ['5000', '5200', 'Mobiliario y Equipo Educacional y Recreativo'],
      ['5000', '5300', 'Equipo e Instrumental Médico y de Laboratorio'],
      ['5000', '5400', 'Vehículos y Equipo de Transporte'],
      ['5000', '5500', 'Equipo de Defensa y Seguridad'],
      ['5000', '5600', 'Maquinaria, Otros Equipos y Herramientas'],
      ['5000', '5700', 'Activos Biológicos'],
      ['5000', '5800', 'Bienes Inmuebles'],
      ['5000', '5900', 'Activos Intangibles']
    ];

    let procesados = 0;

    for (const [codigoCapitulo, codigo, nombre] of subcapitulos) {
      const idCapitulo = mapaCapitulos[codigoCapitulo];

      if (!idCapitulo) {
        console.log(`Capítulo no encontrado para subcapítulo ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_subcapitulos (
          id_capitulo,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_capitulo = VALUES(id_capitulo),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idCapitulo, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Subcapítulos 5000 procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar subcapítulos 5000:', error);
  } finally {
    await connection.end();
  }
}

main();