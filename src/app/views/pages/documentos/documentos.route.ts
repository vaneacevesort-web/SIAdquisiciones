import { Routes } from "@angular/router";
import { statusGuard } from '../../../core/guards/status.guard'
export default [
    { path: '', redirectTo: 'documentos', pathMatch: 'full' },
    {
        path: 'documentos',
        loadComponent: () => import('./documentos.component').then(c => c.DocumentosComponent)
    },
    {
        path: 'add-documentos/:id',
        loadComponent: () => import('./add-edit-documentos/add-edit-documentos.component').then(c => c.AddEditDocumentosComponent)
        // canActivate : [ statusGuard ]
    },
] as Routes;