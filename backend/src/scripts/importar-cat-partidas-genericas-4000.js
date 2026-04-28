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
      ['4100', '4110', 'Asignaciones Presupuestarias al Poder Ejecutivo'],
      ['4100', '4120', 'Asignaciones Presupuestarias al Poder Legislativo'],
      ['4100', '4130', 'Asignaciones Presupuestarias al Poder Judicial'],
      ['4100', '4140', 'Asignaciones Presupuestarias a Órganos Autónomos'],

      ['4200', '4210', 'Transferencias Otorgadas a Entidades Paraestatales no Empresariales y no Financieras'],
      ['4200', '4220', 'Transferencias Otorgadas para Entidades Paraestatales Empresariales y no Financieras'],
      ['4200', '4230', 'Transferencias Otorgadas para Instituciones Paraestatales Públicas Financieras'],
      ['4200', '4240', 'Transferencias Otorgadas a Entidades Federativas y Municipios'],
      ['4200', '4250', 'Transferencias a Fideicomisos de Entidades Federativas y Municipios'],

      ['4300', '4310', 'Subsidios a la Producción'],
      ['4300', '4320', 'Subsidios a la Distribución'],
      ['4300', '4330', 'Subsidios a la Inversión'],
      ['4300', '4340', 'Subsidios a la Prestación de Servicios Públicos'],
      ['4300', '4350', 'Subsidios para Cubrir Diferenciales de Tasas de Interés'],
      ['4300', '4360', 'Subsidios a la Vivienda'],
      ['4300', '4370', 'Subvenciones al Consumo'],

      ['4400', '4410', 'Ayudas Sociales a Personas'],
      ['4400', '4420', 'Becas y Otras Ayudas para Programas de Capacitación'],
      ['4400', '4430', 'Ayudas Sociales a Instituciones de Enseñanza'],
      ['4400', '4440', 'Ayudas Sociales a Actividades Científicas o Académicas'],
      ['4400', '4450', 'Ayudas Sociales a Instituciones sin Fines de Lucro'],
      ['4400', '4460', 'Ayudas Sociales a Cooperativas'],
      ['4400', '4470', 'Ayudas Sociales a Entidades de Interés Público'],
      ['4400', '4480', 'Ayudas por Desastres Naturales y Otros Siniestros'],

      ['4500', '4510', 'Pensiones'],
      ['4500', '4520', 'Jubilaciones'],

      ['4600', '4610', 'Transferencias a Fideicomisos del Poder Ejecutivo'],
      ['4600', '4620', 'Transferencias a Fideicomisos del Poder Legislativo'],
      ['4600', '4630', 'Transferencias a Fideicomisos del Poder Judicial'],
      ['4600', '4640', 'Transferencias a Fideicomisos Públicos de Entidades Paraestatales no Empresariales y no Financieras'],
      ['4600', '4650', 'Transferencias a Fideicomisos de Entidades Federativas y Municipios'],
      ['4600', '4660', 'Transferencias a Fideicomisos de Instituciones Públicas Financieras'],

      ['4700', '4710', 'Transferencias por Obligación de Ley'],
      ['4700', '4720', 'Transferencias por Obligación de Seguridad Social'],

      ['4800', '4810', 'Donativos a Instituciones sin Fines de Lucro'],
      ['4800', '4820', 'Donativos a Entidades Federativas'],
      ['4800', '4830', 'Donativos a Fideicomisos Privados'],
      ['4800', '4840', 'Donativos a Fideicomisos Estatales'],

      ['4900', '4910', 'Transferencias para Gobiernos Extranjeros'],
      ['4900', '4920', 'Transferencias para Organismos Internacionales']
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

    console.log('Partidas genéricas 4000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 4000:', error);
  } finally {
    await connection.end();
  }
}

main();