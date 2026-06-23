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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // para simular que la ruta require autenticación/está alguien autorizado a acceder a esa ruta
    const needsAuthentication: boolean = (route.data as RouteMetadata).requiresAuth ?? false;
    // para simular si el usuario está loggeado para autenticarlo y acceder a la ruta
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap((isLogged: boolean) => {
        if (needsAuthentication && !isLogged) {
          this.notificationService.showWarning('Sesión Caducada o Inválida. Por favor reautentíquese.');
          this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN]);
        }
      })
    );
  }

}
