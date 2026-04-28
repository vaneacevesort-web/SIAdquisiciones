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
      ['1110', '1111', 'Dietas'],
      ['1120', '1121', 'Haberes'],
      ['1130', '1131', 'Sueldo Base'],
      ['1130', '1132', 'Otro Sueldo Magisterio'],
      ['1130', '1133', 'Hora Clase'],
      ['1130', '1134', 'Carrera Magisterial'],
      ['1130', '1135', 'Carrera Docente'],
      ['1140', '1141', 'Remuneraciones por Adscripción Laboral en el Extranjero'],

      ['1210', '1211', 'Honorarios Asimilables al Salario'],
      ['1220', '1221', 'Sueldo por Interinato'],
      ['1220', '1222', 'Sueldos y Salarios Compactados al Personal Eventual'],
      ['1220', '1223', 'Becas para Médicos Residentes'],
      ['1230', '1231', 'Compensación por Servicio Social'],
      ['1240', '1241', 'Compensación a Representante'],

      ['1310', '1311', 'Prima por Años de Servicio'],
      ['1310', '1312', 'Prima de Antigüedad'],
      ['1310', '1313', 'Prima Adicional por Permanencia en el Servicio'],

      ['1320', '1321', 'Prima Vacacional'],
      ['1320', '1322', 'Aguinaldo'],
      ['1320', '1323', 'Aguinaldo de Eventuales'],
      ['1320', '1324', 'Vacaciones no Disfrutadas por Finiquito'],
      ['1320', '1325', 'Prima Dominical'],

      ['1330', '1331', 'Remuneraciones por Horas Extraordinarias'],

      ['1340', '1341', 'Compensación'],
      ['1340', '1342', 'Compensación por Servicios Especiales'],
      ['1340', '1343', 'Compensación por Riesgo Profesional'],
      ['1340', '1344', 'Compensación por Retabulación'],
      ['1340', '1345', 'Gratificación'],
      ['1340', '1346', 'Gratificación por Convenio'],
      ['1340', '1347', 'Gratificación por Productividad'],
      ['1340', '1348', 'Labores Docentes'],
      ['1340', '1349', 'Estudios Superiores'],

      ['1350', '1351', 'Sobrehaberes'],
      ['1360', '1361', 'Asignaciones de Técnico, de Mando, por Comisión, de Vuelo y de Técnico Especial'],
      ['1370', '1371', 'Honorarios Especiales'],
      ['1380', '1381', 'Participaciones por Vigilancia en el Cumplimiento de las Leyes y Custodia de Valores'],

      ['1410', '1411', 'Aportaciones al ISSSTE'],
      ['1410', '1412', 'Aportaciones de Servicio de Salud'],
      ['1410', '1413', 'Aportaciones al Fondo del Sistema Solidario de Reparto'],
      ['1410', '1414', 'Aportaciones del Sistema de Capitalización Individual'],
      ['1410', '1415', 'Aportaciones para Financiar los Gastos Generales de Administración del ISSEMYM'],
      ['1410', '1416', 'Aportaciones para Riesgo de Trabajo'],
      ['1410', '1417', 'Aportaciones al Seguro de Cesantía en Edad Avanzada y Vejez'],

      ['1420', '1421', 'FOVISSSTE'],
      ['1430', '1431', 'SAR (Sistema de Ahorro para el Retiro)'],
      ['1440', '1441', 'Seguros y Fianzas'],

      ['1510', '1511', 'Cuotas para Fondo de Retiro'],
      ['1510', '1512', 'Seguro de Separación Individualizado'],
      ['1520', '1521', 'Indemnización por Accidentes de Trabajo'],
      ['1520', '1522', 'Liquidaciones por Indemnizaciones, por Sueldos y Salarios Caídos'],
      ['1530', '1531', 'Prima por Jubilación'],

      ['1540', '1541', 'Becas para Hijos de Trabajadores Sindicalizados'],
      ['1540', '1542', 'Días Cívicos y Económicos'],
      ['1540', '1543', 'Gastos Relacionados al Magisterio'],
      ['1540', '1544', 'Día del Maestro y del Servidor Público'],
      ['1540', '1545', 'Estudios de Postgrado'],
      ['1540', '1546', 'Otros Gastos Derivados de Convenio'],
      ['1540', '1547', 'Asignaciones Extraordinarias para Servidores Públicos Sindicalizados'],

      ['1550', '1551', 'Becas Institucionales'],
      ['1550', '1552', 'Profesionalización de los Servidores Públicos'],

      ['1590', '1591', 'Elaboración de Tesis'],
      ['1590', '1592', 'Seguro de Vida'],
      ['1590', '1593', 'Viáticos'],
      ['1590', '1594', 'Diferencial por Escuelas'],
      ['1590', '1595', 'Despensa'],

      ['1610', '1611', 'Previsiones de Carácter Laboral, Económica y de Seguridad Social'],

      ['1710', '1711', 'Reconocimiento a Servidores Públicos'],
      ['1710', '1712', 'Estímulos por Puntualidad y Asistencia'],

      ['1720', '1721', 'Recompensas']
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

    console.log('Partidas específicas 1000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 1000:', error);
  } finally {
    await connection.end();
  }
}

main();