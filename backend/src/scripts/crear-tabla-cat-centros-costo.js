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

    await connection.execute(`DROP TABLE IF EXISTS adq_cat_centros_costo`);

    await connection.execute(`
      CREATE TABLE adq_cat_centros_costo (
        id_cat_centro_costo BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(30) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT NULL,
        UNIQUE KEY uk_adq_cat_centros_costo_codigo (codigo)
      )
    `);

    console.log('Tabla adq_cat_centros_costo creada correctamente');
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  } finally {
    await connection.end();
  }
}

main();