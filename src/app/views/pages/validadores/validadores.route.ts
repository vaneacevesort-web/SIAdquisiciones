import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
    {
        path: 'usuarios',
        loadComponent: () => import('./validadores.component').then(c => c.ValidadoresComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./create-validador/create-validador.component').then(c => c.CreateValidadorComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./create-validador/create-validador.component').then(c => c.CreateValidadorComponent)
      }
] as Routes;