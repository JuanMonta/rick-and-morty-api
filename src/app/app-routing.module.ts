import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDashboardPageComponent } from './layout/character-dashboard/character-dashboard-page.component';
import { APP_ROUTES } from './core/constants/routes.dictionary';

export const routes: Routes = [
  {
    path: APP_ROUTES.COMODINS.BLANK_PATH,
    component: CharacterDashboardPageComponent,
    children: [
      {
        path: APP_ROUTES.CHARACTERS.ROOT,
        loadChildren: () => import('./features/character/character.module').then(m => m.CharacterModule)
      },
      {
        path: APP_ROUTES.COMODINS.BLANK_PATH,
        redirectTo: APP_ROUTES.CHARACTERS.ROOT,
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
