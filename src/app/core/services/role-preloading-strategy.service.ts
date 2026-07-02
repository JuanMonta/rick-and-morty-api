import { RouteMetadata } from 'src/app/core/models/routing.model';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Role, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RolePreloadingStrategyService implements PreloadingStrategy {

  constructor(
    private readonly authService: AuthService
  ) { }

  // Esto está hecho para que se active en la pantalla de LOGIN por lo que supuestamente
  // asi deber siempre entrar en el mensaje de [Preloader 🛑] Denegado, que así deber ser
  // a nivel empresarial, y pues claro está que al iniciar el usuario será null.
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Verificamos si la ruta tiene la bandera custom 'preload: true'
    const data = (route.data as RouteMetadata) || null;

    // Si la ruta no exige la bandera custom de precarga, la ignoramos de inmediato
    if (!data || !data.preload) return of(null);

    return this.authService.currentUser$.pipe(
      // Filtramos las emisiones iniciales nulas. Dejamos el hilo esperando hasta que ocurra el Login
      filter((user: User | null) => user !== null),
      // En cuanto llega el primer usuario válido, cerramos el canal para evitar descargas duplicadas
      take(1),
      // Evaluamos el rol del usuario de forma segura
      switchMap((user: User | null) => {
        // Si hay usuario y es ADMIN o CIENTIFICO, ordenamos la descarga en 2do plano
        if (user && (user.role === Role.ADMIN || user.role === Role.SCIENTIST)) {
          console.log(`%c[Preloader 📦] Aprobado. Descargando módulo en background: ${route.path}`, 'color: #27ae60; font-weight: bold;');
          return load();// Gatilla la descarga física del archivo en segundo plano
        }
        // Si es GUEST o no hay sesión, bloqueamos la precarga silenciando el flujo
        console.log(`%c[Preloader 🛑] Denegado. Auth Needed. Ahorrando red para: ${route.path}`, 'color: #e67e22; font-weight: bold;');
        return of(null);
      }),
      catchError(() => {
        console.log(`%c[Preloader 🛑] Denegado. Ocurrió un error. Ahorrando red para: ${route.path}`, 'color: #e67e22; font-weight: bold;');
        return of(null)
      })
    );
  }
}
