import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  // Sin restricción de rol → visible para todos los usuarios autenticados
  {
    label: 'Solicitudes',
    icon: 'grid',
    link: '/gestion-solicitudes',
  },

  // Solo pueden crear solicitudes: Administrador y Estudio de Mercado
  {
    label: 'Nueva Solicitud',
    icon: 'plus-circle',
    roles: ['Administrador', 'Estudio de Mercado'],
    link: '/solicitud/nuevo',
  },

  // Solo el Administrador gestiona usuarios
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

  // Sin restricción de rol → todos pueden consultar reportes
  {
    label: 'Reportes',
    icon: 'bar-chart-2',
    link: '/reportes',
  },

  // Solo el Administrador puede hacer carga masiva
  {
    label: 'Carga Masiva',
    icon: 'upload',
    roles: ['Administrador'],
    link: '/carga-masiva',
  },

];
