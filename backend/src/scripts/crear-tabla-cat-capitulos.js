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

    const capitulos = [
      ['1000', 'Servicios Personales'],
      ['2000', 'Materiales y Suministros'],
      ['3000', 'Servicios Generales'],
      ['4000', 'Transferencias, Asignaciones, Subsidios y Otras Ayudas'],
      ['5000', 'Bienes Muebles, Inmuebles e Intangibles'],
      ['6000', 'Inversión Pública'],
      ['7000', 'Inversiones Financieras y Otras Provisiones'],
      ['8000', 'Participaciones y Aportaciones'],
      ['9000', 'Deuda Pública']
    ];

    let procesados = 0;

    for (const [codigo, nombre] of capitulos) {
      await connection.execute(
        `
        INSERT INTO adq_cat_capitulos (codigo, nombre, clave, descripcion)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [codigo, nombre, codigo, nombre]
      );

      procesados++;
    }

    console.log('Capítulos procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar capítulos:', error);
  } finally {
    await connection.end();
  }
}

main();