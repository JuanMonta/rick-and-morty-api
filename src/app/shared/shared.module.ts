import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TotalsFooterComponent } from './components/totals/totals-footer.component';
import { MaterialModule } from './material.module';

const COMPONENTS = [
  TotalsFooterComponent,
  AvatarComponent,
  PaginationComponent
]

const IMPORTS = [
  MaterialModule, // Angular Material Components
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
