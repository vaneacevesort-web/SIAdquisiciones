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
      ['6100', '6110', 'Edificación Habitacional'],
      ['6100', '6120', 'Edificación no Habitacional'],
      ['6100', '6130', 'Construcción de Obras para el Abastecimiento de Agua, Petróleo, Gas, Electricidad y Telecomunicaciones'],
      ['6100', '6140', 'División de Terrenos y Construcción de Obras de Urbanización'],
      ['6100', '6150', 'Construcción de Vías de Comunicación'],
      ['6100', '6160', 'Otras Construcciones de Ingeniería Civil u Obra Pesada'],
      ['6100', '6170', 'Instalaciones y Equipamiento en Construcciones'],
      ['6100', '6190', 'Trabajos de Acabados en Edificaciones y Otros Trabajos Especializados'],

      ['6200', '6210', 'Edificación Habitacional'],
      ['6200', '6220', 'Edificación no Habitacional'],
      ['6200', '6230', 'Construcción de Obras para el Abastecimiento de Agua, Petróleo, Gas, Electricidad y Telecomunicaciones'],
      ['6200', '6240', 'División de Terrenos y Construcción de Obras de Urbanización'],
      ['6200', '6250', 'Construcción de Vías de Comunicación'],
      ['6200', '6260', 'Otras Construcciones de Ingeniería Civil u Obra Pesada'],
      ['6200', '6270', 'Instalaciones y Equipamiento en Construcciones'],
      ['6200', '6290', 'Trabajos de Acabados en Edificaciones y Otros Trabajos Especializados'],

      ['6300', '6310', 'Estudios, Formulación y Evaluación de Proyectos Productivos no Incluidos en Conceptos Anteriores de este Capítulo'],
      ['6300', '6320', 'Ejecución de Proyectos Productivos no Incluidos en Conceptos Anteriores de este Capítulo']
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

    console.log('Partidas genéricas 6000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 6000:', error);
  } finally {
    await connection.end();
  }
}

main();