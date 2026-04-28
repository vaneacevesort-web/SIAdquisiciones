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
      ['7100', '7110', 'Créditos Otorgados por Entidades Federativas y Municipios al Sector Social y Privado para el Fomento de Actividades Productivas'],
      ['7100', '7120', 'Créditos Otorgados por las Entidades Federativas a Municipios para el Fomento de Actividades Productivas'],

      ['7200', '7210', 'Acciones y Participaciones de Capital en Entidades Paraestatales no Empresariales y no Financieras con Fines de Política Económica'],
      ['7200', '7220', 'Acciones y Participaciones de Capital en Entidades Paraestatales Empresariales y no Financieras con Fines de Política Económica'],
      ['7200', '7230', 'Acciones y Participaciones de Capital en Instituciones Paraestatales Públicas Financieras con Fines de Política Económica'],
      ['7200', '7240', 'Acciones y Participaciones de Capital en el Sector Privado con Fines de Política Económica'],
      ['7200', '7250', 'Acciones y Participaciones de Capital en Organismos Internacionales con Fines de Política Económica'],

      ['7300', '7310', 'Bonos'],
      ['7300', '7320', 'Valores Representativos de Deuda Adquiridos con Fines de Política Económica'],
      ['7300', '7330', 'Valores Representativos de Capital Adquiridos con Fines de Política Económica'],

      ['7400', '7410', 'Concesión de Préstamos a Entidades Paraestatales no Empresariales y no Financieras con Fines de Política Económica'],
      ['7400', '7420', 'Concesión de Préstamos a Entidades Paraestatales Empresariales y no Financieras con Fines de Política Económica'],
      ['7400', '7430', 'Concesión de Préstamos a Instituciones Paraestatales Públicas Financieras con Fines de Política Económica'],
      ['7400', '7440', 'Concesión de Préstamos a Entidades Federativas y Municipios con Fines de Política Económica'],
      ['7400', '7450', 'Concesión de Préstamos al Sector Privado con Fines de Política Económica'],
      ['7400', '7460', 'Concesión de Préstamos al Sector Externo con Fines de Política Económica'],

      ['7500', '7510', 'Inversiones en Fideicomisos del Poder Ejecutivo'],
      ['7500', '7520', 'Inversiones en Fideicomisos del Poder Legislativo'],
      ['7500', '7530', 'Inversiones en Fideicomisos del Poder Judicial'],
      ['7500', '7540', 'Inversiones en Fideicomisos Públicos no Empresariales y no Financieros'],
      ['7500', '7550', 'Inversiones en Fideicomisos Públicos Empresariales y no Financieros'],
      ['7500', '7560', 'Inversiones en Fideicomisos Públicos Financieros'],
      ['7500', '7570', 'Inversiones en Fideicomisos de Entidades Federativas'],
      ['7500', '7580', 'Inversiones en Fideicomisos de Municipios'],
      ['7500', '7590', 'Fideicomisos de Empresas Privadas y Particulares'],

      ['7600', '7610', 'Depósitos a Largo Plazo en Moneda Nacional'],
      ['7600', '7620', 'Depósitos a Largo Plazo en Moneda Extranjera'],

      ['7900', '7910', 'Contingencias por Fenómenos Naturales'],
      ['7900', '7920', 'Contingencias Socioeconómicas'],
      ['7900', '7990', 'Otras Erogaciones Especiales']
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

    console.log('Partidas genéricas 7000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 7000:', error);
  } finally {
    await connection.end();
  }
}

main();