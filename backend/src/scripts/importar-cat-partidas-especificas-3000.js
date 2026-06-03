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
      ['3110', '3111', 'Servicio de Energía Eléctrica'],
      ['3120', '3121', 'Gas'],
      ['3130', '3131', 'Agua'],
      ['3140', '3141', 'Servicio Telefónico Convencional'],
      ['3150', '3151', 'Servicio de Telefonía Celular'],
      ['3160', '3161', 'Servicio de Radiolocalización y Telecomunicación'],
      ['3160', '3162', 'Servicios de conducción de señales analógicas y digitales'],
      ['3170', '3171', 'Servicios de Acceso a Internet'],
      ['3170', '3172', 'Servicios Electrónicos y Colaboración en la Nube'],
      ['3180', '3181', 'Servicio Postal y Telegráfico'],
      ['3190', '3191', 'Servicios Integrales y Otros Servicios'],

      ['3210', '3211', 'Arrendamiento de Terrenos'],
      ['3220', '3221', 'Arrendamiento de Edificios y Locales'],
      ['3230', '3231', 'Arrendamiento de Equipo y Bienes Informáticos'],
      ['3230', '3232', 'Arrendamiento de Equipo y Aparatos Audiovisuales'],
      ['3230', '3233', 'Arrendamiento de Equipo de Fotocopiado'],
      ['3230', '3234', 'Arrendamiento de Mobiliario'],
      ['3240', '3241', 'Arrendamiento de Equipo e Instrumental Médico y de Laboratorio'],
      ['3250', '3251', 'Arrendamiento de Vehículos'],
      ['3260', '3261', 'Arrendamiento de Maquinaria y Equipo'],
      ['3270', '3271', 'Patentes, Regalías y Otros'],
      ['3280', '3281', 'Arrendamiento Financiero'],
      ['3290', '3291', 'Otros Arrendamientos'],

      ['3310', '3311', 'Asesorías Asociadas a Convenios o Acuerdos'],
      ['3310', '3312', 'Asesorías, Consultorías e Investigaciones'],
      ['3310', '3313', 'Auditorías Externas'],
      ['3310', '3314', 'Capacitación Institucional'],
      ['3310', '3315', 'Servicios Legales y de Contabilidad'],
      ['3320', '3321', 'Servicios Estadísticos y Geográficos'],
      ['3330', '3331', 'Servicios Informáticos'],
      ['3330', '3332', 'Desarrollo de Aplicaciones Informáticas'],
      ['3330', '3333', 'Servicios Relacionados con Certificación de Procesos'],
      ['3340', '3341', 'Capacitación'],
      ['3350', '3351', 'Servicios de Investigación Científica y Desarrollo'],
      ['3360', '3361', 'Servicios de Apoyo Administrativo y Fotocopiado'],
      ['3360', '3362', 'Impresiones de Documentos Oficiales para la Prestación de Servicios Públicos, Identificación, Formatos Administrativos y Fiscales, Formas Valoradas, Certificados y Títulos'],
      ['3360', '3363', 'Servicios de Impresión de Documentos Oficiales'],
      ['3360', '3364', 'Servicios de Impresión y Elaboración de Material Informativo Derivado de la Operación y Administración de las Dependencias y Organismos Auxiliares'],
      ['3360', '3365', 'Información en Medios Masivos Derivada de la Operación y Administración de las Dependencias y Organismos Auxiliares'],
      ['3360', '3366', 'Servicios de Información y Documentación'],
      ['3370', '3371', 'Servicios de Protección y Seguridad'],
      ['3380', '3381', 'Servicios de Vigilancia'],
      ['3390', '3391', 'Servicios Profesionales, Científicos y Técnicos Integrales'],

      ['3410', '3411', 'Servicios Bancarios y Financieros'],
      ['3420', '3421', 'Servicios de Cobranza, Investigación Crediticia y Similar'],
      ['3430', '3431', 'Servicios de Recaudación, Traslado y Custodia de Valores'],
      ['3440', '3441', 'Seguros de Responsabilidad Patrimonial y Fianzas'],
      ['3450', '3451', 'Seguros de Bienes Patrimoniales'],
      ['3460', '3461', 'Almacenaje, Embalaje y Envase'],
      ['3470', '3471', 'Fletes y Maniobras'],
      ['3480', '3481', 'Comisiones por Ventas'],
      ['3490', '3491', 'Servicios Financieros, Bancarios y Comerciales Integrales'],

      ['3510', '3511', 'Reparación y Mantenimiento de Inmuebles'],
      ['3520', '3521', 'Reparación, Mantenimiento e Instalación de Mobiliario y Equipo de Oficina'],
      ['3530', '3531', 'Reparación, Instalación y Mantenimiento de Bienes Informáticos, Microfilmación y Tecnologías de la Información'],
      ['3540', '3541', 'Reparación, Instalación y Mantenimiento de Equipo Médico y de Laboratorio'],
      ['3550', '3551', 'Reparación y Mantenimiento de Vehículos Terrestres, Aéreos y Lacustres'],
      ['3560', '3561', 'Reparación y Mantenimiento de Equipos de Seguridad y Defensa'],
      ['3570', '3571', 'Reparación, Instalación y Mantenimiento de Maquinaria, Equipo Industrial y Diverso'],
      ['3580', '3581', 'Servicios de Lavandería, Limpieza e Higiene'],
      ['3590', '3591', 'Servicios de Fumigación'],

      ['3610', '3611', 'Gastos de Publicidad y Propaganda'],
      ['3610', '3612', 'Publicaciones Oficiales'],
      ['3620', '3621', 'Gastos de Publicidad en Materia Comercial'],
      ['3630', '3631', 'Servicios de Creatividad, Preproducción y Producción de Publicidad, Excepto Internet'],
      ['3640', '3641', 'Servicios de Revelado de Fotografías'],
      ['3650', '3651', 'Servicios de Cine y Grabación'],
      ['3660', '3661', 'Servicio de Creación y Difusión de Contenido Exclusivamente a Través de Internet'],
      ['3690', '3691', 'Otros Servicios de Información'],

      ['3710', '3711', 'Transportación Aérea'],
      ['3720', '3721', 'Gastos de Traslado por Vía Terrestre'],
      ['3730', '3731', 'Pasajes Marítimos, Lacustres y Fluviales'],
      ['3740', '3741', 'Autotransporte'],
      ['3750', '3751', 'Viáticos Nacionales'],
      ['3760', '3761', 'Viáticos en el Extranjero'],
      ['3770', '3771', 'Gastos de Instalación y Traslado de Menaje'],
      ['3780', '3781', 'Servicios Integrales de Traslado y Viáticos'],
      ['3790', '3791', 'Otros Servicios de Traslado y Hospedaje'],

      ['3810', '3811', 'Gastos de Ceremonial'],
      ['3820', '3821', 'Gastos de Orden Social'],
      ['3820', '3822', 'Espectáculos Cívicos y Culturales'],
      ['3830', '3831', 'Congresos y Convenciones'],
      ['3840', '3841', 'Exposiciones y Ferias'],
      ['3850', '3851', 'Gastos de Representación'],

      ['3910', '3911', 'Servicios Funerarios y de Cementerios'],
      ['3920', '3921', 'Impuestos y Derechos'],
      ['3930', '3931', 'Impuestos y Derechos de Importación'],
      ['3940', '3941', 'Sentencias y Resoluciones Judiciales'],
      ['3950', '3951', 'Penas, Multas, Accesorios y Actualizaciones'],
      ['3960', '3961', 'Otros Gastos por Responsabilidades'],
      ['3970', '3971', 'Utilidades'],
      ['3980', '3981', 'Impuesto sobre Nóminas'],
      ['3990', '3991', 'Cuotas y Suscripciones'],
      ['3990', '3992', 'Gastos de Servicios Menores'],
      ['3990', '3993', 'Estudios y Análisis Clínicos'],
      ['3990', '3994', 'Inscripciones y Arbitrajes'],
      ['3990', '3995', 'Diferencias por Variaciones en el Tipo de Cambio'],
      ['3990', '3996', 'Subcontratación de Servicios con Terceros'],
      ['3990', '3997', 'Proyectos para Prestación de Servicios'],
      ['3990', '3998', 'Licencias Informáticas e Intelectuales'],
      ['3990', '3999', 'Otros Servicios Generales']
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

    console.log('Partidas específicas 3000 procesadas =>', procesados);
  } catch (error) {
    console.error('Error al importar partidas específicas 3000:', error);
  } finally {
    await connection.end();
  }
}

main();