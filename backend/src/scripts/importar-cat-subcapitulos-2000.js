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
      ['2000', '2100', 'Materiales de Administración, Emisión de Documentos y Artículos Oficiales'],
      ['2000', '2200', 'Alimentos y Utensilios'],
      ['2000', '2300', 'Materias Primas y Materiales de Producción y Comercialización'],
      ['2000', '2400', 'Materiales y Artículos de Construcción y de Reparación'],
      ['2000', '2500', 'Productos Químicos, Farmacéuticos y de Laboratorio'],
      ['2000', '2600', 'Combustibles, Lubricantes y Aditivos'],
      ['2000', '2700', 'Vestuario, Blancos, Prendas de Protección y Artículos Deportivos'],
      ['2000', '2800', 'Materiales y Suministros para Seguridad'],
      ['2000', '2900', 'Herramientas, Refacciones y Accesorios Menores']
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

    console.log('Subcapítulos 2000 procesados =>', procesados);
  } catch (error) {
    console.error('Error al importar subcapítulos 2000:', error);
  } finally {
    await connection.end();
  }
}

main();