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
      ['3100', '3110', 'Energía Eléctrica'],
      ['3100', '3120', 'Gas'],
      ['3100', '3130', 'Agua'],
      ['3100', '3140', 'Telefonía Tradicional'],
      ['3100', '3150', 'Telefonía Celular'],
      ['3100', '3160', 'Servicios de Telecomunicaciones y Satélites'],
      ['3100', '3170', 'Servicios de Acceso de Internet, Redes y Procesamiento de Información'],
      ['3100', '3180', 'Servicios Postales y Telegráficos'],
      ['3100', '3190', 'Servicios Integrales y Otros Servicios'],

      ['3200', '3210', 'Arrendamiento de Terrenos'],
      ['3200', '3220', 'Arrendamiento de Edificios'],
      ['3200', '3230', 'Arrendamiento de Mobiliario y Equipo de Administración, Educacional y Recreativo'],
      ['3200', '3240', 'Arrendamiento de Equipo e Instrumental Médico y de Laboratorio'],
      ['3200', '3250', 'Arrendamiento de Equipo de Transporte'],
      ['3200', '3260', 'Arrendamiento de Maquinaria, Otros Equipos y Herramientas'],
      ['3200', '3270', 'Arrendamiento de Activos Intangibles'],
      ['3200', '3280', 'Arrendamiento Financiero'],
      ['3200', '3290', 'Otros Arrendamientos'],

      ['3300', '3310', 'Servicios Legales, de Contabilidad, Auditoría y Relacionados'],
      ['3300', '3320', 'Servicios de Diseño, Arquitectura, Ingeniería y Actividades Relacionadas'],
      ['3300', '3330', 'Servicios de Consultoría Administrativa, Procesos, Técnica y en Tecnologías de la Información'],
      ['3300', '3340', 'Servicios de Capacitación'],
      ['3300', '3350', 'Servicios de Investigación Científica y Desarrollo'],
      ['3300', '3360', 'Servicios de Apoyo Administrativo, Traducción, Fotocopiado e Impresión'],
      ['3300', '3370', 'Servicios de Protección y Seguridad'],
      ['3300', '3380', 'Servicios de Vigilancia'],
      ['3300', '3390', 'Servicios Profesionales, Científicos y Técnicos Integrales'],

      ['3400', '3410', 'Servicios Financieros y Bancarios'],
      ['3400', '3420', 'Servicios de Cobranza, Investigación Crediticia y Similar'],
      ['3400', '3430', 'Servicios de Recaudación, Traslado y Custodia de Valores'],
      ['3400', '3440', 'Seguros de Responsabilidad Patrimonial y Fianzas'],
      ['3400', '3450', 'Seguro de Bienes Patrimoniales'],
      ['3400', '3460', 'Almacenaje, Envase y Embalaje'],
      ['3400', '3470', 'Fletes y Maniobras'],
      ['3400', '3480', 'Comisiones por Ventas'],
      ['3400', '3490', 'Servicios Financieros, Bancarios y Comerciales Integrales'],

      ['3500', '3510', 'Conservación y Mantenimiento Menor de Inmuebles'],
      ['3500', '3520', 'Instalación, Reparación y Mantenimiento de Mobiliario y Equipo de Administración, Educacional y Recreativo'],
      ['3500', '3530', 'Instalación, Reparación y Mantenimiento de Equipo de Cómputo y Tecnología de la Información'],
      ['3500', '3540', 'Instalación, Reparación y Mantenimiento de Equipo e Instrumental Médico y de Laboratorio'],
      ['3500', '3550', 'Reparación y Mantenimiento de Equipo de Transporte'],
      ['3500', '3560', 'Reparación y Mantenimiento de Equipo de Defensa y Seguridad'],
      ['3500', '3570', 'Instalación, Reparación y Mantenimiento de Maquinaria, Otros Equipos y Herramienta'],
      ['3500', '3580', 'Servicios de Limpieza y Manejo de Desechos'],
      ['3500', '3590', 'Servicios de Jardinería y Fumigación'],

      ['3600', '3610', 'Difusión por Radio, Televisión y Otros Medios de Mensajes sobre Programas y Actividades Gubernamentales'],
      ['3600', '3620', 'Difusión por Radio, Televisión y Otros Medios de Mensajes Comerciales para Promover la Venta de Bienes o Servicios'],
      ['3600', '3630', 'Servicios de Creatividad, Preproducción y Producción de Publicidad, Excepto Internet'],
      ['3600', '3640', 'Servicios de Revelado de Fotografías'],
      ['3600', '3650', 'Servicios de la Industria Fílmica, del Sonido y del Video'],
      ['3600', '3660', 'Servicio de Creación y Difusión de Contenido Exclusivamente a Través de Internet'],
      ['3600', '3690', 'Otros Servicios de Información'],

      ['3700', '3710', 'Pasajes Aéreos'],
      ['3700', '3720', 'Pasajes Terrestres'],
      ['3700', '3730', 'Pasajes Marítimos, Lacustres y Fluviales'],
      ['3700', '3740', 'Autotransporte'],
      ['3700', '3750', 'Viáticos en el País'],
      ['3700', '3760', 'Viáticos en el Extranjero'],
      ['3700', '3770', 'Gastos de Instalación y Traslado de Menaje'],
      ['3700', '3780', 'Servicios Integrales de Traslado y Viáticos'],
      ['3700', '3790', 'Otros Servicios de Traslado y Hospedaje'],

      ['3800', '3810', 'Gastos de Ceremonial'],
      ['3800', '3820', 'Gastos de Orden Social y Cultural'],
      ['3800', '3830', 'Congresos y Convenciones'],
      ['3800', '3840', 'Exposiciones'],
      ['3800', '3850', 'Gastos de Representación'],

      ['3900', '3910', 'Servicios Funerarios y de Cementerios'],
      ['3900', '3920', 'Impuestos y Derechos'],
      ['3900', '3930', 'Impuestos y Derechos de Importación'],
      ['3900', '3940', 'Sentencias y Resoluciones por Autoridad Competente'],
      ['3900', '3950', 'Penas, Multas, Accesorios y Actualizaciones'],
      ['3900', '3960', 'Otros Gastos por Responsabilidades'],
      ['3900', '3970', 'Utilidades'],
      ['3900', '3980', 'Impuesto sobre Nóminas y Otros que se Deriven de una Relación Laboral'],
      ['3900', '3990', 'Otros Servicios Generales']
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

    console.log('Partidas genéricas 3000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas genéricas 3000:', error);
  } finally {
    await connection.end();
  }
}

main();