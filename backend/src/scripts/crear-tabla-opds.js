require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
});

  try {
    console.log('Conectado a MySQL');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adq_organismosOPDS (
        id_organismo_opds INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        codigo VARCHAR(30) NOT NULL,
        created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_adq_organismosOPDS_codigo (codigo)
      )
    `);

    console.log('Tabla adq_organismosOPDS creada correctamente.');
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  } finally {
    await connection.end();
  }
}

main();