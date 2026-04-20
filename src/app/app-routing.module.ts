import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'characters',
    loadChildren: () =>
      import('./components/character.module').then((m) => m.CharacterModule),
  },
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
