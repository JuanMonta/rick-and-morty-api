import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CharacterDashboardPageComponent as CharacterDashboardPageComponent } from '../character-dashboard/character-dashboard-page.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CharacterDashboardPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    CharacterDashboardPageComponent
  ]
})
export class LayoutModule { }
