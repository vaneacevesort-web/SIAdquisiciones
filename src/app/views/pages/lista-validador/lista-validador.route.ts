import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'estudiodemercado', pathMatch: 'full' },
    {
        path: 'estudiodemercado',
        loadComponent: () => import('./lista-validador.component').then(c => c.ListaValidadorComponent)
      },
      {
        path: 'afectacionpresupuestal',
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
        path: 'nuevo',
        loadComponent: () => import('./solicitud-create/solicitud-create.component').then(c => c.SolicitudCreateComponent)
      },
      {
        path: 'validacion/:id',
        loadComponent: () => import('./detalle-validador/detalle-validador.component').then(c => c.DetalleValidadorComponent)
      },
      {
        path: 'nuevo/estudio-mercado',
        loadComponent: () => import('../../registro/estudio-mercado/estudio-mercado.component')
          .then(c => c.EstudioMercadoComponent)
      },

] as Routes;