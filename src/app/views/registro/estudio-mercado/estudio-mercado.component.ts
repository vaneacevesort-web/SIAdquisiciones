import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RegistroService } from '../../../service/registro.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-estudio-mercado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estudio-mercado.component.html',
  styleUrl: './estudio-mercado.component.scss'
})
export class EstudioMercadoComponent implements OnInit {

  idSolicitud!: number;
  form!: FormGroup;

  tipoSolicitudOptions = [
    { value: 'BIEN', label: 'Bien - Adquisición de materiales y suministros' },
    { value: 'SERVICIO', label: 'Servicio - Contratación de servicios generales' }
  ];

  estadoEstudioOptions = [
    { value: 'CONCLUIDO', label: 'Concluido' },
    { value: 'PROCESO', label: 'Proceso' },
    { value: 'RECHAZADO', label: 'Rechazado' }
  ];

  plurianualOptions = [
    { value: 'SI', label: 'Sí' },
    { value: 'NO', label: 'No' }
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.idSolicitud = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID SOLICITUD =>', this.idSolicitud);

    this.form = this.fb.group({
      tipoSolicitud: ['', Validators.required],
      descripcion: ['', Validators.required],
      valorEstudio: ['', Validators.required],
      estadoEstudio: ['', Validators.required],
      montoSabys: ['', Validators.required],
      contratacionPlurianual: ['', Validators.required],
      monto2026: [''],
      monto2027: [''],
      monto2028: [''],
      monto2029: ['']
    });
  }

  hasError(name: string, err: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  regresar(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const data = {
      id_solicitud: this.idSolicitud,
      tipo_solicitud: formValue.tipoSolicitud,
      descripcion_bien_servicio: formValue.descripcion,
      valor_estudio_mercado: Number(formValue.valorEstudio),
      estado_estudio_mercado: formValue.estadoEstudio,
      monto_sabys: Number(formValue.montoSabys),
      contratacion_plurianual: formValue.contratacionPlurianual,
      monto_2026: formValue.contratacionPlurianual === 'SI' ? Number(formValue.monto2026 || 0) : 0,
      monto_2027: formValue.contratacionPlurianual === 'SI' ? Number(formValue.monto2027 || 0) : 0,
      monto_2028: formValue.contratacionPlurianual === 'SI' ? Number(formValue.monto2028 || 0) : 0,
      monto_2029: formValue.contratacionPlurianual === 'SI' ? Number(formValue.monto2029 || 0) : 0
    };

    console.log('DATA ESTUDIO MERCADO =>', data);

    this.registroService.saveEstudioMercado(data).subscribe({
      next: (resp: any) => {
        console.log('ESTUDIO GUARDADO =>', resp);
// aqui lo dirigue a la afectacion presupuestal, para continuar con el flujo 
        this.router.navigate(['/solicitud/afectacion-presupuestal']); 
      },
      error: (e: HttpErrorResponse) => {
        console.error('ERROR AL GUARDAR ESTUDIO =>', e);

        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: e.error?.msg || e.message || 'Revisa consola'
        });
      }
    });
  }

}