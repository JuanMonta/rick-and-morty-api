import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDashboardPageComponent } from './layout/character-dashboard/character-dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CharacterDashboardPageComponent,
    children: [
      {
        path: 'characters',
        loadChildren: () => import('./features/character/character.module').then(m => m.CharacterModule)
      },
      {
        path: '',
        redirectTo: 'characters',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
