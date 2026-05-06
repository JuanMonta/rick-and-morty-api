import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout-module/layout.module';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, LayoutModule, GraphQLModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
