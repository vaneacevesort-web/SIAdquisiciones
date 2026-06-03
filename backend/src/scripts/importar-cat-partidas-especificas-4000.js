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
      ['4110', '4111', 'Asignaciones Presupuestarias al Poder Ejecutivo'],
      ['4120', '4121', 'Asignaciones Presupuestarias al Poder Legislativo'],
      ['4130', '4131', 'Asignaciones Presupuestarias al Poder Judicial'],
      ['4140', '4141', 'Asignaciones Presupuestarias a Órganos Autónomos'],

      ['4210', '4211', 'Transferencias a Entidades Paraestatales no Empresariales y no Financieras'],
      ['4220', '4221', 'Transferencias a Entidades Paraestatales Empresariales y no Financieras'],
      ['4230', '4231', 'Transferencias a Instituciones Públicas Financieras'],
      ['4240', '4241', 'Transferencias a Entidades Federativas y Municipios'],
      ['4250', '4251', 'Transferencias a Fideicomisos de Entidades Federativas y Municipios'],

      ['4310', '4311', 'Subsidios a la Producción'],
      ['4320', '4321', 'Subsidios a la Distribución'],
      ['4330', '4331', 'Subsidios a la Inversión'],
      ['4340', '4341', 'Subsidios a la Prestación de Servicios Públicos'],
      ['4350', '4351', 'Subsidios para Cubrir Diferenciales de Tasas de Interés'],
      ['4360', '4361', 'Subsidios a la Vivienda'],
      ['4370', '4371', 'Subvenciones al Consumo'],

      ['4410', '4411', 'Cooperaciones y Ayudas'],
      ['4410', '4412', 'Despensas'],
      ['4410', '4413', 'Gastos Relacionados con Actividades Culturales, Deportivas y de Ayuda Extraordinaria'],
      ['4410', '4414', 'Gastos por Servicios de Traslado de Personas'],
      ['4410', '4415', 'Gastos de Atención a Personas'],
      ['4410', '4416', 'Apoyos a Adultos Mayores'],
      ['4410', '4417', 'Apoyos Funcionales a Personas con Discapacidad'],
      ['4410', '4418', 'Canastas Alimentarias para Familias'],
      ['4410', '4419', 'Otras Ayudas Sociales a Personas'],

      ['4420', '4421', 'Becas'],
      ['4420', '4422', 'Capacitación'],
      ['4430', '4431', 'Ayudas a Instituciones Educativas'],
      ['4430', '4432', 'Premios, recompensas y pensión recreativa estudiantil'],
      ['4440', '4441', 'Ayudas a Actividades Científicas o Académicas'],
      ['4450', '4451', 'Ayudas a Instituciones sin Fines de Lucro'],
      ['4460', '4461', 'Ayudas a Cooperativas'],
      ['4470', '4471', 'Ayudas a Entidades de Interés Público'],
      ['4480', '4481', 'Ayudas por Desastres Naturales y Otros Siniestros'],

      ['4510', '4511', 'Pensiones'],
      ['4520', '4521', 'Jubilaciones'],

      ['4610', '4611', 'Transferencias a Fideicomisos del Poder Ejecutivo'],
      ['4620', '4621', 'Transferencias a Fideicomisos del Poder Legislativo'],
      ['4630', '4631', 'Transferencias a Fideicomisos del Poder Judicial'],
      ['4640', '4641', 'Transferencias a Fideicomisos Públicos de Entidades Paraestatales no Empresariales y no Financieras'],
      ['4650', '4651', 'Transferencias a Fideicomisos de Entidades Federativas y Municipios'],
      ['4660', '4661', 'Transferencias a Fideicomisos de Instituciones Públicas Financieras'],

      ['4710', '4711', 'Transferencias por Obligación de Ley'],
      ['4720', '4721', 'Transferencias por Obligación de Seguridad Social'],

      ['4810', '4811', 'Donativos a Instituciones sin Fines de Lucro'],
      ['4820', '4821', 'Donativos a Entidades Federativas'],
      ['4830', '4831', 'Donativos a Fideicomisos Privados'],
      ['4840', '4841', 'Donativos a Fideicomisos Estatales'],

      ['4910', '4911', 'Transferencias para Gobiernos Extranjeros'],
      ['4920', '4921', 'Transferencias para Organismos Internacionales']
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

    console.log('Partidas específicas 4000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 4000:', error);
  } finally {
    await connection.end();
  }
}

main();