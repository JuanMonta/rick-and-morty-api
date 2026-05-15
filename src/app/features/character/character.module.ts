import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { CharacterRoutingModule } from './character-routing.module';
import { CharacterDetailsComponent } from './containers/character-details/character-details.component';
import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharacterPageComponent } from './containers/character-page/character-page.component';


@NgModule({
  declarations: [
    CharacterPageComponent,
    CharacterTableComponent,
    CharacterDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    CharacterRoutingModule
  ]
})
export class CharacterModule { }
