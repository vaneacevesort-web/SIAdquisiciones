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

    const [capitulos] = await connection.execute(`
      SELECT id_capitulo, codigo
      FROM adq_cat_capitulos
    `);

    const mapaCapitulos = {};
    for (const row of capitulos) {
      mapaCapitulos[row.codigo] = row.id_capitulo;
    }

    const subcapitulos = [
      ['3000', '3100', 'Servicios Básicos'],
      ['3000', '3200', 'Servicios de Arrendamiento'],
      ['3000', '3300', 'Servicios Profesionales, Científicos, Técnicos y Otros Servicios'],
      ['3000', '3400', 'Servicios Financieros, Bancarios y Comerciales'],
      ['3000', '3500', 'Servicios de Instalación, Reparación, Mantenimiento y Conservación'],
      ['3000', '3600', 'Servicios de Comunicación Social y Publicidad'],
      ['3000', '3700', 'Servicios de Traslado y Viáticos'],
      ['3000', '3800', 'Servicios Oficiales'],
      ['3000', '3900', 'Otros Servicios Generales']
    ];

    let procesados = 0;

    for (const [codigoCapitulo, codigo, nombre] of subcapitulos) {
      const idCapitulo = mapaCapitulos[codigoCapitulo];

      if (!idCapitulo) {
        console.log(`Capítulo no encontrado para subcapítulo ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_subcapitulos (
          id_capitulo,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_capitulo = VALUES(id_capitulo),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idCapitulo, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Subcapítulos 3000 procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar subcapítulos 3000:', error);
  } finally {
    await connection.end();
  }
}

main();