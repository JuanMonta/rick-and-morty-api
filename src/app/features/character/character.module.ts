import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { CharacterRoutingModule } from './character-routing.module';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharacterListComponent } from './pages/character-list/character-list.component';


@NgModule({
  declarations: [
    CharacterListComponent,
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
