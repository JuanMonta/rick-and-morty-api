import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routing.model';
import { APP_ROUTES } from './../../core/constants/routes.dictionary';
import { CharacterPageComponent } from './containers/character-page/character-page.component';

const routes: AppRoutes = [
  {
    path: APP_ROUTES.COMODINS.BLANK_PATH, // Cuando la ruta sea /characters/'', carga este componente por defecto:
    component: CharacterPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRoutingModule { }
