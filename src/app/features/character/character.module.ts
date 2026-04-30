import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharacterListComponent } from './pages/character-list/character-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";

const characterRoutes: Routes = [
  {
    path: '',
    component: CharacterListComponent
  }
];

@NgModule({
  declarations: [
    CharacterListComponent,
    CharacterTableComponent,
    CharacterDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(characterRoutes),
    SharedModule
  ]
})
export class CharacterModule { }
