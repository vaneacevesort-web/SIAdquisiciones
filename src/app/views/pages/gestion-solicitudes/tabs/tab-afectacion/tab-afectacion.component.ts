import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../../../../service/registro.service';

@Component({
  selector: 'app-tab-afectacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tab-afectacion.component.html',
})
export class TabAfectacionComponent implements OnInit, OnChanges {

  @Input() idSolicitud!: number;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  paso = 1;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';

  fuentesFinanciamiento: any[] = [];
  fuentesFiltradas:      any[] = [];
  fuentesSeleccionadas:  number[] = [];
  mostrarFuentes = false;
  oficioNombreArchivo = '';
  oficioArchivo: File | null = null;
  dictamenNombreArchivo = '';
  dictamenArchivo: File | null = null;

  form!: FormGroup;

  private fb              = inject(FormBuilder);
  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.inicializarForm();
    this.cargarFuentesFinanciamiento();
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
      folio_ca:                       [null, Validators.required],
      fecha_liberacion_estudio:       [null, Validators.required],
      oficio_suficiencia_url:         [null],
      nombre_testigo_social:          [null],
      tipo_gasto:                     [null, Validators.required],
      importe_suficiencia:            [null],
      clave_verificacion:             [null],
      descripcion_clave_verificacion: [null],
      unidad_medida:                  [null],
      dictamen:                       [null, Validators.required],
      dictamen_path_url:              [null],
      contrato_abierto:               [null, Validators.required],
      consolidado:                    [null, Validators.required],
    });

    if (this.readonly) this.form.disable();
  }

  cargarFuentesFinanciamiento(): void {
    this.registroService.getFuentesFinanciamiento().subscribe({
      next: (resp: any) => {
        this.fuentesFinanciamiento = resp.data || [];
        this.fuentesFiltradas = [...this.fuentesFinanciamiento];
      },
      error: err => console.error('ERROR FUENTES =>', err),
    });
  }

  cargarDatos(): void {
    this.paso = 1;
    this.mostrarFuentes = false;
    this.mensajeExito   = '';
    this.mensajeError   = '';
    this.fuentesSeleccionadas = [];
    this.oficioNombreArchivo  = '';
    this.oficioArchivo        = null;
    this.dictamenNombreArchivo = '';
    this.dictamenArchivo      = null;
    if (this.form) this.form.reset();

    const idPeticion = this.idSolicitud;

    this.registroService.getAfectacionById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        if (idPeticion !== this.idSolicitud) return;

        if (resp?.data?.afectacion) {
          const a = resp.data.afectacion;
          this.form.patchValue({
            nombre_testigo_social:    a.nombre_testigo_social,
            tipo_gasto:               a.tipo_gasto,
            importe_suficiencia:      a.importe_suficiencia,
            oficio_suficiencia_url:   a.oficio_suficiencia_path ?? null,
          });
          if (a.fuentes_financiamiento?.length) {
            this.fuentesSeleccionadas = [...a.fuentes_financiamiento];
          }
        }
        if (resp?.data?.bienesServicios) {
          const bs = resp.data.bienesServicios;
          this.form.patchValue({
            clave_verificacion:             bs.clave_verificacion,
            descripcion_clave_verificacion: bs.descripcion_clave_verificacion,
            unidad_medida:                  bs.unidad_medida,
            dictamen:                       bs.dictamen ? 'SI' : 'NO',
            dictamen_path_url:              bs.dictamen_path ?? null,
            contrato_abierto:               bs.contrato_abierto ? 'SI' : 'NO',
            consolidado:                    bs.consolidado ? 'SI' : 'NO',
          });
        }
        this.mostrarFuentes = true;

        if (this.readonly) this.form.disable();
      },
      error: () => {
        if (idPeticion === this.idSolicitud) this.mostrarFuentes = true;
      },
    });
  }

  filtrarFuentes(event: Event): void {
    const txt = (event.target as HTMLInputElement).value.toLowerCase();
    this.fuentesFiltradas = this.fuentesFinanciamiento.filter(f =>
      f.codigo.toLowerCase().includes(txt) || f.nombre.toLowerCase().includes(txt)
    );
  }

  toggleFuente(id: number, checked: boolean): void {
    if (checked) this.fuentesSeleccionadas.push(id);
    else this.fuentesSeleccionadas = this.fuentesSeleccionadas.filter(f => f !== id);
  }

  esFuenteSeleccionada(id: number): boolean {
    return this.fuentesSeleccionadas.includes(id);
  }

  onOficioFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.oficioArchivo = input.files[0];
      this.oficioNombreArchivo = this.oficioArchivo.name;
    }
  }

  onDictamenFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.dictamenArchivo = input.files[0];
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

    this.guardando    = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const v = this.form.value;

    const payload = {
      afectacion: {
        folio_ca:               v.folio_ca,
        fecha_liberacion_estudio: v.fecha_liberacion_estudio,
        nombre_testigo_social:  v.nombre_testigo_social,
        tipo_gasto:             v.tipo_gasto,
        fuentes_financiamiento: this.fuentesSeleccionadas,
        importe_suficiencia:    v.importe_suficiencia,
        oficio_suficiencia_path: v.oficio_suficiencia_url ?? null,
      },
      bienesServicios: {
        clave_verificacion:             v.clave_verificacion,
        descripcion_clave_verificacion: v.descripcion_clave_verificacion,
        unidad_medida:                  v.unidad_medida,
        dictamen:                       v.dictamen,
        dictamen_path:                  v.dictamen_path_url ?? null,
        contrato_abierto:               v.contrato_abierto,
        consolidado:                    v.consolidado,
      },
    };

    this.registroService.saveAfectacionPresupuestal(this.idSolicitud, payload).subscribe({
      next: () => {
        this.guardando    = false;
        this.mensajeExito = 'Afectación presupuestal guardada correctamente.';
        this.saved.emit();
      },
      error: (err) => {
        console.error('ERROR afectación =>', err);
        this.mensajeError = 'Ocurrió un error al guardar. Intente de nuevo.';
        this.guardando = false;
      },
    });
  }

  limpiar(): void {
    this.form.reset();
    this.fuentesSeleccionadas = [];
    this.fuentesFiltradas = [...this.fuentesFinanciamiento];
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
