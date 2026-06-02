import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../../../service/registro.service';
import { UserService } from '../../../../../service/user.service';

@Component({
  selector: 'app-tab-adjudicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tab-adjudicacion.component.html',
  styleUrl: './tab-adjudicacion.component.scss',
})
export class TabAdjudicacionComponent implements OnInit, OnChanges {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  guardando       = false;
  cargando        = true;
  guardadoExitoso = false;
  mensajeError    = '';
  mensajeExito    = '';

  readonly estatusEstudioOpts = [
    { value: 'JUNTA',          label: 'Junta' },
    { value: 'COMITE',         label: 'Comité' },
    { value: 'ADJUDICADO',     label: 'Adjudicado' },
    { value: 'CONTRAOFERTA',   label: 'Contraoferta' },
    { value: 'DICTAMINACION',  label: 'Dictaminación' },
    { value: 'DESIERTA',       label: 'Desierta' },
  ];

  private fb          = inject(FormBuilder);
  private registroSvc = inject(RegistroService);
  private userSvc     = inject(UserService);
  private router      = inject(Router);

  irInicio(): void          { this.router.navigate(['/dashboard']); }
  irSolicitudes(): void     { this.router.navigate(['/gestion-solicitudes']); }

  ngOnInit(): void {
    this.buildForm();
    this.cargar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;
    if (changes['readonly']) {
      this.readonly ? this.form.disable() : this.form.enable();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      no_procedimiento:                   [null, Validators.required],
      proveedor_razon_social:             [null, Validators.required],
      proveedor_rfc:                      [null, Validators.required],
      monto_total_adjudicado_iva:         [null, Validators.required],
      no_contrato:                        [null, Validators.required],
      vigencia_inicio:                    [null, Validators.required],
      vigencia_termino:                   [null, Validators.required],
      url_testimonio_testigo_social:      [null],               // opcional
      remanente_suficiencia_presupuestal: [null, Validators.required],
      responsable:                        [null, Validators.required],
      estatus_adjudicacion:               [null, Validators.required],
      estatus_estudio_mercado_adj:        [null, Validators.required],
      comentarios_adjudicacion:           [null],               // opcional
      existe_reprogramacion:              [null, Validators.required],
      // Campos de reprogramación — siempre opcionales
      fecha_junta_aclaracion:             [null],
      hora_junta_aclaracion:              [null],
      fecha_presentacion_apertura:        [null],
      hora_presentacion_apertura:         [null],
      fecha_fallo:                        [null],
      hora_fallo:                         [null],
    });

    if (this.readonly) this.form.disable();
  }

  get mostrarReprogramacion(): boolean {
    return this.form?.get('existe_reprogramacion')?.value === 'SI';
  }

  cargar(): void {
    this.cargando = true;
    this.registroSvc.getAdjudicacionById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        const p = resp?.data?.procedimiento;
        if (p) {
          this.form.patchValue({
            no_procedimiento:                   p.no_procedimiento                   ?? null,
            proveedor_razon_social:             p.proveedor_razon_social             ?? null,
            proveedor_rfc:                      p.proveedor_rfc                      ?? null,
            monto_total_adjudicado_iva:         p.monto_total_adjudicado_iva         ?? null,
            no_contrato:                        p.no_contrato                        ?? null,
            vigencia_inicio:                    p.vigencia_inicio                    ?? null,
            vigencia_termino:                   p.vigencia_termino                   ?? null,
            url_testimonio_testigo_social:      p.url_testimonio_testigo_social      ?? null,
            remanente_suficiencia_presupuestal: p.remanente_suficiencia_presupuestal ?? null,
            responsable:                        p.responsable                        ?? null,
            estatus_adjudicacion:               p.estatus_adjudicacion               ?? null,
            estatus_estudio_mercado_adj:        p.estatus_estudio_mercado_adj        ?? null,
            comentarios_adjudicacion:           p.comentarios_adjudicacion           ?? null,
            existe_reprogramacion: p.existe_reprogramacion === true  ? 'SI'
                                 : p.existe_reprogramacion === false ? 'NO' : null,
            fecha_junta_aclaracion:      p.fecha_junta_aclaracion      ?? null,
            hora_junta_aclaracion:       p.hora_junta_aclaracion       ?? null,
            fecha_presentacion_apertura: p.fecha_presentacion_apertura ?? null,
            hora_presentacion_apertura:  p.hora_presentacion_apertura  ?? null,
            fecha_fallo:                 p.fecha_fallo                 ?? null,
            hora_fallo:                  p.hora_fallo                  ?? null,
          });
        }
        this.cargando = false;
        if (this.readonly) this.form.disable();
      },
      error: () => { this.cargando = false; }
    });
  }

  private camposRequeridos = [
    'no_procedimiento', 'proveedor_razon_social', 'proveedor_rfc',
    'monto_total_adjudicado_iva', 'no_contrato', 'vigencia_inicio', 'vigencia_termino',
    'remanente_suficiencia_presupuestal', 'responsable',
    'estatus_adjudicacion', 'estatus_estudio_mercado_adj', 'existe_reprogramacion',
  ];

  guardar(): void {
    if (this.guardando) return;

    // Asegurar que todos los controles estén habilitados para que los validadores actúen
    this.form.enable();
    this.form.markAllAsTouched();

    // Verificar campos requeridos manualmente por si algún control quedó deshabilitado
    const faltantes = this.camposRequeridos.filter(c => {
      const v = this.form.get(c)?.value;
      return v === null || v === undefined || v === '';
    });

    if (faltantes.length > 0 || this.form.invalid) {
      this.mensajeError = 'Completa todos los campos obligatorios antes de guardar.';
      return;
    }
    this.mensajeError = '';

    this.guardando    = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const user_id = this.userSvc.currentUserValue?.id ?? null;
    const payload  = { ...this.form.getRawValue(), user_id };

    this.registroSvc.saveAdjudicacion(this.idSolicitud, payload).subscribe({
      next: () => {
        this.guardando        = false;
        this.guardadoExitoso  = true;
        this.saved.emit();
      },
      error: (err: any) => {
        this.guardando = false;
        const msg    = err?.error?.msg    ?? 'Error al guardar. Intente de nuevo.';
        const detail = err?.error?.detail ?? '';
        this.mensajeError = detail ? `${msg} — ${detail}` : msg;
      }
    });
  }
}
