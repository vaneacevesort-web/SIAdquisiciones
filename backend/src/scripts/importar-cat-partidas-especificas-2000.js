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

    const [genericas] = await connection.execute(`
      SELECT id_partida_generica, codigo
      FROM adq_cat_partidas_genericas
    `);

    const mapaGenericas = {};
    for (const row of genericas) {
      mapaGenericas[row.codigo] = row.id_partida_generica;
    }

    const partidasEspecificas = [
      ['2110', '2111', 'Materiales y Útiles de Oficina'],
      ['2110', '2112', 'Enseres de Oficina'],
      ['2120', '2121', 'Material y Útiles de Imprenta y Reproducción'],
      ['2130', '2131', 'Material Estadístico y Geográfico'],
      ['2140', '2141', 'Materiales y Útiles para el Procesamiento en Equipos y Bienes Informáticos'],
      ['2140', '2142', 'Materiales y Útiles de Tecnologías de la Información y Comunicaciones'],
      ['2150', '2151', 'Material de Información'],
      ['2160', '2161', 'Material y Enseres de Limpieza'],
      ['2170', '2171', 'Material Didáctico'],
      ['2180', '2181', 'Material para Identificación y Registro'],

      ['2210', '2211', 'Productos Alimenticios para Personas'],
      ['2220', '2221', 'Equipamiento y Enseres para Animales'],
      ['2220', '2222', 'Productos alimenticios para animales'],
      ['2230', '2231', 'Utensilios para el Servicio de Alimentación'],

      ['2310', '2311', 'Materias Primas y Materiales de Producción'],
      ['2320', '2321', 'Insumos Textiles'],
      ['2330', '2331', 'Productos de Papel, Cartón e Impresos como Materia Prima'],
      ['2340', '2341', 'Combustibles, Lubricantes, Aditivos, Carbón y sus Derivados como Materia Prima'],
      ['2350', '2351', 'Productos Químicos, Farmacéuticos y de Laboratorio como Materia Prima'],
      ['2360', '2361', 'Productos Metálicos y a Base de Minerales no Metálicos como Materia Prima'],
      ['2370', '2371', 'Productos de Cuero, Piel, Plástico y Hule como Materia Prima'],
      ['2380', '2381', 'Mercancías para su Comercialización'],
      ['2390', '2391', 'Otros Productos Adquiridos como Materia Prima'],

      ['2410', '2411', 'Productos Minerales no Metálicos'],
      ['2420', '2421', 'Cemento y Productos de Concreto'],
      ['2430', '2431', 'Cal, Yeso y Productos de Yeso'],
      ['2440', '2441', 'Madera y Productos de Madera'],
      ['2450', '2451', 'Vidrio y Productos de Vidrio'],
      ['2460', '2461', 'Material Eléctrico y Electrónico'],
      ['2470', '2471', 'Artículos Metálicos para la Construcción'],
      ['2480', '2481', 'Materiales Complementarios'],
      ['2480', '2482', 'Material de señalización'],
      ['2490', '2491', 'Otros Materiales y Artículos de Construcción y Reparación'],
      ['2490', '2492', 'Estructuras y manufacturas para construcción'],

      ['2510', '2511', 'Sustancias Químicas'],
      ['2520', '2521', 'Plaguicidas, Abonos y Fertilizantes'],
      ['2530', '2531', 'Medicinas y Productos Farmacéuticos'],
      ['2540', '2541', 'Materiales, Accesorios y Suministros Médicos'],
      ['2550', '2551', 'Materiales, Accesorios y Suministros de Laboratorio'],
      ['2560', '2561', 'Fibras Sintéticas, Hules, Plásticos y Derivados'],
      ['2570', '2571', 'Productos de Cuero, Piel, Plástico y Hule'],
      ['2580', '2581', 'Productos Químicos, Farmacéuticos y de Laboratorio no Clasificados en Otra Parte'],
      ['2590', '2591', 'Otros Productos Químicos'],

      ['2610', '2611', 'Combustibles, Lubricantes y Aditivos'],
      ['2620', '2621', 'Carbón y sus Derivados'],

      ['2710', '2711', 'Vestuario y Uniformes'],
      ['2720', '2721', 'Prendas de Seguridad y Protección Personal'],
      ['2730', '2731', 'Artículos Deportivos'],
      ['2740', '2741', 'Productos Textiles'],
      ['2750', '2751', 'Blancos y Otros Productos Textiles'],

      ['2810', '2811', 'Sustancias y Materiales Explosivos'],
      ['2820', '2821', 'Materiales de Seguridad Pública'],
      ['2830', '2831', 'Prendas de Protección para Seguridad Pública y Nacional'],

      ['2910', '2911', 'Refacciones, Accesorios y Herramientas'],
      ['2920', '2921', 'Refacciones y Accesorios Menores de Edificios'],
      ['2930', '2931', 'Refacciones y Accesorios Menores de Mobiliario y Equipo de Administración, Educacional y Recreativo'],
      ['2940', '2941', 'Refacciones y Accesorios para Equipo de Cómputo'],
      ['2950', '2951', 'Refacciones y Accesorios Menores de Equipo e Instrumental Médico y de Laboratorio'],
      ['2960', '2961', 'Refacciones y Accesorios Menores de Equipo de Transporte'],
      ['2970', '2971', 'Artículos para la Extinción de Incendios'],
      ['2980', '2981', 'Refacciones y Accesorios Menores de Maquinaria y Otros Equipos'],
      ['2990', '2991', 'Refacciones y Accesorios Menores Otros Bienes Muebles'],
      ['2990', '2992', 'Otros enseres'],
    ];

    let procesados = 0;

    for (const [codigoGenerica, codigo, nombre] of partidasEspecificas) {
      const idPartidaGenerica = mapaGenericas[codigoGenerica];

      if (!idPartidaGenerica) {
        console.log(`Partida genérica no encontrada para específica ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_partidas_especificas (
          id_partida_generica,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_partida_generica = VALUES(id_partida_generica),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idPartidaGenerica, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Partidas específicas 2000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 2000:', error);
  } finally {
    await connection.end();
  }
}

main();