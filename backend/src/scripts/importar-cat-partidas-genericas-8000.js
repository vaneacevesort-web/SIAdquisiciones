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

    const [subcapitulos] = await connection.execute(`
      SELECT id_subcapitulo, codigo
      FROM adq_cat_subcapitulos
    `);

    const mapaSubcapitulos = {};
    for (const row of subcapitulos) {
      mapaSubcapitulos[row.codigo] = row.id_subcapitulo;
    }

    const partidasGenericas = [
      ['8100', '8110', 'Participaciones de la Federación a Entidades Federativas y Municipios'],
      ['8100', '8120', 'Participaciones de las Entidades Federativas a los Municipios'],
      ['8100', '8190', 'Otras Participaciones'],

      ['8300', '8310', 'Aportaciones de la Federación a las Entidades Federativas'],
      ['8300', '8320', 'Aportaciones de la Federación a Municipios'],
      ['8300', '8330', 'Aportaciones de las Entidades Federativas a los Municipios'],
      ['8300', '8340', 'Aportaciones previstas en leyes y decretos al sistema de protección social'],
      ['8300', '8350', 'Aportaciones previstas en leyes y decretos compensatorias a entidades federativas y municipios'],

      ['8500', '8510', 'Convenios de reasignación'],
      ['8500', '8520', 'Convenios de descentralización'],
      ['8500', '8530', 'Otros Convenios']
    ];

    let procesados = 0;

    for (const [codigoSubcapitulo, codigo, nombre] of partidasGenericas) {
      const idSubcapitulo = mapaSubcapitulos[codigoSubcapitulo];

      if (!idSubcapitulo) {
        console.log(`Subcapítulo no encontrado para partida genérica ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_partidas_genericas (
          id_subcapitulo,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_subcapitulo = VALUES(id_subcapitulo),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idSubcapitulo, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Partidas genéricas 8000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 8000:', error);
  } finally {
    await connection.end();
  }
}

main();