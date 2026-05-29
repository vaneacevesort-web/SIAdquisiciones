import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

/** Validador de grupo: password === confirmPassword */
function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { noMatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  form: FormGroup;
  enviando  = false;
  showPass  = false;
  showPass2 = false;

  private userService = inject(UserService);
  private router      = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
      ]],
      confirmPassword: ['', Validators.required],
    }, { validators: matchPasswords });
  }

  get f() { return this.form.controls; }

  registrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.enviando = true;
    const { nombre, correo, password } = this.form.value;

    this.userService.registerPublic({ nombre, correo, password }).subscribe({
      next: () => {
        this.enviando = false;
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta fue creada. Un administrador asignará tu rol. Puedes iniciar sesión cuando tu acceso esté activo.',
          confirmButtonText: 'Ir al login',
          confirmButtonColor: '#7a001f',
        }).then(() => this.router.navigate(['/auth/login']));
      },
      error: (e: HttpErrorResponse) => {
        this.enviando = false;
        const msg = e.error?.msg ?? 'Ocurrió un error. Intenta de nuevo.';
        Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#7a001f' });
      },
    });
  }
}
