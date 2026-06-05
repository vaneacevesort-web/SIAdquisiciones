import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { RegistroService } from '../../../service/registro.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  cargando = true;
  ahora    = new Date();

  // ── KPIs principales ─────────────────────────────────────────────────
  kpis = {
    total: 0, contratos: 0, monto: 0, dependencias: 0,
    registradas: 0, estudio: 0, afectacion: 0, contratacion: 0, adjudicacion: 0,
    estatal: 0, federal: 0, fideicomiso: 0, concurrente: 0, propio: 0,
  };

  // ── Detalle por origen ────────────────────────────────────────────────
  origenDetalle: {
    id: number; nombre: string;
    solicitudes: number; contratos: number;
    monto: number; pct_formalizacion: number;
  }[] = [];

  // ── Top dependencias ──────────────────────────────────────────────────
  topSolicitudes: { nombre: string; total: number }[] = [];
  topMonto:       { nombre: string; monto: number }[] = [];

  // ── Tabla ejecutiva ───────────────────────────────────────────────────
  tablaResumen: {
    nombre: string; solicitudes: number;
    contratos: number; monto: number; principal_origen: string;
  }[] = [];

  // ── Tendencia mensual ─────────────────────────────────────────────────
  evolucionData: {
    anio: number; categorias: string[];
    solicitudes: number[]; contratos: number[]; montos: number[];
  } | null = null;

  // ── Gráficas ──────────────────────────────────────────────────────────
  chartContratosPorOrigen:   ApexOptions | null = null;
  chartTopSolicitudes:       ApexOptions | null = null;
  chartTopMonto:             ApexOptions | null = null;
  chartMontoOrigen:          ApexOptions | null = null;
  chartTendenciaMensual:     ApexOptions | null = null;

  // ── Paleta por origen del recurso (usada en donut + dots de la lista) ──
  // Combinación de verde, dorado y azul — sin guinda.
  readonly ORIGIN_COLORS: Record<number, string> = {
    1: '#2E8B57', // Estatal     — verde ejecutivo
    2: '#C89B3C', // Federal     — dorado institucional
    3: '#355C7D', // Fideicomiso — azul petróleo
    4: '#4A9E7C', // Concurrente — verde teal
    5: '#5E6472', // Propio      — gris acero
  };

  getOriginColor(id: number): string {
    return this.ORIGIN_COLORS[id] ?? '#5E6472';
  }

  pctOrigenNum(n: number): number {
    const total = this.origenDetalle.reduce((s, o) => s + o.solicitudes, 0);
    return total ? Math.round((n / total) * 100) : 0;
  }

  private svc = inject(RegistroService);

  ngOnInit(): void {
    forkJoin({
      kpis:     this.svc.getKpis(),
      origen:   this.svc.getOrigenDetalle(),
      tops:     this.svc.getTopDependencias(),
      tabla:    this.svc.getDependenciasResumen(),
      evolucion: this.svc.getEvolucionMensual().pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ kpis, origen, tops, tabla, evolucion }) => {
        if (kpis?.data) {
          const d = kpis.data;
          this.kpis = {
            total: d.total ?? 0, contratos: d.total_contratos ?? 0,
            monto: d.monto_total ?? 0, dependencias: d.dependencias_participantes ?? 0,
            registradas: d.registradas ?? 0, estudio: d.estudio ?? 0,
            afectacion: d.afectacion ?? 0, contratacion: d.contratacion ?? 0,
            adjudicacion: d.adjudicacion ?? 0,
            estatal: d.estatal ?? 0, federal: d.federal ?? 0,
            fideicomiso: d.fideicomiso ?? 0, concurrente: d.concurrente ?? 0,
            propio: d.propio ?? 0,
          };
        }
        if (origen?.data)    this.origenDetalle  = origen.data;
        if (tops?.data)      { this.topSolicitudes = tops.data.porSolicitudes ?? []; this.topMonto = tops.data.porMonto ?? []; }
        if (tabla?.data)     this.tablaResumen   = tabla.data;
        if (evolucion?.data) this.evolucionData  = evolucion.data;

        this.buildCharts();
        this.cargando = false;
      },
      error: () => { this.cargando = false; },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  pct(n: number): string {
    if (!this.kpis.total) return '0%';
    return Math.round((n / this.kpis.total) * 100) + '%';
  }

  pesos(n: number): string {
    if (!n) return '$0';
    // Mostrar monto completo con separadores de miles — sin etiquetas MDP/MXN
    // (la unidad "MXN · IVA incluido" ya aparece en el subtexto del KPI)
    return '$' + Math.round(n).toLocaleString('es-MX');
  }

  // ── Gráficas ──────────────────────────────────────────────────────────
  private buildCharts(): void {
    // ── Paleta semántica por tipo de métrica ──────────────────────────────
    // Azul petróleo → solicitudes     (información/demanda)
    // Verde ejecutivo → contratos     (proceso completado)
    // Dorado → monto adjudicado       (resultado financiero)
    // Guinda → KPIs y acentos solo    (no en gráficas de barras o dona)
    const AZUL_P = '#355C7D'; // solicitudes
    const DORADO = '#C89B3C'; // monto adjudicado
    const GRIS   = '#64748B';

    const oriColors  = this.origenDetalle.map(o => this.getOriginColor(o.id));
    const oriNames   = this.origenDetalle.map(o => o.nombre);

    const LABEL_STYLE = { fontSize: '11px', fontFamily: 'inherit', colors: GRIS };
    const GRID_CFG    = {
      borderColor: '#F1F5F9',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    };

    // ── Donut: contratos por origen ───────────────────────────────────────
    // Reducido a 210 px — no debe dominar la fila.
    this.chartContratosPorOrigen = {
      series:  this.origenDetalle.map(o => o.contratos),
      labels:  oriNames,
      chart:   { type: 'donut', height: 210, toolbar: { show: false } },
      colors:  oriColors,
      plotOptions: { pie: { donut: { size: '60%', labels: {
        show: true,
        total: {
          show:      true,
          label:     'Contratos',
          color:     GRIS,
          fontSize:  '11px',
          formatter: () => this.origenDetalle.reduce((s, o) => s + o.contratos, 0).toString(),
        },
      } } } },
      dataLabels: { enabled: false },
      legend: {
        position:   'bottom',
        fontSize:   '11px',
        fontFamily: 'inherit',
        labels:     { colors: GRIS },
        markers:    { size: 7 } as any,
      },
      stroke:  { width: 2, colors: ['#fff'] },
      tooltip: { y: { formatter: (v: number) => v + ' contratos' } },
    };

    // chartSolicitudesPorOrigen ya no es una gráfica — se muestra como lista.

    // ── Barras: top 5 solicitudes por dependencia ─────────────────────────
    // Azul petróleo → identidad visual "solicitudes" coherente con la lista.
    const t5n = this.topSolicitudes.map(d => this.shortName(d.nombre));
    this.chartTopSolicitudes = {
      series: [{ name: 'Solicitudes', data: this.topSolicitudes.map(d => d.total) }],
      chart:  { type: 'bar', height: 230, toolbar: { show: false } },
      colors: [AZUL_P],
      plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '48%' } },
      dataLabels:  { enabled: true, style: { fontSize: '11px', colors: ['#fff'] } },
      xaxis: {
        categories: t5n,
        labels:     { style: LABEL_STYLE },
        axisBorder: { show: false },
        axisTicks:  { show: false },
      },
      yaxis: { labels: { style: LABEL_STYLE } },
      grid:  GRID_CFG,
      tooltip: { y: { formatter: (v: number) => v + ' solicitudes' } },
    };

    // ── Barras: top 5 monto adjudicado por dependencia ────────────────────
    // Dorado → identidad visual "monto adjudicado" inmediatamente reconocible.
    const m5n = this.topMonto.map(d => this.shortName(d.nombre));
    const m5v = this.topMonto.map(d => +(d.monto / 1_000_000).toFixed(1));
    this.chartTopMonto = {
      series: [{ name: 'Millones MXN', data: m5v }],
      chart:  { type: 'bar', height: 230, toolbar: { show: false } },
      colors: [DORADO],
      plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '48%' } },
      dataLabels: {
        enabled:   true,
        style:     { fontSize: '11px', colors: ['#fff'] },
        formatter: (v: number) => '$' + v.toLocaleString('es-MX') + ' M',
      },
      xaxis: {
        categories: m5n,
        labels:     { style: LABEL_STYLE },
        axisBorder: { show: false },
        axisTicks:  { show: false },
      },
      yaxis: { labels: { style: LABEL_STYLE } },
      grid:  GRID_CFG,
      tooltip: { y: { formatter: (v: number) => '$' + v.toLocaleString('es-MX') + ' M MXN' } },
    };

    // ── Monto adjudicado por origen del recurso ───────────────────────────
    // Dorado → identidad "monto". Solo orígenes con monto > 0.
    const conMonto = this.origenDetalle.filter(o => o.monto > 0);
    if (conMonto.length) {
      this.chartMontoOrigen = {
        series: [{ name: 'M MXN', data: conMonto.map(o => +(o.monto / 1_000_000).toFixed(1)) }],
        chart:  { type: 'bar', height: 230, toolbar: { show: false } },
        colors: [DORADO],
        plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '48%' } },
        dataLabels: {
          enabled:   true,
          style:     { fontSize: '11px', colors: ['#fff'] },
          formatter: (v: number) => '$' + v.toLocaleString('es-MX') + ' M',
        },
        xaxis: {
          categories: conMonto.map(o => o.nombre),
          labels:     { style: LABEL_STYLE },
          axisBorder: { show: false },
          axisTicks:  { show: false },
        },
        yaxis: { labels: { style: LABEL_STYLE } },
        grid:  GRID_CFG,
        tooltip: { y: { formatter: (v: number) => '$' + v.toLocaleString('es-MX') + ' M MXN' } },
      };
    }

    // ── Tendencia mensual de solicitudes y contratos ───────────────────────
    // Barras (azul) = solicitudes · Línea (verde) = contratos.
    if (this.evolucionData) {
      const ev = this.evolucionData;
      this.chartTendenciaMensual = {
        series: [
          { name: 'Solicitudes', type: 'column', data: ev.solicitudes },
          { name: 'Contratos',   type: 'line',   data: ev.contratos   },
        ],
        chart:  { type: 'line', height: 230, toolbar: { show: false } },
        colors: [AZUL_P, '#2E8B57'],
        stroke: { width: [0, 2.5], curve: 'smooth' },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 2 } },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ev.categorias,
          labels:     { style: LABEL_STYLE },
          axisBorder: { show: false },
          axisTicks:  { show: false },
        },
        yaxis: { labels: { style: LABEL_STYLE } },
        grid:  GRID_CFG,
        legend: {
          show: true, position: 'bottom', fontSize: '11px',
          fontFamily: 'inherit', labels: { colors: GRIS },
        },
        markers: { size: [0, 4] } as any,
        tooltip: { shared: true, intersect: false },
      };
    }
  }

  private shortName(s: string): string {
    return s.length > 30 ? s.substring(0, 28) + '…' : s;
  }
}
