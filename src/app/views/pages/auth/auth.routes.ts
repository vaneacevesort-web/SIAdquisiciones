import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./cambiar-contrasena/cambiar-contrasena.component').then(c => c.CambiarContrasenaComponent)
  },
  {
    path: 'restaurar-contrasena',
    loadComponent: () => import('./restaurar-contrasena/restaurar-contrasena.component').then(c => c.RestaurarContrasenaComponent)
  }
] as Routes;