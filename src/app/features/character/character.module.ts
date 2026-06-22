import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { CharacterRoutingModule } from './character-routing.module';
import { CharacterDetailsComponent } from './containers/character-details/character-details.component';
import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharacterPageComponent } from './containers/character-page/character-page.component';
import { LoginComponent } from '../auth/login/login.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    CharacterPageComponent,
    CharacterTableComponent,
    CharacterDetailsComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    CharacterRoutingModule
  ]
})
export class CharacterModule { }
