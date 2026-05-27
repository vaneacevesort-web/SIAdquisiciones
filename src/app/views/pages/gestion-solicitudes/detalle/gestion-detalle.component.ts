import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../../service/registro.service';
import { UserService } from '../../../../service/user.service';

import { TabInfoGeneralComponent }          from '../tabs/tab-info-general/tab-info-general.component';
import { TabEstudioMercadoComponent }       from '../tabs/tab-estudio-mercado/tab-estudio-mercado.component';
import { TabAfectacionComponent }           from '../tabs/tab-afectacion/tab-afectacion.component';
import { TabAdquisicionComponent }          from '../tabs/tab-adquisicion/tab-adquisicion.component';
import { TabAdjudicacionComponent }         from '../tabs/tab-adjudicacion/tab-adjudicacion.component';

interface TabDef {
  key: string;
  label: string;
  icon: string;
  minEstatus: number;
}

const TABS: TabDef[] = [
  { key: 'info',        label: 'Info General',            icon: 'icon-file-text',  minEstatus: 1 },
  { key: 'estudio',     label: 'Estudio de Mercado',      icon: 'icon-search',     minEstatus: 1 },
  { key: 'afectacion',  label: 'Afectación Presupuestal', icon: 'icon-dollar-sign',minEstatus: 2 },
  { key: 'adquisicion', label: 'Adquisición',             icon: 'icon-shopping-cart', minEstatus: 3 },
  { key: 'adjudicacion',label: 'Adjudicación',            icon: 'icon-award',      minEstatus: 4 },
];

@Component({
  selector: 'app-gestion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabInfoGeneralComponent,
    TabEstudioMercadoComponent,
    TabAfectacionComponent,
    TabAdquisicionComponent,
    TabAdjudicacionComponent,
  ],
  templateUrl: './gestion-detalle.component.html',
  styleUrl:    './gestion-detalle.component.scss'
})
export class GestionDetalleComponent implements OnInit {

  readonly tabs = TABS;

  idSolicitud!: number;
  solicitud:    any = null;
  activeTab     = 'info';
  loading       = true;

  /** Tab solicitado vía query param (?tab=estudio) — se aplica tras cargar */
  private pendingTab: string | null = null;

  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private registroService = inject(RegistroService);
  private userService     = inject(UserService);

  ngOnInit(): void {
    // Capturar tab solicitado desde la lista (?tab=estudio)
    this.route.queryParams.subscribe(qp => {
      if (qp['tab']) this.pendingTab = qp['tab'];
    });

    this.route.params.subscribe(params => {
      this.idSolicitud = parseInt(params['id'], 10);
      if (!isNaN(this.idSolicitud)) {
        this.cargarSolicitud();
      }
    });
  }

  cargarSolicitud(): void {
    this.loading = true;
    // Reuse existing endpoint: returns { solicitud, procedimiento }
    this.registroService.getProcedimientoById(this.idSolicitud).subscribe({
      next: (resp: any) => {
        this.solicitud = resp?.data?.solicitud ?? null;
        this.loading   = false;
        // Si llegó un tab solicitado desde la lista, usarlo (verificando accesibilidad)
        if (this.pendingTab && this.isTabAccessible(this.pendingTab)) {
          this.activeTab  = this.pendingTab;
          this.pendingTab = null;
        } else {
          this.autoSelectTab();
        }
      },
      error: () => { this.loading = false; }
    });
  }

  autoSelectTab(): void {
    const estatus = Number(this.solicitud?.estatus_id ?? 1);
    if      (estatus >= 4) this.activeTab = 'adjudicacion';
    else if (estatus >= 3) this.activeTab = 'adquisicion';
    else if (estatus >= 2) this.activeTab = 'afectacion';
    else                   this.activeTab = 'info';
  }

  selectTab(key: string): void {
    if (this.isTabAccessible(key)) {
      this.activeTab = key;
    }
  }

  isTabAccessible(tabKey: string): boolean {
    const estatus = Number(this.solicitud?.estatus_id ?? 0);
    const tab = TABS.find(t => t.key === tabKey);
    return estatus >= (tab?.minEstatus ?? 999);
  }

  isTabEditable(tabKey: string): boolean {
    const role   = this.userService.currentUserValue?.rol_users?.role?.name ?? '';
    const estatus = Number(this.solicitud?.estatus_id ?? 0);

    switch (tabKey) {
      case 'info':
        return role === 'Administrador' && estatus === 1;
      case 'estudio':
        return (role === 'Administrador' || role === 'Validador') && estatus === 1;
      case 'afectacion':
        return role === 'Administrador' && estatus === 2;
      case 'adquisicion':
        return role === 'Administrador' && estatus === 3;
      case 'adjudicacion':
        return role === 'Administrador' && estatus === 4;
      default:
        return false;
    }
  }

  onSaved(): void {
    // Reload solicitud to get updated estatus
    this.cargarSolicitud();
  }

  volver(): void {
    this.router.navigate(['/gestion-solicitudes']);
  }

  getEstatusLabel(estatus: number): string {
    switch (Number(estatus)) {
      case 1: return 'Registrada';
      case 2: return 'Estudio de Mercado';
      case 3: return 'Afectación Presupuestal';
      case 4: return 'Adquisición';
      case 5: return 'Adjudicación';
      default: return '—';
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

  getStepPct(estatus: number): number {
    return Math.min(((Number(estatus) - 1) / 4) * 100, 100);
  }
}
