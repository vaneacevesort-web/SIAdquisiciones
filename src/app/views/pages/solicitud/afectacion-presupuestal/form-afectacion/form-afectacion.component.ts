import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from '../../../../../service/registro.service';

@Component({
  selector: 'app-form-afectacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-afectacion.component.html',
  styleUrl: './form-afectacion.component.scss'
})
export class FormAfectacionComponent implements OnInit {

  paso: number = 1;
  idSolicitud!: number;
  guardando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  fuentesFinanciamiento: any[] = [];
  fuentesFiltradas: any[] = [];
  fuentesSeleccionadas: number[] = [];

  form!: FormGroup;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.inicializarForm();
    this.cargarFuentesFinanciamiento();

    this.route.params.subscribe(params => {
      const raw = params['id'];
      this.idSolicitud = parseInt(raw, 10);

      if (!isNaN(this.idSolicitud) && this.idSolicitud > 0) {
        this.cargarDatosExistentes();
      }
    });
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      // Paso 1 - Afectación presupuestal
      fecha_liberacion_estudio: [null],
      nombre_testigo_social: [null],
      tipo_gasto: [null, Validators.required],
      importe_suficiencia: [null],
      // Paso 2 - Bienes y servicios
      clave_verificacion: [null],
      descripcion_clave_verificacion: [null],
      unidad_medida: [null],
      dictamen: [null],
      contrato_abierto: [null],
      consolidado: [null],
    });
  }

  cargarFuentesFinanciamiento(): void {
    this.registroService.getFuentesFinanciamiento().subscribe({
      next: (resp: any) => {
        this.fuentesFinanciamiento = resp.data || [];
        this.fuentesFiltradas = [...this.fuentesFinanciamiento];
      },
      error: (error) => console.error('ERROR FUENTES FINANCIAMIENTO =>', error),
    });
  }

  cargarDatosExistentes(): void {
    this.registroService.getAfectacionById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        if (resp?.data?.afectacion) {
          const a = resp.data.afectacion;
          this.form.patchValue({
            nombre_testigo_social: a.nombre_testigo_social,
            tipo_gasto: a.tipo_gasto,
            importe_suficiencia: a.importe_suficiencia,
          });
          if (a.fuentes_financiamiento?.length) {
            this.fuentesSeleccionadas = [...a.fuentes_financiamiento];
          }
        }
        if (resp?.data?.bienesServicios) {
          const bs = resp.data.bienesServicios;
          this.form.patchValue({
            clave_verificacion: bs.clave_verificacion,
            descripcion_clave_verificacion: bs.descripcion_clave_verificacion,
            unidad_medida: bs.unidad_medida,
            dictamen: bs.dictamen ? 'SI' : 'NO',
            contrato_abierto: bs.contrato_abierto ? 'SI' : 'NO',
            consolidado: bs.consolidado ? 'SI' : 'NO',
          });
        }
      },
      error: (error) => console.error('ERROR AL CARGAR AFECTACIÓN =>', error),
    });
  }

  filtrarFuentes(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.toLowerCase();
    this.fuentesFiltradas = this.fuentesFinanciamiento.filter(f =>
      f.codigo.toLowerCase().includes(texto) || f.nombre.toLowerCase().includes(texto)
    );
  }

  toggleFuente(id: number, checked: boolean): void {
    if (checked) {
      this.fuentesSeleccionadas.push(id);
    } else {
      this.fuentesSeleccionadas = this.fuentesSeleccionadas.filter(f => f !== id);
    }
  }

  esFuenteSeleccionada(id: number): boolean {
    return this.fuentesSeleccionadas.includes(id);
  }

  guardar(): void {
    if (isNaN(this.idSolicitud) || this.idSolicitud <= 0) {
      this.mensajeError = 'No se puede guardar: ID de solicitud inválido.';
      return;
    }

    if (this.form.get('tipo_gasto')?.invalid) {
      this.mensajeError = 'El tipo de gasto es obligatorio.';
      return;
    }

    this.guardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const v = this.form.value;

    const payload = {
      afectacion: {
        nombre_testigo_social: v.nombre_testigo_social,
        tipo_gasto: v.tipo_gasto,
        fuentes_financiamiento: this.fuentesSeleccionadas,
        importe_suficiencia: v.importe_suficiencia,
      },
      bienesServicios: {
        clave_verificacion: v.clave_verificacion,
        descripcion_clave_verificacion: v.descripcion_clave_verificacion,
        unidad_medida: v.unidad_medida,
        dictamen: v.dictamen,
        contrato_abierto: v.contrato_abierto,
        consolidado: v.consolidado,
      },
    };

    this.registroService.saveAfectacionPresupuestal(this.idSolicitud, payload).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/solicitud/adquisicion', this.idSolicitud]);
      },
      error: (error) => {
        console.error('ERROR AL GUARDAR =>', error);
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
