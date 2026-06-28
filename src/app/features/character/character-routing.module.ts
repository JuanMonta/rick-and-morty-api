import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routing.model';
import { APP_ROUTES } from './../../core/constants/routes.dictionary';
import { CharacterPageComponent } from './containers/character-page/character-page.component';
import { WelcomeComponent } from 'src/app/core/components/welcome/welcome.component';
import { Role } from 'src/app/core/models/user.model';
import { AuthPortalGuard } from 'src/app/core/guards/auth-portal.guard';
import { RolePortalGuard } from 'src/app/core/guards/role-portal.guard';
const routes: AppRoutes = [
  {
    path: APP_ROUTES.COMODINS.BLANK_PATH, // Cuando la ruta sea /characters/'', carga este componente por defecto:
    component: CharacterPageComponent
  },
  {
    path: APP_ROUTES.WELCOME.ROOT,
    component: WelcomeComponent,
    data: {
      requiresAuth: true,
      allowedRoles: [Role.ADMIN, Role.SCIENTIST]
    },
    canActivate: [
      AuthPortalGuard,
      RolePortalGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRoutingModule { }
