import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../../../../service/registro.service';
import { UserService }     from '../../../../../service/user.service';

@Component({
  selector: 'app-tab-adquisicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-adquisicion.component.html',
})
export class TabAdquisicionComponent implements OnInit, OnChanges {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  readonly modalidades = [
    { value: 'LICITACION_PUBLICA_PRESENCIAL',     label: 'Licitación Pública Presencial' },
    { value: 'INVITACION_RESTRINGIDA_PRESENCIAL', label: 'Invitación Restringida Presencial' },
    { value: 'ADJUDICACION_DIRECTA_PRESENCIAL',   label: 'Adjudicación Directa Presencial' },
  ];

  dictamenArchivo: File | null = null;
  dictamenNombreArchivo = '';

  get esAdjudicacionDirecta(): boolean {
    return this.form?.get('modalidad')?.value === 'ADJUDICACION_DIRECTA_PRESENCIAL';
  }

  private camposFecha = [
    'fecha_junta_aclaracion', 'hora_junta_aclaracion',
    'fecha_presentacion_apertura', 'hora_presentacion_apertura',
    'fecha_sesion_comite', 'hora_sesion_comite',
    'fecha_contra_oferta', 'hora_contra_oferta',
    'fecha_dictaminacion', 'hora_dictaminacion',
    'fecha_sesion_subcomite', 'hora_sesion_subcomite',
    'fecha_fallo', 'hora_fallo',
  ];

  tieneFechaCapturada(): boolean {
    return this.camposFecha.some(c => !!this.form.get(c)?.value);
  }

  private fb              = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private userService     = inject(UserService);

  ngOnInit(): void {
    this.inicializarForm();
    if (this.idSolicitud) this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSolicitud'] && !changes['idSolicitud'].firstChange) {
      this.cargarDatos();
    }
    if (changes['readonly'] && this.form) {
      this.readonly ? this.form.disable() : this.form.enable();
    }
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      modalidad:                   [null, Validators.required],
      dictamen_procedencia:        [null],
      dictamen_procedencia_url:    [null],
      responsable:                 [null, Validators.required],
      no_procedimiento:            [null, Validators.required],
      convocatoria_url:            [null, Validators.required],
      medio_publicacion:           [null, Validators.required],
      fecha_junta_aclaracion:      [null],
      hora_junta_aclaracion:       [null],
      fecha_presentacion_apertura: [null],
      hora_presentacion_apertura:  [null],
      fecha_sesion_comite:         [null],
      hora_sesion_comite:          [null],
      fecha_contra_oferta:         [null],
      hora_contra_oferta:          [null],
      fecha_dictaminacion:         [null],
      hora_dictaminacion:          [null],
      fecha_sesion_subcomite:      [null],
      hora_sesion_subcomite:       [null],
      fecha_fallo:                 [null],
      hora_fallo:                  [null],
    });

    if (this.readonly) this.form.disable();
  }

  cargarDatos(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    this.registroService.getProcedimientoById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        const p = resp?.data?.procedimiento;
        if (p) {
          this.form.patchValue({
            modalidad:                   p.modalidad,
            dictamen_procedencia:        p.dictamen_procedencia,
            responsable:                 p.responsable,
            no_procedimiento:            p.no_procedimiento,
            convocatoria_url:            p.convocatoria_url,
            medio_publicacion:           p.medio_publicacion,
            fecha_junta_aclaracion:      p.fecha_junta_aclaracion,
            hora_junta_aclaracion:       p.hora_junta_aclaracion,
            fecha_presentacion_apertura: p.fecha_presentacion_apertura,
            hora_presentacion_apertura:  p.hora_presentacion_apertura,
            fecha_sesion_comite:         p.fecha_sesion_comite,
            hora_sesion_comite:          p.hora_sesion_comite,
            fecha_contra_oferta:         p.fecha_contra_oferta,
            hora_contra_oferta:          p.hora_contra_oferta,
            fecha_dictaminacion:         p.fecha_dictaminacion,
            hora_dictaminacion:          p.hora_dictaminacion,
            fecha_sesion_subcomite:      p.fecha_sesion_subcomite,
            hora_sesion_subcomite:       p.hora_sesion_subcomite,
            fecha_fallo:                 p.fecha_fallo,
            hora_fallo:                  p.hora_fallo,
          });
        }
        if (this.readonly) this.form.disable();
      },
      error: err => console.error('ERROR cargar procedimiento =>', err),
    });
  }

  onDictamenFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.dictamenArchivo       = input.files[0];
      this.dictamenNombreArchivo = this.dictamenArchivo.name;
    }
  }

  guardar(): void {
    if (this.guardando) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Completa todos los campos obligatorios antes de guardar.';
      return;
    }

    if (!this.tieneFechaCapturada()) {
      this.mensajeError = 'Captura al menos una fecha u hora del procedimiento antes de guardar.';
      return;
    }

    // Validación condicional: Adjudicación Directa requiere Dictamen de Procedencia
    if (this.esAdjudicacionDirecta) {
      const url = this.form.get('dictamen_procedencia_url')?.value;
      if (!url && !this.dictamenArchivo) {
        this.mensajeError = 'Para Adjudicación Directa Presencial, el Dictamen de Procedencia es obligatorio (URL o archivo).';
        return;
      }
    }

    this.guardando    = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const v = this.form.value;
    const payload = {
      ...v,
      // Mapea la URL del dictamen al campo del modelo
      dictamen_procedencia_path: v.dictamen_procedencia_url || null,
      // Marca dictamen como SI si hay URL o archivo
      dictamen_procedencia: this.esAdjudicacionDirecta
        ? (v.dictamen_procedencia_url || this.dictamenArchivo ? 'SI' : 'NO')
        : v.dictamen_procedencia,
    };

    payload.user_id = this.userService.currentUserValue?.id ?? null;

    this.registroService.saveProcedimientoAdquisitivo(this.idSolicitud, payload).subscribe({
      next: () => {
        this.guardando    = false;
        this.mensajeExito = 'Adquisición guardada correctamente.';
        this.saved.emit();
      },
      error: (err) => {
        console.error('ERROR guardar procedimiento =>', err);
        const msg    = err?.error?.msg    ?? 'Ocurrió un error al guardar. Intente de nuevo.';
        const detail = err?.error?.detail ?? '';
        this.mensajeError = detail ? `${msg} — ${detail}` : msg;
        this.guardando = false;
      },
    });
  }

  limpiar(): void {
    this.form.reset();
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
