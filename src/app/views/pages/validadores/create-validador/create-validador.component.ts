import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-validador',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './create-validador.component.html',
  styleUrl: './create-validador.component.scss'
})
export class CreateValidadorComponent implements OnInit {
  formReg: FormGroup;
  roles: any[] = [];
  public _userService = inject(UserService);
  private router      = inject(Router);
  private aRouter     = inject(ActivatedRoute);
  id: any;
  operacion: string = 'Registrar';

  constructor(private fb: FormBuilder) {
    this.formReg = this.fb.group({
      ap_paterno: ['', Validators.required],
      ap_materno: ['', Validators.required],
      nombres:    [null, Validators.required],
      correo:     ['', [Validators.required, Validators.email]],
      curp: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/)
      ]],
      role_id: [2, Validators.required],
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this._userService.getRoles().subscribe({
      next: (resp: any) => { this.roles = resp?.data ?? []; },
      error: () => {}
    });

    if (this.id != null) {
      this.operacion = 'Editar';
      this.getValidador();
    }
  }

  getValidador(): void {
    this._userService.getValidador(this.id).subscribe({
      next: (response: any) => {
        this.formReg.patchValue({
          ap_paterno: response.data.datos_user.apaterno,
          ap_materno: response.data.datos_user.amaterno,
          nombres:    response.data.datos_user.nombre,
          correo:     response.data.email,
          curp:       response.data.name,
        });
      },
      error: (e: HttpErrorResponse) => { console.error(e.error?.msg || e); }
    });
  }

  envio(): void {
    if (!this.formReg.valid) {
      this.formReg.markAllAsTouched();
      return;
    }

    const v = this.formReg.value;

    if (this.id != null) {
      const datos = {
        apaterno:  v.ap_paterno,
        amaterno:  v.ap_materno,
        nombre:    v.nombres,
        correo:    v.correo,
        curp:      v.curp,
      };
      this._userService.updateVallidador(this.id, datos).subscribe({
        next: (_: any) => {
          Swal.fire({ icon: 'success', title: 'Datos actualizados correctamente', timer: 3000, showConfirmButton: false });
          this.router.navigate(['/validadores/usuarios']);
        },
        error: (e: HttpErrorResponse) => { console.error(e.error?.msg || e); }
      });
    } else {
      const datos = {
        apaterno:  v.ap_paterno,
        amaterno:  v.ap_materno,
        nombre:    v.nombres,
        correo:    v.correo,
        curp:      v.curp,
        role_id:   v.role_id,
      };
      this._userService.saveValidador(datos).subscribe({
        next: (response: any) => {
          if (response?.estatus === '400') {
            Swal.fire({ icon: 'warning', title: 'Correo ya registrado', text: response.correo, timer: 3000, showConfirmButton: false });
            return;
          }
          Swal.fire({ icon: 'success', title: 'Usuario registrado', timer: 3000, showConfirmButton: false });
          this.formReg.reset({ role_id: 2 });
        },
        error: (e: HttpErrorResponse) => { console.error(e.error?.msg || e); }
      });
    }
  }
}
