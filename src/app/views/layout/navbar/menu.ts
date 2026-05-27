import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  // ── Administrador / Validador ─────────────────────────────────────────────
  {
    label: 'Solicitudes',
    icon: 'grid',
    roles: ['Administrador', 'Validador'],
    link: '/gestion-solicitudes',
  },
  {
    label: 'Nueva Solicitud',
    icon: 'plus-circle',
    roles: ['Administrador', 'Validador'],
    link: '/solicitud/nuevo',
  },
  {
    label: 'Validadores',
    icon: 'users',
    roles: ['Administrador'],
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'Usuarios',
            isTitle: true,
          },
          {
            label: 'Validadores',
            link: '/validadores'
          }
        ]
      },
    ]
  },
  {
    label: 'Reportes',
    icon: 'bar-chart-2',
    roles: ['Administrador', 'Validador'],
    link: '/reportes',
  },

  // ── Usuario (rol solicitante) ─────────────────────────────────────────────
  {
    label: 'Mi Solicitud',
    icon: 'file-text',
    roles: ['Usuario'],
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'Mi solicitud',
            isTitle: true,
          },
          {
            label: 'Documentos',
            link: '/registro'
          }
        ]
      },
    ]
  },
];
