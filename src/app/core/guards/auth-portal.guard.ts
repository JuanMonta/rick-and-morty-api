import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { RouteMetadata } from '../models/routing.model';
import { take, tap } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/routes.dictionary';

@Injectable({
  providedIn: 'root'
})
export class AuthPortalGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // para simular que la ruta require autenticación/está alguien autorizado a acceder a esa ruta
    const needsAuthentication: boolean = (route.data as RouteMetadata).requiresAuth ?? false;

    // Evitamos suscribirnos a RxJS si el disco duro ya delata que la sesión expiró
    if (needsAuthentication && this.authService.isSessionExpired()) {
      this.notificationService.showWarning('Sesión Expirada. La Ciudadela exige nueva autenticación.');
      this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN], { replaceUrl: true });
      return false;
    }
    // para verificar si el usuario está loggeado para autenticarlo y acceder a la ruta
    return this.authService.isAuthenticated$.pipe(
      take(1),// Obligatorio: Cierra el hilo instantáneamente tras leer el primer valor
      tap((isLogged: boolean) => {
        if (needsAuthentication && !isLogged) {
          this.notificationService.showWarning('Sesión Caducada o Inválida. Por favor reautentíquese.');
          this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN], { replaceUrl: true });
          return false;
        }
        // Si no requiere auth, o si está logueado, damos luz verde
        return true;
      })
    );
  }

}
