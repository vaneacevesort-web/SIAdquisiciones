import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { UserService }     from '../../../../service/user.service';

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

// Etapa activa por estatus_id (para autoselect al abrir el detalle)
const TAB_BY_ESTATUS: Record<number, string> = {
  1: 'estudio',
  2: 'afectacion',
  3: 'adquisicion',
  4: 'adjudicacion',
  5: 'adjudicacion',
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

  private registroService = inject(RegistroService);
  private router          = inject(Router);
  private userService     = inject(UserService);

  // ── Helpers de rol ──────────────────────────────────────────────────────
  private get role(): string {
    return this.userService.currentUserValue?.rol_users?.role?.name ?? '';
  }

  // ── API pública de permisos ─────────────────────────────────────────────

  /**
   * ¿El usuario puede ACCEDER (ver) esta etapa según el estatus de la solicitud?
   * Independiente del rol: solo depende de que la solicitud haya avanzado lo suficiente.
   */
  puedeAcceder(solicitud: any, etapa: Etapa): boolean {
    const estatus = Number(solicitud?.estatus_id ?? 0);
    return estatus >= MIN_ESTATUS[etapa];
  }

  /**
   * Función central de permisos de edición.
   * Combina ROL del usuario + ESTATUS de la solicitud.
   * Preparada para roles futuros — al agregar un nuevo rol solo se toca aquí.
   */
  puedeEditarEtapa(solicitud: any, etapa: Etapa): boolean {
    const estatus = Number(solicitud?.estatus_id ?? 0);
    const r = this.role;

    switch (etapa) {
      case 'ver':
        // Todos pueden ver — solo acceso de lectura
        return true;

      case 'estudio':
        // Administrador o Validador, mientras siga en estatus 1
        return (r === 'Administrador' || r === 'Validador' || r === 'Estudio de Mercado')
               && estatus === 1;

      case 'afectacion':
        return (r === 'Administrador' || r === 'Afectación Presupuestal')
               && estatus === 2;

      case 'adquisicion':
        return (r === 'Administrador' || r === 'Adquisiciones')
               && estatus === 3;

      case 'adjudicacion':
        return (r === 'Administrador' || r === 'Adjudicación')
               && estatus === 4;

      default:
        return false;
    }
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

  // ── Helpers de presentación ─────────────────────────────────────────────

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

  formatDate(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
