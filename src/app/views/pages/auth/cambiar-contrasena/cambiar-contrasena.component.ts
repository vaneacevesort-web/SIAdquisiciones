import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cambiar-contrasena',
  imports: [NgStyle, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.scss'
})
export class CambiarContrasenaComponent {
  showPassword1: boolean = false;
  showPassword2: boolean = false;
  token: string = '';
  formPassword: FormGroup;
    public _userService = inject(UserService);
  constructor(private fb: FormBuilder, private  aRouter: ActivatedRoute,private router: Router){
    this.formPassword = this.fb.group({
      password1:['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      password2:['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      },{ validators: [this.matchPasswords]}
    );

    
  }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
    this.validaTkn();
  }
  validaTkn(){
    this._userService.validaToken(this.token).subscribe({
    next: (response: any) => {
      if(response.valid != true){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Token inválido o expirado",
          showConfirmButton: false,
          timer: 3000
        });
        this.router.navigate(['/auth/login']); 
      }
    },
    error: (e: HttpErrorResponse) => {
      console.error('Error:', e.error?.msg || e);
    }
    });
  }
  togglePassword(field: number): void {
    if (field === 1) {
      this.showPassword1 = !this.showPassword1;
    } else if (field === 2) {
      this.showPassword2 = !this.showPassword2;
    }
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password1')?.value;
    const confirm = group.get('password2')?.value;
    return pass === confirm ? null : { noMatch: true };
  }

  cambiarContrasena(){

    const datos = {
    newPassword: this.formPassword.value.password1, 
    token: this.token
    };
    this._userService.updatePassword(datos).subscribe({
      next: (response: any) => {
          Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Correcto!.",
          text: "La contraseña se ha cambiado correctamente.",
          showConfirmButton: false,
          timer: 4000
        });
        this.router.navigate(['/auth/login']); 
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
      }
    });
    
  }
}

