import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppRoutes } from 'src/app/core/models/routing.model';

const routes: AppRoutes = [
  {
    path: '', // Ruta base perezosa que se monta al escribir /login
    component: LoginComponent,
    data: {
      browserTitle: 'Ciudadela de Ricks - Control de Identidad'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
