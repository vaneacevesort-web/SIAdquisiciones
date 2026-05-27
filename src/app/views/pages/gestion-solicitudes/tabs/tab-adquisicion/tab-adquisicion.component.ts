import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../../../../service/registro.service';

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
    { value: 'ACUERDO_MARCO',                     label: 'Acuerdo Marco' },
    { value: 'LICITACION_PUBLICA_ELECTRONICA',    label: 'Licitación Pública Nacional Electrónica' },
    { value: 'INVITACION_TRES_PERSONAS',          label: 'Invitación a Cuando Menos Tres Personas Nacional Electrónica' },
  ];

  private fb              = inject(FormBuilder);
  private registroService = inject(RegistroService);

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
      responsable:                 [null],
      no_procedimiento:            [null],
      convocatoria_url:            [null],
      medio_publicacion:           [null],
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

  guardar(): void {
    if (this.form.invalid) {
      this.mensajeError = 'Selecciona una modalidad para continuar.';
      return;
    }

    this.guardando    = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.registroService.saveProcedimientoAdquisitivo(this.idSolicitud, this.form.value).subscribe({
      next: () => {
        this.guardando    = false;
        this.mensajeExito = 'Adquisición guardada correctamente.';
        this.saved.emit();
      },
      error: err => {
        console.error('ERROR guardar procedimiento =>', err);
        this.mensajeError = 'Ocurrió un error al guardar. Intente de nuevo.';
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
