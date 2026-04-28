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
      ['9110', '9111', 'Amortización de la Deuda Interna con Instituciones de Crédito'],
      ['9120', '9121', 'Amortización de la Deuda Interna por Emisión de Títulos y Valores'],
      ['9130', '9131', 'Amortización de Arrendamientos Financieros Nacionales'],
      ['9140', '9141', 'Amortización de la Deuda Externa con Instituciones de Crédito'],
      ['9150', '9151', 'Amortización de Deuda con Organismos Financieros Internacionales'],
      ['9160', '9161', 'Amortización de la Deuda Bilateral'],
      ['9170', '9171', 'Amortización de la Deuda Externa por Emisión de Títulos y Valores'],
      ['9180', '9181', 'Amortización de Arrendamientos Financieros Internacionales'],

      ['9210', '9211', 'Intereses de la Deuda Interna con Instituciones de Crédito'],
      ['9220', '9221', 'Intereses Derivados de la Colocación de Títulos y Valores'],
      ['9230', '9231', 'Intereses por Arrendamientos Financieros Nacionales'],
      ['9240', '9241', 'Intereses de la Deuda Externa con Instituciones de Crédito'],
      ['9250', '9251', 'Intereses de la Deuda con Organismos Financieros Internacionales'],
      ['9260', '9261', 'Intereses de la Deuda Bilateral'],
      ['9270', '9271', 'Intereses Derivados de la Colocación de Títulos y Valores en el Exterior'],
      ['9280', '9281', 'Intereses por Arrendamientos Financieros Internacionales'],

      ['9310', '9311', 'Comisiones de la Deuda Pública Interna'],
      ['9320', '9321', 'Comisiones de la Deuda Pública Externa'],

      ['9410', '9411', 'Gastos de la Deuda Pública Interna'],
      ['9420', '9421', 'Gastos de la Deuda Pública Externa'],

      ['9510', '9511', 'Costos por Coberturas'],
      ['9520', '9521', 'Costos por Coberturas de la Deuda Pública'],

      ['9610', '9611', 'Apoyos a Intermediarios Financieros'],
      ['9620', '9621', 'Apoyos a Ahorradores y Deudores del Sistema Financiero Nacional'],

      ['9910', '9911', 'ADEFAS'],
      ['9920', '9921', 'Pasivos Derivados de Erogaciones Devengadas y Pendientes de Liquidar']
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

    console.log('Partidas específicas 9000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 9000:', error);
  } finally {
    await connection.end();
  }
}

main();