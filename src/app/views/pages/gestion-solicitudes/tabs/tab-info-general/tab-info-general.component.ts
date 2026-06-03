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
      case 4: return 'Concurrente';
      case 5: return 'Propio';
      default: return '—';
    }
  }

  getTipoSolicitud(tipo: string): string {
    return tipo === 'BIEN' ? 'Bien — Adquisición de materiales' : tipo === 'SERVICIO' ? 'Servicio — Contratación de servicios' : tipo || '—';
  }

  hasClasificacion(): boolean {
    const s = this.solicitud;
    if (!s) return false;
    return !!(
      s.dependencia_nombre  || s.opd_nombre          ||
      s.centro_costo_nombre || s.capitulo_nombre      ||
      s.subcapitulo_nombre  || s.partida_generica_nombre ||
      s.partida_especifica_nombre
    );
  }
}
