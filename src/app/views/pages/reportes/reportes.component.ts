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
    estatal:      0,
    federal:      0,
    fideicomiso:  0,
    concurrente:  0,
    propio:       0,
    total_contratos: 0,
    monto_total:  0,
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
            estatal:      d.estatal      ?? 0,
            federal:      d.federal      ?? 0,
            fideicomiso:  d.fideicomiso  ?? 0,
            concurrente:  d.concurrente  ?? 0,
            propio:       d.propio       ?? 0,
            total_contratos: d.total_contratos ?? 0,
            monto_total:  d.monto_total  ?? 0,
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

  pesos(n: number): string {
    if (!n) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
    }).format(n);
  }
}
