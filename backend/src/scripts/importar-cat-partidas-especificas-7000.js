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
      ['7110', '7111', 'Créditos Otorgados para el Fomento de Actividades Productivas'],
      ['7120', '7121', 'Créditos Otorgados a Municipios para Actividades Productivas'],

      ['7210', '7211', 'Acciones y Participaciones de Capital en Entidades no Empresariales'],
      ['7220', '7221', 'Acciones y Participaciones de Capital en Entidades Empresariales'],
      ['7230', '7231', 'Acciones y Participaciones de Capital en Instituciones Públicas Financieras'],
      ['7240', '7241', 'Acciones y Participaciones de Capital en el Sector Privado'],
      ['7250', '7251', 'Acciones y Participaciones de Capital en Organismos Internacionales'],

      ['7310', '7311', 'Bonos'],
      ['7320', '7321', 'Valores Representativos de Deuda'],
      ['7330', '7331', 'Valores Representativos de Capital'],

      ['7410', '7411', 'Préstamos a Entidades no Empresariales y no Financieras'],
      ['7420', '7421', 'Préstamos a Entidades Empresariales y no Financieras'],
      ['7430', '7431', 'Préstamos a Instituciones Públicas Financieras'],
      ['7440', '7441', 'Préstamos a Entidades Federativas y Municipios'],
      ['7450', '7451', 'Préstamos al Sector Privado'],
      ['7460', '7461', 'Préstamos al Sector Externo'],

      ['7510', '7511', 'Inversiones en Fideicomisos del Poder Ejecutivo'],
      ['7520', '7521', 'Inversiones en Fideicomisos del Poder Legislativo'],
      ['7530', '7531', 'Inversiones en Fideicomisos del Poder Judicial'],
      ['7540', '7541', 'Inversiones en Fideicomisos Públicos no Empresariales y no Financieros'],
      ['7550', '7551', 'Inversiones en Fideicomisos Públicos Empresariales y no Financieros'],
      ['7560', '7561', 'Inversiones en Fideicomisos Públicos Financieros'],
      ['7570', '7571', 'Inversiones en Fideicomisos de Entidades Federativas'],
      ['7580', '7581', 'Inversiones en Fideicomisos de Municipios'],
      ['7590', '7591', 'Fideicomisos de Empresas Privadas y Particulares'],

      ['7610', '7611', 'Depósitos a Largo Plazo en Moneda Nacional'],
      ['7620', '7621', 'Depósitos a Largo Plazo en Moneda Extranjera'],

      ['7910', '7911', 'Contingencias por Fenómenos Naturales'],
      ['7920', '7921', 'Contingencias Socioeconómicas'],
      ['7990', '7991', 'Otras Erogaciones Especiales']
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

    console.log('Partidas específicas 7000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 7000:', error);
  } finally {
    await connection.end();
  }
}

main();