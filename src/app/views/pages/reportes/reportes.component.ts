import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistroService } from '../../../service/registro.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {

  cargando = true;

  kpis = {
    solicitudes:  0,
    estudio:      0,
    afectacion:   0,
    contratacion: 0,
    adjudicacion: 0,
  };

  private registroService = inject(RegistroService);

  ngOnInit(): void {
    this.registroService.getKpis().subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          const d = resp.data;
          this.kpis = {
            solicitudes:  d.total        ?? 0,
            estudio:      d.estudio      ?? 0,
            afectacion:   d.afectacion   ?? 0,
            contratacion: d.contratacion ?? 0,
            adjudicacion: d.adjudicacion ?? 0,
          };
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  pct(n: number, total: number): string {
    if (!total) return '—';
    return Math.round((n / total) * 100) + '%';
  }
}
