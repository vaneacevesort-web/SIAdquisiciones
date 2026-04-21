import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../service/user.service';

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

  // Origen de recurso (select)
  origenOptions = [
    { value: 'Estatal', label: 'Estatal' },
    { value: 'Federal', label: 'Federal' },
    { value: 'Fideicomiso', label: 'Fideicomiso' },
    { value: 'Concurrente o Propio', label: 'Concurrente o Propio' },
  ];

  // Capítulos
  capituloOptions = [
    { value: '1000', label: '1000 Servicios Personales' },
    { value: '2000', label: '2000 Materiales Y Suministros' },
    { value: '3000', label: '3000 Servicios Generales' },
    { value: '4000', label: '4000 Transferencias, Asignaciones, Subsidios Y Otras Ayudas' },
    { value: '5000', label: '5000 Bienes Muebles, Inmuebles E Intangibles' },
    { value: '6000', label: '6000 Inversión Pública' },
    { value: '7000', label: '7000 Inversiones Financieras Y Otras Provisiones' },
    { value: '8000', label: '8000 Participaciones Y Aportaciones' },
    { value: '9000', label: '9000 Deuda Pública' },
  ];

  // Giro / Subgiro (ejemplo: cambia por tu catálogo real)
  giroOptions: string[] = ['Bienes', 'Servicios', 'Arrendamientos'];

  subGiroByGiro: Record<string, string[]> = {
    Bienes: ['Papelería', 'Mobiliario', 'Equipo de cómputo'],
    Servicios: ['Mantenimiento', 'Limpieza', 'Consultoría'],
    Arrendamientos: ['Inmuebles', 'Vehículos'],
  };

  get subGiroOptions(): string[] {
    const g = this.form?.get('giro')?.value;
    return g ? this.subGiroByGiro[g] ?? [] : [];
  }

  // Dependencias debe BD
  dependenciaOptions: any[] = [];
  centroCostoOptionsApi: any[] = []; 
  opdsDescentralizadosOptions: any[] = [];
  organosDesconcentradosOptions: any[] = [];
  get centroCostoOptions(): any[] {
    return this.centroCostoOptionsApi;
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

  constructor(private fb: FormBuilder, private router: Router,) {
  this.form = this.fb.group(
    {
      folioInterno: ['', [Validators.required, Validators.maxLength(50)]],
      fechaIngreso: ['', Validators.required],
      origenRecurso: ['', Validators.required],
      dependencia: ['', Validators.required],
      // OPDS
      opdsDescentralizado: [''],
      organoDesconcentrado: [''],
      // Secretarías
      centroCosto: [''],
      // Estudio de Mercado
      capitulo: ['', Validators.required],
      giro: ['', Validators.required],
      subGiro: ['', Validators.required],
    },
    { validators: [this.opdsSelectionValidator.bind(this)] }
  );

  // Cargar dependencias desde BD
  this._registroService.getDependencias().subscribe({
  next: (resp) => {
    console.log('RESPUESTA COMPLETA DEPENDENCIAS =>', resp);
    console.log('RESP.DATA =>', resp?.data);

    this.dependenciaOptions = resp?.data || [];

    console.log('DEPENDENCIAS DESDE BD =>', this.dependenciaOptions);
  },
  error: (err) => {
    console.log('Error al cargar Dependencias', err);
  }
});

// Cargar OPDS Descentralizados desde BD
this._registroService.getOrganismosOPDS().subscribe({
  next: (resp) => {
    console.log('RESPUESTA COMPLETA OPDS =>', resp);
    console.log('RESP.DATA OPDS =>', resp?.data);

    this.opdsDescentralizadosOptions = resp?.data || [];

    console.log('OPDS DESDE BD =>', this.opdsDescentralizadosOptions);
  },
  error: (err) => {
    console.log('Error al cargar OPDS Descentralizados', err);
  }
});

this._registroService.getOrganosDesconcentrados().subscribe({
  next: (resp) => {
    console.log('RESPUESTA COMPLETA DESCONCENTRADOS =>', resp);
    console.log('RESP.DATA DESCONCENTRADOS =>', resp?.data);

    this.organosDesconcentradosOptions = resp?.data || [];

    console.log('DESCONCENTRADOS DESDE BD =>', this.organosDesconcentradosOptions);
  },
  error: (err) => {
    console.log('Error al cargar órganos desconcentrados', err);
  }
});

  // Estado inicial
  this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
  this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
  this.form.get('centroCosto')?.disable({ emitEvent: false });

  // SubGiro depende del Giro
  this.form.get('subGiro')?.disable({ emitEvent: false });

  // Dependencia: OPDS vs Secretarías
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
          this.centroCostoOptionsApi = resp.data;
          console.log('CENTROS COSTO DESDE BD =>', this.centroCostoOptionsApi);
        },
        error: (err) => {
          console.log('Error al cargar centros de costo', err);
        }
      });
    }

    this.form.updateValueAndValidity({ emitEvent: false });
  });

  // OPDS: si eligen Descentralizado => bloquea Desconcentrado
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

  // OPDS: si eligen Desconcentrado => bloquea Descentralizado
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

  // Giro -> habilita SubGiro y lo limpia
  this.form.get('giro')?.valueChanges.subscribe((g) => {
    const sub = this.form.get('subGiro');
    if (!sub) return;

    sub.setValue('', { emitEvent: false });

    if (g) sub.enable({ emitEvent: false });
    else sub.disable({ emitEvent: false });
  });
}
  // ✅ Form-level validator: si dependencia=OPDS debe elegir al menos uno
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

  hasError(name: string, err: string) {
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

  onClear() {
    this.form.reset(
      {
        folioInterno: '',
        fechaIngreso: '',
        origenRecurso: '',
        dependencia: '',
        opdsDescentralizado: '',
        organoDesconcentrado: '',
        centroCosto: '',
        capitulo: '',
        giro: '',
        subGiro: '',
      },
      { emitEvent: false }
    );

    // vuelve al estado inicial
    this.form.get('opdsDescentralizado')?.disable({ emitEvent: false });
    this.form.get('organoDesconcentrado')?.disable({ emitEvent: false });
    this.form.get('centroCosto')?.disable({ emitEvent: false });
    this.form.get('subGiro')?.disable({ emitEvent: false });

    // centroCosto deja de ser requerido hasta elegir dependencia
   this.form.get('centroCosto')?.clearValidators();
    this.form.get('centroCosto')?.updateValueAndValidity({ emitEvent: false });

    this.centroCostoOptionsApi = [];

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('GUARDAR =>', this.form.value);

    const data = {
      ...this.form.getRawValue(),
      userId: this._userService.currentUserValue?.id
    };

      console.log('DATA ENVIADA =>', data);

    this._registroService.saveRegistro(data).subscribe({
      next: (response: any) => {
        if (response) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Solicitud registrada satisfactoriamente!',
            text: `Para continuar con el trámite.`,
            showConfirmButton: false,
            timer: 10000
          });
          this.router.navigate(['/']);
        }
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: e.error.msg + ': ' + e.error.correo,
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/']);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error desconocido: ' + e,
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/']);
        }
      }
    });
  }
}