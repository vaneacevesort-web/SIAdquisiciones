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
      ['7000', '7100', 'Inversiones para el Fomento de Actividades Productivas'],
      ['7000', '7200', 'Acciones y Participaciones de Capital'],
      ['7000', '7300', 'Compra de Títulos y Valores'],
      ['7000', '7400', 'Concesión de Préstamos'],
      ['7000', '7500', 'Inversiones en Fideicomisos, Mandatos y Otros Análogos'],
      ['7000', '7600', 'Otras Inversiones Financieras'],
      ['7000', '7900', 'Provisiones para Contingencias y Otras Erogaciones Especiales']
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

    console.log('Subcapítulos 7000 procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar subcapítulos 7000:', error);
  } finally {
    await connection.end();
  }
}

main();