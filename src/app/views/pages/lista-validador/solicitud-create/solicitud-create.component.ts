import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-create',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-create.component.html',
  styleUrl: './solicitud-create.component.scss'
})
export class SolicitudCreateComponent {
  form: FormGroup;

  origenOptions = [
    { value: 'Estatal', label: 'Estatal' },
    { value: 'Federal', label: 'Federal' },
    { value: 'Fideicomiso', label: 'Fideicomiso' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      folioInterno: ['', [Validators.required, Validators.maxLength(50)]],
      fechaIngreso: ['', [Validators.required]],
      origenRecurso: ['', [Validators.required]]
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.form.get(controlName)?.hasError(errorName);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

}
