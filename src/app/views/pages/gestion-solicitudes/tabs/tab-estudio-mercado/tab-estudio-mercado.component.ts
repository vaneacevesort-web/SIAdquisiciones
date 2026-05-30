import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../../../../service/registro.service';

@Component({
  selector: 'app-tab-estudio-mercado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-estudio-mercado.component.html',
})
export class TabEstudioMercadoComponent implements OnInit, OnChanges {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  cargando   = false;
  guardando  = false;
  mensajeError = '';
  mensajeExito = '';

  private fb              = inject(FormBuilder);
  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoSolicitud:          ['', Validators.required],
      tipoContratacion:       ['', Validators.required],
      descripcion:            ['', Validators.required],
      valorEstudio:           ['', Validators.required],
      estadoEstudio:          ['', Validators.required],
      montoSabys:             ['', Validators.required],
      contratacionPlurianual: ['', Validators.required],
      monto2026:              [''],
      monto2027:              [''],
      monto2028:              [''],
      monto2029:              [''],
    });

    this.cargar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;
    if (changes['readonly']) {
      this.readonly ? this.form.disable() : this.form.enable();
    }
  }

  cargar(): void {
    this.cargando = true;
    this.registroService.getEstudioMercado(this.idSolicitud).subscribe({
      next: (resp: any) => {
        const e = resp?.data?.estudio;
        if (e) {
          this.form.patchValue({
            tipoSolicitud:          e.tipo_solicitud          ?? '',
            tipoContratacion:       e.tipo_contratacion       ?? '',
            descripcion:            e.descripcion_bien_servicio ?? '',
            valorEstudio:           e.valor_estudio_mercado   ?? '',
            estadoEstudio:          e.estatus_estudio          ?? '',
            montoSabys:             e.monto_sabys             ?? '',
            contratacionPlurianual: e.contratacion_plurianual ?? '',
            monto2026:              e.monto_2026              ?? '',
            monto2027:              e.monto_2027              ?? '',
            monto2028:              e.monto_2028              ?? '',
            monto2029:              e.monto_2029              ?? '',
          });
        }
        this.cargando = false;
        this.readonly ? this.form.disable() : this.form.enable();
      },
      error: () => {
        this.cargando = false;
        this.readonly ? this.form.disable() : this.form.enable();
      },
    });
  }

  hasError(name: string, err: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  guardar(): void {
    if (this.guardando) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Completa todos los campos obligatorios.';
      return;
    }

    const v = this.form.value;
    const plurianual = v.contratacionPlurianual === 'SI';

    if (plurianual) {
      const tieneMontoValido = [v.monto2026, v.monto2027, v.monto2028, v.monto2029]
        .some(m => m !== null && m !== undefined && m !== '' && Number(m) > 0);
      if (!tieneMontoValido) {
        this.mensajeError = 'Si la contratación es plurianual, debes capturar al menos un monto en alguno de los años.';
        return;
      }
    }

    this.guardando    = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const data = {
      id_solicitud:              this.idSolicitud,
      tipo_solicitud:            v.tipoSolicitud,
      tipo_contratacion:         v.tipoContratacion,
      descripcion_bien_servicio: v.descripcion,
      valor_estudio_mercado:     Number(v.valorEstudio),
      estado_estudio_mercado:    v.estadoEstudio,
      monto_sabys:               Number(v.montoSabys),
      contratacion_plurianual:   v.contratacionPlurianual,
      monto_2026: plurianual ? Number(v.monto2026 || 0) : 0,
      monto_2027: plurianual ? Number(v.monto2027 || 0) : 0,
      monto_2028: plurianual ? Number(v.monto2028 || 0) : 0,
      monto_2029: plurianual ? Number(v.monto2029 || 0) : 0,
    };

    this.registroService.saveEstudioMercado(data).subscribe({
      next: () => {
        this.guardando    = false;
        this.mensajeExito = 'Estudio de mercado guardado correctamente.';
        this.saved.emit();
      },
      error: (err) => {
        console.error('ERROR estudio mercado =>', err);
        const msg    = err?.error?.msg    ?? 'Error al guardar. Intente de nuevo.';
        const detail = err?.error?.detail ?? '';
        this.mensajeError = detail ? `${msg} — ${detail}` : msg;
        this.guardando    = false;
      },
    });
  }
}
