import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegistroService }    from '../../../../service/registro.service';
import { PermissionService }  from '../../../../service/permission.service';
import { calcularSemaforo, SemaforoInfo } from '../../../../utils/semaforo';

// ── Etapas del proceso ────────────────────────────────────────────────────
export type Etapa = 'ver' | 'estudio' | 'afectacion' | 'adquisicion' | 'adjudicacion';

// minEstatus para acceder (ver) cada etapa
const MIN_ESTATUS: Record<Etapa, number> = {
  ver:         1,
  estudio:     1,
  afectacion:  2,
  adquisicion: 3,
  adjudicacion:4,
};


@Component({
  selector: 'app-gestion-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-lista.component.html',
  styleUrl: './gestion-lista.component.scss'
})
export class GestionListaComponent implements OnInit {

  rows:         any[] = [];
  temp:         any[] = [];
  originalData: any[] = [];
  loading = true;
  textoBusqueda = '';
  filtroEstatus = '';

  private registroService   = inject(RegistroService);
  private router            = inject(Router);
  private permissionService = inject(PermissionService);

  // ── API pública de permisos ─────────────────────────────────────────────

  /** ¿Puede el usuario ACCEDER (ver) la etapa según el estatus de la solicitud? */
  puedeAcceder(solicitud: any, etapa: Etapa): boolean {
    const estatus = Number(solicitud?.estatus_id ?? 0);
    return estatus >= MIN_ESTATUS[etapa];
  }

  /** ¿Puede el usuario crear nuevas solicitudes? */
  puedeCrear(): boolean {
    return this.permissionService.canCreate();
  }

  /** ¿Puede el usuario EDITAR la etapa? Delega en PermissionService. */
  puedeEditarEtapa(solicitud: any, etapa: Etapa): boolean {
    if (etapa === 'ver') return true;
    const estatus = solicitud?.estatus_id ?? 0;
    return this.permissionService.canEdit(
      etapa as 'estudio' | 'afectacion' | 'adquisicion' | 'adjudicacion',
      estatus,
      solicitud?.user_id
    );
  }

  // ── Navegación ──────────────────────────────────────────────────────────

  /** Navega al detalle abriendo un tab específico vía query param */
  abrirEtapa(solicitud: any, etapa: Etapa, event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.puedeAcceder(solicitud, etapa)) return;

    // 'ver' = info general; el resto usa el tab homónimo
    const tab = etapa === 'ver' ? 'info' : etapa;
    this.router.navigate(
      ['/gestion-solicitudes', solicitud.id_solicitud],
      { queryParams: { tab } }
    );
  }

  /** Click en la fila → abre el tab activo según estatus */
  abrirDetalle(id: number): void {
    this.router.navigate(['/gestion-solicitudes', id]);
  }

  // ── Carga y filtros ─────────────────────────────────────────────────────

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.registroService.getRegistros().subscribe({
      next: (resp: any) => {
        const data = resp?.data ?? [];
        this.originalData = [...data];
        this.temp         = [...data];
        this.rows         = [...data];
        this.loading      = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateFilter(event: Event): void {
    this.textoBusqueda = ((event.target as HTMLInputElement).value || '').toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstatus(event: Event): void {
    this.filtroEstatus = (event.target as HTMLSelectElement).value || '';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.temp = this.originalData.filter((row: any) => {
      const coincideTexto = !this.textoBusqueda ||
        Object.values(row).some(v => v && v.toString().toLowerCase().includes(this.textoBusqueda));
      const coincideEstatus = !this.filtroEstatus ||
        Number(row.estatus_id) === Number(this.filtroEstatus);
      return coincideTexto && coincideEstatus;
    });
    this.rows = [...this.temp];
  }

  // ── Contador descriptivo ────────────────────────────────────────────────

  get textoContador(): string {
    const n = this.rows.length;
    if (n === 0) return 'Sin solicitudes para mostrar';
    const base = `Mostrando ${n} solicitud${n === 1 ? '' : 'es'}`;
    if (this.filtroEstatus) return `${base} en ${this.getEstatusLabel(Number(this.filtroEstatus))}`;
    return base;
  }

  // ── Helpers de presentación ─────────────────────────────────────────────

  getOrigenClass(id: number): string {
    switch (Number(id)) {
      case 1: return 'estatal';
      case 2: return 'federal';
      case 3: return 'fideicomiso';
      case 4: return 'concurrente';
      case 5: return 'propio';
      default: return 'default';
    }
  }

  getEstatusLabel(estatus: number): string {
    switch (Number(estatus)) {
      case 1: return 'Registrada';
      case 2: return 'Estudio de Mercado';
      case 3: return 'Afectación Presupuestal';
      case 4: return 'Adquisición';
      case 5: return 'Adjudicación';
      default: return 'Desconocido';
    }
  }

  getEstatusClass(estatus: number): string {
    switch (Number(estatus)) {
      case 1: return 'badge-registrada';
      case 2: return 'badge-estudio';
      case 3: return 'badge-afectacion';
      case 4: return 'badge-adquisicion';
      case 5: return 'badge-adjudicacion';
      default: return 'bg-secondary';
    }
  }

  getSemaforo(solicitud: any): SemaforoInfo {
    return calcularSemaforo(solicitud);
  }

  formatDate(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
