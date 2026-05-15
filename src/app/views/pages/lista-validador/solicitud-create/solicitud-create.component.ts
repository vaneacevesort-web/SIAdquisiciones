import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../service/user.service';
import { RegistroStateService } from '../../../../service/registro-state.service';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-solicitud-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-create.component.html',
  styleUrls: ['./solicitud-create.component.scss'],
})
export class SolicitudCreateComponent {
  form: FormGroup;

  public _registroService = inject(RegistroService);
  public _userService = inject(UserService);

  origenOptions = [
    { value: 1, label: 'Estatal' },
    { value: 2, label: 'Federal' },
    { value: 3, label: 'Fideicomiso' },
    { value: 4, label: 'Concurrente o Propio' },
  ];

  tipoContratacionOptions = [
    { value: 'LPNP', label: 'LP LICITACIÓN PÚBLICA PRESENCIAL', tipo: 'PRESENCIAL' },
    { value: 'IRP', label: 'IR INVITACIÓN RESTRINGIDA PRESENCIAL', tipo: 'PRESENCIAL' },
    { value: 'ADP', label: 'AD ADJUDICACIÓN DIRECTA PRESENCIAL', tipo: 'PRESENCIAL' },

    { value: 'IRE', label: 'IR INVITACIÓN RESTRINGIDA ELECTRÓNICA', tipo: 'ELECTRONICA' },
    { value: 'ADE', label: 'AD ADJUDICACIÓN DIRECTA ELECTRÓNICA', tipo: 'ELECTRONICA' },
    { value: 'LPE', label: 'LP LICITACIÓN PÚBLICA ELECTRÓNICA', tipo: 'ELECTRONICA' }
  ];

  dependenciaOptions: any[] = [];
  centroCostoOptionsApi: any[] = [];
  opdsDescentralizadosOptions: any[] = [];
  organosDesconcentradosOptions: any[] = [];

  capituloOptionsApi: any[] = [];
  subcapituloOptionsApi: any[] = [];
  partidaGenericaOptionsApi: any[] = [];
  partidaEspecificaOptionsApi: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registroStateService: RegistroStateService
  ) {
    this.form = this.fb.group(
      {
        folioInterno: ['', [Validators.required, Validators.maxLength(50)]],
        fechaIngreso: ['', Validators.required],
        origenRecurso: ['', Validators.required],
        dependencia: ['', Validators.required],
        tipoContratacion: ['', Validators.required],

        opdsDescentralizado: [''],
        organoDesconcentrado: [''],
        centroCosto: [''],

        capitulo: ['', Validators.required],
        subcapitulo: [{ value: '', disabled: true }, Validators.required],
        partidaGenerica: [{ value: '', disabled: true }, Validators.required],
        partidaEspecifica: [{ value: '', disabled: true }, Validators.required],
      },
      { validators: [this.opdsSelectionValidator.bind(this)] }
    );

    this.form.get('origenRecurso')?.valueChanges.subscribe(() => {
      this.form.get('tipoContratacion')?.setValue('');
    });

    this.cargarCatalogos();
    this.configurarDependencia();
    this.configurarOPDS();
    this.configurarPartidas();

    const datosGuardados = this.registroStateService.getDatosGenerales();

    if (datosGuardados) {
      this.form.patchValue(datosGuardados);
    }
  }

  getTipoContratacionOptions(): any[] {
    const origen = Number(this.form.get('origenRecurso')?.value);

    if (origen === 2) {
      return this.tipoContratacionOptions.filter(opt => opt.tipo === 'ELECTRONICA');
    }

    return this.tipoContratacionOptions.filter(opt => opt.tipo === 'PRESENCIAL');
  }

  get centroCostoOptions(): any[] {
    return this.centroCostoOptionsApi;
  }

  get capituloOptions(): any[] {
    return this.capituloOptionsApi;
  }

  get subcapituloOptions(): any[] {
    return this.subcapituloOptionsApi;
  }

  get partidaGenericaOptions(): any[] {
    return this.partidaGenericaOptionsApi;
  }

  get partidaEspecificaOptions(): any[] {
    return this.partidaEspecificaOptionsApi;
  }

  cargarCatalogos(): void {
    this._registroService.getDependencias().subscribe({
      next: (resp) => {
        this.dependenciaOptions = resp?.data || [];
      },
      error: (err) => {
        console.log('Error al cargar Dependencias', err);
      }
    });

    this._registroService.getOrganismosOPDS().subscribe({
      next: (resp) => {
        this.opdsDescentralizadosOptions = resp?.data || [];
      },
      error: (err) => {
        console.log('Error al cargar OPDS Descentralizados', err);
      }
    });

    this._registroService.getOrganosDesconcentrados().subscribe({
      next: (resp) => {
        this.organosDesconcentradosOptions = resp?.data || [];
      },
      error: (err) => {
        console.log('Error al cargar órganos desconcentrados', err);
      }
    });

    this._registroService.getCapitulos().subscribe({
      next: (resp) => {
        this.capituloOptionsApi = resp?.data || [];
      },
      error: (err) => {
        console.log('Error al cargar capítulos', err);
      }
    });
  }

  configurarDependencia(): void {
    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });

    this.form.get('dependencia')?.valueChanges.subscribe((dep) => {
      const desc = this.form.get('opdsDescentralizado')!;
      const desconc = this.form.get('organoDesconcentrado')!;
      const cc = this.form.get('centroCosto')!;

      desc.setValue('', { emitEvent: false });
      desconc.setValue('', { emitEvent: false });
      cc.setValue('', { emitEvent: false });

      this.centroCostoOptionsApi = [];

      const dependenciaSeleccionada = this.dependenciaOptions.find(
        (d) => String(d.id_dependencia) === String(dep)
      );

      const nombreDependencia = dependenciaSeleccionada?.nombre;

      if (!dep) {
        desc.disable({ emitEvent: false });
        desconc.disable({ emitEvent: false });
        cc.disable({ emitEvent: false });
        cc.clearValidators();
        cc.updateValueAndValidity({ emitEvent: false });
        this.form.updateValueAndValidity({ emitEvent: false });
        return;
      }

      if (nombreDependencia === 'Organismos OPDS') {
        desc.enable({ emitEvent: false });
        desconc.enable({ emitEvent: false });
        cc.disable({ emitEvent: false });
        cc.clearValidators();
        cc.updateValueAndValidity({ emitEvent: false });
      } else {
        desc.disable({ emitEvent: false });
        desconc.disable({ emitEvent: false });

        cc.enable({ emitEvent: false });
        cc.setValidators([Validators.required]);
        cc.updateValueAndValidity({ emitEvent: false });

        this._registroService.getCentrosCosto(Number(dep)).subscribe({
          next: (resp) => {
            this.centroCostoOptionsApi = resp.data || [];
          },
          error: (err) => {
            console.log('Error al cargar centros de costo', err);
          }
        });
      }

      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  configurarOPDS(): void {
    this.form.get('opdsDescentralizado')?.valueChanges.subscribe((val) => {
      const desconc = this.form.get('organoDesconcentrado');
      if (!desconc) return;

      if (val) {
        desconc.setValue('', { emitEvent: false });
        desconc.disable({ emitEvent: false });
      } else {
        const dep = this.form.get('dependencia')?.value;
        const dependenciaSeleccionada = this.dependenciaOptions.find(
          (d) => String(d.id_dependencia) === String(dep)
        );

        if (dependenciaSeleccionada?.nombre === 'Organismos OPDS') {
          desconc.enable({ emitEvent: false });
        }
      }

      this.form.updateValueAndValidity({ emitEvent: false });
    });

    this.form.get('organoDesconcentrado')?.valueChanges.subscribe((val) => {
      const desc = this.form.get('opdsDescentralizado');
      if (!desc) return;

      if (val) {
        desc.setValue('', { emitEvent: false });
        desc.disable({ emitEvent: false });
      } else {
        const dep = this.form.get('dependencia')?.value;
        const dependenciaSeleccionada = this.dependenciaOptions.find(
          (d) => String(d.id_dependencia) === String(dep)
        );

        if (dependenciaSeleccionada?.nombre === 'Organismos OPDS') {
          desc.enable({ emitEvent: false });
        }
      }

      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  configurarPartidas(): void {
    this.form.get('capitulo')?.valueChanges.subscribe((idCapitulo) => {
      const subcapitulo = this.form.get('subcapitulo')!;
      const partidaGenerica = this.form.get('partidaGenerica')!;
      const partidaEspecifica = this.form.get('partidaEspecifica')!;

      subcapitulo.setValue('', { emitEvent: false });
      partidaGenerica.setValue('', { emitEvent: false });
      partidaEspecifica.setValue('', { emitEvent: false });

      subcapitulo.disable({ emitEvent: false });
      partidaGenerica.disable({ emitEvent: false });
      partidaEspecifica.disable({ emitEvent: false });

      this.subcapituloOptionsApi = [];
      this.partidaGenericaOptionsApi = [];
      this.partidaEspecificaOptionsApi = [];

      if (!idCapitulo) return;

      this._registroService.getSubcapitulos(Number(idCapitulo)).subscribe({
        next: (resp) => {
          this.subcapituloOptionsApi = resp?.data || [];
          subcapitulo.enable({ emitEvent: false });
        },
        error: (err) => {
          console.log('Error al cargar subcapítulos', err);
        }
      });
    });

    this.form.get('subcapitulo')?.valueChanges.subscribe((idSubcapitulo) => {
      const partidaGenerica = this.form.get('partidaGenerica')!;
      const partidaEspecifica = this.form.get('partidaEspecifica')!;

      partidaGenerica.setValue('', { emitEvent: false });
      partidaEspecifica.setValue('', { emitEvent: false });

      partidaGenerica.disable({ emitEvent: false });
      partidaEspecifica.disable({ emitEvent: false });

      this.partidaGenericaOptionsApi = [];
      this.partidaEspecificaOptionsApi = [];

      if (!idSubcapitulo) return;

      this._registroService.getPartidasGenericas(Number(idSubcapitulo)).subscribe({
        next: (resp) => {
          this.partidaGenericaOptionsApi = resp?.data || [];
          partidaGenerica.enable({ emitEvent: false });
        },
        error: (err) => {
          console.log('Error al cargar partidas genéricas', err);
        }
      });
    });

    this.form.get('partidaGenerica')?.valueChanges.subscribe((idPartidaGenerica) => {
      const partidaEspecifica = this.form.get('partidaEspecifica')!;

      partidaEspecifica.setValue('', { emitEvent: false });
      partidaEspecifica.disable({ emitEvent: false });

      this.partidaEspecificaOptionsApi = [];

      if (!idPartidaGenerica) return;

      this._registroService.getPartidasEspecificas(Number(idPartidaGenerica)).subscribe({
        next: (resp) => {
          this.partidaEspecificaOptionsApi = resp?.data || [];
          partidaEspecifica.enable({ emitEvent: false });
        },
        error: (err) => {
          console.log('Error al cargar partidas específicas', err);
        }
      });
    });
  }

  getDependenciaSeleccionadaNombre(): string {
    const dep = this.form?.get('dependencia')?.value;

    const encontrada = this.dependenciaOptions.find(
      (d) => String(d.id_dependencia) === String(dep)
    );

    return encontrada?.nombre || '';
  }

  esOrganismosOPDS(): boolean {
    return this.getDependenciaSeleccionadaNombre() === 'Organismos OPDS';
  }

  private opdsSelectionValidator(group: AbstractControl): ValidationErrors | null {
    const dep = group.get('dependencia')?.value;

    const dependenciaSeleccionada = this.dependenciaOptions.find(
      (d) => String(d.id_dependencia) === String(dep)
    );

    if (dependenciaSeleccionada?.nombre !== 'Organismos OPDS') return null;

    const d = group.get('opdsDescentralizado')?.value;
    const o = group.get('organoDesconcentrado')?.value;

    if (!d && !o) return { opdsRequired: true };
    return null;
  }

  hasError(name: string, err: string): boolean {
    const c = this.form.get(name);
    return !!(c && c.touched && c.hasError(err));
  }

  showOpdsRequiredError(): boolean {
    const dep = this.form.get('dependencia')?.value;
    const dependenciaSeleccionada = this.dependenciaOptions.find(
      (d) => String(d.id_dependencia) === String(dep)
    );

    if (dependenciaSeleccionada?.nombre !== 'Organismos OPDS') return false;

    const touched =
      this.form.get('opdsDescentralizado')?.touched ||
      this.form.get('organoDesconcentrado')?.touched;

    return !!(touched && this.form.hasError('opdsRequired'));
  }

  onClear(): void {
    this.registroStateService.clear();

    this.form.reset(
      {
        folioInterno: '',
        fechaIngreso: '',
        origenRecurso: '',
        dependencia: '',
        tipoContratacion: '',
        opdsDescentralizado: '',
        organoDesconcentrado: '',
        centroCosto: '',
        capitulo: '',
        subcapitulo: '',
        partidaGenerica: '',
        partidaEspecifica: '',
      },
      { emitEvent: false }
    );

    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });
    this.form.get('subcapitulo')?.disable({ emitEvent: false });
    this.form.get('partidaGenerica')?.disable({ emitEvent: false });
    this.form.get('partidaEspecifica')?.disable({ emitEvent: false });

    this.form.get('centroCosto')?.clearValidators();
    this.form.get('centroCosto')?.updateValueAndValidity({ emitEvent: false });

    this.centroCostoOptionsApi = [];
    this.subcapituloOptionsApi = [];
    this.partidaGenericaOptionsApi = [];
    this.partidaEspecificaOptionsApi = [];

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const data = {
      folio: formValue.folioInterno,
      fecha_ingreso: formValue.fechaIngreso,
      id_origen_recurso: formValue.origenRecurso,
      tipo_contratacion: formValue.tipoContratacion,

      id_dependencia: formValue.dependencia,
      id_opd: formValue.opdsDescentralizado || null,
      id_organo_desconcentrado: formValue.organoDesconcentrado || null,
      id_centro_costo: formValue.centroCosto || null,

      id_capitulo: formValue.capitulo,
      id_subcapitulo: formValue.subcapitulo,
      id_partida_generica: formValue.partidaGenerica,
      id_partida_especifica: formValue.partidaEspecifica,

      userId: this._userService.currentUserValue?.id
    };

    console.log('DATA ENVIADA LIMPIA =>', data);

    this._registroService.saveRegistro(data).subscribe({
      next: (response: any) => {
        console.log('RESPUESTA COMPLETA AL GUARDAR =>', response);

        if (response?.data?.id_solicitud) {
          const idSolicitud = response.data.id_solicitud;

          this.registroStateService.setDatosGenerales(this.form.getRawValue());

          this.router.navigate([
            '/registro/solicitud',
            idSolicitud,
            'estudio-mercado'
          ]);
        }
      },
      error: (e: HttpErrorResponse) => {
        console.error('ERROR AL GUARDAR =>', e);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: e.error?.msg || 'Error desconocido: ' + e.message,
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }
}