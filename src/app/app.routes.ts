import { Routes } from '@angular/router';
import { AUTH_ROUTES } from '@pages/auth/auth.route';
import { AppLayoutComponent } from './containers/layout/app.layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [...AUTH_ROUTES],
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.route').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },
      {
        path: 'cursos',
        loadChildren: () =>
          import('./pages/cursos/cursos.route').then((m) => m.CURSOS_ROUTES),
      },
      {
        path: 'galaxias',
        loadChildren: () =>
          import('./pages/galaxias/galaxias.route').then(
            (m) => m.GALAXIAS_ROUTES
          ),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./pages/categorias/categorias.route').then(
            (m) => m.CATEGORIAS_ROUTES
          ),
      },
      {
        path: 'idiomas',
        loadChildren: () =>
          import('./pages/idiomas/idiomas.route').then((m) => m.IDIOMAS_ROUTES),
      },
      {
        path: 'landing',
        loadChildren: () =>
          import('./pages/landing/landing.route').then((m) => m.LANDING_ROUTES),
      },
      {
        path: 'planetas',
        loadChildren: () =>
          import('./pages/planetas/planetas.route').then(
            (m) => m.PLANETAS_ROUTES
          ),
      },
      {
        path: 'parametros',
        loadChildren: () =>
          import('./pages/parametros/parametros.route').then(
            (m) => m.PARAMETROS_ROUTES
          ),

      },
      {
        path: 'profesor',
        loadChildren: () =>
          import('./pages/profesor/profesor.route').then(
            (m) => m.PROFESOR_ROUTES
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
