import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';

/** Etapas del flujo de adquisición */
export type Etapa = 'info' | 'estudio' | 'afectacion' | 'adquisicion' | 'adjudicacion';

/** Estatus mínimo de la solicitud para poder ACCEDER (ver) cada etapa */
const MIN_ESTATUS: Record<Etapa, number> = {
  info:         1,
  estudio:      1,
  afectacion:   2,
  adquisicion:  3,
  adjudicacion: 4,
};

/**
 * Servicio centralizado de permisos.
 * Toda lógica de "quién puede editar qué" vive aquí.
 * Para agregar/cambiar un rol solo hay que modificar canEdit().
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {

  private userService = inject(UserService);

  get role(): string {
    return this.userService.currentUserValue?.rol_users?.role?.name ?? '';
  }

  private get currentUserId(): string | undefined {
    return this.userService.currentUserValue?.id;
  }

  private isOwner(solicitudUserId?: string | null): boolean {
    return !!this.currentUserId && this.currentUserId === solicitudUserId;
  }

  /**
   * ¿Puede el usuario actual EDITAR la etapa indicada,
   * dado el estatus_id actual de la solicitud?
   * solicitudUserId: user_id del creador de la solicitud (requerido para roles con restricción de propiedad)
   */
  canEdit(etapa: Etapa, estatusId: number | string, solicitudUserId?: string | null): boolean {
    const r = this.role;
    const s = Number(estatusId);

    switch (etapa) {
      case 'info':
        if (r === 'Administrador') return s === 1;
        if (r === 'Estudio de Mercado') return s === 1 && this.isOwner(solicitudUserId);
        return false;

      case 'estudio':
        if (r === 'Administrador') return s === 1;
        if (r === 'Estudio de Mercado') return s === 1 && this.isOwner(solicitudUserId);
        return false;

      case 'afectacion':
        return (r === 'Administrador' || r === 'Afectación Presupuestal') && s === 2;

      case 'adquisicion':
        return (r === 'Administrador' || r === 'Adquisiciones') && s === 3;

      case 'adjudicacion':
        return (r === 'Administrador' || r === 'Adjudicación') && s === 4;

      default:
        return false;
    }
  }

  /**
   * ¿Puede el usuario CREAR nuevas solicitudes?
   * Solo Administrador y Estudio de Mercado tienen este permiso.
   */
  canCreate(): boolean {
    return this.role === 'Administrador' || this.role === 'Estudio de Mercado';
  }

  /**
   * ¿Puede el usuario ACCEDER (ver en modo lectura) la etapa,
   * dado el estatus_id actual de la solicitud?
   * Es independiente del rol: cualquier usuario puede ver etapas ya alcanzadas.
   */
  canAccess(etapa: Etapa, estatusId: number | string): boolean {
    return Number(estatusId) >= MIN_ESTATUS[etapa];
  }
}
