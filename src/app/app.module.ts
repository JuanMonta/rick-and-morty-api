import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterHeaderComponent } from './components/character-header/character-header.component';
import { CharacterFooterComponent } from './components/character-footer/character-footer.component';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CharacterListComponent,
    CharacterHeaderComponent,
    CharacterDetailsComponent,
    CharacterFooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
