import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
    {
        path: 'tramite',
        loadComponent: () => import('./solicitudes.component').then(c => c.SolicitudesComponent) 
    }
] as Routes;