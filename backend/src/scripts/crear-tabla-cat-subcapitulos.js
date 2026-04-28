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

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS adq_cat_subcapitulos (
        id_subcapitulo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        id_capitulo INT UNSIGNED NOT NULL,
        codigo VARCHAR(10) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        clave VARCHAR(10) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT NULL,
        UNIQUE KEY uk_adq_cat_subcapitulos_codigo (codigo),
        UNIQUE KEY uk_adq_cat_subcapitulos_clave (clave),
        KEY idx_adq_cat_subcapitulos_id_capitulo (id_capitulo),
        CONSTRAINT fk_adq_cat_subcapitulos_capitulo
          FOREIGN KEY (id_capitulo)
          REFERENCES adq_cat_capitulos(id_capitulo)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      )
    `);

    console.log('Tabla adq_cat_subcapitulos creada correctamente');
  } catch (error) {
    console.error('Error al crear tabla de subcapítulos:', error);
  } finally {
    await connection.end();
  }
}

main();