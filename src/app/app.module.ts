import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { GraphQLModule } from './graphql.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiAuditInterceptor } from './core/interceptors/api-audit.interceptor';
import { HttpCacheInterceptor } from './core/interceptors/http-cache.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    GraphQLModule,
    BrowserAnimationsModule
  ],
  providers: [
    //===================================================================================
    // ** Aquí dependiendo del orden de colocar primero el Inteerceptor de Audit o el cache, tendremos dos escenarios:
    // ** Escenario A: Auditoría ANTES que Caché ([ApiAuditInterceptor, HttpCacheInterceptor])
    /*La app dispara la petición → Auditoría dice "¡Despegue 🛫!" → Caché la intercepta,
      ve que ya la tiene y la devuelve sin salir a internet → Auditoría dice "¡Aterrizaje 🛬!".

      -Resultado: Se verán logs de todas las peticiones que haga la aplicación, pero se notará que
       las que vienen de la caché tendrán un tiempo de tránsito ridículamente bajo (ej. 0.5ms),
       mientras que las reales tardarán más (ej. 250ms).
       Es la configuración más recomendada si se quiere medir cuánto tiempo nos estamos ahorrando.*/

    // ** Escenario B: Caché ANTES que Auditoría ([HttpCacheInterceptor, ApiAuditInterceptor])
    /* La app dispara la petición → Caché la intercepta, ve que ya la tiene y la devuelve inmediatamente a la app.
      -Resultado: El interceptor de auditoría nunca se entera de que hubo una petición si esta fue resuelta por la caché.
      Solo se verá los mensajes de auditoría en la consola para las peticiones reales que sí viajan por internet.
      Es ideal si se quiere una consola más limpia.
    */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiAuditInterceptor,
      multi: true // Indica que es un eslabón más en la cadena de interceptores nativos
    },
    //===================================================================================
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
