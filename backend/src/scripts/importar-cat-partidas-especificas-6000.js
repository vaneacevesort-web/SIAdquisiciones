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
      ['6110', '6111', 'Edificación Habitacional'],
      ['6120', '6121', 'Edificación no Habitacional'],
      ['6130', '6131', 'Construcción de Obras para el Abastecimiento de Agua, Petróleo, Gas, Electricidad y Telecomunicaciones'],
      ['6140', '6141', 'División de Terrenos y Construcción de Obras de Urbanización'],
      ['6150', '6151', 'Construcción de Vías de Comunicación'],
      ['6160', '6161', 'Otras Construcciones de Ingeniería Civil u Obra Pesada'],
      ['6170', '6171', 'Instalaciones y Equipamiento en Construcciones'],
      ['6190', '6191', 'Trabajos de Acabados en Edificaciones y Otros Trabajos Especializados'],

      ['6210', '6211', 'Edificación Habitacional'],
      ['6220', '6221', 'Edificación no Habitacional'],
      ['6230', '6231', 'Construcción de Obras para el Abastecimiento de Agua, Petróleo, Gas, Electricidad y Telecomunicaciones'],
      ['6240', '6241', 'División de Terrenos y Construcción de Obras de Urbanización'],
      ['6250', '6251', 'Construcción de Vías de Comunicación'],
      ['6260', '6261', 'Otras Construcciones de Ingeniería Civil u Obra Pesada'],
      ['6270', '6271', 'Instalaciones y Equipamiento en Construcciones'],
      ['6290', '6291', 'Trabajos de Acabados en Edificaciones y Otros Trabajos Especializados'],

      ['6310', '6311', 'Estudios, Formulación y Evaluación de Proyectos Productivos'],
      ['6320', '6321', 'Ejecución de Proyectos Productivos']
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

    console.log('Partidas específicas 6000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 6000:', error);
  } finally {
    await connection.end();
  }
}

main();