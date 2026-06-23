import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './core/constants/routes.dictionary';
import { AppRoutes } from './core/models/routing.model';
import { CharacterDashboardPageComponent } from './layout/character-dashboard/character-dashboard-page.component';
import { AuthPortalGuard } from './core/guards/auth-portal.guard';

export const routes: AppRoutes = [
  // Redirección Inicial Asegurada: Envía la raíz hacia la característica perezosa (Login)
  {
    path: APP_ROUTES.COMODINS.BLANK_PATH,
    redirectTo: APP_ROUTES.AUTH.LOGIN,
    pathMatch: 'full'
  },
  // Ruta para el Módulo de Autenticación (Carga Perezosa)
  {
    path: APP_ROUTES.AUTH.LOGIN,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: APP_ROUTES.DASHBOARD.ROOT,
    component: CharacterDashboardPageComponent,
    data: {
      requiresAuth: true
    },
    // Mutiples guards que se activarán secuencialmente segun el array, solo uno que de false se detendrá todo ahí sin proseguir con los demas guards
    canActivate: [
      AuthPortalGuard, // Guard para verificar si tiene authorizacion para ingresar al path
    ],
    children: [
      {
        path: APP_ROUTES.COMODINS.BLANK_PATH,
        loadChildren: () => import('./features/character/character.module').then(m => m.CharacterModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      // ACTIVACIÓN DE LA ESTRATEGIA DE HASHLOCATIONSTRATEGY
      useHash: true,
      // OPTIMIZACIÓN NATIVA DE EXPERIENCIA DE USUARIO Y SCROLLING
      // para cuando al volver a una pagina anterior, mantiene la posicion del scroll de la pagina antes de avandonarla para ver otra
      scrollPositionRestoration: 'enabled'
    }
  )],
  exports: [RouterModule],
})
export class AppRoutingModule { }
