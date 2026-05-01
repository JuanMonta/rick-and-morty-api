import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalsFooterComponent } from './components/totals/totals-footer.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { PaginationComponent } from './components/pagination/pagination.component';


@NgModule({
  declarations: [
    TotalsFooterComponent,
    AvatarComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TotalsFooterComponent,
    AvatarComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
