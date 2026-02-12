import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-restaurar-contrasena',
  imports: [NgStyle, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './restaurar-contrasena.component.html',
  styleUrl: './restaurar-contrasena.component.scss'
})
export class RestaurarContrasenaComponent {
  formRestaura: FormGroup;
  public _userService = inject(UserService);

  constructor(private fb: FormBuilder, private  aRouter: ActivatedRoute,private router: Router,private location: Location){
    this.formRestaura = this.fb.group({
      correo:['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      },
    { validators: [ this.validadorCorreo]});

    
  }
  validadorCorreo(formGroup: FormGroup): { [key: string]: boolean } | null {
    const email = formGroup.get('correo')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;
    if (email !== confirmEmail) {
      return { 'emailsDoNotMatch': true };
    }else{
      return null;
    }
  }

  olvideContrasena(){
    const datos = {
    correo: this.formRestaura.value.correo
    };
    this._userService.resetPassword(datos).subscribe({
      next: (response: any) => {
        if(response.valid == true){
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha enviado a la cuenta de correo electrónico el enlace para cambio de contraseña.",
            text: " Si no encuentra el correo en la bandeja de entrada, verifique en el apartado de Correo no deseado o Spam.",
            showConfirmButton: false,
            timer: 4000
          });
          this.router.navigate(['/auth/login']); 
        }else{
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Correo no válido, favor de verificar.",
            showConfirmButton: false,
            timer: 3000
          });
          this.formRestaura.reset();
        } 
      },
      error: (e: HttpErrorResponse) => {
      console.error('Error:', e.error?.msg || e);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
