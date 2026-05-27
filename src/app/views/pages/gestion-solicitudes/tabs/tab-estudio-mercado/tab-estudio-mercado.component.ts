import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../../../../service/registro.service';

@Component({
  selector: 'app-tab-estudio-mercado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-estudio-mercado.component.html',
})
export class TabEstudioMercadoComponent implements OnInit {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  private fb              = inject(FormBuilder);
  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoSolicitud:          ['', Validators.required],
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

    if (this.readonly) {
      this.form.disable();
    }
  }

  hasError(name: string, err: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Completa todos los campos obligatorios.';
      return;
    }

    this.guardando     = true;
    this.mensajeError  = '';
    this.mensajeExito  = '';

    const v = this.form.value;
    const data = {
      id_solicitud:            this.idSolicitud,
      tipo_solicitud:          v.tipoSolicitud,
      descripcion_bien_servicio: v.descripcion,
      valor_estudio_mercado:   Number(v.valorEstudio),
      estado_estudio_mercado:  v.estadoEstudio,
      monto_sabys:             Number(v.montoSabys),
      contratacion_plurianual: v.contratacionPlurianual,
      monto_2026: v.contratacionPlurianual === 'SI' ? Number(v.monto2026 || 0) : 0,
      monto_2027: v.contratacionPlurianual === 'SI' ? Number(v.monto2027 || 0) : 0,
      monto_2028: v.contratacionPlurianual === 'SI' ? Number(v.monto2028 || 0) : 0,
      monto_2029: v.contratacionPlurianual === 'SI' ? Number(v.monto2029 || 0) : 0,
    };

    this.registroService.saveEstudioMercado(data).subscribe({
      next: () => {
        this.guardando    = false;
        this.mensajeExito = 'Estudio de mercado guardado correctamente.';
        this.saved.emit();
      },
      error: (err) => {
        console.error('ERROR estudio mercado =>', err);
        this.mensajeError = err?.error?.msg ?? 'Error al guardar. Intente de nuevo.';
        this.guardando    = false;
      },
    });
  }
}
