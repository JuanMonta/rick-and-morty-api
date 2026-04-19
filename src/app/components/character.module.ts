import { CommonModule, DatePipe } from '@angular/common';
import { CharacterDetailsComponent } from './character/character-details/character-details.component';
import { CharacterFooterComponent } from './character/character-footer/character-footer.component';
import { CharacterHeaderComponent } from './character/character-header/character-header.component';
import { CharacterListComponent } from './character/character-list/character-list.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CharacterLayoutComponent } from './character/character-layout/character-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CharacterLayoutComponent,
    CharacterListComponent,
    CharacterHeaderComponent,
    CharacterDetailsComponent,
    CharacterFooterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: CharacterLayoutComponent }]),
  ],
  providers: [DatePipe],
})
export class CharacterModule {}
