import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalsFooterComponent } from './components/totals/totals-footer.component';

@NgModule({
  declarations: [
    TotalsFooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TotalsFooterComponent // <--- ¡ESTE CABLE FALTABA! Ahora los demás módulos pueden usarlo.
  ]
})
export class SharedModule { }
