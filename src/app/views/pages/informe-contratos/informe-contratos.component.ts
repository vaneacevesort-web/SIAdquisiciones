import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistroService } from '../../../service/registro.service';

interface Contrato {
  id_solicitud: number;
  no_solicitud: string;
  id_dependencia: number | null;
  id_opd: number | null;
  id_origen_recurso: number;
  dependencia_nombre: string;
  no_procedimiento: string | null;
  no_contrato: string | null;
  fecha_adjudicacion: string | null;
  proveedor_razon_social: string | null;
  monto: number;
  descripcion: string | null;
  partida: string | null;
  giro: string | null;
  origen_recurso: string;
}

interface DepFiltro {
  id_dependencia: number;
  id_opd: number;
  nombre: string;
}

interface GrupoDep {
  nombre: string;
  contratos: Contrato[];
  monto: number;
}

@Component({
  selector: 'app-informe-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './informe-contratos.component.html',
  styleUrl: './informe-contratos.component.scss',
})
export class InformeContratosComponent implements OnInit {

  private registroService = inject(RegistroService);

  cargando = true;
  error = '';
  readonly anioActual = new Date().getFullYear();

  totalSolicitudesGlobal = 0;
  contratos: Contrato[] = [];
  dependencias: DepFiltro[] = [];
  solicitudesPorDep: Record<string, number> = {};

  filtroDepNombre = '';

  ngOnInit(): void {
    this.registroService.getInformeContratos().subscribe({
      next: (resp: any) => {
        if (resp?.ok && resp.data) {
          this.totalSolicitudesGlobal  = resp.data.total_solicitudes  ?? 0;
          this.contratos               = resp.data.contratos          ?? [];
          this.dependencias            = resp.data.dependencias       ?? [];
          this.solicitudesPorDep       = resp.data.solicitudes_por_dep ?? {};
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el informe. Verifica la conexión con el servidor.';
        this.cargando = false;
      },
    });
  }

  // ── KPIs reactivos ────────────────────────────────────────────────────────

  get totalSolicitudes(): number {
    if (!this.filtroDepNombre) return this.totalSolicitudesGlobal;
    return this.solicitudesPorDep[this.filtroDepNombre] ?? 0;
  }

  get contratosFiltrados(): Contrato[] {
    if (!this.filtroDepNombre) return this.contratos;
    return this.contratos.filter(c => c.dependencia_nombre === this.filtroDepNombre);
  }

  get totalContratos(): number {
    return this.contratosFiltrados.length;
  }

  get montoTotal(): number {
    return this.contratosFiltrados.reduce((s, c) => s + (c.monto ?? 0), 0);
  }

  // ── Agrupación por dependencia ────────────────────────────────────────────

  get gruposDependencia(): GrupoDep[] {
    const mapa = new Map<string, Contrato[]>();
    for (const c of this.contratosFiltrados) {
      const dep = c.dependencia_nombre || 'Sin dependencia asignada';
      if (!mapa.has(dep)) mapa.set(dep, []);
      mapa.get(dep)!.push(c);
    }
    return Array.from(mapa.entries()).map(([nombre, contratos]) => ({
      nombre,
      contratos,
      monto: contratos.reduce((s, c) => s + c.monto, 0),
    }));
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  seleccionarDep(nombre: string): void {
    this.filtroDepNombre = nombre;
  }

  quitarFiltros(): void {
    this.filtroDepNombre = '';
  }

  imprimirPDF(): void {
    window.print();
  }

  // ── Formateo ──────────────────────────────────────────────────────────────

  pesos(n: number): string {
    if (!n && n !== 0) return '—';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN',
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(n);
  }

  formatFecha(f: string | null): string {
    if (!f) return '—';
    const d = new Date(f + 'T12:00:00');
    if (isNaN(d.getTime())) return f;
    return d.toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }
}
