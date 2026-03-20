import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-create.component.html',
  styleUrl: './solicitud-create.component.scss'
})
export class SolicitudCreateComponent {

  form!: FormGroup;

  // ✅ Wizard
  currentStep = 1;
  totalPages = 81;

  // ✅ Origen de recurso (select)
  origenOptions = [
    { value: 'Estatal', label: 'Estatal' },
    { value: 'Federal', label: 'Federal' },
    { value: 'Fideicomiso', label: 'Fideicomiso' },
    { value: 'Concurrente o Propio', label: 'Concurrente o Propio' },
  ];

  // ✅ Capítulos (Paso 2)
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
  // ✅ GIRO / SUBGIRO (ejemplo, cámbialo a tus catálogos reales)
  giroOptions: string[] = [
    'Bienes',
    'Servicios',
    'Arrendamientos',
  ];
  subGiroByGiro: Record<string, string[]> = {
  Bienes: ['Papelería', 'Mobiliario', 'Equipo de cómputo'],
  Servicios: ['Mantenimiento', 'Limpieza', 'Consultoría'],
  Arrendamientos: ['Inmuebles', 'Vehículos'],
};

get subGiroOptions(): string[] {
  const g = this.form?.get('giro')?.value;
  return g ? (this.subGiroByGiro[g] ?? []) : [];
}
  // ✅ Dependencias
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
    'Consejería Jurídica',
    'Secretaría de Desarollo Urbano e Infraestructura',
    'Secretaría del Campo',
    'Secretaría de Cultura y Turismo',
    'Secretaría de las Mujeres',
    'Oficialía Mayor',
    'Secretaría del Agua',
    'Agencia Digital del Estado de México',
    'Organismos OPDS'
  ];

  // ✅ OPDS Descentralizados
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
  ];

  // ✅ Órganos Desconcentrados
  organosDesconcentradosOptions: string[] = [
    'Archivo General del Estado de México - 23400000000000L',
    'Centro Estatal de Trasplantes - 20800000000000L',
    'Centro Estatal de Vigilancia Epidemiológica y Control de Enfermadades - 20800000000000L',
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

  // ✅ Centros de costo por dependencia
  centrosCostoByDependencia: Record<string, string[]> = {
    'Secretaría General de Gobierno': [
      'Coordinación de Acción Cívica y Eventos Especiales (205000000010000S)',
      'Oficina del C. Coordinador de Acción Cívica y Eventos Especiales (205000000010000S)',
      'Dirección General de Desarrollo Político (205000010000000L)',
      'Dirección de Desarrollo Político (205000010100000L)',
      'Unidad de Análisis (205000010100000S)',
      'Dirección de Participación Social (205000010200000L)',
    ],
    'Secretaría de Finanzas': [
      'Ejemplo Centro A - 111111',
      'Ejemplo Centro B - 222222',
    ],
  };

  // ✅ Centro de costo según dependencia
  get centroCostoOptions(): string[] {
    const dep = this.form?.get('dependencia')?.value;
    if (!dep || dep === 'Organismos OPDS') return [];
    return this.centrosCostoByDependencia[dep] ?? [];
  }

  // ✅ progreso visual
  get progressPercent(): number {
    return Math.round((this.currentStep / this.totalPages) * 100);
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      folioInterno: ['', [Validators.required, Validators.maxLength(50)]],
      fechaIngreso: ['', [Validators.required]],
      origenRecurso: [null, [Validators.required]],
      dependencia: [null, Validators.required],
      // OPDS
      opdsDescentralizado: [null],
      organoDesconcentrado: [null],

      // Secretarías y OPDS
      centroCosto: [null],

      // Paso 2
      capitulo: [null, Validators.required], 

      giro: [null, [Validators.required, Validators.maxLength(150)]],
      subGiro: [null, [Validators.required, Validators.maxLength(150)]],
    });

    // ✅ Estado inicial
    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });

    // ✅ Capítulo deshabilitado al inicio (para que no bloquee paso 1)
    this.form.get('capitulo')?.disable({ emitEvent: false });

    // ✅ Cuando cambia dependencia (OPDS vs Secretarías)
    this.form.get('dependencia')?.valueChanges.subscribe((val) => {
      const desc = this.form.get('opdsDescentralizado');
      const desconc = this.form.get('organoDesconcentrado');
      const cc = this.form.get('centroCosto');

      // limpia al cambiar
      desc?.setValue(null, { emitEvent: false });
      desconc?.setValue(null, { emitEvent: false });
      cc?.setValue(null, { emitEvent: false });

      if (!val) {
        desc?.disable({ emitEvent: false });
        desconc?.disable({ emitEvent: false });

        cc?.disable({ emitEvent: false });
        cc?.clearValidators();
        cc?.updateValueAndValidity({ emitEvent: false });
        return;
      }

      if (val === 'Organismos OPDS') {
        desc?.enable({ emitEvent: false });
        desconc?.enable({ emitEvent: false });

        cc?.disable({ emitEvent: false });
        cc?.clearValidators();
        cc?.updateValueAndValidity({ emitEvent: false });

      } else {
        desc?.disable({ emitEvent: false });
        desconc?.disable({ emitEvent: false });

        cc?.enable({ emitEvent: false });
        cc?.setValidators([Validators.required]);
        cc?.updateValueAndValidity({ emitEvent: false });
      }
    });

    // ✅ Si eligen Descentralizado -> deshabilita Desconcentrado
    this.form.get('opdsDescentralizado')?.valueChanges.subscribe((val) => {
      const desconc = this.form.get('organoDesconcentrado');
      if (!desconc) return;

      if (val) {
        desconc.setValue(null, { emitEvent: false });
        desconc.disable({ emitEvent: false });
      } else if (this.form.get('dependencia')?.value === 'Organismos OPDS') {
        desconc.enable({ emitEvent: false });
      }
    });

    // ✅ Si eligen Desconcentrado -> deshabilita Descentralizado
    this.form.get('organoDesconcentrado')?.valueChanges.subscribe((val) => {
      const desc = this.form.get('opdsDescentralizado');
      if (!desc) return;

      if (val) {
        desc.setValue(null, { emitEvent: false });
        desc.disable({ emitEvent: false });
      } else if (this.form.get('dependencia')?.value === 'Organismos OPDS') {
        desc.enable({ emitEvent: false });
      }
    });
  }

  // ✅ Validación helper
  hasError(name: string, err: string) {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  // ✅ Siguiente paso
  nextStep() {

    // PASO 1 -> PASO 2
    if (this.currentStep === 1) {

      this.form.get('folioInterno')?.markAsTouched();
      this.form.get('fechaIngreso')?.markAsTouched();
      this.form.get('origenRecurso')?.markAsTouched();
      this.form.get('dependencia')?.markAsTouched();

      if (
        this.form.get('folioInterno')?.invalid ||
        this.form.get('fechaIngreso')?.invalid ||
        this.form.get('origenRecurso')?.invalid ||
        this.form.get('dependencia')?.invalid
      ) {
        return;
      }

      const dep = this.form.get('dependencia')?.value;

      // OPDS: debe elegir al menos uno
      if (dep === 'Organismos OPDS') {
        const d = this.form.get('opdsDescentralizado')?.value;
        const o = this.form.get('organoDesconcentrado')?.value;

        this.form.get('opdsDescentralizado')?.markAsTouched();
        this.form.get('organoDesconcentrado')?.markAsTouched();

        if (!d && !o) return;
      }

      // Secretarías: centro de costo obligatorio
      if (dep && dep !== 'Organismos OPDS') {
        this.form.get('centroCosto')?.markAsTouched();
        if (this.form.get('centroCosto')?.invalid) return;
      }

      // ✅ habilita Capítulo hasta el paso 2 (y lo vuelve requerido)
      const cap = this.form.get('capitulo');
      cap?.enable({ emitEvent: false });
      cap?.setValidators([Validators.required]);
      cap?.updateValueAndValidity({ emitEvent: false });

      this.currentStep = 2;
      return;
    }
      if (this.currentStep === 2) {
  this.form.get('capitulo')?.markAsTouched();
  this.form.get('giro')?.markAsTouched();
  this.form.get('subGiro')?.markAsTouched();

  if (
    this.form.get('capitulo')?.invalid ||
    this.form.get('giro')?.invalid ||
    this.form.get('subGiro')?.invalid
  ) return;

  console.log('PASO 2 OK =>', this.form.value);
  // this.currentStep = 3;
}


    // PASO 2 -> (después harás el 3)
    if (this.currentStep === 2) {
      this.form.get('capitulo')?.markAsTouched();
      if (this.form.get('capitulo')?.invalid) return;

      console.log('PASO 2 OK =>', this.form.value);
      // this.currentStep = 3;
    }
  }

  // ✅ Regresar
  prevStep() {
    if (this.currentStep <= 1) return;

    this.currentStep = 1;

    // opcional: si quieres que al volver al paso 1 se limpie capitulo
    const cap = this.form.get('capitulo');
    cap?.setValue(null, { emitEvent: false });
    cap?.disable({ emitEvent: false });
  }

  // ✅ Guardar final (cuando ya tengas todos los pasos)
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('GUARDAR =>', this.form.value);
  }
}
