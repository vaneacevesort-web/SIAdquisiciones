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

    const [genericas] = await connection.execute(`
      SELECT id_partida_generica, codigo
      FROM adq_cat_partidas_genericas
    `);

    const mapaGenericas = {};
    for (const row of genericas) {
      mapaGenericas[row.codigo] = row.id_partida_generica;
    }

    const partidasEspecificas = [
      ['8110', '8111', 'Participaciones de la Federación a Entidades Federativas y Municipios'],
      ['8120', '8121', 'Participaciones de las Entidades Federativas a los Municipios'],
      ['8190', '8191', 'Otras Participaciones'],

      ['8310', '8311', 'Aportaciones de la Federación a las Entidades Federativas'],
      ['8320', '8321', 'Aportaciones de la Federación a Municipios'],
      ['8330', '8331', 'Aportaciones de las Entidades Federativas a los Municipios'],
      ['8340', '8341', 'Aportaciones previstas en leyes y decretos al sistema de protección social'],
      ['8350', '8351', 'Aportaciones previstas en leyes y decretos compensatorias a entidades federativas y municipios'],

      ['8510', '8511', 'Convenios de reasignación'],
      ['8520', '8521', 'Convenios de descentralización'],
      ['8530', '8531', 'Otros Convenios']
    ];

    let procesados = 0;

    for (const [codigoGenerica, codigo, nombre] of partidasEspecificas) {
      const idPartidaGenerica = mapaGenericas[codigoGenerica];

      if (!idPartidaGenerica) {
        console.log(`Partida genérica no encontrada para específica ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_partidas_especificas (
          id_partida_generica,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_partida_generica = VALUES(id_partida_generica),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idPartidaGenerica, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Partidas específicas 8000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 8000:', error);
  } finally {
    await connection.end();
  }
}

main();