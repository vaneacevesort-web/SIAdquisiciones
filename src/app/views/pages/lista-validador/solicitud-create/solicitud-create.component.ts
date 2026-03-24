import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-solicitud-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-create.component.html',
  styleUrl: './solicitud-create.component.scss',
})
export class SolicitudCreateComponent {
  form: FormGroup;
  public _registroService = inject(RegistroService);

  // Origen de recurso (select)
  origenOptions = [
    { value: 'Estatal', label: 'Estatal' },
    { value: 'Federal', label: 'Federal' },
    { value: 'Fideicomiso', label: 'Fideicomiso' },
    { value: 'Concurrente o Propio', label: 'Concurrente o Propio' },
  ];

  // Capítulos
  capituloOptions = [
    { value: '1000', label: '1000 Servicios Personales' },
    { value: '2000', label: '2000 Materiales Y Suministros' },
    { value: '3000', label: '3000 Servicios Generales' },
    { value: '4000', label: '4000 Transferencias, Asignaciones, Subsidios Y Otras Ayudas' },
    { value: '5000', label: '5000 Bienes Muebles, Inmuebles E Intangibles' },
    { value: '6000', label: '6000 Inversión Pública' },
    { value: '7000', label: '7000 Inversiones Financieras Y Otras Provisiones' },
    { value: '8000', label: '8000 Participaciones Y Aportaciones' },
    { value: '9000', label: '9000 Deuda Pública' },
  ];

  // Giro / Subgiro (ejemplo: cambia por tu catálogo real)
  giroOptions: string[] = ['Bienes', 'Servicios', 'Arrendamientos'];

  subGiroByGiro: Record<string, string[]> = {
    Bienes: ['Papelería', 'Mobiliario', 'Equipo de cómputo'],
    Servicios: ['Mantenimiento', 'Limpieza', 'Consultoría'],
    Arrendamientos: ['Inmuebles', 'Vehículos'],
  };

  get subGiroOptions(): string[] {
    const g = this.form?.get('giro')?.value;
    return g ? this.subGiroByGiro[g] ?? [] : [];
  }

  // Dependencias
  dependenciaOptions: string[] = [
    'Secretaría General de Gobierno',
    'Secretaría de Seguridad',
    'Secretaría de Finanzas',
    'Secretaría de Salud',
    'Secretaría del Trabajo',
    'Secretaría de Educación, Ciencia, Tecnología e Innovación',
    'Secretaría de Bienestar',
    'Secretaría de Desarrollo Económico',
    'Secretaría de Contraloría',
    'Secretaría de Movilidad',
    'Secrettaría de Medio Ambiente y Desarrollo Sustentable',
    'Secretaría de Desarollo Urbano e Infraestructura',
    'Secretaría del Campo',
    'Secretaría de Cultura y Turismo',
    'Secretaría de las Mujeres',
    'Secretaría del Agua',
    'Consejería Jurídica',
    'Oficialía Mayor',
    'Agencia Digital del Estado de México',
    'Organismos OPDS',
  ];

  // OPDS Descentralizados
  opdsDescentralizadosOptions: string[] = [
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

  // Órganos Desconcentrados
  organosDesconcentradosOptions: string[] = [
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

  // Centros de costo por dependencia 
  centrosCostoByDependencia: Record<string, string[]> = {
    'Secretaría General de Gobierno': [
    'Oficina del C. Coordinador de Acción Cívica y Eventos Especiales (20500000010000S)',
    'Secretaría Particular (20500001000000S)',
    'Dirección de Desarrollo Político (20500001010000L)',
    'Unidad de Análisis (20500001010000S)',
    'Dirección de Participación Social (20500001020000L)',
    'Oficina del C. Director General de Desarrollo Político (20500001A000000)',
    'Órgano Interno de Control (20500002000000S)',
    'Oficina del C. Coordinador de Giras y Logística (20500003A000000)',
    'Oficina del C. Coordinador de Atención Ciudadana (20500004A000000)',
    'Unidad de Asuntos Religiosos (20500005000000S)',
    'Coordinación Administrativa (20500007000000S)',
    'Coordinación General de Protección Civil y Gestión Integral del Riesgo (20500600000000L)',
    'Dirección General de Información, Planeación y Evaluación (20502001000000S)',
    'Dirección General de Control y Seguimiento de la Gestión (20502002000000S)',
    'Dirección General de Estudios y Proyectos Especiales (20502003000000S)',
    'Dirección General de Sistemas y Tecnologías de la Información (20502004000000S)',
    'Oficina del Coordinador de Planeación, Igualdad de Género y Apoyo Técnico (20502A000000000)',
    'Subsecretaría de Desarrollo Municipal (20503000000000L)',
    'Dirección General de Políticas Públicas Municipales (20503001000000L)',
    'Dirección General de Apoyo Regional y Municipal (20503002000000L)',
    'Subsecretaría General de Gobierno (20510000000000L)',
    'Dirección General de Información Sociopolítica (20510004000000L)',
    'Coordinación de Gobierno Valle de Toluca (20511100000000T)',
    'Dirección General de Gobierno Región Atlacomulco (20511101000000T)',
    'Dirección General de Gobierno Región Lerma (20511103000000T)',
    'Dirección General de Gobierno Región Tejupilco (20511104000000T)',
    'Dirección General de Gobierno Región Toluca (20511105000000T)',
    'Dirección General de Gobierno Región Valle de Bravo (20511106000000T)',
    'Dirección General de Gobierno Región Tenancingo (20511107000000T)',
    'Coordinación de Gobierno Valle de México Zona Nororiente (20512100000000T)',
    'Dirección General de Gobierno Región Cuautitlán Izcalli (20512101000000T)',
    'Dirección General de Gobierno Región Naucalpan (20512102000000T)',
    'Dirección General de Gobierno Región Tlalnepantla (20512103000000T)',
    'Dirección General de Gobierno Región Tultitlán (20512104000000T)',
    'Dirección General de Gobierno Región Zumpango (20512105000000T)',
    'Coordinación de Gobierno Valle de México Zona Oriente I (20513100000000T)',
    'Dirección General de Gobierno Región Chimalhuacán (20513101000000T)',
    'Dirección General de Gobierno Región Ecatepec (20513102000000T)',
    'Dirección General de Gobierno Región Texcoco (20513103000000T)',
    'Dirección General de Gobierno Región Otumba (20513104000000T)',
    'Coordinación de Gobierno Valle de México Zona Oriente II (20514100000000T)',
    'Dirección General de Gobierno Región Amecameca (20514101000000T)',
    'Dirección General de Gobierno Región Nezahualcóyotl (20514102000000T)',
    'Dirección General de Gobierno Región Chalco (20514103000000T)',
    'Dirección General de Acuerdos de Gabinete (20520003000000L)',
    'Dirección General de Monitoreo de Proyectos Estratégicos (20520004000000L)',
    'Dirección General de Planeación y Estadística (20520005000000L)',
    'Oficina del C. Coordinador Técnico (2052A0000000000)',
    'Coordinación General de Comunicación Social (20530000000000S)',
    'Dirección General de Información y de Servicios a Medios de Comunicación (20530003000000L)',
    'Dirección General de Publicidad (20530004000000L)',
    'Dirección General de Seguimiento de Medios e Investigación (20530005000000L)',
    'Dirección General de Mercadotecnia (20530006000000L)',
    'Oficina del C. Srio. Gral. Gobierno (205A00000000000)',
    'Consejo Estatal de Población (205B01000000000)',
    'Instituto Mexiquense de la Pirotecnia (205C02000000000)',
    'Sistema Mexiquense de Medios Públicos (205C03000000000)',
  ],
  'Secretaría de Seguridad': [
    'Órgano Interno de Control (20600002000000S)',
    'Unidad de Vinculación, Comunicación Social y Relaciones Públicas (20600003000000S)',
    'Dirección General de Desarrollo Institucional e Innovación (20600006000000L)',
    'Unidad de Información, Planeación, Programación y Evaluación (20600007000000S)',
    'Secretaría Técnica y de Igualdad de Género (20600008000000S)',
    'Unidad de Asuntos Jurídicos (20600009000000S)',
    'Dirección General de Información (20600200000000L)',
    'Unidad de Inteligencia e Investigación para la Prevención (20600201000000L)',
    'Centro de Control, Comando, Comunicación, Cómputo y Calidad (20600202000000L)',
    'Unidad de Análisis Criminal (20600203000000L)',
    'Dirección General del Sistema de Desarrollo Policial (20600300000000L)',
    'Unidad de Estudios y Proyectos Especiales (20600301000000L)',
    'Subsecretaría de Policía Estatal (20601000000000L)',
    'Coordinación de Grupos Tácticos (20601002000000S)',
    'Dirección General de Seguridad Pública y Tránsito (20601003000000L)',
    'Unidad de Montados, Caninos y Grupos de Apoyo al Medio Ambiente (20601003000300S)',
    'Dirección de Policía de Tránsito (20601003030000L)',
    'Subdirección Operativa Regional Atlacomulco (20601003050100T)',
    'Subdirección Operativa Regional Norte (20601003050200T)',
    'Subdirección Operativa Regional Toluca (20601003050300T)',
    'Subdirección Operativa Regional Ixtapan (20601003060100T)',
    'Subdirección Operativa Regional Sur (20601003060200T)',
    'Subdirección Operativa Regional Valle de Bravo (20601003060300T)',
    'Subdirección Operativa Regional Ecatepec (20601003070100T)',
    'Subdirección Operativa Regional Metropolitana (20601003070200T)',
    'Subdirección Operativa Regional Valle Cuautitlán (20601003070300T)',
    'Subdirección Operativa Regional Volcanes (20601003080100T)',
    'Subdirección Operativa Regional Oriente (20601003080200T)',
    'Subdirección Operativa Regional Texcoco (20601003080300T)',
    'Dirección General de Combate al Robo de Vehículos y Transporte (20601004000000L)',
    'Dirección General del Centro Estatal de Medidas Cautelares (20601005000000L)',
    'Subdirección Valle de México I (20601005000100T)',
    'Subdirección Valle de México II (20601005000200T)',
    'Subdirección Tlalnepantla (20601005000300T)',
    'Subdirección Norte (20601005000400T)',
    'Subdirección Sur (20601005000500T)',
    'Subdirección para Adultos Valle de México I (20601005000600T)',
    'Subdirección para Adultos Valle de México II (20601005000700T)',
    'Subdirección para Adultos Tlalnepantla (20601005000800T)',
    'Subdirección para Adultos Norte (20601005000900T)',
    'Subdirección para Adultos Sur (20601005001000T)',
    'Subdirección de Evaluación del Riesgo Procesal, Supervisión de Medidas Cautelares y Suspensión condicional del Proceso para Adolescentes (20601005001100L)',
    'Oficina del C. Director General (20601005A000000)',
    'Oficina del C. Director General (20601006A00000L)',
    'Coordinación de Enlace y Apoyo Técnico (20601007000000S)',
    'Subsecretaría de Control Penitenciario (20602000000000L)',
    'Dirección General de Prevención y Reinserción Social (20602001000000L)',
    'Oficialía Mayor (20603000000000L)',
    'Oficina del C. Secretario (206A00000000000)',
    'Secretariado Ejecutivo del Sistema Estatal de Seguridad Pública (206B01000000000)',
    'Universidad Mexiquense de Seguridad (206C01000000000)',
    'Centro de Control de Confianza del Estado de México (206C02000000000)',
    'Unidad de Asuntos Internos (206C03000000000)',
  ],
  'Secretaría de Finanzas': [
    'Coordinación Administrativa (20700002000000S)',
    'Órgano Interno de Control (20700003000000S)',
    'Unidad de Información, Planeación, Programación y Evaluación (20700004000000S)',
    'Coordinación Jurídica, de Igualdad de Género y de Erradicación de la Violencia (20700005000000S)',
    'Delegación de Asuntos Contenciosos Naucalpan (20700006030003T)',
    'Delegación de Asuntos Contenciosos Nezahualcóyotl (20700006030004T)',
    'Oficina del C. Procurador (20700006A00000L)',
    'Subcoordinación de Informática (20701000020000S)',
    'Coordinación de Administración (20701002000000S)',
    'Coordinación de Giras, Logística y Seguridad (20701003000000S)',
    'Coordinación de Agenda (20701004000000S)',
    'Coordinación de Atención Ciudadana (20701005000000S)',
    'Coordinación de Asuntos Internacionales (20701007000000S)',
    'Oficina del Jefe de la Unidad (20701A00000000S)',
    'Coordinación de Gestión Gubernamental (20702000000000S)',
    'Dirección General de Enlace Interinstitucional (20702002000000S)',
    'Dirección General de Programas Gubernamentales (20702003000000S)',
    'Dirección General de Tecnologías para la Gestión (20702004000000S)',
    'Subsecretaría de Ingresos (20703000000000L)',
    'Unidad de Apoyo Técnico Administrativo (20703000000200S)',
    'Dirección General de Recaudación (20703001000000L)',
    'Delegación Fiscal Nezahualcóyotl (20703001040200T)',
    'Delegación Fiscal Ecatepec (20703001040300T)',
    'Delegación Fiscal Tlalnepantla (20703001040400T)',
    'Delegación Fiscal Toluca (20703001040500T)',
    'Delegación Fiscal Naucalpan (20703001040600T)',
    'Delegación de Fiscalización Toluca (20703002030200T)',
    'Delegación de Fiscalización Tlalnepantla (20703002030300T)',
    'Delegación de Fiscalización Naucalpan (20703002030400T)',
    'Delegación de Fiscalización Ecatepec (20703002040100T)',
    'Delegación de Fiscalización Nezahualcóyotl (20703002040200T)',
    'Oficina del C. Director General (20703002A000000)',
    'Dirección General de Política Fiscal (20703003000000L)',
    'Dirección de Estudios de Política de Ingresos (20703003010000L)',
    'Oficina del C. Director General (20703003A000000)',
    'Dirección General de Regulación (20703004000000L)',
    'Subsecretaría de Planeación y Presupuesto (20704000000000L)',
    'Dirección General de Planeación y Gasto Público (20704001000000L)',
    'Contaduría General Gubernamental (20704002000000L)',
    'Dirección General de Inversión (20704003000000L)',
    'Subsecretaría de Tesorería (20705000000000L)',
    'Dirección General de Crédito (20705002000000L)',
    'Dirección General de Tesorería (20705100000000L)',
    'Oficina del C. Secretario (207A00000000000)',
    'Coordinación de Informática (207C0101000100S)',
    'Órgano Interno de control (207C0101020000S)',
    'Dirección de Geografía (207C0101030000L)',
    'Dirección de Estadística (207C0101040000L)',
    'Dirección de Catastro (207C0101050000L)',
    'Dirección de Servicios de Información (207C0101060000L)',
    'Comité de Planeación para el Desarrollo del Estado de México (207C02000000000)',
    'Instituto Hacendario del Estado de México (207C03000000000)',
    'Instituto de Políticas Públicas del Estado de México y sus Municipios (207C08000000000)',
    'Fideicomiso Público irrevocable de Administración, Financiamiento, Inversión y Pago para la Construcción de Centros Preventivos y de Readaptación Social en el Estado de México Denominado "Fideicomiso C3" (207E01000000000)',
  ],
  'Secretaría de Salud': [
    'Coordinación Estatal de Lactancia Materna y Bancos de Leche (20800000060000L)',
    'Coordinación Administrativa (20800001000000S)',
    'Coordinación de Voluntades Anticipadas (20800002000000L)',
    'Coordinación de Hospitales de Alta Especialidad (20802000000000L)',
    'Oficina del C. Srio. Salud (208A00000000000)',
    'Centro Estatal de Trasplantes (208B01000000000)',
    'Centro Estatal de Vigilancia Epidemiológica y Control de Enfermedades (208B03000000000)',
    'Instituto Mexiquense de Salud Mental y Adicciones (208B04000000000)',
    'Instituto de Salud del Estado de México (208C01000000000)',
    'Comisión de Conciliación y Arbitraje Médico del Estado de México (208C02000000000)',
    'Instituto Materno Infantil del Estado de México (208C03000000000)',
    'Hospital Regional de Alta Especialidad Zumpango (208C04000000000)',
    'Banco de Tejidos del Estado de México (208C05000000000)',
    'Instituto Mexiquense para la Discapacidad (208C08000000000)',
  ],
  'Secretaría del Trabajo': [
    'Dirección General de la Previsión Social (20900005000000L)',
    'Procuraduría de la Defensa del Trabajo (20900006000000L)',
    'Contraloría Interna (20900007000000S)',
    'Unidad de Información, Planeación, Programación y Evaluación (20900008000000S)',
    'Dirección General del Trabajo (20900009000000L)',
    'Oficina del C. Srio. Trabajo (209A00000000000)',
    'Instituto de Capacitación y Adiestramiento para el Trabajo Industrial (209C01000000000)',
    'Centro de Conciliación Laboral (209C02000000000)',
  ],
  'Secretaría de Educación, Ciencia, Tecnología e Innovación': [
    'Secretaría Técnica (22800007000000S)',
    'Dirección General de Cultura Física y Deporte (22800010000000L)',
    'Subsecretaría de Educación Básica (22801000000000L)',
    'Dirección General de Educación Preescolar (22801001000000L)',
    'Dirección General de Educación Primaria (22801002000000L)',
    'Dirección General de Educación Secundaria (22801003000000L)',
    'Dirección General de Inclusión y Fortalecimiento Educativo (22801004000000L)',
    'Subsecretaría de Educación Media Superior (22802000000000L)',
    'Dirección General de Educación Media Superior (22802001000000L)',
    'Dirección General de Fortalecimiento Académico de Educación Media Superior (22802002000000L)',
    'Subsecretaría de Educación Superior y Normal (22803000000000L)',
    'Dirección General de Educación Superior (22803001000000L)',
    'Dirección General de Educación Normal (22803002000000L)',
    'Subsecretaría de Administración y Finanzas (22804000000000L)',
    'Dirección General de Administración (22804001000000L)',
    'Dirección General de Finanzas (22804002000000L)',
    'Dirección General de Supervisión de Ingresos y Egresos de Instituciones Educativas (22804003000000L)',
    'Oficina del C. Srio. Educación (228A00000000000)',
    'Instituto Superior de Ciencias de la Educación del Estado de México (228B01000000000)',
    'Consejo para la Convivencia Escolar (228B02000000000)',
    'Coordinación Estatal del Servicio Profesional Docente (228B03000000000)',
    'Dirección General de Evaluación (228B0311000000L)',
    'Dirección General de Formación, Capacitación y Desarrollo Profesional Docente (228B0312000000L)',
    'Dirección General de Información, Planeación y Operación (228B0313000000L)',
    'Dirección de Servicios Regionalizados (228C0101010000L)',
    'Contraloría Interna (228C0101010000S)',
    'Unidad de Apoyo al Servicio Profesional Docente (228C0101040000S)',
    'Coordinación Académica y de Operación Educativa (228C0101100000L)',
    'Dirección de Educación Elemental (228C0101110000L)',
    'Dirección de Educación Secundaria y Servicios de Apoyo (228C0101120000L)',
    'Dirección de Preparatoria Abierta (228C0101130000L)',
    'Dirección de Educación Superior (228C0101140000L)',
    'Coordinación de Administración y Finanzas (228C0101200000L)',
    'Dirección de Instalaciones Educativas (228C0101210000L)',
    'Dirección de Planeación y Evaluación (228C0101250000L)',
    'Tecnológico de Estudios Superiores de Ecatepec (228C02000000000)',
    'Universidad Tecnológica de Nezahualcóyotl (228C03000000000)',
    'Colegio de Estudios Científicos y Tecnológicos del Estado de México (228C04000000000)',
    'Universidad Tecnológica "Fidel Velázquez" (228C05000000000)',
    'Universidad Tecnológica de Tecámac (228C06000000000)',
    'Centros EMSAD (228C0701000069T)',
    'Planteles COBAEM (228C0701000100T)',
    'Tecnológico de Estudios Superiores de Coacalco (228C08000000000)',
    'Universidad Tecnológica del Sur del Estado de México (228C09000000000)',
    'Tecnológico de Estudios Superiores de Cuautitlán Izcalli (228C10000000000)',
    'Tecnológico de Estudios Superiores del Oriente del Estado de México (228C11000000000)',
    'Tecnológico de Estudios Superiores de Huixquilucan (228C12000000000)',
    'Tecnológico de Estudios Superiores de Jilotepec (228C13000000000)',
    'Tecnológico de Estudios Superiores de Tianguistenco (228C14000000000)',
    'Instituto Mexiquense de la Infraestructura Física Educativa (228C15000000000)',
    'Tecnológico de Estudios Superiores de Chalco (228C16000000000)',
    'Tecnológico de Estudios Superiores de Jocotitlán (228C17000000000)',
    'Atlacomulco (228C1801000802M)',
    'Cuautitlán Izcalli (228C1801000804M)',
    'Chimalhuacán (228C1801000807M)',
    'Ecatepec (228C1801000809M)',
    'Lerma (228C1801000815M)',
    'Naucalpan (228C1801000816M)',
    'Nezahualcóyotl (228C1801000819M)',
    'Texcoco (228C1801000828M)',
    'Tlalnepantla (228C1801000832M)',
    'Toluca (228C1801000835M)',
    'Tultitlán (228C1801000836M)',
    'Valle de Bravo (228C1801000840M)',
    'Amecameca (228C1801000841M)',
    'Tecnológico de Estudios Superiores de Valle de Bravo (228C19000000000)',
    'Tecnológico de Estudios Superiores de Ixtapaluca (228C20000000000)',
    'Tecnológico de Estudios Superiores de Villa Guerrero (228C21000000000)',
    'Tecnológico de Estudios Superiores de San Felipe del Progreso (228C22000000000)',
    'Tecnológico de Estudios Superiores de Chimalhuacán (228C23000000000)',
    'Universidad Estatal del Valle de Ecatepec (228C24000000000)',
    'Universidad Tecnológica del Valle de Toluca (228C25000000000)',
    'Universidad Intercultural del Estado de México (228C26000000000)',
    'Universidad Politécnica del Valle de México (228C27000000000)',
    'Universidad Politécnica del Valle de Toluca (228C28000000000)',
    'Universidad Politécnica de Tecámac (228C29000000000)',
    'Universidad Mexiquense del Bicentenario (228C30000000000)',
    'Universidad Estatal del Valle de Toluca (228C31000000000)',
    'Universidad Politécnica de Texcoco (228C32000000000)',
    'Universidad Digital del Estado de México (228C33000000000)',
    'Centro Regional de Formación Docente e Investigación Educativa (228C34000000000)',
    'Universidad Politécnica de Cuautitlán Izcalli (228C35000000000)',
    'Universidad Tecnológica de Zinacantepec (228C36000000000)',
    'Tecnológico de Estudios Superiores de Chicoloapan (228C37000000000)',
    'Universidad Politécnica de Atlautla (228C38000000000)',
    'Instituto de Formación Continua, Profesionalización e Investigación del Magisterio del Estado de México (228C39000000000)',
    'Universidad Politécnica de Otzolotepec (228C40000000000)',
    'Universidad Politécnica de Chimalhuacán (228C41000000000)',
    'Universidad Politécnica de Atlacomulco (228C42000000000)',
    'Consejo Mexiquense de Ciencia y Tecnología (228C43000000000)',
  ],
  'Secretaría de Bienestar': [
    'Contraloría Interna (22900009000000S)',
    'Dirección General de Desarrollo Regional Valle de Toluca (22900016000000T)',
    'Dirección General de Desarrollo Regional Valle de México Zona Nororiente (22900017000000T)',
    'Dirección General de Desarrollo Regional Valle de México Zona Oriente (22900018000000T)',
    'Subsecretaría de Planeación de Bienestar Social (22904000000000L)',
    'Dirección General de Bienestar Social y Fortalecimiento Familiar (22904001000000L)',
    'Dirección General de Programas Sociales Estratégicos (22904002000000L)',
    'Dirección General de Desarrollo Institucional y Tecnologías de la Información (22904003000000L)',
    'Oficina del C. Srio. de Bienestar (229A00000000000)',
    'Consejo Estatal para el Desarrollo Integral de los Pueblos Indígenas del Estado de México (229C01000000000)',
    'Instituto Mexiquense de la Juventud (229C02000000000)',
    'Junta de Asistencia Privada del Estado de México (229C03000000000)',
    'Consejo de Investigación y Evaluación de la Política Social (229C04000000000)',
  ],
  'Secretaría de Desarrollo Económico': [
    'Dirección General de Comercio (21500003000000L)',
    'Coordinación de Fomento Económico y Competitividad (21501000000000S)',
    'Dirección General de Industria (21502001000000L)',
    'Dirección General de Atención Empresarial (21502002000000L)',
    'Oficina del C. Srio. Económico (215A00000000000)',
    'Comisión Estatal de Energía (215B01000000000)',
    'Comisión Estatal de Mejora Regulatoria (215B02000000000)',
    'Instituto de Fomento Minero y Estudios Geológicos del Estado de México (215C01000000000)',
    'Instituto Mexiquense del Emprendedor (215C02000000000)',
    'Fideicomiso para el Desarrollo de Parques y Zonas Industriales en el Estado de México (215E01000000000)',
  ],
  'Secretaría de Contraloría': [
    'Dirección de Políticas y Seguimiento de Sistemas en Contrataciones (21800000010000L)',
    'Dirección de Tecnologías de la Información y Comunicaciones (21800000020000L)',
    'Órgano Interno de Control (21800004000000S)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Oriente (21800004000100T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Sur (21800004000200T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Sureste (21800004000300T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Norte (21800004000400T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Noreste (21800004000500T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Metropolitana (21800004000600T)',
    'Delegación Regional de Contraloría Social y Atención Ciudadana Zona Toluca (21800004000700T)',
    'Oficina del C. Director General (21800004A000000)',
    'Coordinación Administrativa (21800005000000S)',
    'Unidad de Planeación, Seguimiento y Evaluación (21800007000000S)',
    'Coordinación Jurídica, de Igualdad de Género y Erradicación de la Violencia (21800008000000S)',
    'Coordinación de Estrategia Digital (21800009000000S)',
    'Oficina de la, el C. Jefa,e de Unidad (2180001A000000L)',
    'Oficina de la, el C. Subsecretaria, o (21802A000000000)',
    'Oficina de la, el C. Subsecretaria, o (21803A000000000)',
    'Oficina de la, o C. Secretaria, o (218A00000000000)',
    'Unidad Estatal de Evaluación de Confianza (218B02000000000)',
  ],
  'Secretaría de Movilidad': [
    'Dirección General de Vialidad (22000001000000L)',
    'Contraloría Interna (22000003000000S)',
    'Dirección General del Registro Estatal de Transporte Público (22000007000000L)',
    'Coordinación de Seguimiento y Análisis (22000009000000S)',
    'Coordinación Jurídica, de Igualdad de Género y Erradicación de la Violencia (22000013000000L)',
    'Subsecretaría de Movilidad (22001000000000L)',
    'Dirección General de Movilidad Zona I (22001001000000T)',
    'Dirección General de Movilidad Zona II (22001002000000T)',
    'Dirección General de Movilidad Zona III (22001003000000T)',
    'Dirección General de Movilidad Zona IV (22001004000000T)',
    'Oficina del C. Srio. Movilidad (220A00000000000)',
    'Instituto del Transporte del Estado de México (220B01000000000)',
    'Residencia Regional Toluca (220C0101000400T)',
    'Residencia Regional Cuautitlán (220C0101000500T)',
    'Residencia Regional Texcoco (220C0101000600T)',
    'Residencia Regional Atlacomulco (220C0101000700T)',
    'Residencia Regional Ixtapan de la Sal (220C0101000800T)',
    'Residencia Regional Tejupilco (220C0101000900T)',
    'Residencia Regional Tecámac - Ecatepec (220C0101001000T)',
    'Sistema de Autopistas, Aeropuertos, Servicios Conexos y Auxiliares del Estado de México (220C02000000000)',
    'Sistema de Transporte Masivo y Teleférico del Estado de México (220C03000000000)',
  ],
  'Secrettaría de Medio Ambiente y Desarrollo Sustentable': [
    'Contraloría Interna (23100000010000S)',
    'Dirección General de Prevención y Control de la Contaminación Atmosférica (23100005000000L)',
    'Dirección General de Manejo Integral de Residuos (23100006000000L)',
    'Dirección General de Ordenamiento e Impacto Ambiental (23100007000000L)',
    'Oficina del C. Srio. Medio Ambiente y Desarrollo Sostenible (231A00000000000)',
    'Coordinación General de Conservación Ecológica (231B01000000000)',
    'Dirección General (231C01010000000)',
    'Parque el Ocotal (231C0101000203M)',
    'Parque Sierra Morelos (231C0101000204M)',
    'Parque Insurgente Miguel Hidalgo y Costilla “La Marquesa” (231C0101000205M)',
    'Parque Centro Ceremonial Mazahua (231C0101000206M)',
    'Parque Santuario de la Mariposa Monarca (231C0101000208M)',
    'Parque Hermenegildo Galeana (231C0101000209M)',
    'Parque Centro Ceremonial Otomí (231C0101000210M)',
    'Parque San Sebastián Luvianos (231C0101000211M)',
    'Parque Nacional Nevado de Toluca (231C0101000212M)',
    'Parque el Salto Chihuahua (231C0101000213M)',
    'Parque Sierra de Nanchititla (231C0101000214M)',
    'Reserva Estatal “Monte Alto” (231C0101000215M)',
    'Parque del Pueblo, Zoológico de Ciudad Nezahualcóyotl (231C0101000217M)',
    'Coordinación del Zoológico de Zacango (231C0101000220M)',
    'Subprocuraduría de Protección a la Fauna (231C0201000600L)',
    'Subprocuraduría Valle de Toluca (231C0201000700T)',
    'Subprocuraduría Valle de México (231C0201000800T)',
    'Instituto Estatal de Energía y Cambio Climático (231C04000000000)',
  ],
  'Secretaría de Desarollo Urbano e Infraestructura': [
    'Contraloría Interna (23000006000000S)',
    'Subsecretaría de Desarrollo Urbano (23000200000000L)',
    'Dirección General de Planeación Urbana (23000201000000L)',
    'Dirección General de Proyectos y Coordinación Metropolitana (23000202000000L)',
    'Dirección General de Operación y Control Urbano (23000203000000L)',
    'Dirección Técnica para Autorizaciones Urbanas (23000203010000L)',
    'Dirección de Control Urbano, Obras y Áreas de Donación (23000203040000L)',
    'Residencia Local Toluca (23000203050005T)',
    'Dirección Regional Valle de México Zona Nororiente (23000203060000T)',
    'Dirección Regional Valle de México Zona Oriente (23000203070000T)',
    'Subsecretaría de Infraestructura (23000300000000L)',
    'Dirección General de Proyectos, Concursos y Contratos (23000301000000L)',
    'Dirección de Electrificación (23000301020000L)',
    'Dirección General de Construcción de Obra Pública e Infraestructura (23000302000000L)',
    'Residencia Región Atlacomulco (23000302010200T)',
    'Residencia Región Toluca (23000302010300T)',
    'Residencia Regiones Zumpango, Cuautitlán Izcalli y Naucalpan (23000302020200T)',
    'Residencia Regiones Ecatepec y Texcoco (23000302020300T)',
    'Residencia Regiones Nezahualcóyotl y Amecameca (23000302020400T)',
    'Oficina del C. Secretario (230A00000000000)',
    'Comisión de Impacto Estatal (230B01000000000)',
    'Instituto Mexiquense de la Vivienda Social (230C01000000000)',
  ],
  'Secretaría del Campo': [
    'Contraloría Interna (22500000020000S)',
    'Dirección General de Sanidad, Inocuidad y Calidad Agroalimentaria (22500007000000L)',
    'Dirección General de Desarrollo Rural (22501001000000L)',
    'Dirección General de Comercialización Agropecuaria (22501002000000L)',
    'Dirección General de Agricultura (22501003000000L)',
    'Dirección General Pecuaria (22501004000000L)',
    'Coordinación de Delegaciones Regionales de Desarrollo Agropecuario (22501005000000T)',
    'Delegación Regional de Desarrollo Agropecuario Metepec (22501005000400T)',
    'Delegación Regional de Desarrollo Agropecuario Zumpango (22501005000500T)',
    'Delegación Regional de Desarrollo Agropecuario Texcoco (22501005000600T)',
    'Delegación Regional de Desarrollo Agropecuario Tejupilco (22501005000700T)',
    'Delegación Regional de Desarrollo Agropecuario Atlacomulco (22501005000800T)',
    'Delegación Regional de Desarrollo Agropecuario Ixtapan de la Sal (22501005000900T)',
    'Delegación Regional de Desarrollo Agropecuario Valle de Bravo (22501005001000T)',
    'Delegación Regional de Desarrollo Agropecuario Jilotepec (22501005001100T)',
    'Delegación Regional de Desarrollo Agropecuario Teotihuacán (22501005001200T)',
    'Delegación Regional de Desarrollo Agropecuario Tepotzotlán (22501005001300T)',
    'Delegación Regional de Desarrollo Agropecuario Amecameca (22501005001400T)',
    'Dirección General de Infraestructura Rural (22501006000000L)',
    'Oficina del C. Srio. del Campo (225A00000000000)',
    'Instituto de Investigación y Capacitación Agropecuaria, Acuícola y Forestal del Estado de México (225C01000000000)',
    'Protectora de Bosques del Estado de México (225C02000000000)',
  ],
  'Secretaría de Cultura y Turismo': [
    'Secretaría Ejecutiva del Consejo Editorial de la Administración Pública Estatal (22600008000000L)',
    'Dirección General de Planeación y Desarrollo Turístico Sostenible (22600009000000L)',
    'Dirección General de Promoción Turística (22600010000000L)',
    'Dirección General de Calidad y Servicios Turísticos (22600011000000L)',
    'Subsecretaría de Cultura (22600200000000L)',
    'Dirección del Conservatorio de Música del Estado de México (22600200020000L)',
    'Dirección de la Orquesta Sinfónica del Estado de México (22600200030000L)',
    'Dirección General de Patrimonio y Servicios Culturales Valle de los Volcanes (22600201000000L)',
    'Dirección General de Patrimonio y Servicios Culturales del Valle de Toluca (22600202000000L)',
    'Oficina del C. Srio. de Cultura y Turismo (226A00000000000)',
    'Contraloría Interna (226A0002000000S)',
    'Instituto de Investigación y Fomento de las Artesanías del Estado de México (226C01000000000)',
  ],
  'Secretaría de las Mujeres': [
    'Órgano Interno de Control (22700000040000S)',
    'Coordinación Jurídica, de Igualdad de Género y Erradicación de la Violencia (22700000060000S)',
    'Dirección General de Igualdad Sustantiva (22700001000000L)',
    'Dirección General de Prevención y Atención a la Violencia (22700003000000L)',
    'Dirección General de Transversalización de la Perspectiva de Género (22700005000000L)',
    'Oficina de la o del C. Secretaria, o (227A00000000000)',
    'Secretaría Ejecutiva del Sistema Estatal de Protección Integral de Niñas, Niños y Adolescentes del Estado de México (227B01000000000)',
  ],
  'Secretaría del Agua': [
    'Coordinación Jurídica, de Igualdad de Género y Erradicación de la Violencia (23200001000000S)',
    'Coordinación Administrativa (23200002000000S)',
    'Dirección General de Derecho Humano al Agua, Planeación y Ordenamiento (23200003000000L)',
    'Dirección General de Operación y Obras (23200004000000L)',
    'Oficina del C. Secretario (232A0000000000L)',
    'Vocalía Ejecutiva (232C01100000000)',
    'Unidad de Modernización Administrativa e Informática (232C0110010000S)',
    'Contraloría Interna (232C0110020000S)',
    'Dirección General del Programa Hidráulico (232C0111000000L)',
    'Dirección General de Inversión y Gestión (232C0112000000L)',
    'Dirección General de Infraestructura Hidráulica (232C0113000000L)',
    'Dirección de Construcción (232C0113010000L)',
    'Dirección General de Operaciones y Atención a Emergencias (232C0114000000L)',
    'Gerencia Regional Toluca (232C0114000400T)',
    'Gerencia Regional Cuautitlán Poniente (232C0114000500T)',
    'Gerencia Regional Cuautitlán Oriente (232C0114000600T)',
    'Gerencia Regional Atlacomulco (232C0114000700T)',
    'Gerencia Regional Coatepec Harinas (232C0114000800T)',
    'Gerencia Regional Tejupilco - Valle de Bravo (232C0114000900T)',
    'Gerencia Regional Texcoco (232C0114001000T)',
    'Dirección General de Coordinación de Organismos Operadores (232C0115000000L)',
    'Dirección General de Asuntos Jurídicos (232C0116000000L)',
    'Dirección General de Administración y Finanzas (232C0117000000L)',
    'Comisión Técnica del Agua del Estado de México (232C02000000000)',
    'Reciclagua Ambiental, S.A. de C.V. (232D01000000000)',
  ],
  'Consejería Jurídica': [
    'Secretaría Particular (23300000010000S)',
    'Coordinación Administrativa (23300001000000S)',
    'Órgano Interno de Control (23300002000000S)',
    'Unidad de Vinculación y Comunicación (23300003000000S)',
    'Unidad de Información, Planeación, Programación y Evaluación (23300005000000S)',
    'Coordinación de Estudios y Proyectos Especiales (23300006000000S)',
    'Subsecretaría de Justicia (23301000000000L)',
    'Oficina Regional del Registro Civil Toluca (23301001000101M)',
    'Oficina Regional del Registro Civil Atlacomulco (23301001000102M)',
    'Oficina Regional del Registro Civil Ixtlahuaca (23301001000103M)',
    'Oficina Regional del Registro Civil Lerma (23301001000104M)',
    'Oficina Regional del Registro Civil Ixtapan de la Sal (23301001000201M)',
    'Oficina Regional del Registro Civil Tenango del Valle (23301001000202M)',
    'Oficina Regional del Registro Civil Temascaltepec (23301001000203M)',
    'Oficina Regional del Registro Civil Nezahualcóyotl (23301001000301M)',
    'Oficina Regional del Registro Civil Amecameca (23301001000302M)',
    'Oficina Regional del Registro Civil Otumba (23301001000303M)',
    'Oficina Regional del Registro Civil Cuautitlán Izcalli (23301001000401M)',
    'Oficina Regional del Registro Civil Zumpango (23301001000402M)',
    'Oficina Regional del Registro Civil Ecatepec (23301001000403M)',
    'Oficina del C. Director General (23301001A000000)',
    'Dirección General de Justicia Cotidiana (23301003000000L)',
    'Dirección General de Protección al Colono (23301004000000L)',
    'Subsecretaría Jurídica y de Derechos Humanos (23302000000000L)',
    'Dirección General Jurídica y Consultiva (23302001000000L)',
    'Dirección General de Derechos Humanos e Igualdad de Género (23302002000000L)',
    'Dirección General de Legalización y del Periódico Oficial "Gaceta del Gobierno" (23302003000000L)',
    'Dirección General de Asuntos Agrarios (23302004000000L)',
    'Dirección General de Procedimientos y Asuntos Notariales (23302005000000L)',
    'Dirección General de Legislación y Estudios Normativos (23302006000000L)',
    'Oficina del C. Secretario (233A00000000000)',
    'Instituto de la Defensoría Pública del Estado de México (233B01000000000)',
    'Comisión Ejecutiva de Atención a Víctimas del Estado de México (233B02000000000)',
    'Comisión de Búsqueda de Personas del Estado de México (233B03000000000)',
    'Instituto de Verificación Administrativa del Estado de México (233B04000000000)',
    'Coordinación Ejecutiva del Mecanismo para la Protección Integral de Periodistas y Personas Defensoras de los Derechos Humanos del Estado de México (233B05000000000)',
    'Instituto de la Función Registral del Estado de México (233C01000000000)',
  ],
  'Oficialía Mayor': [
    'Coordinación de Servicios Auxiliares a Contingencias y Emergencias (23400001000000S)',
    'Órgano Interno de Control (23400003000000S)',
    'Dirección General de Personal (23400004000000L)',
    'Dirección General de Recursos Materiales (23400005000000L)',
    'Dirección General de Innovación (23400006000000L)',
    'Oficina del C. Oficial Mayor (234A00000000000)',
    'Instituto de Profesionalización de los Servidores Públicos del Poder Ejecutivo del Gobierno del Estado de México (234B01000000000)',
    'Archivo General del Estado de México (234B02000000000)',
    'Instituto de Seguridad Social del Estado de México y Municipios (234C01000000000)',
  ],
  'Agencia Digital del Estado de México': [
    'Oficina de la o del C. Titular de la Agencia Digital del Estado de México (23800001A000000)',
  ],
  'Organismos OPDS': [
    'Consejo Estatal de Población (205B01000000000)',
    'Instituto Mexiquense de la Pirotecnia (205C02000000000)',
    'Sistema Mexiquense de Medios Públicos (205C03000000000)',
    'Secretariado Ejecutivo del Sistema Estatal de Seguridad Pública (206B01000000000)',
    'Universidad Mexiquense de Seguridad (206C01000000000)',
    'Centro de Control de Confianza del Estado de México (206C02000000000)',
    'Unidad de Asuntos Internos (206C03000000000)',
    'Comité de Planeación para el Desarrollo del Estado de México (207C02000000000)',
    'Instituto Hacendario del Estado de México (207C03000000000)',
    'Instituto de Políticas Públicas del Estado de México y sus Municipios (207C08000000000)',
    'Fideicomiso Público irrevocable de Administración, Financiamiento, Inversión y Pago para la Construcción de Centros Preventivos y de Readaptación Social en el Estado de México Denominado "Fideicomiso C3" (207E01000000000)',
    'Centro Estatal de Trasplantes (208B01000000000)',
    'Centro Estatal de Vigilancia Epidemiológica y Control de Enfermedades (208B03000000000)',
    'Instituto Mexiquense de Salud Mental y Adicciones (208B04000000000)',
    'Instituto de Salud del Estado de México (208C01000000000)',
    'Comisión de Conciliación y Arbitraje Médico del Estado de México (208C02000000000)',
    'Instituto Materno Infantil del Estado de México (208C03000000000)',
    'Hospital Regional de Alta Especialidad Zumpango (208C04000000000)',
    'Banco de Tejidos del Estado de México (208C05000000000)',
    'Instituto Mexiquense para la Discapacidad (208C08000000000)',
    'Instituto de Capacitación y Adiestramiento para el Trabajo Industrial (209C01000000000)',
    'Centro de Conciliación Laboral (209C02000000000)',
    'Comisión Estatal de Energía (215B01000000000)',
    'Comisión Estatal de Mejora Regulatoria (215B02000000000)',
    'Instituto de Fomento Minero y Estudios Geológicos del Estado de México (215C01000000000)',
    'Instituto Mexiquense del Emprendedor (215C02000000000)',
    'Fideicomiso para el Desarrollo de Parques y Zonas Industriales en el Estado de México (215E01000000000)',
    'Unidad Estatal de Evaluación de Confianza (218B02000000000)',
    'Instituto del Transporte del Estado de México (220B01000000000)',
    'Sistema de Autopistas, Aeropuertos, Servicios Conexos y Auxiliares del Estado de México (220C02000000000)',
    'Sistema de Transporte Masivo y Teleférico del Estado de México (220C03000000000)',
    'Instituto de Investigación y Capacitación Agropecuaria, Acuícola y Forestal del Estado de México (225C01000000000)',
    'Protectora de Bosques del Estado de México (225C02000000000)',
    'Instituto de Investigación y Fomento de las Artesanías del Estado de México (226C01000000000)',
    'Secretaría Ejecutiva del Sistema Estatal de Protección Integral de Niñas, Niños y Adolescentes del Estado de México (227B01000000000)',
    'Instituto Superior de Ciencias de la Educación del Estado de México (228B01000000000)',
    'Consejo para la Convivencia Escolar (228B02000000000)',
    'Coordinación Estatal del Servicio Profesional Docente (228B03000000000)',
    'Tecnológico de Estudios Superiores de Ecatepec (228C02000000000)',
    'Universidad Tecnológica de Nezahualcóyotl (228C03000000000)',
    'Colegio de Estudios Científicos y Tecnológicos del Estado de México (228C04000000000)',
    'Universidad Tecnológica "Fidel Velázquez" (228C05000000000)',
    'Universidad Tecnológica de Tecámac (228C06000000000)',
    'Tecnológico de Estudios Superiores de Coacalco (228C08000000000)',
    'Universidad Tecnológica del Sur del Estado de México (228C09000000000)',
    'Tecnológico de Estudios Superiores de Cuautitlán Izcalli (228C10000000000)',
    'Tecnológico de Estudios Superiores del Oriente del Estado de México (228C11000000000)',
    'Tecnológico de Estudios Superiores de Huixquilucan (228C12000000000)',
    'Tecnológico de Estudios Superiores de Jilotepec (228C13000000000)',
    'Tecnológico de Estudios Superiores de Tianguistenco (228C14000000000)',
    'Instituto Mexiquense de la Infraestructura Física Educativa (228C15000000000)',
    'Tecnológico de Estudios Superiores de Chalco (228C16000000000)',
    'Tecnológico de Estudios Superiores de Jocotitlán (228C17000000000)',
    'Tecnológico de Estudios Superiores de Valle de Bravo (228C19000000000)',
    'Tecnológico de Estudios Superiores de Ixtapaluca (228C20000000000)',
    'Tecnológico de Estudios Superiores de Villa Guerrero (228C21000000000)',
    'Tecnológico de Estudios Superiores de San Felipe del Progreso (228C22000000000)',
    'Tecnológico de Estudios Superiores de Chimalhuacán (228C23000000000)',
    'Universidad Estatal del Valle de Ecatepec (228C24000000000)',
    'Universidad Tecnológica del Valle de Toluca (228C25000000000)',
    'Universidad Intercultural del Estado de México (228C26000000000)',
    'Universidad Politécnica del Valle de México (228C27000000000)',
    'Universidad Politécnica del Valle de Toluca (228C28000000000)',
    'Universidad Politécnica de Tecámac (228C29000000000)',
    'Universidad Mexiquense del Bicentenario (228C30000000000)',
    'Universidad Estatal del Valle de Toluca (228C31000000000)',
    'Universidad Politécnica de Texcoco (228C32000000000)',
    'Universidad Digital del Estado de México (228C33000000000)',
    'Centro Regional de Formación Docente e Investigación Educativa (228C34000000000)',
    'Universidad Politécnica de Cuautitlán Izcalli (228C35000000000)',
    'Universidad Tecnológica de Zinacantepec (228C36000000000)',
    'Tecnológico de Estudios Superiores de Chicoloapan (228C37000000000)',
    'Universidad Politécnica de Atlautla (228C38000000000)',
    'Instituto de Formación Continua, Profesionalización e Investigación del Magisterio del Estado de México (228C39000000000)',
    'Universidad Politécnica de Otzolotepec (228C40000000000)',
    'Universidad Politécnica de Chimalhuacán (228C41000000000)',
    'Universidad Politécnica de Atlacomulco (228C42000000000)',
    'Consejo Mexiquense de Ciencia y Tecnología (228C43000000000)',
    'Consejo Estatal para el Desarrollo Integral de los Pueblos Indígenas del Estado de México (229C01000000000)',
    'Instituto Mexiquense de la Juventud (229C02000000000)',
    'Junta de Asistencia Privada del Estado de México (229C03000000000)',
    'Consejo de Investigación y Evaluación de la Política Social (229C04000000000)',
    'Comisión de Impacto Estatal (230B01000000000)',
    'Instituto Mexiquense de la Vivienda Social (230C01000000000)',
    'Coordinación General de Conservación Ecológica (231B01000000000)',
    'Instituto Estatal de Energía y Cambio Climático (231C04000000000)',
    'Comisión Técnica del Agua del Estado de México (232C02000000000)',
    'Reciclagua Ambiental, S.A. de C.V. (232D01000000000)',
    'Instituto de la Defensoría Pública del Estado de México (233B01000000000)',
    'Comisión Ejecutiva de Atención a Víctimas del Estado de México (233B02000000000)',
    'Comisión de Búsqueda de Personas del Estado de México (233B03000000000)',
    'Instituto de Verificación Administrativa del Estado de México (233B04000000000)',
    'Coordinación Ejecutiva del Mecanismo para la Protección Integral de Periodistas y Personas Defensoras de los Derechos Humanos del Estado de México (233B05000000000)',
    'Instituto de la Función Registral del Estado de México (233C01000000000)',
    'Instituto de Profesionalización de los Servidores Públicos del Poder Ejecutivo del Gobierno del Estado de México (234B01000000000)',
    'Archivo General del Estado de México (234B02000000000)',
    'Instituto de Seguridad Social del Estado de México y Municipios (234C01000000000)',
  ],
  };

  get centroCostoOptions(): string[] {
    const dep = this.form?.get('dependencia')?.value;
    if (!dep || dep === 'Organismos OPDS') return [];
    return this.centrosCostoByDependencia[dep] ?? [];
  }

  constructor(private fb: FormBuilder, private router: Router,) {
    this.form = this.fb.group(
      {
        folioInterno: ['', [Validators.required, Validators.maxLength(50)]],
        fechaIngreso: ['', Validators.required],
        origenRecurso: ['', Validators.required],
        dependencia: ['', Validators.required],

        // OPDS
        opdsDescentralizado: [''],
        organoDesconcentrado: [''],

        // Secretarías
        centroCosto: [''],

        // Estudio de Mercado
        capitulo: ['', Validators.required],
        giro: ['', Validators.required],
        subGiro: ['', Validators.required],
      },
      { validators: [this.opdsSelectionValidator] }
    );

    // Estado inicial
    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });

    // SubGiro depende del Giro
    this.form.get('subGiro')?.disable({ emitEvent: false });

    // Dependencia: OPDS vs Secretarías
    this.form.get('dependencia')?.valueChanges.subscribe((dep) => {
      const desc = this.form.get('opdsDescentralizado')!;
      const desconc = this.form.get('organoDesconcentrado')!;
      const cc = this.form.get('centroCosto')!;

      // Limpia al cambiar
      desc.setValue('', { emitEvent: false });
      desconc.setValue('', { emitEvent: false });
      cc.setValue('', { emitEvent: false });

      if (!dep) {
        desc.disable({ emitEvent: false });
        desconc.disable({ emitEvent: false });

        cc.disable({ emitEvent: false });
        cc.clearValidators();
        cc.updateValueAndValidity({ emitEvent: false });

        this.form.updateValueAndValidity({ emitEvent: false });
        return;
      }

      if (dep === 'Organismos OPDS') {
        desc.enable({ emitEvent: false });
        desconc.enable({ emitEvent: false });

        cc.disable({ emitEvent: false });
        cc.clearValidators();
        cc.updateValueAndValidity({ emitEvent: false });
      } else {
        desc.disable({ emitEvent: false });
        desconc.disable({ emitEvent: false });

        cc.enable({ emitEvent: false });
        cc.setValidators([Validators.required]);
        cc.updateValueAndValidity({ emitEvent: false });
      }

      this.form.updateValueAndValidity({ emitEvent: false });
    });

    // OPDS: si eligen Descentralizado => bloquea Desconcentrado
    this.form.get('opdsDescentralizado')?.valueChanges.subscribe((val) => {
      const desconc = this.form.get('organoDesconcentrado');
      if (!desconc) return;

      if (val) {
        desconc.setValue('', { emitEvent: false });
        desconc.disable({ emitEvent: false });
      } else if (this.form.get('dependencia')?.value === 'Organismos OPDS') {
        desconc.enable({ emitEvent: false });
      }
      this.form.updateValueAndValidity({ emitEvent: false });
    });

    // OPDS: si eligen Desconcentrado => bloquea Descentralizado
    this.form.get('organoDesconcentrado')?.valueChanges.subscribe((val) => {
      const desc = this.form.get('opdsDescentralizado');
      if (!desc) return;

      if (val) {
        desc.setValue('', { emitEvent: false });
        desc.disable({ emitEvent: false });
      } else if (this.form.get('dependencia')?.value === 'Organismos OPDS') {
        desc.enable({ emitEvent: false });
      }
      this.form.updateValueAndValidity({ emitEvent: false });
    });

    // Giro -> habilita SubGiro y lo limpia
    this.form.get('giro')?.valueChanges.subscribe((g) => {
      const sub = this.form.get('subGiro');
      if (!sub) return;

      sub.setValue('', { emitEvent: false });

      if (g) sub.enable({ emitEvent: false });
      else sub.disable({ emitEvent: false });
    });
  }

  // ✅ Form-level validator: si dependencia=OPDS debe elegir al menos uno
  private opdsSelectionValidator(group: AbstractControl): ValidationErrors | null {
    const dep = group.get('dependencia')?.value;
    if (dep !== 'Organismos OPDS') return null;

    const d = group.get('opdsDescentralizado')?.value;
    const o = group.get('organoDesconcentrado')?.value;

    if (!d && !o) return { opdsRequired: true };
    return null;
  }

  hasError(name: string, err: string) {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  showOpdsRequiredError(): boolean {
    const dep = this.form.get('dependencia')?.value;
    if (dep !== 'Organismos OPDS') return false;

    const touched =
      this.form.get('opdsDescentralizado')?.touched || this.form.get('organoDesconcentrado')?.touched;

    return !!(touched && this.form.hasError('opdsRequired'));
  }

  onClear() {
    this.form.reset(
      {
        folioInterno: '',
        fechaIngreso: '',
        origenRecurso: '',
        dependencia: '',
        opdsDescentralizado: '',
        organoDesconcentrado: '',
        centroCosto: '',
        capitulo: '',
        giro: '',
        subGiro: '',
      },
      { emitEvent: false }
    );

    // vuelve al estado inicial
    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });
    this.form.get('subGiro')?.disable({ emitEvent: false });

    // centroCosto deja de ser requerido hasta elegir dependencia
    this.form.get('centroCosto')?.clearValidators();
    this.form.get('centroCosto')?.updateValueAndValidity({ emitEvent: false });

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('GUARDAR =>', this.form.value);
    const data= this.form.value;

    this._registroService.saveRegistro(data).subscribe({
      next: (response: any) => {
        if (response) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Solicitud registrada satisfactoriamente!',
            text: `Para continuar con el trámite.`,
            showConfirmButton: false,
            timer: 10000
          });
          this.router.navigate(['/']);
        }
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: e.error.msg + ': ' + e.error.correo,
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/']);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error desconocido: ' + e,
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/']);
        }
      }
    });
  }
}