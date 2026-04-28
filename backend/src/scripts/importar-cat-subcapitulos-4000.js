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
      ['4000', '4100', 'Transferencias Internas y Asignaciones al Sector Público'],
      ['4000', '4200', 'Transferencias al Resto del Sector Público'],
      ['4000', '4300', 'Subsidios y Subvenciones'],
      ['4000', '4400', 'Ayudas Sociales'],
      ['4000', '4500', 'Pensiones y Jubilaciones'],
      ['4000', '4600', 'Transferencias a Fideicomisos, Mandatos y Otros Análogos'],
      ['4000', '4700', 'Transferencias a la Seguridad Social'],
      ['4000', '4800', 'Donativos'],
      ['4000', '4900', 'Transferencias al Exterior']
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

    console.log('Subcapítulos 4000 procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar subcapítulos 4000:', error);
  } finally {
    await connection.end();
  }
}

main();