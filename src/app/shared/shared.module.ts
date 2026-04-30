import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalsFooterComponent } from './components/totals/totals-footer.component';
import { AvatarComponent } from './components/avatar/avatar.component';


@NgModule({
  declarations: [
    TotalsFooterComponent,
    AvatarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TotalsFooterComponent,
    AvatarComponent
  ]
})
export class SharedModule { }
