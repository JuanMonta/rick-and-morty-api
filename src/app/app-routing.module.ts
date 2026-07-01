import { RolePreloadingStrategyService } from './core/services/role-preloading-strategy.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './core/constants/routes.dictionary';
import { AppRoutes } from './core/models/routing.model';
import { CharacterDashboardPageComponent } from './layout/character-dashboard/character-dashboard-page.component';
import { AuthPortalGuard } from './core/guards/auth-portal.guard';
import { SidebarMenuComponent } from './layout/sidebar-menu/sidebar-menu.component';
import { AccessDeniedComponent } from './core/components/access-denied/access-denied.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { PublicPortalGuard } from './core/guards/public-portal.guard';

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
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [PublicPortalGuard]
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
        loadChildren: () => import('./features/character/character.module').then(m => m.CharacterModule),
        data: {
          preload: true
        }
      },
      //Como CharacterDashboardPageComponent contiene HeaderComponent con html puro, al ser
      //CharacterDashboardPageComponent el que carga todo lo visual(padre de todo lo que está dentro),
      // al no tener el HeaderComponent un routing, por lo tanto la dueña del outlet que coloqué
      // dentro de HeaderComponent es CharacterDashboardPageComponent.
      // Si HeaderComponent se dibujara con o en un routing-module pues colocaría ahí esto para el outlet.
      {
        path: APP_ROUTES.NAVIGATION.MENU,
        component: SidebarMenuComponent,
        outlet: APP_ROUTES.OUTLETS.SIDEBAR
      }
    ]
  },
  {
    path: APP_ROUTES.ERRORS.ACCESS_DENIED,
    component: AccessDeniedComponent,
    // Mutiples guards que se activarán secuencialmente segun el array, solo uno que de false se detendrá todo ahí sin proseguir con los demas guards
    canActivate: [
      AuthPortalGuard, // Guard para verificar si tiene authorizacion para ingresar al path
    ],
  },
  {
    path: APP_ROUTES.COMODINS.WILDCARD,
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: RolePreloadingStrategyService,
      paramsInheritanceStrategy: 'always',
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
