import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-form-nueva-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-nueva-solicitud.component.html',
  styleUrl: './form-nueva-solicitud.component.scss',
})
export class FormNuevaSolicitudComponent implements OnInit {

  form!: FormGroup;
  guardando = false;
  mensajeError = '';

  dependencias:         any[] = [];
  centrosCosto:         any[] = [];
  opds:                 any[] = [];
  organosDesconc:       any[] = [];
  capitulos:            any[] = [];
  subcapitulos:         any[] = [];
  partidasGenericas:    any[] = [];
  partidasEspecificas:  any[] = [];

  readonly origenesRecurso = [
    { id: 1, nombre: 'Estatal' },
    { id: 2, nombre: 'Federal' },
    { id: 3, nombre: 'Fideicomiso' },
    { id: 4, nombre: 'Concurrente o Propio' },
  ];

  readonly tiposSolicitud = [
    { value: 'BIEN',     label: 'Bien — Adquisición de materiales y suministros' },
    { value: 'SERVICIO', label: 'Servicio — Contratación de servicios generales' },
  ];

  private fb             = inject(FormBuilder);
  private router         = inject(Router);
  private registroService = inject(RegistroService);
  private userService    = inject(UserService);

  ngOnInit(): void {
    const hoy = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      folio:                    [null, Validators.required],
      fecha_ingreso:            [hoy,  Validators.required],
      id_origen_recurso:        [null, Validators.required],
      tipo_solicitud:           [null, Validators.required],
      id_dependencia:           [null],
      id_centro_costo:          [null],
      id_opd:                   [null],
      id_organo_desconcentrado: [null],
      id_capitulo:              [null],
      id_subcapitulo:           [null],
      id_partida_generica:      [null],
      id_partida_especifica:    [null],
    });

    // Cargar catálogos independientes en paralelo
    this.registroService.getDependencias().subscribe({ next: r => this.dependencias = r?.data ?? [] });
    this.registroService.getOrganismosOPDS().subscribe({ next: r => this.opds = r?.data ?? [] });
    this.registroService.getOrganosDesconcentrados().subscribe({ next: r => this.organosDesconc = r?.data ?? [] });
    this.registroService.getCapitulos().subscribe({ next: r => this.capitulos = r?.data ?? [] });
  }

  onDependenciaChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.centrosCosto = [];
    this.form.patchValue({ id_centro_costo: null });
    if (id) {
      this.registroService.getCentrosCosto(id).subscribe({ next: r => this.centrosCosto = r?.data ?? [] });
    }
  }

  onCapituloChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.subcapitulos = [];
    this.partidasGenericas = [];
    this.partidasEspecificas = [];
    this.form.patchValue({ id_subcapitulo: null, id_partida_generica: null, id_partida_especifica: null });
    if (id) {
      this.registroService.getSubcapitulos(id).subscribe({ next: r => this.subcapitulos = r?.data ?? [] });
    }
  }

  onSubcapituloChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.partidasGenericas = [];
    this.partidasEspecificas = [];
    this.form.patchValue({ id_partida_generica: null, id_partida_especifica: null });
    if (id) {
      this.registroService.getPartidasGenericas(id).subscribe({ next: r => this.partidasGenericas = r?.data ?? [] });
    }
  }

  onPartidaGenericaChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.partidasEspecificas = [];
    this.form.patchValue({ id_partida_especifica: null });
    if (id) {
      this.registroService.getPartidasEspecificas(id).subscribe({ next: r => this.partidasEspecificas = r?.data ?? [] });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Completa los campos obligatorios.';
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    const user = this.userService.currentUserValue;
    const payload = {
      ...this.form.value,
      user_id: user?.id ?? null,
    };

    this.registroService.saveRegistro(payload).subscribe({
      next: (resp: any) => {
        this.guardando = false;
        const idSolicitud = resp?.data?.id_solicitud;
        // Ir a Gestión Integral → detalle con tab estudio de mercado activo
        this.router.navigate(['/gestion-solicitudes', idSolicitud]);
      },
      error: (err) => {
        console.error('ERROR al guardar solicitud =>', err);
        this.mensajeError = err?.error?.msg ?? 'Ocurrió un error al guardar. Intente de nuevo.';
        this.guardando = false;
      },
    });
  }

  limpiar(): void {
    const hoy = new Date().toISOString().split('T')[0];
    this.form.reset({ fecha_ingreso: hoy });
    this.centrosCosto = [];
    this.subcapitulos = [];
    this.partidasGenericas = [];
    this.partidasEspecificas = [];
    this.mensajeError = '';
  }
}
