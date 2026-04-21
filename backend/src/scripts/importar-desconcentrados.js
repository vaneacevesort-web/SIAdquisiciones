require('dotenv').config();
const mysql = require('mysql2/promise');

const organosDesconcentradosOptions = [
  'Archivo General del Estado de México - 23400000000000L',
  'Centro Estatal de Trasplantes - 20800000000000L',
  'Centro Estatal de Vigilancia Epidemiológica y Control de Enfermedades - 20800000000000L',
  'Comisión de Búsqueda de Personas del Estado de México - 23300000000000L',
  'Comisión de Impacto Estatal - 23000000000000L',
  'Comisión Ejecutiva de Atención a Víctimas del Estado de México - 23300000000000L',
  'Comisión Estatal de Energía - 21500000000000L',
  'Comisión Estatal de Mejora Regulatoria - 21500000000000L',
  'Consejo Estatal de Población - 20500000000000L',
  'Consejo para la Convivencia Escolar - 22800000000000L',
  'Coordinación Ejecutiva del Mecanismo para la Protección Integral de Periodistas y Personas Defensoras de los Derechos Humanos del Estado de México - 23300000000000L',
  'Coordinación Estatal del Servicio Profesional Docente - 22800000000000L',
  'Coordinación General de Conservación Ecológica - 23100000000000L',
  'Instituto de la Defensoría Pública del Estado de México - 23300000000000L',
  'Oficialía Mayor - 23400000000000L',
  'Instituto de Verificación Administrativa del Estado de México - 23300000000000L',
  'Instituto del Transporte del Estado de México - 22000000000000L',
  'Instituto Mexiquense de Salud Mental y Adicciones - 20800000000000L',
  'Instituto Superior de Ciencias de la Educación del Estado de México - 22800000000000L',
  'Secretaría Ejecutiva del Sistema Estatal de Protección Integral de Niñas, Niños y Adolescentes del Estado de México - 22700000000000L',
  'Secretariado Ejecutivo del Sistema Estatal de Seguridad Pública - 20600000000000L',
  'Unidad Estatal de Evaluación de Confianza - 21800000000000L',
];

function parseItem(item) {
  const parts = item.split(' - ');
  const codigo = (parts.pop() || '').trim();
  const nombre = parts.join(' - ').trim();
  if (!nombre || !codigo) return null;
  return { nombre, codigo };
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
  });

  try {
    console.log('Conectado a MySQL');

    let insertados = 0;

    for (const item of organosDesconcentradosOptions) {
      const parsed = parseItem(item);
      if (!parsed) continue;

      await connection.execute(
        `
        INSERT INTO adq_organosDesconcentrados (nombre, codigo)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          updated_at = CURRENT_TIMESTAMP
        `,
        [parsed.nombre, parsed.codigo]
      );

      insertados++;
    }

    console.log(`Registros procesados: ${insertados}`);
  } catch (error) {
    console.error('Error al importar órganos desconcentrados:', error);
  } finally {
    await connection.end();
  }
}

main();