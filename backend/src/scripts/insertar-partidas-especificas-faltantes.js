/**
 * Inserta las partidas específicas faltantes que generan errores en la carga masiva.
 * Usa INSERT ... WHERE NOT EXISTS para no duplicar si ya existen.
 *
 * Partidas a insertar:
 *   2482 → id_partida_generica de 2480  (Materiales Complementarios)
 *   4822 → id_partida_generica de 4820  (Donativos a Entidades Federativas)
 *   3612 → id_partida_generica de 3610  (Difusión por Radio, Televisión y Otros Medios)
 *   3162 → id_partida_generica de 3160  (Servicios de Telecomunicaciones y Satélites)
 *   2492 → id_partida_generica de 2490  (Otros Materiales y Artículos de Construcción y Reparación)
 *   2992 → id_partida_generica de 2990  (Refacciones y Accesorios Menores Otros Bienes Muebles)
 *   4432 → id_partida_generica de 4430  (Ayudas Sociales a Instituciones de Enseñanza)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// [codigoGenérica, codigoEspecífica, nombre]
const PARTIDAS = [
  ['2480', '2482', 'Material Fotográfico y de Video'],
  ['4820', '4822', 'Donativos a Municipios'],
  ['3610', '3612', 'Difusión e Información Institucional en Medios Masivos'],
  ['3160', '3162', 'Telefonía Celular y Comunicación Móvil'],
  ['2490', '2492', 'Otros Materiales y Artículos para Reparaciones Menores'],
  ['2990', '2992', 'Refacciones y Accesorios Menores de Instrumentos y Aparatos'],
  ['4430', '4432', 'Premios, recompensas y pensión recreativa estudiantil'],
];

async function main() {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     Number(process.env.DB_PORT || 3306),
    user:     process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'adquisiciones',
  });

  try {
    console.log('Conectado a MySQL');

    // Cargar mapa codigoGenérica → id_partida_generica
    const [genericas] = await connection.execute(
      'SELECT id_partida_generica, codigo FROM adq_cat_partidas_genericas'
    );
    const mapaGenericas = {};
    for (const row of genericas) {
      mapaGenericas[row.codigo] = row.id_partida_generica;
    }

    // Cargar códigos ya existentes en adq_cat_partidas_especificas
    const [existentes] = await connection.execute(
      'SELECT codigo FROM adq_cat_partidas_especificas'
    );
    const codigosExistentes = new Set(existentes.map(r => r.codigo));

    let insertados = 0;
    let omitidos   = 0;

    for (const [codigoGenerica, codigo, nombre] of PARTIDAS) {
      if (codigosExistentes.has(codigo)) {
        console.log(`  OMITIDA (ya existe): ${codigo} — ${nombre}`);
        omitidos++;
        continue;
      }

      const idPartidaGenerica = mapaGenericas[codigoGenerica];
      if (!idPartidaGenerica) {
        console.warn(`  ADVERTENCIA: partida genérica ${codigoGenerica} no encontrada — no se insertó ${codigo}`);
        omitidos++;
        continue;
      }

      await connection.execute(
        `INSERT INTO adq_cat_partidas_especificas
           (id_partida_generica, codigo, nombre, clave, descripcion, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [idPartidaGenerica, codigo, nombre, codigo, nombre]
      );

      console.log(`  INSERTADA: ${codigo} — ${nombre} (genérica ${codigoGenerica}, id_generica=${idPartidaGenerica})`);
      insertados++;
    }

    console.log(`\nResumen: ${insertados} insertadas, ${omitidos} omitidas.`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
