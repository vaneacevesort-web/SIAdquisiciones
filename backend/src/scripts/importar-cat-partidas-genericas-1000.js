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
      ['1100', '1110', 'Dietas'],
      ['1100', '1120', 'Haberes'],
      ['1100', '1130', 'Sueldos Base al Personal Permanente'],
      ['1100', '1140', 'Remuneraciones por Adscripción Laboral en el Extranjero'],

      ['1200', '1210', 'Honorarios Asimilables a Salarios'],
      ['1200', '1220', 'Sueldos Base al Personal Eventual'],
      ['1200', '1230', 'Retribuciones por Servicios de Carácter Social'],
      ['1200', '1240', 'Retribución a los Representantes de los Trabajadores y de los Patrones en la Junta de Conciliación y Arbitraje'],

      ['1300', '1310', 'Primas por Años de Servicio Efectivos Prestados'],
      ['1300', '1320', 'Primas de Vacaciones, Dominical y Gratificación de Fin de Año'],
      ['1300', '1330', 'Horas Extraordinarias'],
      ['1300', '1340', 'Compensaciones'],
      ['1300', '1350', 'Sobrehaberes'],
      ['1300', '1360', 'Asignaciones de Técnico, de Mando, por Comisión, de Vuelo y de Técnico Especial'],
      ['1300', '1370', 'Honorarios Especiales'],
      ['1300', '1380', 'Participaciones por Vigilancia en el Cumplimiento de las Leyes y Custodia de Valores'],

      ['1400', '1410', 'Aportaciones de Seguridad Social'],
      ['1400', '1420', 'Aportaciones a Fondos de Vivienda'],
      ['1400', '1430', 'Aportaciones al Sistema para el Retiro'],
      ['1400', '1440', 'Aportaciones para Seguros'],

      ['1500', '1510', 'Cuotas para el Fondo de Ahorro y Fondo de Trabajo'],
      ['1500', '1520', 'Indemnizaciones'],
      ['1500', '1530', 'Prestaciones y Haberes de Retiro'],
      ['1500', '1540', 'Prestaciones Contractuales'],
      ['1500', '1550', 'Apoyos a la Capacitación de los Servidores Públicos'],
      ['1500', '1590', 'Otras Prestaciones Sociales y Económicas'],

      ['1600', '1610', 'Previsiones de Carácter Laboral, Económica y de Seguridad Social'],

      ['1700', '1710', 'Estímulos'],
      ['1700', '1720', 'Recompensas']
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

    console.log('Partidas genéricas 1000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 1000:', error);
  } finally {
    await connection.end();
  }
}

main();