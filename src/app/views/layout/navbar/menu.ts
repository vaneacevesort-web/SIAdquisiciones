import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

  // Dashboard ejecutivo — visible para todos
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard',
  },

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

  // Seguimiento de contratos — link directo, sin paso intermedio por indicadores
  {
    label: 'Informes',
    icon: 'bar-chart-2',
    link: '/informe-contratos',
  },

  // Solo el Administrador puede hacer carga masiva
  {
    label: 'Carga Masiva',
    icon: 'upload',
    roles: ['Administrador'],
    link: '/carga-masiva',
  },

];
