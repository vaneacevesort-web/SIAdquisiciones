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
      CREATE TABLE IF NOT EXISTS adq_cat_partidas_especificas (
        id_partida_especifica INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        id_partida_generica INT UNSIGNED NOT NULL,
        codigo VARCHAR(10) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        clave VARCHAR(10) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT NULL,
        UNIQUE KEY uk_adq_cat_partidas_especificas_codigo (codigo),
        UNIQUE KEY uk_adq_cat_partidas_especificas_clave (clave),
        KEY idx_adq_cat_partidas_especificas_id_partida_generica (id_partida_generica),
        CONSTRAINT fk_adq_cat_partidas_especificas_generica
          FOREIGN KEY (id_partida_generica)
          REFERENCES adq_cat_partidas_genericas(id_partida_generica)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      )
    `);

    console.log('Tabla adq_cat_partidas_especificas creada correctamente');
  } catch (error) {
    console.error('Error al crear tabla de partidas específicas:', error);
  } finally {
    await connection.end();
  }
}

main();