import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-info-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-info-general.component.html',
})
export class TabInfoGeneralComponent {

  @Input() idSolicitud!: number;
  @Input() solicitud: any = null;
  @Input() readonly = true;
  @Output() saved = new EventEmitter<void>();

  getOrigenRecurso(id: number): string {
    switch (Number(id)) {
      case 1: return 'Estatal';
      case 2: return 'Federal';
      case 3: return 'Fideicomiso';
      case 4: return 'Concurrente o Propio';
      default: return '—';
    }
  }

  getTipoSolicitud(tipo: string): string {
    return tipo === 'BIEN' ? 'Bien — Adquisición de materiales' : tipo === 'SERVICIO' ? 'Servicio — Contratación de servicios' : tipo || '—';
  }
}
