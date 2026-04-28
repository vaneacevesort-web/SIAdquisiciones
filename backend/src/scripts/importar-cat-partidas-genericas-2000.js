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

    const [subcapitulos] = await connection.execute(`
      SELECT id_subcapitulo, codigo
      FROM adq_cat_subcapitulos
    `);

    const mapaSubcapitulos = {};
    for (const row of subcapitulos) {
      mapaSubcapitulos[row.codigo] = row.id_subcapitulo;
    }

    const partidasGenericas = [
      ['2100', '2110', 'Materiales, Útiles y Equipos Menores de Oficina'],
      ['2100', '2120', 'Materiales y Útiles de Impresión y Reproducción'],
      ['2100', '2130', 'Material Estadístico y Geográfico'],
      ['2100', '2140', 'Materiales, Útiles y Equipos Menores de Tecnologías de la Información y Comunicaciones'],
      ['2100', '2150', 'Material Impreso e Información Digital'],
      ['2100', '2160', 'Material de Limpieza'],
      ['2100', '2170', 'Materiales y Útiles de Enseñanza'],
      ['2100', '2180', 'Materiales para el Registro e Identificación de Bienes y Personas'],

      ['2200', '2210', 'Productos Alimenticios para Personas'],
      ['2200', '2220', 'Productos Alimenticios para Animales'],
      ['2200', '2230', 'Utensilios para el Servicio de Alimentación'],

      ['2300', '2310', 'Productos Alimenticios, Agropecuarios y Forestales Adquiridos como Materia Prima'],
      ['2300', '2320', 'Insumos Textiles Adquiridos como Materia Prima'],
      ['2300', '2330', 'Productos de Papel, Cartón e Impresos Adquiridos como Materia Prima'],
      ['2300', '2340', 'Combustibles, Lubricantes, Aditivos, Carbón y sus Derivados Adquiridos como Materia Prima'],
      ['2300', '2350', 'Productos Químicos, Farmacéuticos y de Laboratorio Adquiridos como Materia Prima'],
      ['2300', '2360', 'Productos Metálicos y a Base de Minerales no Metálicos Adquiridos como Materia Prima'],
      ['2300', '2370', 'Productos de Cuero, Piel, Plástico y Hule Adquiridos como Materia Prima'],
      ['2300', '2380', 'Mercancías Adquiridas para su Comercialización'],
      ['2300', '2390', 'Otros Productos Adquiridos como Materia Prima'],

      ['2400', '2410', 'Productos Minerales no Metálicos'],
      ['2400', '2420', 'Cemento y Productos de Concreto'],
      ['2400', '2430', 'Cal, Yeso y Productos de Yeso'],
      ['2400', '2440', 'Madera y Productos de Madera'],
      ['2400', '2450', 'Vidrio y Productos de Vidrio'],
      ['2400', '2460', 'Material Eléctrico y Electrónico'],
      ['2400', '2470', 'Artículos Metálicos para la Construcción'],
      ['2400', '2480', 'Materiales Complementarios'],
      ['2400', '2490', 'Otros Materiales y Artículos de Construcción y Reparación'],

      ['2500', '2510', 'Productos Químicos Básicos'],
      ['2500', '2520', 'Fertilizantes, Pesticidas y Otros Agroquímicos'],
      ['2500', '2530', 'Medicinas y Productos Farmacéuticos'],
      ['2500', '2540', 'Materiales, Accesorios y Suministros Médicos'],
      ['2500', '2550', 'Materiales, Accesorios y Suministros de Laboratorio'],
      ['2500', '2560', 'Fibras Sintéticas, Hules, Plásticos y Derivados'],
      ['2500', '2570', 'Productos de Cuero, Piel, Plástico y Hule'],
      ['2500', '2580', 'Productos Químicos, Farmacéuticos y de Laboratorio no Clasificados en Otra Parte'],
      ['2500', '2590', 'Otros Productos Químicos'],

      ['2600', '2610', 'Combustibles, Lubricantes y Aditivos'],
      ['2600', '2620', 'Carbón y sus Derivados'],

      ['2700', '2710', 'Vestuario y Uniformes'],
      ['2700', '2720', 'Prendas de Seguridad y Protección Personal'],
      ['2700', '2730', 'Artículos Deportivos'],
      ['2700', '2740', 'Productos Textiles'],
      ['2700', '2750', 'Blancos y Otros Productos Textiles, Excepto Prendas de Vestir'],

      ['2800', '2810', 'Sustancias y Materiales Explosivos'],
      ['2800', '2820', 'Materiales de Seguridad Pública'],
      ['2800', '2830', 'Prendas de Protección para Seguridad Pública y Nacional'],

      ['2900', '2910', 'Herramientas Menores'],
      ['2900', '2920', 'Refacciones y Accesorios Menores de Edificios'],
      ['2900', '2930', 'Refacciones y Accesorios Menores de Mobiliario y Equipo de Administración, Educacional y Recreativo'],
      ['2900', '2940', 'Refacciones y Accesorios Menores de Equipo de Cómputo y Tecnologías de la Información'],
      ['2900', '2950', 'Refacciones y Accesorios Menores de Equipo e Instrumental Médico y de Laboratorio'],
      ['2900', '2960', 'Refacciones y Accesorios Menores de Equipo de Transporte'],
      ['2900', '2970', 'Refacciones y Accesorios Menores de Equipo de Defensa y Seguridad'],
      ['2900', '2980', 'Refacciones y Accesorios Menores de Maquinaria y Otros Equipos'],
      ['2900', '2990', 'Refacciones y Accesorios Menores Otros Bienes Muebles']
    ];

    let procesados = 0;

    for (const [codigoSubcapitulo, codigo, nombre] of partidasGenericas) {
      const idSubcapitulo = mapaSubcapitulos[codigoSubcapitulo];

      if (!idSubcapitulo) {
        console.log(`Subcapítulo no encontrado para partida genérica ${codigo}`);
        continue;
      }

      const clave = codigo;
      const descripcion = nombre;

      await connection.execute(
        `
        INSERT INTO adq_cat_partidas_genericas (
          id_subcapitulo,
          codigo,
          nombre,
          clave,
          descripcion
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_subcapitulo = VALUES(id_subcapitulo),
          nombre = VALUES(nombre),
          clave = VALUES(clave),
          descripcion = VALUES(descripcion),
          updated_at = CURRENT_TIMESTAMP
        `,
        [idSubcapitulo, codigo, nombre, clave, descripcion]
      );

      procesados++;
    }

    console.log('Partidas genéricas 2000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 2000:', error);
  } finally {
    await connection.end();
  }
}

main();