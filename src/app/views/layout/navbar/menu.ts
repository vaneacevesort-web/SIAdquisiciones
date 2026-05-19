import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
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
