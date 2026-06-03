import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { RegistroService } from '../../../service/registro.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  cargando     = true;
  cargandoDeps = true;
  cargandoCal  = true;
  ahora        = new Date();

  // ── KPIs ──────────────────────────────────────────────────────────────
  kpis = {
    total: 0, estatal: 0, federal: 0, fideicomiso: 0, concurrente: 0, propio: 0,
    contratos: 0, monto: 0,
    registradas: 0, estudio: 0, afectacion: 0, contratacion: 0, adjudicacion: 0,
  };

  // ── Gráficas ──────────────────────────────────────────────────────────
  chartEtapas: ApexOptions | null = null;
  chartOrigen: ApexOptions | null = null;

  // ── Top dependencias ──────────────────────────────────────────────────
  topSolicitudes: { nombre: string; total: number }[] = [];
  topMonto:       { nombre: string; monto: number }[] = [];

  // ── Calendario ────────────────────────────────────────────────────────
  calAnio  = this.ahora.getFullYear();
  calMes   = this.ahora.getMonth() + 1;
  calDias: { fecha: Date | null; solicitudes: number; contratos: number; adjudicaciones: number }[] = [];
  calSeleccionado: Date | null = null;

  readonly DIAS_SEM   = ['L','M','X','J','V','S','D'];
  readonly MESES_NOM  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                         'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  private svc = inject(RegistroService);

  ngOnInit(): void {
    // KPIs + gráficas
    this.svc.getKpis().subscribe({
      next: (r: any) => {
        if (r?.data) {
          const d = r.data;
          this.kpis = {
            total: d.total ?? 0, estatal: d.estatal ?? 0, federal: d.federal ?? 0,
            fideicomiso: d.fideicomiso ?? 0, concurrente: d.concurrente ?? 0, propio: d.propio ?? 0,
            contratos: d.total_contratos ?? 0, monto: d.monto_total ?? 0,
            registradas: d.registradas ?? 0, estudio: d.estudio ?? 0,
            afectacion: d.afectacion ?? 0, contratacion: d.contratacion ?? 0,
            adjudicacion: d.adjudicacion ?? 0,
          };
          this.buildCharts();
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; },
    });

    // Top dependencias
    this.svc.getTopDependencias().subscribe({
      next: (r: any) => {
        if (r?.data) {
          this.topSolicitudes = r.data.porSolicitudes ?? [];
          this.topMonto       = r.data.porMonto       ?? [];
        }
        this.cargandoDeps = false;
      },
      error: () => { this.cargandoDeps = false; },
    });

    // Calendario
    this.cargarCal();
  }

  // ── Helpers KPI ───────────────────────────────────────────────────────
  pct(n: number): string {
    if (!this.kpis.total) return '0%';
    return Math.round((n / this.kpis.total) * 100) + '%';
  }

  pesos(n: number): string {
    if (!n) return '$0';
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(1) + ' MMM';
    if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + ' M';
    return '$' + Math.round(n).toLocaleString('es-MX');
  }

  barWidth(n: number, list: {total:number}[]): string {
    const max = list[0]?.total ?? 1;
    return Math.min(Math.round((n / max) * 100), 100) + '%';
  }

  barWidthMonto(n: number): string {
    const max = this.topMonto[0]?.monto ?? 1;
    return Math.min(Math.round((n / max) * 100), 100) + '%';
  }

  // ── Gráficas ──────────────────────────────────────────────────────────
  private buildCharts(): void {
    const k = this.kpis;
    this.chartEtapas = {
      series: [k.registradas, k.estudio, k.afectacion, k.contratacion, k.adjudicacion],
      labels: ['Registrada','Estudio de Mercado','Afectación Presupuestal','Adquisición','Adjudicación'],
      chart:  { type: 'donut', height: 260, toolbar: { show: false } },
      colors: ['#64748b','#d97706','#1e40af','#0d9488','#15803d'],
      plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', color: '#64748b', formatter: () => k.total.toString() } } } } },
      dataLabels: { enabled: false },
      legend: { position: 'bottom', fontSize: '11px', fontFamily: 'inherit', labels: { colors: '#64748b' } },
      stroke: { width: 2 },
      tooltip: { y: { formatter: (v: number) => v + ' solicitudes' } },
    };

    this.chartOrigen = {
      series: [{ name: 'Solicitudes', data: [k.estatal, k.federal, k.fideicomiso, k.concurrente, k.propio] }],
      chart:  { type: 'bar', height: 260, toolbar: { show: false } },
      colors: ['#7a001f'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
      dataLabels: { enabled: true, style: { fontSize: '11px', colors: ['#fff'] } },
      xaxis: { categories: ['Estatal','Federal','Fideicomiso','Concurrente','Propio'], labels: { style: { fontSize: '11px', colors: '#64748b' } }, axisBorder: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px', colors: '#64748b' } } },
      grid:  { borderColor: '#f1f5f9', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      tooltip: { y: { formatter: (v: number) => v + ' solicitudes' } },
    };
  }

  // ── Calendario ────────────────────────────────────────────────────────
  get calTitulo(): string { return `${this.MESES_NOM[this.calMes - 1]} ${this.calAnio}`; }

  calNavegar(d: number): void {
    this.calMes += d;
    if (this.calMes > 12) { this.calMes = 1;  this.calAnio++; }
    if (this.calMes < 1)  { this.calMes = 12; this.calAnio--; }
    this.calSeleccionado = null;
    this.cargarCal();
  }

  seleccionarDia(dia: { fecha: Date | null }): void {
    if (!dia.fecha) return;
    const iso = this.isoDate(dia.fecha);
    this.calSeleccionado = this.calSeleccionado && this.isoDate(this.calSeleccionado) === iso ? null : dia.fecha;
  }

  get calEventosDia() {
    if (!this.calSeleccionado) return null;
    return this.calDias.find(d => d.fecha && this.isoDate(d.fecha) === this.isoDate(this.calSeleccionado!)) ?? null;
  }

  tieneEventos(d: { solicitudes: number; contratos: number; adjudicaciones: number }) {
    return d.solicitudes > 0 || d.contratos > 0 || d.adjudicaciones > 0;
  }

  esHoy(f: Date | null) {
    if (!f) return false;
    const h = new Date();
    return f.getFullYear() === h.getFullYear() && f.getMonth() === h.getMonth() && f.getDate() === h.getDate();
  }

  esSelec(f: Date | null) {
    if (!f || !this.calSeleccionado) return false;
    return this.isoDate(f) === this.isoDate(this.calSeleccionado);
  }

  private isoDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  private cargarCal(): void {
    this.cargandoCal = true;
    this.svc.getActividadCalendario(this.calAnio, this.calMes).subscribe({
      next: (r: any) => { this.buildCal(r?.data ?? {}); this.cargandoCal = false; },
      error: () => { this.buildCal({}); this.cargandoCal = false; },
    });
  }

  private buildCal(data: any): void {
    const toMap = (arr: any[] = []) => new Map<string, number>(arr.map(r => [r.fecha.split('T')[0], Number(r.total)]));
    const sol = toMap(data.solicitudes);
    const con = toMap(data.contratos);
    const adj = toMap(data.adjudicaciones);

    const primer  = new Date(this.calAnio, this.calMes - 1, 1);
    const dow     = (primer.getDay() + 6) % 7;
    const enMes   = new Date(this.calAnio, this.calMes, 0).getDate();
    const celdas: typeof this.calDias = [];

    for (let i = 0; i < dow; i++) celdas.push({ fecha: null, solicitudes: 0, contratos: 0, adjudicaciones: 0 });
    for (let d = 1; d <= enMes; d++) {
      const f = new Date(this.calAnio, this.calMes - 1, d);
      const iso = this.isoDate(f);
      celdas.push({ fecha: f, solicitudes: sol.get(iso) ?? 0, contratos: con.get(iso) ?? 0, adjudicaciones: adj.get(iso) ?? 0 });
    }
    while (celdas.length % 7 !== 0) celdas.push({ fecha: null, solicitudes: 0, contratos: 0, adjudicaciones: 0 });
    this.calDias = celdas;
  }
}
