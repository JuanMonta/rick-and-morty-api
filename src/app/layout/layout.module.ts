import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CharacterDashboardPageComponent } from './character-dashboard/character-dashboard-page.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CharacterDashboardPageComponent,
    SidebarMenuComponent
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
