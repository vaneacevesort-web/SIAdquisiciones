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
      ['5110', '5111', 'Muebles y Enseres'],
      ['5110', '5112', 'Adjudicaciones e Indemnizaciones de Bienes Muebles'],
      ['5120', '5121', 'Muebles, Excepto de Oficina y Estantería'],
      ['5130', '5131', 'Instrumental de Música'],
      ['5130', '5132', 'Artículos de Biblioteca'],
      ['5130', '5133', 'Objetos, Obras de Arte, Históricas y Culturales'],
      ['5140', '5141', 'Objetos de Valor'],
      ['5150', '5151', 'Bienes Informáticos'],
      ['5190', '5191', 'Otros Bienes Muebles'],
      ['5190', '5192', 'Mobiliario y Equipo para Escuelas, Laboratorios y Talleres'],
      ['5190', '5193', 'Bienes Muebles en Tránsito'],

      ['5210', '5211', 'Equipos y Aparatos Audiovisuales'],
      ['5220', '5221', 'Equipo Deportivo'],
      ['5230', '5231', 'Equipo de Foto, Cine y Grabación'],
      ['5290', '5291', 'Otro Equipo Educacional y Recreativo'],

      ['5310', '5311', 'Equipo Médico y de Laboratorio'],
      ['5320', '5321', 'Instrumental Médico y de Laboratorio'],

      ['5410', '5411', 'Vehículos y Equipo de Transporte Terrestre'],
      ['5410', '5412', 'Vehículos y Equipo Auxiliar de Transporte'],
      ['5410', '5413', 'Vehículos y Equipo de Transporte Aéreo'],
      ['5410', '5414', 'Vehículos y Equipo de Transporte Marítimo, Lacustre y Fluvial'],
      ['5410', '5415', 'Vehículos y Equipo de Transporte Ferroviario'],
      ['5410', '5416', 'Vehículos y Equipo de Transporte para la Seguridad Pública y Defensa'],
      ['5410', '5417', 'Vehículos y Equipo Eléctrico y Electrónico'],
      ['5420', '5421', 'Carrocerías y Remolques'],
      ['5430', '5431', 'Equipo Aeroespacial'],
      ['5440', '5441', 'Equipo Ferroviario'],
      ['5450', '5451', 'Embarcaciones'],
      ['5490', '5491', 'Otros Equipos de Transporte'],

      ['5510', '5511', 'Equipo de Defensa y Seguridad'],

      ['5610', '5611', 'Maquinaria y Equipo Agropecuario'],
      ['5620', '5621', 'Maquinaria y Equipo Industrial'],
      ['5630', '5631', 'Maquinaria y Equipo de Construcción'],
      ['5640', '5641', 'Sistemas de Aire Acondicionado, Calefacción y de Refrigeración Industrial y Comercial'],
      ['5650', '5651', 'Equipo y Aparatos para Comunicación, Telecomunicación y Radiotransmisión'],
      ['5660', '5661', 'Maquinarias y Equipos Eléctricos y Electrónicos'],
      ['5670', '5671', 'Herramientas, Máquinas Herramienta y Equipo'],
      ['5690', '5691', 'Instrumentos y Aparatos Especializados y de Precisión'],
      ['5690', '5692', 'Maquinaria y Equipo Diverso'],
      ['5690', '5693', 'Maquinaria y Equipo para Agua y Saneamiento'],
      ['5690', '5694', 'Maquinaria y Equipo para Alumbrado Público'],
      ['5690', '5695', 'Equipo de Generación Eléctrica, Aparatos y Accesorios Eléctricos'],
      ['5690', '5696', 'Maquinaria y Equipo para Purificación y Tratamiento de Agua'],
      ['5690', '5697', 'Maquinaria y Equipo en Tránsito'],

      ['5710', '5711', 'Bovinos'],
      ['5720', '5721', 'Porcinos'],
      ['5730', '5731', 'Aves'],
      ['5740', '5741', 'Ovinos y Caprinos'],
      ['5750', '5751', 'Peces y Acuicultura'],
      ['5760', '5761', 'Equinos'],
      ['5770', '5771', 'Especies Menores y de Zoológico'],
      ['5780', '5781', 'Árboles y Plantas'],
      ['5790', '5791', 'Otros Activos Biológicos'],

      ['5810', '5811', 'Terrenos'],
      ['5820', '5821', 'Viviendas'],
      ['5830', '5831', 'Edificios y Locales'],
      ['5890', '5891', 'Otros Bienes Inmuebles'],

      ['5910', '5911', 'Software'],
      ['5920', '5921', 'Patentes'],
      ['5930', '5931', 'Marcas'],
      ['5940', '5941', 'Derechos'],
      ['5950', '5951', 'Concesiones'],
      ['5960', '5961', 'Franquicias'],
      ['5970', '5971', 'Licencias Informáticas e Intelectuales'],
      ['5980', '5981', 'Licencias Industriales, Comerciales y Otras'],
      ['5990', '5991', 'Otros Activos Intangibles']
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

    console.log('Partidas específicas 5000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 5000:', error);
  } finally {
    await connection.end();
  }
}

main();