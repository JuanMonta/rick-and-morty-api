import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from "src/app/shared/shared.module";
import { CharacterRoutingModule } from './character-routing.module';
import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharacterDetailsComponent } from './containers/character-details/character-details.component';
import { CharacterPageComponent } from './containers/character-page/character-page.component';


@NgModule({
  declarations: [
    CharacterPageComponent,
    CharacterTableComponent,
    CharacterDetailsComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    CharacterRoutingModule
  ]
})
export class CharacterModule { }
