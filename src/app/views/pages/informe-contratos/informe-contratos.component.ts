import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
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

interface PaginaPDF {
  registros: Contrato[];
  numPagina: number;
  totalPaginas: number;
}

interface GrupoDep {
  nombre: string;
  contratos: Contrato[];
  totalMonto: number;
  totalContratos: number;
}

interface PaginaDetallePDF {
  depNombre: string;
  registros: Contrato[];
  numPaginaDep: number;
  totalPaginasDep: number;
  esUltimaPaginaDep: boolean;
  totalMontoDep: number;
  totalContratosDep: number;
  numPaginaGlobal: number;
  totalPaginasGlobal: number;
}

type Vista = 'concentrado' | 'federal' | 'detalle';

const PAGE_SIZE         = 24;
const PAGE_SIZE_DETALLE = 20;

@Component({
  selector: 'app-informe-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './informe-contratos.component.html',
  styleUrl: './informe-contratos.component.scss',
})
export class InformeContratosComponent implements OnInit {

  private registroService = inject(RegistroService);

  readonly pageSize        = PAGE_SIZE;
  readonly pageSizeDetalle = PAGE_SIZE_DETALLE;

  cargando = true;
  error = '';
  readonly anioActual = new Date().getFullYear();

  totalSolicitudesGlobal = 0;
  contratos: Contrato[] = [];
  dependencias: DepFiltro[] = [];
  solicitudesPorDep: Record<string, number> = {};

  filtrosDep: Set<string> = new Set();
  mostrarMenuDep = false;
  readonly vistaActiva = signal<Vista>('concentrado');

  ngOnInit(): void {
    this.registroService.getInformeContratos().subscribe({
      next: (resp: any) => {
        if (resp?.ok && resp.data) {
          this.totalSolicitudesGlobal = resp.data.total_solicitudes   ?? 0;
          this.contratos              = resp.data.contratos           ?? [];
          this.dependencias           = resp.data.dependencias        ?? [];
          this.solicitudesPorDep      = resp.data.solicitudes_por_dep ?? {};
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el informe. Verifica la conexión con el servidor.';
        this.cargando = false;
      },
    });
  }

  // ── Cierre del menú al clic fuera ────────────────────────────────────────
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (this.mostrarMenuDep && !(target as HTMLElement)?.closest('.rep-filter-wrap')) {
      this.mostrarMenuDep = false;
    }
  }

  // ── Menú filtro ───────────────────────────────────────────────────────────

  get filtroActivo(): boolean { return this.filtrosDep.size > 0; }

  get etiquetaFiltro(): string {
    const n = this.filtrosDep.size;
    if (n === 0) return 'DEPENDENCIA';
    if (n === 1) return Array.from(this.filtrosDep)[0];
    return `${n} dependencias seleccionadas`;
  }

  get dependenciasUnicas(): string[] {
    const nombres = new Set<string>();
    for (const c of this.contratos) {
      const n = c.dependencia_nombre?.trim();
      if (n) nombres.add(n);
    }
    return Array.from(nombres).sort((a, b) => a.localeCompare(b, 'es'));
  }

  esDependenciaSeleccionada(nombre: string): boolean {
    return this.filtrosDep.has(nombre.trim());
  }

  // ── Cadena de filtrado ────────────────────────────────────────────────────

  // 1. Filtro de dependencia seleccionada
  get contratosFiltrados(): Contrato[] {
    if (!this.filtroActivo) return this.contratos;
    return this.contratos.filter(c => {
      const n = c.dependencia_nombre?.trim().toLowerCase();
      return n ? [...this.filtrosDep].some(f => f.toLowerCase() === n) : false;
    });
  }

  // 2. Validez de contrato: tiene número real, no es desierto/cancelado, monto > 0
  private esContratoValido(c: Contrato): boolean {
    const no = c.no_contrato?.trim().toLowerCase() ?? '';
    return no.length > 0
      && no !== 'desierto'
      && no !== 'cancelado'
      && no !== 'rechazado'
      && (c.monto ?? 0) > 0;
  }

  // 3. Todos los contratos válidos (dep-filtrados)
  get contratosEfectivos(): Contrato[] {
    return this.contratosFiltrados.filter(c => this.esContratoValido(c));
  }

  // 4a. Solo estatales válidos
  get contratosEstatalesEfectivos(): Contrato[] {
    return this.contratosEfectivos.filter(
      c => c.origen_recurso?.toLowerCase().includes('estatal')
    );
  }

  // 4b. Solo federales válidos
  get contratosFederalesEfectivos(): Contrato[] {
    return this.contratosEfectivos.filter(
      c => c.origen_recurso?.toLowerCase().includes('federal')
    );
  }

  // 5. Dataset de la vista activa (usado por KPIs y tabla)
  //    'concentrado' y 'detalle' → estatales  |  'federal' → federales
  get contratosVistaActiva(): Contrato[] {
    if (this.vistaActiva() === 'federal') return this.contratosFederalesEfectivos;
    return this.contratosEstatalesEfectivos;
  }

  // 6. Contratos ordenados — adapta a la vista (base para PDF y tabla)
  get contratosOrdenados(): Contrato[] {
    return [...this.contratosVistaActiva].sort((a, b) =>
      (a.dependencia_nombre || '').localeCompare(b.dependencia_nombre || '', 'es')
    );
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────

  // Universo completo de solicitudes del origen activo (incluye desiertos, cancelados)
  get totalSolicitudes(): number {
    const origen = this.vistaActiva === 'federal' ? 'federal' : 'estatal';
    const base = this.contratosFiltrados.filter(
      c => c.origen_recurso?.toLowerCase().includes(origen)
    );
    return new Set(base.map(c => c.id_solicitud)).size;
  }

  // Solo solicitudes que concluyeron en contrato formalizado (monto > 0, no desierto)
  get totalContratos(): number {
    return this.contratosVistaActiva.length;
  }

  // Suma de montos de contratos formalizados
  get montoTotal(): number {
    return this.contratosVistaActiva.reduce((s, c) => s + (c.monto ?? 0), 0);
  }

  // ── Ayudantes de tabla ────────────────────────────────────────────────────

  esCambioDeGrupo(index: number): boolean {
    if (index === 0) return false;
    const lista = this.contratosOrdenados;
    return lista[index]?.dependencia_nombre !== lista[index - 1]?.dependencia_nombre;
  }

  // ── Grupos para vista Detalle ─────────────────────────────────────────────
  get gruposPorDependencia(): GrupoDep[] {
    const mapa = new Map<string, Contrato[]>();
    for (const c of this.contratosOrdenados) {
      const dep = c.dependencia_nombre?.trim() || '(Sin dependencia)';
      if (!mapa.has(dep)) mapa.set(dep, []);
      mapa.get(dep)!.push(c);
    }
    return Array.from(mapa.entries()).map(([nombre, contratos]) => ({
      nombre,
      contratos,
      totalMonto:     contratos.reduce((s, c) => s + (c.monto ?? 0), 0),
      totalContratos: contratos.filter(c => !!c.no_contrato?.trim()).length,
    }));
  }

  // ── Paginación PDF — Concentrado (estatales y federal) ────────────────────
  get paginasPDF(): PaginaPDF[] {
    const all   = this.contratosOrdenados;
    const total = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    return Array.from({ length: total }, (_, i) => ({
      registros:    all.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
      numPagina:    i + 1,
      totalPaginas: total,
    }));
  }

  // ── Paginación PDF — Detalle por Dependencia ──────────────────────────────
  get paginasDetallePDF(): PaginaDetallePDF[] {
    const grupos  = this.gruposPorDependencia;
    const paginas: PaginaDetallePDF[] = [];

    for (const g of grupos) {
      const totalPagsDep = Math.max(1, Math.ceil(g.contratos.length / PAGE_SIZE_DETALLE));
      for (let i = 0; i < totalPagsDep; i++) {
        paginas.push({
          depNombre:          g.nombre,
          registros:          g.contratos.slice(i * PAGE_SIZE_DETALLE, (i + 1) * PAGE_SIZE_DETALLE),
          numPaginaDep:       i + 1,
          totalPaginasDep:    totalPagsDep,
          esUltimaPaginaDep:  i === totalPagsDep - 1,
          totalMontoDep:      g.totalMonto,
          totalContratosDep:  g.totalContratos,
          numPaginaGlobal:    paginas.length + 1,
          totalPaginasGlobal: 0,
        });
      }
    }

    const total = Math.max(1, paginas.length);
    paginas.forEach(p => p.totalPaginasGlobal = total);
    return paginas;
  }

  // ── Títulos dinámicos ─────────────────────────────────────────────────────

  get tituloEncabezado(): string {
    if (this.vistaActiva === 'federal') return `CONCENTRADO DE CONTRATOS FEDERALES<br>POR DEPENDENCIA ${this.anioActual}`;
    if (this.vistaActiva === 'detalle') return `DETALLE POR DEPENDENCIA<br>CONTRATOS ESTATALES ${this.anioActual}`;
    return `CONCENTRADO DE CONTRATOS ESTATALES<br>POR DEPENDENCIA ${this.anioActual}`;
  }

  get tituloPDF(): string {
    if (this.vistaActiva === 'federal') return `CONCENTRADO DE CONTRATOS FEDERALES POR DEPENDENCIA ${this.anioActual}`;
    return `CONCENTRADO DE CONTRATOS ESTATALES POR DEPENDENCIA ${this.anioActual}`;
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  cambiarVista(v: Vista): void { this.vistaActiva = v; }

  toggleMenuDep(): void { this.mostrarMenuDep = !this.mostrarMenuDep; }

  toggleDep(nombre: string): void {
    const key = nombre.trim();
    if (this.filtrosDep.has(key)) this.filtrosDep.delete(key);
    else this.filtrosDep.add(key);
    this.filtrosDep = new Set(this.filtrosDep);
  }

  quitarFiltros(): void {
    this.filtrosDep     = new Set();
    this.mostrarMenuDep = false;
  }

  imprimirPDF(): void { window.print(); }

  // ── Formateo ──────────────────────────────────────────────────────────────

  pesos(n: number): string {
    if (!n && n !== 0) return '—';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN',
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(n);
  }

  fecha(s: string | null): string {
    if (!s) return '—';
    const [y, m, d] = s.split('-');
    return d && m && y ? `${d}/${m}/${y}` : s;
  }
}
