import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TotalsCardComponent } from './components/totals/totals-card.component';
import { MaterialModule } from './material.module';
import { ChipComponent } from './components/chip/chip.component';
import { CharacterFilterComponent } from './components/character-filter/character-filter.component';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [
  AvatarComponent,
  CharacterFilterComponent,
  ChipComponent,
  PaginationComponent,
  TotalsCardComponent
]

const IMPORTS = [
  MaterialModule, // Angular Material Components
  ReactiveFormsModule
]

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    IMPORTS
  ],
  exports: [
    COMPONENTS,
    IMPORTS
  ]
})
export class SharedModule { }
