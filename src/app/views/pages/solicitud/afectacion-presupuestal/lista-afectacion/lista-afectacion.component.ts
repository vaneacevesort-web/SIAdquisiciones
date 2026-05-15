import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroService } from '../../../../../service/registro.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-afectacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-afectacion.component.html',
  styleUrl: './lista-afectacion.component.scss'
})
export class ListaAfectacionComponent implements OnInit {

  solicitudes: any[] = [];

  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.cargarSolicitudesAfectacion();
  }

  cargarSolicitudesAfectacion(): void {
    this.registroService.getSolicitudesAfectacion().subscribe({
      next: (resp: any) => {
        console.log('SOLICITUDES AFECTACIÓN =>', resp);
        this.solicitudes = resp.data || resp || [];
      },
      error: (error) => {
        console.error('ERROR AL CARGAR AFECTACIÓN =>', error);
      }
    });
  }

}