import { Component, inject, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registro } from '../../../interfaces/registro';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroService } from '../../../service/registro.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  formReg: FormGroup;
  miControl = new FormControl('');
  public _registroService = inject(RegistroService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.formReg = this.fb.group(
      {
        ap_paterno: ['', Validators.required],
        ap_materno: ['', Validators.required],
        nombres: [null, Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        aviso_privacidad: [false, Validators.requiredTrue],
      },
      { validators: [this.validadorCorreo] }
    );
  }

  ngOnInit(): void {}

  convertirAMayuscula(controlName: string) {
    const valor = this.formReg.get(controlName)?.value || '';
    this.formReg.get(controlName)?.setValue(valor.toUpperCase(), { emitEvent: false });
  }

  // ✅ Solo dejamos validador de correo
  validadorCorreo(formGroup: FormGroup): { [key: string]: boolean } | null {
    const email = formGroup.get('correo')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;
    if (email !== confirmEmail) {
      return { emailsDoNotMatch: true };
    } else {
      return null;
    }
  }

  onAvisoChange(event: Event, modalRef: TemplateRef<any>) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.openLgModal(modalRef);
    }
  }

  openLgModal(content: TemplateRef<any>) {
    console.log('modal');
    this.modalService.open(content, { size: 'lg' }).result
      .then((result) => console.log('Modal closed' + result))
      .catch(() => {});
  }

  sendReg() {
    const registroval: Registro = {
      ap_paterno: this.formReg.value.ap_paterno,
      ap_materno: this.formReg.value.ap_materno,
      nombres: this.formReg.value.nombres,
      correo: this.formReg.value.correo,
      aviso_privacidad: this.formReg.value.aviso_privacidad,
      celular: '',
      curp: ''
    };

    this._registroService.saveRegistro(registroval).subscribe({
      next: (response: any) => {
        const correo = response.correo;
        if (response.estatus == 400) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Atención!',
            text: `Ya existe un registro con el correo: ${correo}.`,
            showConfirmButton: false,
            timer: 3000
          });

          this.formReg.get('confirmEmail')?.reset('');
          this.formReg.get('confirmEmail')?.markAsTouched();
          this.formReg.get('correo')?.reset('');
          this.formReg.get('correo')?.markAsTouched();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Solicitud registrada satisfactoriamente!',
            text: `Para continuar con el trámite, se han enviado a la cuenta de correo electrónico ${correo} las instrucciones para continuar con el proceso de registro. Si no encuentra el correo en la bandeja de entrada, verifique en el apartado de Correo no deseado o Spam.`,
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

