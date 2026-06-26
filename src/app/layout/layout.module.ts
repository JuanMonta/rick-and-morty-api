import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { CharacterDashboardPageComponent } from './character-dashboard/character-dashboard-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
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
