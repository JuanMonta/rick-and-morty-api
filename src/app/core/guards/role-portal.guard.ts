import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '../models/user.model';
import { APP_ROUTES } from '../constants/routes.dictionary';
import { RouteMetadata } from '../models/routing.model';

@Injectable({
  providedIn: 'root'
})
export class RolePortalGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Extraemos la lista de roles permitidos configurada en el enrutador
    const allowedRoles = (route.data as RouteMetadata).allowedRoles as UserRole[];

    // Si la ruta no especifica restricciones de rol, dejamos pasar libremente
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // Le pedimos al servicio que valide si el usuario en sesión cumple con los requisitos
    const hasAuthorizedRole = this.authService.hasRole(allowedRoles);

    if (!hasAuthorizedRole) {
      //this.notificationService.showError('Acceso Denegado: Rango de credenciales insuficiente para este expediente.');
      // Lo desviamos elegantemente al dashboard común en lugar de colapsar la app
      //this.router.navigate(['/', APP_ROUTES.DASHBOARD.ROOT]);
      this.router.navigate(['/', APP_ROUTES.ERRORS.ACCESS_DENIED]);
      return false;
    }

    return true;
  }

}
