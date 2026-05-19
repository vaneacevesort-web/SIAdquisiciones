import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';

@Component({
  selector: 'app-form-adquisicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-adquisicion.component.html',
  styleUrl: './form-adquisicion.component.scss',
})
export class FormAdquisicionComponent implements OnInit {

  idSolicitud!: number;
  folio: string = '';
  guardando = false;
  mensajeExito = '';
  mensajeError = '';

  form!: FormGroup;

  readonly modalidades = [
    { value: 'LICITACION_PUBLICA_PRESENCIAL',      label: 'Licitación Pública Presencial' },
    { value: 'INVITACION_RESTRINGIDA_PRESENCIAL',  label: 'Invitación Restringida Presencial' },
    { value: 'ADJUDICACION_DIRECTA_PRESENCIAL',    label: 'Adjudicación Directa Presencial' },
    { value: 'ACUERDO_MARCO',                      label: 'Acuerdo Marco' },
    { value: 'LICITACION_PUBLICA_ELECTRONICA',     label: 'Licitación Pública Nacional Electrónica' },
    { value: 'INVITACION_TRES_PERSONAS',           label: 'Invitación a Cuando Menos Tres Personas Nacional Electrónica' },
  ];

  private fb               = inject(FormBuilder);
  private route            = inject(ActivatedRoute);
  private router           = inject(Router);
  private registroService  = inject(RegistroService);

  ngOnInit(): void {
    this.form = this.fb.group({ modalidad: [null, Validators.required] });

    this.route.params.subscribe(params => {
      this.idSolicitud = parseInt(params['id'], 10);
      if (!isNaN(this.idSolicitud) && this.idSolicitud > 0) {
        this.cargarDatos();
      }
    });
  }

  cargarDatos(): void {
    this.registroService.getProcedimientoById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        this.folio = resp?.data?.solicitud?.folio ?? '';
        if (resp?.data?.procedimiento?.modalidad) {
          this.form.patchValue({ modalidad: resp.data.procedimiento.modalidad });
        }
      },
      error: err => console.error('ERROR al cargar procedimiento =>', err),
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.mensajeError = 'Selecciona una modalidad para continuar.';
      return;
    }

    this.guardando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.registroService.saveProcedimientoAdquisitivo(this.idSolicitud, this.form.value).subscribe({
      next: () => {
        this.mensajeExito = 'Guardado correctamente.';
        this.guardando = false;
      },
      error: err => {
        console.error('ERROR al guardar =>', err);
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
