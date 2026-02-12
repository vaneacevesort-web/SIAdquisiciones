import { Component, inject } from '@angular/core';
import { DocumentoService } from '../../../service/documento.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { Documento } from '../../../interfaces/documento';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-documentos',
  imports: [CommonModule,NgbTooltipModule,RouterModule],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {
  
  public _documentoService = inject(DocumentoService);
  public _userService = inject(UserService);

  persona: {  id:string, nombre: string, correo: string, telefono: string, curp: string, estatus: number } | null = null;
  constructor(){}

  ngOnInit(): void {
    this.getUsuarioEstatus();
  }

  getUsuarioEstatus(){
      const id_user = String(this._userService.currentUserValue?.id);
      this._documentoService.getDocumentosUser(id_user).subscribe({
      next: (response: any) => {
        this.persona = {
          id: response.id,
          nombre: response.ap_paterno + ' ' + response.ap_materno + ' ' + response.nombres,
          correo: response.correo,
          curp: response.curp,
          telefono: response.celular,
          estatus: response.estatusId
        };
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


