import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { UserService } from '../../../../service/user.service';

type TipoUnidad    = 'DEPENDENCIA' | 'OPD' | null;
type TipoOrganismo = 'DESCENTRALIZADO' | 'DESCONCENTRADO' | null;

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

  /** Tipo de unidad solicitante seleccionado (no se envía al backend) */
  tipoUnidad:    TipoUnidad    = null;
  tipoOrganismo: TipoOrganismo = null;

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

  get isDependencia(): boolean { return this.tipoUnidad === 'DEPENDENCIA'; }
  get isOPD():         boolean { return this.tipoUnidad === 'OPD'; }


  private fb              = inject(FormBuilder);
  private router          = inject(Router);
  private registroService = inject(RegistroService);
  private userService     = inject(UserService);

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
    this.registroService.getDependencias().subscribe({
      next: r => {
        const todas = r?.data ?? [];
        this.dependencias = todas.filter(
          (d: any) => !d.nombre?.toUpperCase().includes('ORGANISMOS OPD')
        );
        console.log('[dependencias cargadas]', this.dependencias.map((d: any) => d.nombre));
      }
    });
    this.registroService.getOrganismosOPDS().subscribe({ next: r => this.opds = r?.data ?? [] });
    this.registroService.getOrganosDesconcentrados().subscribe({ next: r => this.organosDesconc = r?.data ?? [] });
    this.registroService.getCapitulos().subscribe({ next: r => this.capitulos = r?.data ?? [] });
  }

  // ── Tipo de unidad ───────────────────────────────────────────────────────

  onTipoUnidadChange(tipo: TipoUnidad): void {
    if (this.tipoUnidad === tipo) return;
    this.tipoUnidad    = tipo;
    this.tipoOrganismo = null;
    this.centrosCosto  = [];
    this.form.patchValue({
      id_dependencia:           null,
      id_opd:                   null,
      id_centro_costo:          null,
      id_organo_desconcentrado: null,
    });
  }

  // ── Tipo de organismo OPD ────────────────────────────────────────────────

  onTipoOrganismoChange(tipo: TipoOrganismo): void {
    if (this.tipoOrganismo === tipo) return;
    this.tipoOrganismo = tipo;
    this.form.patchValue({
      id_opd:                   null,
      id_organo_desconcentrado: null,
    });
  }

  // ── Cambio de dependencia ────────────────────────────────────────────────

  onDependenciaChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value) || null;
    this.centrosCosto = [];
    this.form.patchValue({ id_centro_costo: null });
    if (id) {
      this.registroService.getCentrosCosto(id).subscribe({
        next: r => this.centrosCosto = r?.data ?? [],
      });
    }
  }

  // ── Clasificación presupuestal (cascada) ─────────────────────────────────

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

  // ── Guardar ──────────────────────────────────────────────────────────────

  guardar(): void {
    if (this.guardando) return;
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
        this.router.navigate(['/gestion-solicitudes', idSolicitud]);
      },
      error: (err) => {
        this.guardando = false;
        if (err?.status === 409 || err?.error?.code === 'FOLIO_DUPLICADO') {
          this.mensajeError = 'El folio interno ya existe. Ingresa un folio diferente.';
          const folioCtrl = this.form.get('folio');
          folioCtrl?.setErrors({ duplicado: true });
          folioCtrl?.markAsTouched();
        } else {
          console.error('ERROR al guardar solicitud =>', err);
          this.mensajeError = err?.error?.msg ?? 'Ocurrió un error al guardar. Intente de nuevo.';
        }
      },
    });
  }

  // ── Limpiar ──────────────────────────────────────────────────────────────

  limpiar(): void {
    const hoy = new Date().toISOString().split('T')[0];
    this.tipoUnidad         = null;
    this.tipoOrganismo      = null;
    this.form.reset({ fecha_ingreso: hoy });
    this.centrosCosto        = [];
    this.subcapitulos        = [];
    this.partidasGenericas   = [];
    this.partidasEspecificas = [];
    this.mensajeError        = '';
  }
}
