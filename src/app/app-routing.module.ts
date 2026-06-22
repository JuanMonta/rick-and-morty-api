import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDashboardPageComponent } from './layout/character-dashboard/character-dashboard-page.component';
import { APP_ROUTES } from './core/constants/routes.dictionary';

export const routes: Routes = [
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
