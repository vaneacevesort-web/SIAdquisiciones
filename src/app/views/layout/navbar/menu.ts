import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Bandeja de entrada',
    icon: 'mail',
    roles: ['Administrador', 'Validador'],
    subMenus: [
      {
        subMenuItems: [
          {
            label: 'Solicitudes',
            isTitle: true,
          },
          {
            label: 'En tramite',
            link: '/solicitud/tramite'
          },
          {
            label: 'Finalizadas',
            link: '/solicitud/finalizados'
          },
          {
            label: 'Rechazadas',
            link: '/solicitud/rechazados'
          },
          {
            label: 'Registradas',
            link: '/solicitud/registradas'
          },
        ]
      },

    ]
  },
  {
    label: 'Validadores',
    icon: 'file-text',
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
    label: 'Solicitud',
    icon: 'mail',
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
  }
];
