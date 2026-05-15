import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterPageComponent } from './containers/character-page/character-page.component';

const routes: Routes = [
  {
    path: '', // Cuando la ruta sea /characters/'', carga este componente por defecto:
    component: CharacterPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRoutingModule { }
