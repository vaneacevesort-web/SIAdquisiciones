require('dotenv').config();
const mysql = require('mysql2/promise');

const opdsDescentralizadosOptions = [
  'Banco de Tejidos del Estado de México - 208C05000000000',
  'Centro de Conciliación Laboral - 209C02000000000',
  'Centro de Control de Confianza del Estado de México - 206C02000000000',
  'Centro Regional de Formación Docente e Investigación Educativa - 228C34000000000',
  'Colegio de Bachilleres del Estado de México - 228C07000000000',
  'Colegio de Educación Profesional Técnica del Estado de México - 228C18000000000',
  'Colegio de Estudios Científicos y Tecnológicos del Estado de México - 228C04000000000',
  'Comisión de Conciliación y Arbitraje Médico del Estado de México - 208C02000000000',
  'Comisión del Agua del Estado de México - 232C01000000000',
  'Comisión Estatal de Parques Naturales y de la Fauna - 231C01000000000',
  'Comisión Técnica del Agua del Estado de México - 232C02000000000',
  'Comité de Planeación para el Desarrollo del Estado de México - 207C02000000000',
  'Consejo de Investigación y Evaluación de la Política Social - 229C04000000000',
  'Consejo Estatal para el Desarrollo Integral de los Pueblos Indígenas del Estado de México - 229C01000000000',
  'Consejo Mexiquense de Ciencia y Tecnología - 228C43000000000',
  'Hospital Regional de Alta Especialidad Zumpango - 208C04000000000',
  'Instituto de Capacitación y Adiestramiento para el Trabajo Industrial - 209C01000000000',
  'Instituto de Fomento Minero y Estudios Geológicos del Estado de México - 215C01000000000',
  'Instituto de Formación Contínua, Profesionalización e Investigación del Magisterio del Estado de México - 228C39000000000',
  'Instituto de Información e Investigación Geográfica, Estadística y Catastral del Estado de México - 207C01000000000',
  'Instituto de Investigación y Capacitación Agropecuaria, Acuícola y Forestal del Estado de México - 225C01000000000',
  'Instituto de Investigación y Fomento de las Artesanías del Estado de México - 226C01000000000',
  'Instituto de la Función Registral del Estado de México - 233C01000000000',
  'Instituto de Políticas Públicas del Estado de México y sus Municipios - 207C08000000000',
  'Instituto de Salud del Estado de México - 208C01000000000',
  'Instituto de Seguridad Social del Estado de México y Municipios - 207C04000000000',
  'Instituto Estatal de Energía y Cambio Climático - 231C04000000000',
  'Instituto Hacendario del Estado de México - 207C03000000000',
  'Instituto Materno Infantil del Estado de México - 208C03000000000',
  'Instituto Mexiquense de la Infraestructura Física Educativa - 228C15000000000',
  'Instituto Mexiquense de la Juventud - 229C02000000000',
  'Instituto Mexiquense de la Pirotecnia - 205C02000000000',
  'Instituto Mexiquense de la Vivienda Social - 230C01000000000',
  'Instituto Mexiquense del Emprendedor - 215C02000000000',
  'Instituto Mexiquense para la Discapacidad - 208C08000000000',
  'Junta de Asistencia Privada del Estado de México - 229C03000000000',
  'Junta de Caminos del Estado de México - 220C01000000000',
  'Procuraduría de Protección al Ambiente del Estado de México - 231C02000000000',
  'Protectora de Bosques del Estado de México - 225C02000000000',
  'Servicios Educativos Integrados al Estado de México - 228C01000000000',
  'Sistema de Autopistas, Aeropuertos, Servicios Conexos y Auxiliares del Estado de México - 220C02000000000',
  'Sistema de Transporte Masivo y Teleférico del Estado de México - 220C03000000000',
  'Sistema Mexiquense de Medios Públicos - 207C07000000000',
  'Sistema para el Desarrollo Integral de la Familia del Estado de México - 200C01000000000',
  'Tecnológico de Estudios Superiores de Chalco - 228C16000000000',
  'Tecnológico de Estudios Superiores de Chicoloapan - 228C37000000000',
  'Tecnológico de Estudios Superiores de Chimalhuacán - 228C23000000000',
  'Tecnológico de Estudios Superiores de Coacalco - 228C08000000000',
  'Tecnológico de Estudios Superiores de Cuautitlán Izcalli - 228C10000000000',
  'Tecnológico de Estudios Superiores de Ecatepec - 228C02000000000',
  'Tecnológico de Estudios Superiores de Huixquilucan - 228C12000000000',
  'Tecnológico de Estudios Superiores de Ixtapaluca - 228C20000000000',
  'Tecnológico de Estudios Superiores de Jilotepec - 228C13000000000',
  'Tecnológico de Estudios Superiores de Jocotitlán - 228C17000000000',
  'Tecnológico de Estudios Superiores de San Felipe del Progreso - 228C22000000000',
  'Tecnológico de Estudios Superiores de Tianguistenco - 228C14000000000',
  'Tecnológico de Estudios Superiores de Valle de Bravo - 228C19000000000',
  'Tecnológico de Estudios Superiores de Villa Guerrero - 228C21000000000',
  'Tecnológico de Estudios Superiores del Oriente del Estado de México - 228C11000000000',
  'Unidad de Asuntos Internos - 206C03000000000',
  'Universidad Digital del Estado de México - 228C33000000000',
  'Universidad Estatal del Valle de Ecatepec - 228C24000000000',
  'Universidad Estatal del Valle de Toluca - 228C31000000000',
  'Universidad Intercultural del Estado de México - 228C26000000000',
  'Universidad Mexiquense de Seguridad - 206C01000000000',
  'Universidad Mexiquense del Bicentenario - 228C30000000000',
  'Universidad Politécnica de Atlacomulco - 228C42000000000',
  'Universidad Politécnica de Atlautla - 228C38000000000',
  'Universidad Politécnica de Chimalhuacán - 228C41000000000',
  'Universidad Politécnica de Cuautitlán Izcalli - 228C35000000000',
  'Universidad Politécnica de Otzolotepec - 228C40000000000',
  'Universidad Politécnica de Tecámac - 228C29000000000',
  'Universidad Politécnica de Texcoco - 228C32000000000',
  'Universidad Politécnica del Valle de México - 228C27000000000',
  'Universidad Politécnica del Valle de Toluca - 228C28000000000',
  'Universidad Tecnológica "Fidel Velázquez" - 228C05000000000',
  'Universidad Tecnológica de Nezahualcóyotl - 228C03000000000',
  'Universidad Tecnológica de Tecámac - 228C06000000000',
  'Universidad Tecnológica de Zinacantepec - 228C36000000000',
  'Universidad Tecnológica del Sur del Estado de México - 228C09000000000',
  'Universidad Tecnológica del Valle de Toluca - 228C25000000000',
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

    for (const item of opdsDescentralizadosOptions) {
      const parsed = parseItem(item);
      if (!parsed) continue;

      await connection.execute(
        `
        INSERT INTO adq_organismosOPDS (nombre, codigo)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          updated_at = CURRENT_TIMESTAMP
        `,
        [parsed.nombre, parsed.codigo]
      );

      insertados++;
    }

    console.log(`Registros procesados: \${insertados}`);
  } catch (error) {
    console.error('Error al importar OPDS:', error);
  } finally {
    await connection.end();
  }
}

main();
