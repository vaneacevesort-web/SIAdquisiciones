import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.routes') },
  {
    path: '',
    component: BaseComponent,
    canActivateChild: [authGuard],
    children: [

      // Ruta raíz — roleGuard redirige según rol (Admin/Validador → /gestion-solicitudes)
      { path: '',
        canActivate: [roleGuard],
        component: DashboardComponent,  // nunca carga; guard siempre redirige
      },

      // Dashboard (pendiente de limpieza final)
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.routes'),
      },

      // ── Rutas de la aplicación ──────────────────────────────────────────

      {
        path: 'registro',
        loadChildren: () => import('./views/pages/documentos/documentos.route')
      },

      // Estudio de Mercado standalone — pendiente de limpieza final
      {
        path: 'registro/solicitud/:id/estudio-mercado',
        loadComponent: () =>
          import('./views/registro/estudio-mercado/estudio-mercado.component')
            .then(c => c.EstudioMercadoComponent)
      },

      {
        path: 'validadores',
        loadChildren: () => import('./views/pages/validadores/validadores.route')
      },

      // /reportes redirige a /informe-contratos — el dashboard de KPIs fue eliminado de Informes
      { path: 'reportes', redirectTo: 'informe-contratos', pathMatch: 'full' },

      {
        path: 'informe-contratos',
        loadComponent: () =>
          import('./views/pages/informe-contratos/informe-contratos.component')
            .then(c => c.InformeContratosComponent)
      },

      {
        path: 'solicitud/nuevo',
        loadComponent: () =>
          import('./views/pages/solicitud/nuevo/form-nueva-solicitud.component')
            .then(m => m.FormNuevaSolicitudComponent)
      },

      {
        path: 'gestion-solicitudes',
        loadChildren: () => import('./views/pages/gestion-solicitudes/gestion-solicitudes.routes')
          .then(m => m.gestionSolicitudesRoutes)
      },

      {
        path: 'carga-masiva',
        loadComponent: () =>
          import('./views/pages/carga-masiva/carga-masiva.component')
            .then(m => m.CargaMasivaComponent)
      },

    ]
  },
  {
    path: 'error',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent),
  },
  {
    path: 'error/:type',
    loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent)
  },
  {
    path: 'registrate',
    loadComponent: () => import('./views/pages/registro/registro.component').then(c => c.RegistroComponent)
  },

  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];
