import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { RouteMetadata } from '../models/routing.model';
import { map, take, tap } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/routes.dictionary';

@Injectable({
  providedIn: 'root'
})
export class PublicPortalGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {

  }

  canActivate(): Observable<boolean> | boolean {
    // CAPA SÍNCRONA DE DISCO: ¿El token físico sigue vivo?
    // Si NO está expirado, significa que hay sesión válida.
    if (!this.authService.isSessionExpired()) {
      console.warn('%c[Routing 🛡️] Usuario autenticado intentó acceder al Login. Redirigiendo...', 'color: #f39c12; font-weight: bold;');
      //this.router.navigate(['/', APP_ROUTES.DASHBOARD], { replaceUrl: true });
      return false; // Matamos la navegación al login
    }

    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isLogged: boolean) => {
        if (isLogged) {
          // Destruimos el intento de volver al login en el historial
          //this.router.navigate(['/', APP_ROUTES.DASHBOARD], { replaceUrl: true });
          return false;
        }
        // El usuario es un invitado real, le permitimos ver el Login
        return true;
      })
    );
  }

}
