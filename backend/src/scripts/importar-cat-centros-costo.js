require('dotenv').config();
const path = require('path');
const mysql = require('mysql2/promise');
const XLSX = require('xlsx');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adquisiciones',
  });

  try {
    console.log('Conectado a MySQL');

    const filePath = path.join(__dirname, '../../centros_costo_diccionario_filtrado(1).xlsx');
    const workbook = XLSX.readFile(filePath);

    console.log('Hojas del archivo =>', workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error('No se encontró ninguna hoja válida');
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    console.log('Hoja usada =>', sheetName);
    console.log('Primeras filas =>', rows.slice(0, 5));

    let procesados = 0;

    for (const row of rows) {
      const codigo = String(row['Clave'] || '').trim();
      const nombre = String(row['Descripción'] || '').trim();

      if (!codigo || !nombre) continue;

      await connection.execute(
        `
        INSERT INTO adq_cat_centros_costo (codigo, nombre)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          updated_at = CURRENT_TIMESTAMP
        `,
        [codigo, nombre]
      );

      procesados++;
    }

    console.log(`Registros procesados: ${procesados}`);
  } catch (error) {
    console.error('Error al importar catálogo de centros de costo:', error);
  } finally {
    await connection.end();
  }
}

main();
