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
      ['9100', '9110', 'Amortización de la Deuda Interna con Instituciones de Crédito'],
      ['9100', '9120', 'Amortización de la Deuda Interna por Emisión de Títulos y Valores'],
      ['9100', '9130', 'Amortización de Arrendamientos Financieros Nacionales'],
      ['9100', '9140', 'Amortización de la Deuda Externa con Instituciones de Crédito'],
      ['9100', '9150', 'Amortización de Deuda Externa con Organismos Financieros Internacionales'],
      ['9100', '9160', 'Amortización de la Deuda Bilateral'],
      ['9100', '9170', 'Amortización de la Deuda Externa por Emisión de Títulos y Valores'],
      ['9100', '9180', 'Amortización de Arrendamientos Financieros Internacionales'],

      ['9200', '9210', 'Intereses de la Deuda Interna con Instituciones de Crédito'],
      ['9200', '9220', 'Intereses Derivados de la Colocación de Títulos y Valores'],
      ['9200', '9230', 'Intereses por Arrendamientos Financieros Nacionales'],
      ['9200', '9240', 'Intereses de la Deuda Externa con Instituciones de Crédito'],
      ['9200', '9250', 'Intereses de la Deuda con Organismos Financieros Internacionales'],
      ['9200', '9260', 'Intereses de la Deuda Bilateral'],
      ['9200', '9270', 'Intereses Derivados de la Colocación de Títulos y Valores en el Exterior'],
      ['9200', '9280', 'Intereses por Arrendamientos Financieros Internacionales'],

      ['9300', '9310', 'Comisiones de la Deuda Pública Interna'],
      ['9300', '9320', 'Comisiones de la Deuda Pública Externa'],

      ['9400', '9410', 'Gastos de la Deuda Pública Interna'],
      ['9400', '9420', 'Gastos de la Deuda Pública Externa'],

      ['9500', '9510', 'Costos por Coberturas'],
      ['9500', '9520', 'Costos por Coberturas de la Deuda Pública'],

      ['9600', '9610', 'Apoyos a Intermediarios Financieros'],
      ['9600', '9620', 'Apoyos a Ahorradores y Deudores del Sistema Financiero Nacional'],

      ['9900', '9910', 'ADEFAS'],
      ['9900', '9920', 'Pasivos Derivados de Erogaciones Devengadas y Pendientes de Liquidar']
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

    console.log('Partidas genéricas 9000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 9000:', error);
  } finally {
    await connection.end();
  }
}

main();