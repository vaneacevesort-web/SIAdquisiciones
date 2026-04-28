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
      ['5100', '5110', 'Muebles de Oficina y Estantería'],
      ['5100', '5120', 'Muebles, Excepto de Oficina y Estantería'],
      ['5100', '5130', 'Bienes Artísticos, Culturales y Científicos'],
      ['5100', '5140', 'Objetos de Valor'],
      ['5100', '5150', 'Equipo de Cómputo y de Tecnologías de la Información'],
      ['5100', '5190', 'Otros Mobiliarios y Equipos de Administración'],

      ['5200', '5210', 'Equipos y Aparatos Audiovisuales'],
      ['5200', '5220', 'Aparatos Deportivos'],
      ['5200', '5230', 'Cámaras Fotográficas y de Video'],
      ['5200', '5290', 'Otro Mobiliario y Equipo Educacional y Recreativo'],

      ['5300', '5310', 'Equipo Médico y de Laboratorio'],
      ['5300', '5320', 'Instrumental Médico y de Laboratorio'],

      ['5400', '5410', 'Vehículos y Equipo Terrestre'],
      ['5400', '5420', 'Carrocerías y Remolques'],
      ['5400', '5430', 'Equipo Aeroespacial'],
      ['5400', '5440', 'Equipo Ferroviario'],
      ['5400', '5450', 'Embarcaciones'],
      ['5400', '5490', 'Otros Equipos de Transporte'],

      ['5500', '5510', 'Equipo de Defensa y Seguridad'],

      ['5600', '5610', 'Maquinaria y Equipo Agropecuario'],
      ['5600', '5620', 'Maquinaria y Equipo Industrial'],
      ['5600', '5630', 'Maquinaria y Equipo de Construcción'],
      ['5600', '5640', 'Sistemas de Aire Acondicionado, Calefacción y de Refrigeración Industrial y Comercial'],
      ['5600', '5650', 'Equipo de Comunicación y Telecomunicación'],
      ['5600', '5660', 'Equipos de Generación Eléctrica, Aparatos y Accesorios Eléctricos'],
      ['5600', '5670', 'Herramientas y Máquinas-Herramienta'],
      ['5600', '5690', 'Otros Equipos'],

      ['5700', '5710', 'Bovinos'],
      ['5700', '5720', 'Porcinos'],
      ['5700', '5730', 'Aves'],
      ['5700', '5740', 'Ovinos y Caprinos'],
      ['5700', '5750', 'Peces y Acuicultura'],
      ['5700', '5760', 'Equinos'],
      ['5700', '5770', 'Especies Menores y de Zoológico'],
      ['5700', '5780', 'Árboles y Plantas'],
      ['5700', '5790', 'Otros Activos Biológicos'],

      ['5800', '5810', 'Terrenos'],
      ['5800', '5820', 'Viviendas'],
      ['5800', '5830', 'Edificios no Residenciales'],
      ['5800', '5890', 'Otros Bienes Inmuebles'],

      ['5900', '5910', 'Software'],
      ['5900', '5920', 'Patentes'],
      ['5900', '5930', 'Marcas'],
      ['5900', '5940', 'Derechos'],
      ['5900', '5950', 'Concesiones'],
      ['5900', '5960', 'Franquicias'],
      ['5900', '5970', 'Licencias Informáticas e Intelectuales'],
      ['5900', '5980', 'Licencias Industriales, Comerciales y Otras'],
      ['5900', '5990', 'Otros Activos Intangibles']
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

    console.log('Partidas genéricas 5000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 5000:', error);
  } finally {
    await connection.end();
  }
}

main();