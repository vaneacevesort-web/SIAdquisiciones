import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Documento } from '../../../../interfaces/documento';
import { UserService } from '../../../../service/user.service';
import { DocumentoService } from '../../../../service/documento.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-documentos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-edit-documentos.component.html',
  styleUrl: './add-edit-documentos.component.scss'
})

export class AddEditDocumentosComponent {
  @ViewChildren('fileInputsRef') fileInputsRef!: QueryList<ElementRef<HTMLInputElement>>;
  formDoc: FormGroup;
  files: { [key: string]: File } = {};
  public _userService = inject(UserService);
  public _documentoService = inject(DocumentoService);
  archivosSubidos: { [key: string]: string } = {};
  archivosRechazados: { [key: string]: number } = {};
  observac: { [key: string]: string } = {};
  documentos: any;
  isLoading: boolean = false;
  estatusSoli: any;
  isAdmin = false;
  id_user: string | null = null;
  data: any  = {};
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,) {
    this.formDoc = this.fb.group({
      curp: [null, Validators.required],
      constancia_residencia: [null, Validators.required],
      acta_nacimiento: [null, Validators.required],
      carta_ant_no_penales: [null],
      carta_protesta5: [null, Validators.required],
      curriculum: [null, Validators.required],
      propuesta_programa: [null, Validators.required],
      copia_certificada: [null, Validators.required],
      ine: [null, Validators.required],
      informe_no_penales: [null, Validators.required],
      carta_motivos: [null, Validators.required],
      escrito_consentimiento: [null, Validators.required],
    },{
        validators: []
    });
  }

  ngOnInit(): void {
    this.getDocumUsuario();
  }
  eliminarArchivo(tipoDoc: string){
    const currntUsr = String(this.id_user);
      const datos = {
        tipo: tipoDoc, usuario: currntUsr
      };
      this._documentoService.deleteDocumento(datos).subscribe({
        next: (response: any) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Documento borrado correctamente."
          });
          this.archivosSubidos[tipoDoc] = '';
          const control = this.formDoc.get(tipoDoc);
          if (control) {
          control.reset();
          control.setValidators([Validators.required]);
          control.updateValueAndValidity();
          }
          const input = document.getElementById(tipoDoc) as HTMLInputElement;
          if (input) {
            input.value = '';
          }
      
        },
        error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
        } else {
          console.error('Error desconocido:', e);
        }
        },
      })
  }
  onFile7(event: Event, controlName: string, maxmb: number): void {

    const input = event.target as HTMLInputElement;
    const control = this.formDoc.get(controlName);
    const currntUsr = String(this.id_user);

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = maxmb * 1024 * 1024;

      if (file.size > maxSize) {
        control?.setErrors({ fileSize: true });
      }else{
        control?.setErrors(null); 
        this.files[controlName] = file; 

        const document: Documento = {
          tipo: input.id,
          archivo: this.files[controlName],
          usuario: 1
        }

        const formData = new FormData();
        formData.append('tipo', input.id);
        formData.append('archivo', this.files[controlName]);
        formData.append('usuario', String(currntUsr));

        this._documentoService.saveDocumentos(formData, currntUsr).subscribe({
          next: (response: any) => {
            const archivoUrl = 'https://dev4.siasaf.gob.mx/' + response.documento.path;
            this.archivosSubidos[input.id] = archivoUrl;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Documento guardado correctamente."
            });
          },
          error: (e: HttpErrorResponse) => {
            if (e.error && e.error.msg) {
              console.error('Error del servidor:', e.error.msg);
            } else {
              console.error('Error desconocido:', e);
            }
          },
        })

      }
      control?.markAsTouched();
    }
  }

  getDocumUsuario() {

   
    if(this._userService.currentUserValue?.rol_users?.role?.name == 'Administrador'){
       this.id_user  = this.route.snapshot.paramMap.get('id') ?? '';
       this.isAdmin = true
    }else{
      this.id_user = String(this._userService.currentUserValue?.id);
    }

    this._documentoService.getDocumentosUser(this.id_user).subscribe({
      next: (response: any) => {
          this.data = response
          this.documentos = response.documentos;
           this.estatusSoli = response.estatusId;
          this.documentos.forEach((doc: any) => {
            
            if (doc) {
  
                this.archivosRechazados[doc.tipo?.valor] = doc.estatus;
                this.observac[doc.tipo?.valor] = doc.observaciones;
                const archivoUrl = 'https://dev4.siasaf.gob.mx/' + doc.path;
                
                this.archivosSubidos[doc.tipo?.valor] = archivoUrl;
                this.formDoc.get(doc.tipo?.valor)?.clearValidators();
                this.formDoc.get(doc.tipo?.valor)?.updateValueAndValidity();
            }else{
              this.archivosRechazados[doc.tipo?.valor] = 0;
            }
          });  
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
        } else {
          console.error('Error desconocido:', e);
        }
      },
    })
    
  }

  sendDoc() {
    this.isLoading = true;
    const id_user = String(this.id_user);
    this._documentoService.sendDocumentos(id_user).subscribe({
      next: (response: any) => {
        this.isLoading = false; 
        Swal.fire({
          position: "center", 
          icon: "success",
          title: "Tu registro ha sido enviado.",
          showConfirmButton: false,
          timer: 3000
        });
        if(this.isAdmin){
          this.router.navigate(['/solicitud/registradas']);
        }else{
          this.router.navigate(['/registro/documentos']);
        }
        
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
        } else {
          console.error('Error desconocido:', e);
        }
      },
    })
  }
}

