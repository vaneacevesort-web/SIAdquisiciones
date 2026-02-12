import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'tramite', pathMatch: 'full' },
    {
        path: 'tramite',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'finalizados',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'rechazados',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'registradas',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'validacion/:id',
        loadComponent: () => import('./detalle-validador/detalle-validador.component').then(c => c.DetalleValidadorComponent)
      }
] as Routes;